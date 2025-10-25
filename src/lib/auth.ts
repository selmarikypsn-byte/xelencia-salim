import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Types issus de la DB
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
// L'enum DB contient (selon ton schéma) : 'admin' | 'parent' | 'teacher'.
// On étend localement avec 'student' pour l'élève majeur auto-rattaché.
type RoleDB = NonNullable<Profile["role"]>; // 'admin' | 'parent' | 'teacher'
export type Role = RoleDB | "student";

/* ---------------------------------------
 * Small helpers
 * -------------------------------------*/
const getOrigin = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : "https://preview--xelencia-connect.lovable.app";

/** Safer getUser (surface errors for debugging) */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error("auth.getUser error:", error);
  return data.user ?? null;
}

/** Fetch the current user's profile (RLS-safe). */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error, status } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    // 406 => no row; any other error we log
    if (error && status !== 406) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data ?? null;
  } catch (err) {
    console.error("Error getting current profile:", err);
    return null;
  }
}

/** Type-safe route by role (supporte aussi 'student'). */
export function routeByRole(role: string | null): string {
  switch (role) {
    case "admin":   return "/dashboard/admin";
    case "teacher": return "/dashboard/teacher";
    case "parent":  return "/dashboard/parent";
    case "student": return "/dashboard/student";
    default:        return "/";
  }
}


/* ---------------------------------------
 * Auth actions
 * -------------------------------------*/

/**
 * Sign in with email/password.
 * Returns `{ session, user, error, code }`.
 * `code` is a small classifier for nicer UI messages.
 */
export async function signInWithEmailPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  let code: "email_not_confirmed" | "invalid_credentials" | "auth_error" | undefined;
  if (error) {
    const msg = (error.message || "").toLowerCase();
    if (msg.includes("email not confirmed")) code = "email_not_confirmed";
    else if (msg.includes("invalid login credentials")) code = "invalid_credentials";
    else code = "auth_error";
  }

  return { ...data, error, code };
}

/** Send a magic link (passwordless). */
export async function signInWithMagicLink(email: string) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getOrigin()}/connexion`,
    },
  });
}

/** Start reset-password flow. */
export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getOrigin()}/reset-complete`,
  });
}

/** Sign out current session. */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * High-level helper: login → fetch profile → compute next route.
 * Useful in your /connexion form submit handler.
 */
export async function signInAndResolveRoute(email: string, password: string) {
  const res = await signInWithEmailPassword(email, password);
  if (res.error) {
    return { next: "/connexion", profile: null as Profile | null, ...res };
  }

  // Ensure session exists (some projects require confirmed email)
  const { data: sData, error: sErr } = await supabase.auth.getSession();
  if (sErr || !sData.session) {
    return { next: "/connexion", profile: null as Profile | null, error: sErr ?? new Error("No session"), code: "auth_error" as const };
  }

  const profile = await getCurrentProfile();
  const next = routeByRole((profile?.role as Role | null) ?? null);
  return { next, profile, ...res };
}

/**
 * Optional: ensure a role exists for the current user (useful in dev).
 * Call after signUp if your trigger didn’t fill role yet.
 */
export async function ensureRole(defaultRole: Role = "parent") {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("ensureRole read error:", error);
    return null;
  }
  if (!data) return null;

  if (!data.role) {
    const { error: upErr } = await supabase
      .from("profiles")
      .update({ role: defaultRole as RoleDB })
      .eq("id", user.id);
    if (upErr) console.error("ensureRole update error:", upErr);
    return { ...data, role: (defaultRole as RoleDB) } as Profile;
  }

  return data as Profile;
}
