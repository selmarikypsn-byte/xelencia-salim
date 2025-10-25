import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Star, Phone, BadgeCheck, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <header className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Image + Overlay plus sombre pour contraste AA */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Parent et élève accompagnés par un professeur Xelencia"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/25" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl">
          {/* Headline orientée résultat */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Réussite scolaire
            <span className="block text-secondary">garantie à domicile ou en ligne</span>
          </h1>

          {/* Sous-titre avec bénéfice prix */}
          <p className="mt-5 text-xl md:text-2xl text-primary-foreground/90 max-w-2xl">
            Professeurs vérifiés. Suivi personnalisé. Grâce à l’Avance Immédiate,
            <span className="font-semibold text-secondary"> 25 €/h au lieu de 50 €</span>.
          </p>

          {/* CTAs + Chip avis */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button
              variant="hero"
              size="lg"
              asChild
              className="text-lg px-8 py-6"
              data-analytics-id="hero_cta_primary"
              aria-label="Trouver un professeur"
            >
              <Link to="/offres">
                Trouver un professeur <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              data-analytics-id="hero_cta_secondary"
              aria-label="Parler à un conseiller"
            >
              <a href="tel:+33123456789">
                <Phone className="mr-2 h-5 w-5" />
                Parler à un conseiller
              </a>
            </Button>

            {/* Chip avis compact */}
            <div
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 text-primary-foreground px-4 py-2 backdrop-blur-sm"
              aria-label="Satisfaction clients"
            >
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">4,9/5</span>
              <span className="opacity-80">— 500+ familles</span>
            </div>
          </div>

          {/* Bullets d’objections */}
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-primary-foreground/90">
            <li className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-secondary-foreground" />
              Professeurs testés & formés
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary-foreground" />
              Suivi des progrès pour les parents
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-secondary-foreground" />
              Sans engagement
            </li>
          </ul>

          {/* Bandeau de réassurance */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-primary-foreground/80">
            <Reassure title="Paiement sécurisé" desc="CB & SEPA, 3D Secure" />
            <Reassure title="Facture fiscale" desc="Avance Immédiate appliquée" />
            <Reassure title="Données RGPD" desc="Stockées en UE, chiffrées" />
          </div>
        </div>
      </div>

      {/* Indicateur scroll vers “Comment ça marche” (même page ou page dédiée) */}
      <a
        href="/comment-ca-marche"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        aria-label="Voir comment ça marche"
        data-analytics-id="hero_anchor_how_it_works"
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary rounded-full mt-2 animate-bounce" />
        </div>
      </a>
    </header>
  );
};

function Reassure({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-black/10 md:bg-white/5 backdrop-blur-sm p-4">
      <p className="font-semibold text-primary-foreground">{title}</p>
      <p className="text-sm">{desc}</p>
    </div>
  );
}
