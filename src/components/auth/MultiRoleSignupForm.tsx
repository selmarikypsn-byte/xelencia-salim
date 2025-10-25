import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { routeByRole } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Loader2, Shield, Plus, Trash2 } from "lucide-react";

// ----------------------- Constantes -----------------------
const SCHOOL_LEVELS = [
  "Maternelle",
  "CP", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème",
  "2nde", "1ère", "Terminale",
  "Post-bac: Licence", "Post-bac: Master", "Concours/Prépa", "Professionnel", "Reconversion"
];

const SUBJECTS = [
  "Mathématiques", "Français", "Anglais", "Espagnol", "Allemand",
  "Histoire-Géographie", "Physique-Chimie", "SVT", "Philosophie",
  "Économie", "Informatique", "Arts plastiques"
];

// ------------------------- Types -------------------------
type Role = "parent" | "student" | "teacher";

interface StudentDraft {
  firstName: string;
  lastName: string;
  schoolLevel: string;
  desiredSubjects: string[];
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role | "";
  // Parent: liste d'enfants
  students: StudentDraft[];
  // Étudiant (adulte) = un seul student auto-rattaché
  selfStudent: StudentDraft;
  // Prof
  teacherSubjects: string[];
  cvFile: File | null;
  // UX
  acceptTerms: boolean;
}

const blankStudent = (): StudentDraft => ({
  firstName: "",
  lastName: "",
  schoolLevel: "",
  desiredSubjects: []
});

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  students: [blankStudent()],
  selfStudent: blankStudent(),
  teacherSubjects: [],
  cvFile: null,
  acceptTerms: false
};

// --------------------- Composant UI ----------------------
export default function MultiRoleSignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // robustesse mdp
  const passwordStrength = useMemo(() => {
    const p = form.password;
    let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[a-z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 5);
  }, [form.password]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role === "parent" || role === "student" || role === "teacher") setForm((f) => ({ ...f, role }));
  }, []);

  const update = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const updateStudent = (i: number, patch: Partial<StudentDraft>) => setForm((f) => ({
    ...f,
    students: f.students.map((st, idx) => (idx === i ? { ...st, ...patch } : st))
  }));
  const toggleSubjectIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const validate = (): string | null => {
    if (!form.firstName.trim()) return "Le prénom est requis";
    if (!form.lastName.trim()) return "Le nom est requis";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email invalide";
    if (form.password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    if (!(form.role === "parent" || form.role === "student" || form.role === "teacher")) return "Veuillez sélectionner un rôle";

    if (!form.acceptTerms) return "Vous devez accepter les conditions d'utilisation";

    if (form.role === "parent") {
      if (form.students.length === 0) return "Ajoutez au moins un enfant";
      for (const [idx, st] of form.students.entries()) {
        if (!st.firstName.trim()) return `Prénom de l'enfant #${idx + 1} requis`;
        if (!st.lastName.trim()) return `Nom de l'enfant #${idx + 1} requis`;
        if (!st.schoolLevel) return `Niveau scolaire de l'enfant #${idx + 1} requis`;
        if (st.desiredSubjects.length === 0) return `Sélectionnez au moins une matière pour l'enfant #${idx + 1}`;
      }
    }

    if (form.role === "student") {
      const st = form.selfStudent;
      if (!st.schoolLevel) return "Votre niveau scolaire est requis";
      if (st.desiredSubjects.length === 0) return "Sélectionnez au moins une matière";
    }

    if (form.role === "teacher") {
      if (form.teacherSubjects.length === 0) return "Sélectionnez au moins une matière enseignée";
      if (!form.cvFile) return "Veuillez déposer votre CV (PDF)";
      if (form.cvFile && form.cvFile.type !== "application/pdf") return "Le CV doit être au format PDF";
      if (form.cvFile && form.cvFile.size > 5 * 1024 * 1024) return "Le CV ne doit pas dépasser 5 Mo";
    }

    return null;
  };

// -------------------- Soumission -----------------------
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  const err = validate();
  if (err) { setError(err); return; }

  setSubmitting(true);
  try {
    // 1) AUTH: pass identity/role in metadata (DB trigger will create profiles row)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          role: form.role, // "parent" | "student" | "teacher"
        },
        emailRedirectTo: window.location.origin + "/connexion",
      },
    });
    if (signUpError) throw signUpError;

    // 2) SESSION CHECK (important for RLS).
    // If email confirmation is enabled, there may be NO session yet.
    const { data: s, error: sErr } = await supabase.auth.getSession();
    if (sErr || !s.session) {
      setSuccess(
        "Compte créé. Vérifiez votre e-mail pour confirmer, puis connectez-vous pour finaliser l’inscription."
       );
      return;
    }

    const userId = s.session.user.id;

    // 3) ROLE-SPECIFIC WRITES (now allowed by RLS because we have a session)
    if (form.role === "parent") {
      const rows = form.students.map((st) => ({
        parent_id: userId,
        first_name: st.firstName.trim(),
        last_name: st.lastName.trim(),
        school_level: st.schoolLevel,
        is_active: true,
        desired_subjects: st.desiredSubjects, // requires column + policy in DB
      }));
      const { error: sErr2 } = await supabase.from("students").insert(rows);
      if (sErr2) throw sErr2;
    }

    if (form.role === "student") {
      const st = form.selfStudent;
      const { error: sErr3 } = await supabase.from("students").insert({
        parent_id: userId,           // self-attached
        first_name: form.firstName.trim(), // or st.firstName if you collect it in UI
        last_name: form.lastName.trim(),   // or st.lastName if you collect it in UI
        school_level: st.schoolLevel,
        is_self: true,               // requires column in DB
        is_active: true,
        desired_subjects: st.desiredSubjects, // requires column in DB
      });
      if (sErr3) throw sErr3;
    }

    if (form.role === "teacher") {
      // Optional: upload CV (needs 'cvs' bucket + storage policies)
      let cv_url: string | null = null;
      if (form.cvFile) {
        const path = `${userId}/${Date.now()}-cv.pdf`;
        const { error: upErr } = await supabase.storage
          .from("cvs")
          .upload(path, form.cvFile, { contentType: "application/pdf", upsert: false });
        if (upErr) throw upErr;
        cv_url = path; // store private storage path
      }

      const { error: tErr } = await supabase.from("teachers").insert({
        id: userId,
        subjects: form.teacherSubjects,
        is_verified: false,
        is_active: true,
        cv_url, // requires column in DB
      });
      if (tErr) throw tErr;
    }

    // 4) UX: success + redirect by role
    setSuccess("Inscription réussie !");
    const next = routeByRole(form.role);
    setTimeout(() => navigate(next, { replace: true }), 600);
  } catch (e: any) {
    console.error(e);
    setError(e?.message ?? "Une erreur est survenue pendant l'inscription");
  } finally {
    setSubmitting(false);
  }
};


  // ------------------------ UI ---------------------------
  return (
    <Card className="shadow-xl border">
      <CardHeader>
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" /> Vos données sont protégées (HTTPS, stockage sécurisé)
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {/* Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input id="firstName" value={form.firstName} onChange={(e) => update({ firstName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input id="lastName" value={form.lastName} onChange={(e) => update({ lastName: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse email *</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => update({ password: e.target.value })} required />
            <div className="flex items-center gap-2">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className={`h-1 w-full rounded ${i < passwordStrength ? 'bg-green-500' : 'bg-muted'}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Au moins 8 caractères, idéalement avec chiffres et caractères spéciaux.</p>
          </div>

          {/* Rôle */}
          <div className="space-y-3">
            <Label>Je suis *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button type="button" onClick={() => update({ role: "parent" })} className={`border rounded-xl p-4 text-left hover:bg-accent ${form.role === 'parent' ? 'border-primary' : ''}`} aria-pressed={form.role === 'parent'}>
                <div className="font-medium">Parent</div>
                <p className="text-sm text-muted-foreground">Gérez un ou plusieurs enfants.</p>
              </button>
              <button type="button" onClick={() => update({ role: "student" })} className={`border rounded-xl p-4 text-left hover:bg-accent ${form.role === 'student' ? 'border-primary' : ''}`} aria-pressed={form.role === 'student'}>
                <div className="font-medium">Étudiant</div>
                <p className="text-sm text-muted-foreground">Je m'inscris pour moi-même.</p>
              </button>
              <button type="button" onClick={() => update({ role: "teacher" })} className={`border rounded-xl p-4 text-left hover:bg-accent ${form.role === 'teacher' ? 'border-primary' : ''}`} aria-pressed={form.role === 'teacher'}>
                <div className="font-medium">Professeur</div>
                <p className="text-sm text-muted-foreground">Je propose des cours.</p>
              </button>
            </div>
          </div>

          {/* Section Parent: liste d'enfants */}
          {form.role === "parent" && (
            <div className="space-y-4 border rounded-xl p-4">
              <Badge variant="secondary">Enfants (students)</Badge>
              {form.students.map((st, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`childFirst-${idx}`}>Prénom *</Label>
                      <Input id={`childFirst-${idx}`} value={st.firstName} onChange={(e) => updateStudent(idx, { firstName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`childLast-${idx}`}>Nom *</Label>
                      <Input id={`childLast-${idx}`} value={st.lastName} onChange={(e) => updateStudent(idx, { lastName: e.target.value })} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`schoolLevel-${idx}`}>Niveau scolaire *</Label>
                    <select id={`schoolLevel-${idx}`} className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={st.schoolLevel} onChange={(e) => updateStudent(idx, { schoolLevel: e.target.value })} required>
                      <option value="" disabled>Choisir un niveau</option>
                      {SCHOOL_LEVELS.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Matières souhaitées *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {SUBJECTS.map((s) => (
                        <label key={s} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="h-4 w-4" checked={st.desiredSubjects.includes(s)} onChange={() => {
                            const next = toggleSubjectIn(st.desiredSubjects, s);
                            updateStudent(idx, { desiredSubjects: next });
                          }} />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  {form.students.length > 1 && (
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => update({ students: form.students.filter((_, i) => i !== idx) })}>
                        <Trash2 className="h-4 w-4 mr-1" /> Supprimer cet enfant
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={() => update({ students: [...form.students, blankStudent()] })}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter un autre enfant
              </Button>
            </div>
          )}

          {/* Section Étudiant (auto) */}
          {form.role === "student" && (
            <div className="space-y-4 border rounded-xl p-4">
              <Badge variant="secondary">Mes informations (student)</Badge>
              <div className="space-y-2">
                <Label htmlFor="selfLevel">Niveau scolaire *</Label>
                <select id="selfLevel" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={form.selfStudent.schoolLevel} onChange={(e) => update({ selfStudent: { ...form.selfStudent, schoolLevel: e.target.value } })} required>
                  <option value="" disabled>Choisir un niveau</option>
                  {SCHOOL_LEVELS.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Matières souhaitées *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SUBJECTS.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4" checked={form.selfStudent.desiredSubjects.includes(s)} onChange={() => {
                        const next = toggleSubjectIn(form.selfStudent.desiredSubjects, s);
                        update({ selfStudent: { ...form.selfStudent, desiredSubjects: next } });
                      }} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section Professeur */}
          {form.role === "teacher" && (
            <div className="space-y-4 border rounded-xl p-4">
              <Badge variant="secondary">Informations professeur</Badge>
              <div className="space-y-2">
                <Label>Matières enseignées *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SUBJECTS.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4" checked={form.teacherSubjects.includes(s)} onChange={() => update({ teacherSubjects: toggleSubjectIn(form.teacherSubjects, s) })} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cv">Déposer votre CV (PDF, max 5 Mo) *</Label>
                <Input id="cv" type="file" accept="application/pdf" onChange={(e) => update({ cvFile: e.target.files?.[0] ?? null })} required />
                <p className="text-xs text-muted-foreground">Votre CV est stocké de façon sécurisée et accessible uniquement par l'équipe Xelencia.</p>
              </div>
            </div>
          )}

          {/* Consentement */}
          <div className="flex items-center gap-2">
            <input id="terms" type="checkbox" className="h-4 w-4" checked={form.acceptTerms} onChange={(e) => update({ acceptTerms: e.target.checked })} required />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">J'accepte les conditions d'utilisation et la politique de confidentialité.</Label>
          </div>

          {/* Erreur / Succès */}
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création du compte…</>) : "Créer mon compte"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={async () => {
              const { error } = await supabase.auth.resend({
                type: 'signup',
                email: form.email
              });
              if (error) {
                setError("Impossible de renvoyer l'email de confirmation.");
              } else {
                setSuccess("Email de confirmation renvoyé !");
              }
            }}
          >
            Renvoyer l’email de confirmation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
