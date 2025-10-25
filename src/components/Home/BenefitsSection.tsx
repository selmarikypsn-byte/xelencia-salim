import { Sparkles, Shield, Clock, Heart } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Qualité premium",
    description: "Professeurs sélectionnés et formés pour garantir l'excellence pédagogique"
  },
  {
    icon: Shield,
    title: "Simplicité garantie",
    description: "Réservation en ligne, paiement sécurisé, suivi personnalisé de vos progrès"
  },
  {
    icon: Clock,
    title: "Économies de 50%",
    description: "Grâce à l'Avance Immédiate, payez seulement 25€/h au lieu de 50€"
  }
];

export const BenefitsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Pourquoi choisir <span className="text-secondary">Xelencia</span> ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une approche moderne de l'accompagnement scolaire, 
            pensée pour les familles d'aujourd'hui
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-center group hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                <benefit.icon className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional emphasis */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-accent px-6 py-3 rounded-full">
            <Heart className="h-5 w-5 text-secondary" />
            <span className="text-foreground font-medium">
              Plus de 500 familles nous font déjà confiance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};