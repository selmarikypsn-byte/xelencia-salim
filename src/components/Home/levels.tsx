type Level = {
  name: string;
  startingPrice: number;
  tagline: string;
  features: string[];
  icon: "primaire" | "college" | "lycee" | "superieur";
  popular?: boolean;
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
    popular: true,
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
