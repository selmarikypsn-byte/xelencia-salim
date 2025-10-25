import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  BookOpen,
  Award,
  ShieldCheck,
  GraduationCap,
  School,
  Sparkles,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ---------- Tarifs par niveau ---------- */
type Level = {
  name: string;
  startingPrice: number;   // "à partir de"
  tagline: string;
  features: string[];
  icon: "primaire" | "college" | "lycee" | "superieur";
};

const levels: Level[] = [
  {
    name: "Primaire",
    startingPrice: 18,
    tagline: "Bases solides & plaisir d’apprendre",
    features: ["Professeur dédié", "Suivi personnalisé", "Sans engagement", "AIA disponible (-50%)"],
    icon: "primaire",
  },
  {
    name: "Collège",
    startingPrice: 21,
    tagline: "Méthode & confiance pour progresser",
    features: ["Professeurs vérifiés", "Planning flexible", "Bilan régulier", "AIA disponible (-50%)"],
    icon: "college",
  },
  {
    name: "Lycée",
    startingPrice: 23,
    tagline: "Maîtrise du programme & examens",
    features: ["Suivi continu", "Objectifs par matière", "Préparation aux épreuves", "AIA disponible (-50%)"],
    icon: "lycee",
  },
  {
    name: "Supérieur",
    startingPrice: 27,
    tagline: "Renforcement ciblé & réussite",
    features: ["Expertises spécifiques", "Créneaux soir/week-end", "Coaching méthodo", "AIA disponible (-50%)"],
    icon: "superieur",
  },
];

const Offres = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge className="mb-4 bg-secondary text-secondary-foreground">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Avance Immédiate disponible
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Nos Offres de Cours
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-slide-up">
            Des tarifs clairs <span className="font-semibold text-background">à partir de</span> selon le niveau.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-background/15 px-4 py-2 rounded-full">
              <ShieldCheck className="h-4 w-4" />
              <span>Sécurisé & sans engagement</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-background/15 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span>Professeurs vérifiés</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-background/15 px-4 py-2 rounded-full">
              <CreditCard className="h-4 w-4" />
              <span>Facture fiscale incluse</span>
            </div>
          </div>
        </div>
      </section>

      {/* TARIFS PAR NIVEAU */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <Badge className="mb-3 bg-secondary text-secondary-foreground">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Avance Immédiate (–50%) si éligible
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Tarifs à l’heure par niveau</h2>
            <p className="text-muted-foreground">
              Primaire <strong>18€</strong> • Collège <strong>21€</strong> • Lycée <strong>23€</strong> • Supérieur <strong>27€</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {levels.map((level, i) => (
              <LevelCard key={i} level={level} />
            ))}
          </div>

          {/* (Supprimé) Bandeau d’info AIA */}
        </div>
      </section>

      {/* PACKS D’HEURES PERSONNALISÉS — NOUVELLE APPROCHE EXPLICATIVE */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
            {/* Texte & garanties */}
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-3">
                Comment définissons-nous <span className="text-secondary">le bon pack d’heures</span> ?
              </h3>
              <p className="text-muted-foreground mb-6">
                Chez Xelencia, le volume d’heures n’est jamais arbitraire. Il est défini <strong>avec votre famille et le professeur</strong>,
                à l’issue d’un <strong>bilan gratuit</strong> qui permet d’identifier le niveau, les objectifs et le rythme réaliste de travail.
                Notre objectif : <em>le bon volume au bon moment</em>, ajustable à tout instant.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-accent text-foreground text-sm">Sans engagement</span>
                <span className="px-3 py-1 rounded-full bg-accent text-foreground text-sm">Ajustable chaque mois</span>
                <span className="px-3 py-1 rounded-full bg-accent text-foreground text-sm">Séances validées par OTP</span>
              </div>

              {/* CTA unique */}
              <div className="flex gap-3 flex-wrap">
                <Button asChild size="lg" className="px-6" data-analytics-id="packs_contact_cta">
                  <Link to="/contact">Parler à un conseiller</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Notre priorité est la vôtre : <strong>la réussite de votre enfant</strong>. Allons ensemble vers l’excellence.
              </p>
            </div>

            {/* Stepper vertical explicatif (aucun prix ni volume chiffré) */}
            <div className="relative">
              {/* ligne verticale */}
              <div className="absolute left-[22px] top-3 bottom-3 w-[2px] bg-accent/70" />

              <div className="space-y-6">
                {/* Étape 1 */}
                <div className="relative pl-14">
                  <div className="absolute left-0 top-2 h-11 w-11 rounded-full bg-secondary/90 text-secondary-foreground grid place-items-center shadow">
                    {/* ClipboardCheck */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <path d="M9 3h6v4H9z" />
                      <path d="m9 14 2 2 4-4" />
                    </svg>
                  </div>
                  <Card className="hover-lift">
                    <CardContent className="p-5">
                      <h4 className="text-lg font-semibold">1) Bilan gratuit & diagnostic</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Le professeur échange avec vous et votre enfant, analyse le niveau par matière,
                        les points d’appui et les contraintes (planning, examens, motivation…).
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Étape 2 */}
                <div className="relative pl-14">
                  <div className="absolute left-0 top-2 h-11 w-11 rounded-full bg-secondary/90 text-secondary-foreground grid place-items-center shadow">
                    {/* Target */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 14v-4" />
                      <path d="M10 12h4" />
                      <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <Card className="hover-lift">
                    <CardContent className="p-5">
                      <h4 className="text-lg font-semibold">2) Plan de réussite & rythme</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Des objectifs simples et datés sont posés, avec un <strong>rythme réaliste</strong> (ex. 1 ou 2 séances hebdomadaires, durée optimisée).
                        Le plan reste évolutif pour s’adapter aux progrès.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Étape 3 */}
                <div className="relative pl-14">
                  <div className="absolute left-0 top-2 h-11 w-11 rounded-full bg-secondary/90 text-secondary-foreground grid place-items-center shadow">
                    {/* CheckCircle */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4 12 14.01l-3-3" />
                    </svg>
                  </div>
                  <Card className="hover-lift">
                    <CardContent className="p-5">
                      <h4 className="text-lg font-semibold">3) Proposition de pack d’heures</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Le professeur propose une <strong>fourchette d’heures</strong> cohérente avec le plan (ex. “faible / standard / renforcé”),
                        validée avec vous. <strong>Réévaluation régulière</strong> (toutes les 4–6 semaines). Seules les séances réellement réalisées
                        sont comptabilisées et <strong>validées par OTP</strong>.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL — unique */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-3">
            Prêt à commencer au meilleur tarif&nbsp;?
          </h3>
          <p className="text-muted-foreground mb-6">
            Parlez avec un conseiller pour définir le bon rythme.
          </p>
          <div className="flex items-center justify-center">
            <Button asChild size="lg" className="px-8" data-analytics-id="offers_final_contact">
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA STICKY MOBILE — unique */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="mx-4 mb-4 rounded-xl shadow-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 flex items-center justify-between">
          <div className="text-sm">
            <div className="font-semibold">Tarifs dès 18 € / h</div>
            <div className="text-muted-foreground">Avance Immédiate disponible</div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" data-analytics-id="offers_sticky_contact">
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Offres;

/* ---------- Composant de carte ---------- */
function LevelCard({ level }: { level: Level }) {
  const Icon = (() => {
    switch (level.icon) {
      case "primaire": return BookOpen;
      case "college": return School;
      case "lycee": return Award;
      case "superieur": return GraduationCap;
      default: return BookOpen;
    }
  })();

  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-secondary/60 via-primary/40 to-tertiary/60">
      <Card
        className={`rounded-2xl bg-card/90 backdrop-blur border-0 shadow-md transition
                    group-hover:shadow-xl`}
        data-analytics-id={`pricing_level_${level.name.toLowerCase()}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">{level.name}</CardTitle>
            <div className="grid place-items-center h-11 w-11 rounded-xl bg-secondary/15">
              <Icon className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{level.tagline}</p>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <div className="text-sm text-muted-foreground">À partir de</div>
            <div className="text-3xl font-bold text-foreground leading-tight">
              {level.startingPrice} € <span className="text-base font-medium text-muted-foreground">/ h</span>
            </div>
          </div>

          <ul className="space-y-2">
            {level.features.map((f, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>

          {/* CTA unique */}
          <div>
            <Button
              asChild
              className="w-full group/btn px-4"
              data-analytics-id={`cta_contact_${level.name.toLowerCase()}`}
            >
              <Link to="/contact">
                Parler à un conseiller
                <ArrowRight className="ml-2 h-4 w-4 inline-block group-hover/btn:translate-x-0.5 transition" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
