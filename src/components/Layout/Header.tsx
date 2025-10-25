import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { routeByRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import logoUrl from "../../assets/Logo_complet_claire_XELENCIA.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AccountDialog from "@/components/account/AccountDialog";
import { Phone } from "lucide-react";
import clsx from "clsx";

// ➜ Choisis le style du CTA : "brand" (charte) ou "flashy" (très voyant)
const CTA_STYLE: "brand" | "flashy" = "brand";

// ➜ Intensité de la pastille active
const PILL_TONE: "soft" | "solid" = "solid";

type NavLink = { to: string; label: string };

const NAV_LINKS: NavLink[] = [
  { to: "/", label: "Accueil" },
  { to: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { to: "/nos-enseignants", label: "Nos enseignants" },
  { to: "/offres", label: "Nos offres" },
  { to: "/temoignages", label: "Témoignages" },
  { to: "/comment-ca-marche", label: "Comment ça marche ?" },
  { to: "/faq", label: "FAQ" },
];

function isActivePath(current: string, target: string) {
  if (target === "/") return current === "/";
  return current === target || current.startsWith(target + "/");
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const { pathname } = useLocation();
  const active = isActivePath(pathname, to);

  const pillClass =
    PILL_TONE === "solid"
      ? // Fond charte plein
        "bg-secondary text-secondary-foreground ring-1 ring-secondary/40"
      : // Fond charte doux
        "bg-secondary/20 text-foreground ring-1 ring-secondary/30";

  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "relative group inline-flex items-center h-10 px-3 rounded-xl text-sm font-medium transition-colors",
        active ? "text-foreground" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {/* “Pill” animé (Framer Motion) avec couleur de la charte */}
      {active && (
        <motion.span
          layoutId="nav-pill"
          className={clsx("absolute inset-0 rounded-xl shadow-sm", pillClass)}
          transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.6 }}
        />
      )}

      {/* Lueur légère au survol */}
      <span
        className={clsx(
          "relative z-10",
          "transition-[text-shadow] duration-300",
          "group-hover:[text-shadow:0_0_18px_rgba(0,0,0,0.08)]"
        )}
      >
        {children}
      </span>
    </Link>
  );
}

export function Header() {
  const { profile, loading } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const initials = `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase();
  const dashboardHref = routeByRole(profile?.role ?? null);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navigateWithScroll = (to: string, opts?: { replace?: boolean }) => {
    navigate(to, opts);
    requestAnimationFrame(() => scrollTop());
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigateWithScroll("/", { replace: true });
  };

  const ctaClasses = useMemo(() => {
    if (CTA_STYLE === "flashy") {
      return `
        relative overflow-hidden px-6 py-3 text-base font-extrabold rounded-2xl shadow-lg
        bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white
        transition will-change-transform hover:scale-105 hover:shadow-xl
        before:absolute before:inset-0 before:-translate-x-full before:bg-white/30 before:skew-x-12
        before:transition-transform before:duration-700 hover:before:translate-x-full
        ring-1 ring-white/20
      `;
    }
    // Variante charte (couleur secondaire)
    return `
      relative overflow-hidden px-5 py-2.5 text-sm font-bold rounded-xl shadow-md
      bg-gradient-to-r from-secondary via-secondary/90 to-secondary text-secondary-foreground
      transition hover:shadow-lg hover:brightness-110 ring-1 ring-secondary/30
      before:absolute before:inset-0 before:-translate-x-full before:bg-white/20 before:skew-x-12
      before:transition-transform before:duration-700 hover:before:translate-x-full
    `;
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo agrandi */}
        <Link
          to="/"
          onClick={scrollTop}
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="Aller à l'accueil"
        >
          <img src={logoUrl} alt="Xelencia" className="h-20 w-auto" />
        </Link>

        {/* Nav avec pill animé couleur charte */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {NAV_LINKS.map((l) => (
            <NavItem key={l.to} to={l.to}>
              {l.label}
            </NavItem>
          ))}
        </nav>

        {/* Zone droite */}
        <div className="flex items-center gap-3">
          {/* CTA principal */}
          <Button asChild className={`hidden sm:inline-flex ${ctaClasses}`}>
            <Link to="/contact" onClick={scrollTop} aria-label="Parler à un conseiller">
              <span className="inline-flex items-center gap-2">
                <Phone className="h-5 w-5" aria-hidden />
                Parler à un conseiller
              </span>
            </Link>
          </Button>

          {/* Variante mobile compacte */}
          <Button asChild size="sm" className="sm:hidden rounded-lg" variant="default">
            <Link to="/contact" onClick={scrollTop} aria-label="Parler à un conseiller (mobile)">
              <Phone className="h-4 w-4 mr-1" aria-hidden />
              Conseiller
            </Link>
          </Button>

          {/* Espace compte / auth */}
          {!loading && profile ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigateWithScroll(dashboardHref)}
                className="hidden md:inline-flex"
              >
                Tableau de bord
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="inline-flex items-center outline-none">

                    <Avatar className="h-9 w-9">
                      {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="Avatar" /> : null}
                      <AvatarFallback>{initials || "U"}</AvatarFallback>
                    </Avatar>

                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {profile.first_name} {profile.last_name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to={dashboardHref} onClick={scrollTop}>
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => setAccountOpen(true)}>
                    Paramètres du compte
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AccountDialog
                open={accountOpen}
                onOpenChange={setAccountOpen}
                profile={profile as any}
                onProfileUpdated={() => {}}
              />
            </>
          ) : (
            !loading && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWithScroll("/connexion")}
                  className="hidden md:inline-flex"
                >
                  Connexion
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => navigateWithScroll("/inscription")}
                  className="hidden md:inline-flex"
                >
                  Inscription
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
