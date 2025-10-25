import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  FileText,
  ClipboardCheck,
  UserCheck,
  Target,
  CheckCircle,
  Play,
  KeyRound,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";

type StepItem = {
  title: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const STEPS: StepItem[] = [
  {
    title: "Prise de contact",
    desc:
      "Vous nous contactez afin de présenter vos besoins. Un conseiller pédagogique identifie les attentes de votre enfant pour lui attribuer le professeur le plus adapté.",
    icon: Phone,
  },
  {
    title: "Envoi du dossier",
    desc:
      "Nous vous transmettons un dossier d’inscription comprenant un mandat et une fiche à compléter.",
    icon: FileText,
  },
  {
    title: "Inscription",
    desc:
      "Vous remplissez le dossier et renseignez les disponibilités de votre enfant (au moins deux créneaux par matière). Vous joignez également les frais d’inscription (60 €).",
    icon: ClipboardCheck,
  },
  {
    title: "Bilan gratuit",
    desc:
      "Sous 10 jours ouvrés, un enseignant vous contacte pour réaliser un bilan gratuit d’1h. Il échange avec votre enfant, évalue son niveau et définit son profil.",
    icon: UserCheck,
  },
  {
    title: "Plan de réussite",
    desc:
      "L’enseignant élabore un plan de travail personnalisé, que nous validons ensemble pour garantir la progression vers l’autonomie.",
    icon: Target,
  },
  {
    title: "Validation du plan",
    desc:
      "Sous 48h, notre équipe pédagogique vous recontacte pour valider le rythme hebdomadaire et l’échéancier adapté.",
    icon: CheckCircle,
  },
  {
    title: "Démarrage officiel",
    desc:
      "Vous confirmez votre engagement en réglant le pack choisi (chèques ou CESU). Les heures sont créditées sur votre espace.",
    icon: Play,
  },
  {
    title: "Validation des séances (OTP)",
    desc:
      "Après chaque cours, le professeur génère un code OTP unique depuis la plateforme. Ce code est validé par l’élève ou le parent : traçabilité parfaite et décompte automatique.",
    icon: KeyRound,
  },
];

export default function CommentCaMarche() {
  const [active, setActive] = useState(0);

  const total = STEPS.length;
  const boundedActive = Math.min(Math.max(active, 0), total - 1);
  const percent = useMemo(
    () => Math.round(((boundedActive + 1) / total) * 100),
    [boundedActive, total]
  );

  const go = (n: number) =>
    setActive(Math.min(Math.max(n, 0), total - 1));
  const next = () => go(boundedActive + 1);
  const prev = () => go(boundedActive - 1);

  // ✅ Récupérer le composant d’icône de l’étape active
  const ActiveIcon = STEPS[boundedActive].icon;

  return (
    <Layout>
      {/* HERO */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Comment ça marche&nbsp;?</h1>
          <p className="text-lg md:text-2xl text-primary-foreground/90">
            Xelencia, c’est <strong>8 lettres</strong>… et aussi <strong>8 étapes</strong> pour une réussite durable ✨
          </p>
        </div>
      </section>

      {/* STEPPER INTERACTIF */}
      <section className="bg-background py-14">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Barre de progression */}
          <div className="mb-8">
            <div
              className="h-2 w-full rounded-full bg-accent"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <div
                className="h-2 rounded-full bg-secondary transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground text-right">
              {percent}% complété
            </div>
          </div>

          {/* Marqueurs horizontaux (scroll en mobile) */}
          <div className="relative overflow-x-auto pb-2 mb-8">
            <ol className="flex min-w-[720px] justify-between items-center">
              {STEPS.map((s, i) => {
                const state =
                  i < boundedActive ? "done" : i === boundedActive ? "current" : "todo";
                return (
                  <li key={i} className="flex flex-col items-center">
                    <button
                      onClick={() => go(i)}
                      className={`grid place-items-center h-12 w-12 rounded-full border-2 transition
                        ${
                          state === "done"
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : state === "current"
                            ? "bg-primary text-primary-foreground border-primary animate-pulse"
                            : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                        }`}
                      aria-current={state === "current" ? "step" : undefined}
                      aria-label={`Étape ${i + 1} : ${s.title}`}
                    >
                      {i + 1}
                    </button>
                    <span className="mt-2 text-xs md:text-sm text-foreground font-medium text-center max-w-[140px]">
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Carte de contenu de l’étape active */}
          <Card className="hover-lift">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-secondary/90 text-secondary-foreground grid place-items-center shadow">
                  {/* ✅ utilisation correcte du composant d’icône */}
                  <ActiveIcon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Étape {boundedActive + 1} — {STEPS[boundedActive].title}
                  </h2>
                  <p className="text-muted-foreground md:text-lg leading-relaxed">
                    {STEPS[boundedActive].desc}
                  </p>

                  {/* Navigation */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={prev}
                      disabled={boundedActive === 0}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      onClick={next}
                      disabled={boundedActive === STEPS.length - 1}
                      className="gap-2"
                    >
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste compacte des 8 étapes (SEO + scan rapide) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <Card
                key={`compact-${i}`}
                className={`transition ${i === boundedActive ? "ring-2 ring-secondary/70" : "hover-lift"}`}
                onMouseEnter={() => go(i)}
              >
                <CardContent className="p-5 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent grid place-items-center text-foreground font-semibold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {s.desc}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
