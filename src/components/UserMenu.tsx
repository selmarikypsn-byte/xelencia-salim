// src/components/UserMenu.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export default function UserMenu() {
  const { profile, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !profile) return null;

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase();

  const handleLogout = async () => {
    // UI immédiate + fin propre
    await logout();
    navigate("/connexion", { replace: true });
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {/* si un jour tu ajoutes profile.avatar_url */}
        {"avatar_url" in profile && profile.avatar_url ? (
          <AvatarImage src={(profile as any).avatar_url} alt="Avatar" />
        ) : null}
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
      <div className="hidden sm:flex flex-col text-sm">
        <span className="font-medium">
          {profile.first_name} {profile.last_name}
        </span>
        <span className="text-muted-foreground">{profile.email}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        title="Se déconnecter"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}
