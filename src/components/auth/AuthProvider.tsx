import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentProfile } from "@/lib/auth"; // <-- on réutilise tes helpers

type Profile = Awaited<ReturnType<typeof getCurrentProfile>>;

type AuthCtx = {
  session: any | null;
  profile: Profile;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setSession(data.session ?? null);
      setLoading(false);

      if (data.session) {
        const me = await getCurrentProfile().catch(() => null);
        if (alive) setProfile(me);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setProfile(null);
        return;
      }
      const me = await getCurrentProfile().catch(() => null);
      setProfile(me);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setProfile(null);                 // UI immédiate
    await supabase.auth.signOut().catch(() => {});
  };

  const refreshProfile = async () => {
    const me = await getCurrentProfile().catch(() => null);
    setProfile(me);
  };

  const value = useMemo(
    () => ({ session, profile, loading, logout, refreshProfile }),
    [session, profile, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
