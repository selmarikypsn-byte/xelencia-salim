import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  BarChart,
  Users,
  ClipboardCheck,
  Sparkles,
  Laptop,
} from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Mets ces fichiers dans src/assets/ avec exactement ces noms
import img1 from "@/assets/image_enseignants_1.jpg";
import img2 from "@/assets/image_enseignants_2.jpg";

export default function NosEnseignants() {
  return (
    <Layout>
      {/* HERO */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge className="mb-4 bg-secondary text-secondary-foreground">
            <GraduationCap className="h-4 w-4 mr-2" />
            Professeurs sélectionnés & accompagnés
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Nos Enseignants</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            La qualité humaine et pédagogique au service de la réussite des élèves — renforcée
            par un suivi moderne (intranet, OTP) et l’absence d’engagement.
          </p>
        </div>
      </section>

      {/* BLOC 1 : Argumentaire gauche / Image droite */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Argumentaire */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Sélection exigeante & pédagogie active</h2>
            <p className="text-muted-foreground mb-6">
              Nous ne recrutons pas seulement des experts de leur matière : nous choisissons des
              **pédagogues** capables d’expliquer simplement, d’encourager et d’installer des
              habitudes de travail durables. Chaque enseignant est évalué sur des critères
              académiques et humains.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Feature
                icon={ClipboardCheck}
                title="Processus de sélection"
                desc="Vérification des diplômes, entretien pédagogique, test de cours, référence(s)."
              />
              <Feature
                icon={ShieldCheck}
                title="Fiabilité & sécurité"
                desc="Charte qualité, validation des séances par OTP, historique transparent."
              />
              <Feature
                icon={BarChart}
                title="Suivi mesurable"
                desc="Objectifs, bilans réguliers, progression suivie dans l’intranet."
              />
              <Feature
                icon={Sparkles}
                title="Formation continue"
                desc="Bonnes pratiques de pédagogie active & différenciation didactique."
              />
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={img1}
              alt="Professeur Xelencia accompagnant un élève"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* BLOC 2 : Image gauche / Argumentaire droite */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image (à gauche en desktop grâce à order) */}
          <div className="rounded-2xl overflow-hidden shadow-lg order-last md:order-first">
            <img
              src={img2}
              alt="Cours particuliers avec professeur qualifié"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Argumentaire */}
          <div className="order-first md:order-last">
            <h2 className="text-3xl font-bold mb-4">Notre valeur ajoutée sur le marché</h2>
            <p className="text-muted-foreground mb-6">
              Xelencia va au-delà du cours : nous **accompagnons l’évolution** de l’élève. Parents
              et élèves disposent d’un **intranet** pour suivre les objectifs, comptes-rendus,
              feuilles de route, et progression par matière — et chaque séance est validée via un **OTP**,
              pour une traçabilité fiable et un paiement automatique des heures réellement effectuées.
            </p>

            <div className="space-y-3">
              <Point title="Pas d’engagement">
                Nous croyons en la qualité de notre dispositif : vous êtes libres d’arrêter à tout moment.
              </Point>
              <Point title="Plan de réussite personnalisé">
                Le professeur construit un plan évolutif validé avec la famille, ajusté selon les progrès.
              </Point>
              <Point title="Intranet parents/élèves">
                Tableau de bord clair : objectifs, bilans après chaque cours, messages, documents.
              </Point>
              <Point title="Matching intelligent">
                Nous affectons le bon enseignant selon niveau, matière, personnalité & disponibilités.
              </Point>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Button asChild size="lg">
                <Link to="/offres">Voir les offres</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Parler à un conseiller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS + PREUVES */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Stat number="4.8/5" label="Note moyenne des professeurs" />
            <Stat number="500+" label="Élèves accompagnés" />
            <Stat number="50+" label="Enseignants actifs" />
            <Stat number="98%" label="Satisfaction des familles" />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Proof
              title="Suivi intranet"
              desc="Parents & élèves consultent objectifs, bilans et progression, et échangent avec le professeur."
              icon={Laptop}
            />
            <Proof
              title="Validation OTP"
              desc="Après chaque cours, un code OTP confirme la séance et déclenche le décompte d’heures."
              icon={ShieldCheck}
            />
            <Proof
              title="Équipe à l’écoute"
              desc="Conseillers pédagogiques disponibles pour ajuster le rythme et le plan de réussite."
              icon={Users}
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-accent text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Prêts à rencontrer votre professeur idéal ?</h3>
        <p className="text-muted-foreground mb-6">
          Décrivez vos besoins, on s’occupe du reste. Sans engagement.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link to="/offres">Commencer maintenant</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contact">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

/* ---------- Petits composants ---------- */

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<any>;
  title: string;
  desc: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5 text-secondary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
    </Card>
  );
}

function Point({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow hover-lift">
      <div className="text-3xl md:text-4xl font-bold text-secondary">{number}</div>
      <div className="text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Proof({
  title,
  desc,
  icon: Icon,
}: {
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5 text-secondary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
    </Card>
  );
}
