import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  onProfileUpdated?: (p: any) => void;
};

export default function AccountDialog({ open, onOpenChange, profile, onProfileUpdated }: Props) {
  const [first, setFirst] = useState(profile.first_name);
  const [last, setLast] = useState(profile.last_name);
  const [email, setEmail] = useState(profile.email);
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const saveProfile = async () => {
    setSaving(true); setErr(null); setMsg(null);
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: first.trim(), last_name: last.trim() })
      .eq("id", profile.id);
    if (error) setErr("Impossible d’enregistrer le profil.");
    else {
      setMsg("Profil mis à jour.");
      onProfileUpdated?.({ ...profile, first_name: first, last_name: last });
    }
    setSaving(false);
  };

  const changeEmail = async () => {
    setSaving(true); setErr(null); setMsg(null);
    const { error } = await supabase.auth.updateUser({
      email,
    });
    if (error) setErr("Changement d’email impossible.");
    else setMsg("Email mis à jour. Vérifie ta boîte pour confirmer.");
    setSaving(false);
  };

  const changePassword = async () => {
    if (pwd.length < 8) { setErr("Mot de passe trop court (min 8)."); return; }
    setSaving(true); setErr(null); setMsg(null);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) setErr("Changement de mot de passe impossible.");
    else setMsg("Mot de passe mis à jour.");
    setSaving(false);
    setPwd("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paramètres du compte</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div>
                <Label>Nom</Label>
                <Input value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>
            <Button onClick={saveProfile} disabled={saving}>Enregistrer</Button>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div>
              <Label>Nouvel e-mail</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={changeEmail} disabled={saving}>Mettre à jour l’e-mail</Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div>
              <Label>Nouveau mot de passe</Label>
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">8 caractères minimum.</p>
            </div>
            <Button onClick={changePassword} disabled={saving}>Changer le mot de passe</Button>
          </TabsContent>
        </Tabs>

        {msg && <p className="text-sm text-green-600">{msg}</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
      </DialogContent>
    </Dialog>
  );
}
