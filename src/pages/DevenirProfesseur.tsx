import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Euro, Clock, MapPin, Award, Users, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DevenirProfesseur = () => {
  const benefits = [
    {
      icon: Euro,
      title: "Rémunération Transparente",
      description: "Jusqu'à 35€/heure net",
      details: ["Paiement sécurisé chaque mois", "Déclaration URSSAF automatique", "Pas de frais cachés", "Évolution selon l'expérience"]
    },
    {
      icon: Clock,
      title: "Flexibilité Totale",
      description: "Choisissez vos horaires",
      details: ["Planning adapté à vos disponibilités", "Cours en présentiel ou visio", "Minimum 2h/semaine", "Annulation 24h à l'avance"]
    },
    {
      icon: MapPin,
      title: "Zone Géographique Large",
      description: "Intervenez près de chez vous",
      details: ["Déplacements optimisés", "Frais de transport remboursés", "Cours à domicile ou en ligne", "Couverture nationale"]
    },
    {
      icon: Users,
      title: "Accompagnement Continu",
      description: "Vous n'êtes jamais seul",
      details: ["Formation initiale gratuite", "Support pédagogique", "Échange avec d'autres professeurs", "Suivi personnalisé"]
    }
  ];

  const requirements = [
    {
      category: "Formation",
      items: ["Bac+3 minimum dans la matière enseignée", "Expérience pédagogique appréciée", "Passion pour la transmission"]
    },
    {
      category: "Qualités",
      items: ["Patience et bienveillance", "Capacité d'adaptation", "Excellent relationnel", "Ponctualité et fiabilité"]
    },
    {
      category: "Administratif",
      items: ["Casier judiciaire vierge", "Assurance responsabilité civile", "Statut auto-entrepreneur ou salarié", "Éligibilité CESU"]
    }
  ];

  const subjects = [
    "Mathématiques", "Français", "Anglais", "Espagnol", "Allemand", "Histoire-Géographie",
    "Physique-Chimie", "SVT", "Philosophie", "Économie", "Informatique", "Arts plastiques"
  ];

  const steps = [
    {
      number: "01",
      title: "Candidature en ligne",
      description: "Remplissez le formulaire avec vos informations et matières d'enseignement"
    },
    {
      number: "02", 
      title: "Entretien pédagogique",
      description: "Échange de 30 minutes pour valider votre approche et motivation"
    },
    {
      number: "03",
      title: "Cours d'essai",
      description: "Démonstration pratique avec un élève pour valider vos compétences"
    },
    {
      number: "04",
      title: "Intégration",
      description: "Formation, création de profil et attribution de vos premiers élèves"
    }
  ];

  const testimonialsProfesseurs = [
    {
      name: "Claire M.",
      subject: "Mathématiques",
      experience: "3 ans chez Xelencia",
      text: "La plateforme est vraiment bien pensée. Le système OTP me rassure sur la validation des cours et les paiements sont toujours à l'heure.",
      revenue: "1200€/mois"
    },
    {
      name: "Antoine R.", 
      subject: "Physique-Chimie",
      experience: "2 ans chez Xelencia",
      text: "J'ai pu concilier mon travail de recherche avec l'enseignement. Les familles sont formidables et voir les progrès des élèves est très gratifiant.",
      revenue: "800€/mois"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-foreground to-foreground/90 text-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                Devenez Professeur Xelencia
              </h1>
              <p className="text-xl md:text-2xl text-background/90 mb-8 animate-slide-up">
                Transmettez votre passion et construisez un revenu complémentaire 
                avec la flexibilité que vous méritez
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/inscription">Postuler maintenant</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-background/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-3xl font-bold text-secondary mb-2">Jusqu'à 35€/h</div>
                <div className="text-background/80">Rémunération nette</div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-3xl font-bold text-secondary mb-2">2000+</div>
                <div className="text-background/80">Professeurs actifs</div>
              </div>
              <div className="bg-background/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-3xl font-bold text-secondary mb-2">98%</div>
                <div className="text-background/80">Satisfaction professeurs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi rejoindre Xelencia ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme pensée pour valoriser votre expertise et maximiser votre épanouissement professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      <p className="text-secondary font-semibold">{benefit.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comment devenir professeur ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Un processus simple et transparent en 4 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-xl mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-secondary mx-auto mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Profil recherché
            </h2>
            <p className="text-xl text-muted-foreground">
              Les critères essentiels pour rejoindre notre équipe pédagogique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <Card 
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-center text-secondary">
                    {req.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {req.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Matières recherchées
            </h2>
            <p className="text-xl text-muted-foreground">
              Tous niveaux : du primaire aux études supérieures
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="px-4 py-2 text-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ils enseignent avec nous
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez l'expérience de nos professeurs partenaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonialsProfesseurs.map((testimonial, index) => (
              <Card 
                key={index}
                className="hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="space-y-2">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-secondary">{testimonial.subject}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.experience}</div>
                    <Badge variant="secondary" className="mt-2">
                      Revenus: {testimonial.revenue}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à transformer votre passion en revenus ?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Rejoignez dès aujourd'hui la communauté de professeurs qui font la différence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/inscription">Postuler maintenant</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/contact">Poser une question</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DevenirProfesseur;
