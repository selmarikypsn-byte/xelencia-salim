import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  BarChart,
  Laptop,
  ShieldCheck,
  Heart,
  Sparkles,
} from "lucide-react";
import React from "react";
import quiImage from "@/assets/quisommesnous_.jpg";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export default function QuiSommesNous() {
  return (
    <Layout>
      {/* Hero avec image */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Texte */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Qui sommes-nous ?
            </h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              Plus qu’un soutien scolaire, nous construisons des parcours de
              réussite durables pour chaque élève, avec un suivi continu, un
              intranet moderne et des professeurs sélectionnés pour leur
              excellence pédagogique.
            </p>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={quiImage}
              alt="Un professeur accompagnant un élève"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Chez Xelencia, nous ne nous arrêtons pas aux cours. Nous accompagnons vos
            enfants dans la durée grâce à un suivi individualisé et des outils
            modernes permettant aux parents de suivre chaque étape. Notre
            objectif : transformer chaque heure en progrès mesurables et en
            autonomie.
          </p>
        </div>
      </section>

      {/* Différenciateurs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ce qui nous rend uniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DiffCard
              icon={Laptop}
              title="Intranet de suivi"
              desc="Tableau de bord élève/parent : progression, bilans, plan de travail, compte-rendus."
            />
            <DiffCard
              icon={ShieldCheck}
              title="Sans engagement"
              desc="Aucun contrat contraignant : notre qualité et nos résultats parlent d’eux-mêmes."
            />
            <DiffCard
              icon={BarChart}
              title="Suivi évolutif"
              desc="Objectifs clairs, indicateurs de progrès, ajustement continu du plan pédagogique."
            />
            <DiffCard
              icon={Users}
              title="Professeurs sélectionnés"
              desc="Sélection, entretien pédagogique, test de cours, vérifications & formation continue."
            />
            <DiffCard
              icon={Heart}
              title="Bienveillance"
              desc="Respect du rythme de l’élève, restauration de la confiance, plaisir d’apprendre."
            />
            <DiffCard
              icon={Sparkles}
              title="Innovation"
              desc="Outils modernes (OTP, intranet, rapports) au service de la pédagogie et des familles."
            />
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <h2 className="text-3xl font-bold mb-10">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ValueCard
              title="Excellence"
              desc="Exigence élevée dans le recrutement et l’accompagnement de nos professeurs."
            />
            <ValueCard
              title="Confiance"
              desc="Transparence totale, validation des cours par OTP, pas d’engagement."
            />
            <ValueCard
              title="Innovation"
              desc="Un intranet clair pour un suivi en temps réel et des décisions éclairées."
            />
            <ValueCard
              title="Proximité"
              desc="Un lien humain fort entre familles et enseignants, avec un conseiller dédié."
            />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Envie d’en savoir plus ?
        </h2>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button asChild size="lg" variant="secondary">
            <Link to="/offres">Découvrir nos offres</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-background text-foreground">
            <Link to="/contact#form">Nous contacter</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function DiffCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: IconType;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-6 text-center hover-lift">
      <div className="flex items-center justify-center mb-4">
        <Icon className="h-10 w-10 text-secondary" />
      </div>
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{desc}</CardContent>
    </Card>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow hover-lift">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}
