import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      title: "Avance Immédiate & Tarifs",
      questions: [
        {
          q: "Comment fonctionne l'Avance Immédiate exactement ?",
          a: "L'Avance Immédiate est un dispositif gouvernemental qui permet à l'État d'avancer 50% du coût de vos cours particuliers. Vous ne payez que la moitié du prix, et l'État se charge directement du reste auprès de Xelencia. C'est automatique, sans démarches supplémentaires de votre part."
        },
        {
          q: "Qui peut bénéficier de l'Avance Immédiate ?",
          a: "Tous les foyers français peuvent en bénéficier, sans conditions de revenus. Il suffit d'avoir un compte CESU (Chèque Emploi Service Universel) qui est gratuit et se crée en quelques minutes sur le site officiel."
        },
        {
          q: "Y a-t-il des frais cachés ou supplémentaires ?",
          a: "Absolument aucun frais caché. Le prix affiché est le prix final que vous payez. Pas de frais d'inscription, pas de frais de dossier, pas de commission supplémentaire."
        },
        {
          q: "Puis-je cumuler avec d'autres aides ?",
          a: "Oui, vous pouvez également bénéficier de la réduction d'impôt de 50% sur la partie que vous payez effectivement, ce qui réduit encore plus le coût final des cours."
        }
      ]
    },
    {
      title: "Système OTP et Sécurité",
      questions: [
        {
          q: "Qu'est-ce que le système OTP et pourquoi l'utiliser ?",
          a: "L'OTP (One-Time Password) est un code unique généré pour chaque cours. Le professeur vous le communique à la fin de la séance, et vous le validez sur votre espace parent. Cela garantit que le cours a bien eu lieu et évite tout malentendu sur les heures effectuées."
        },
        {
          q: "Que se passe-t-il si j'oublie de valider l'OTP ?",
          a: "Vous avez 48h pour valider l'OTP après le cours. Passé ce délai, vous recevrez un rappel par email et SMS. En cas d'oubli prolongé, notre équipe vous contactera pour régulariser la situation."
        },
        {
          q: "Le professeur peut-il tricher avec le système OTP ?",
          a: "Non, c'est impossible. Chaque OTP est unique et lié à une date, heure et durée précises. Il ne peut être généré que depuis notre plateforme au moment exact du cours, et ne peut être validé que par le parent."
        }
      ]
    },
    {
      title: "Sélection des Professeurs",
      questions: [
        {
          q: "Comment choisissez-vous vos professeurs ?",
          a: "Tous nos professeurs passent par un processus de sélection rigoureux : vérification des diplômes, entretien pédagogique, cours d'essai, et vérification du casier judiciaire. Moins de 15% des candidats sont retenus."
        },
        {
          q: "Puis-je changer de professeur si ça ne convient pas ?",
          a: "Absolument. Si le contact ne passe pas avec le premier professeur, nous vous en proposons un nouveau sans frais supplémentaires. Votre satisfaction est notre priorité."
        },
        {
          q: "Les professeurs sont-ils tous diplômés ?",
          a: "Oui, tous nos professeurs ont au minimum un Bac+3 dans la matière qu'ils enseignent. Beaucoup sont Bac+5 (Master, école d'ingénieur, etc.) et certains ont une expérience professionnelle dans leur domaine."
        }
      ]
    },
    {
      title: "Organisation des Cours",
      questions: [
        {
          q: "Comment se déroule le premier cours ?",
          a: "Le premier cours est toujours un cours de diagnostic gratuit de 30 minutes. Le professeur évalue le niveau de l'élève, identifie les lacunes et définit un plan de progression personnalisé avec vous."
        },
        {
          q: "Puis-je annuler ou reporter un cours ?",
          a: "Oui, vous pouvez annuler ou reporter un cours jusqu'à 24h avant. En cas d'annulation tardive ou d'absence non justifiée, le cours est dû. En cas de force majeure (maladie, etc.), nous étudions chaque situation au cas par cas."
        },
        {
          q: "Les cours peuvent-ils avoir lieu en visioconférence ?",
          a: "Oui, nos professeurs sont équipés pour donner des cours en ligne de qualité. C'est particulièrement efficace pour certaines matières comme les langues, les mathématiques ou l'aide aux devoirs."
        },
        {
          q: "Quelle est la durée minimum d'un cours ?",
          a: "La durée minimum est d'1h30 pour être pédagogiquement efficace. Nous proposons aussi des créneaux de 2h pour les révisions intensives ou la préparation d'examens."
        }
      ]
    },
    {
      title: "Paiements et Remboursements",
      questions: [
        {
          q: "Quand et comment suis-je prélevé ?",
          a: "Le prélèvement se fait automatiquement après validation de chaque cours via l'OTP. Vous payez donc uniquement les cours effectivement réalisés. Le paiement est sécurisé et effectué sous 48h."
        },
        {
          q: "Puis-je avoir un remboursement ?",
          a: "Si vous n'êtes pas satisfait après les 3 premiers cours, nous vous remboursons intégralement. Pour les heures non utilisées d'un pack, le remboursement est possible sous conditions (voir CGV)."
        },
        {
          q: "Puis-je payer en plusieurs fois ?",
          a: "Les packs peuvent être payés en 2 ou 3 fois sans frais. Vous pouvez aussi opter pour un abonnement mensuel qui lisse les paiements sur l'année scolaire."
        }
      ]
    },
    {
      title: "Support et Suivi",
      questions: [
        {
          q: "Comment suivre les progrès de mon enfant ?",
          a: "Vous avez accès à un tableau de bord complet avec : compte-rendu de chaque cours, évolution des notes, points travaillés, devoirs donnés. Le professeur peut aussi vous envoyer un bilan mensuel détaillé."
        },
        {
          q: "Que faire en cas de problème avec un professeur ?",
          a: "Contactez immédiatement notre service client au 01 23 45 67 89 ou via votre espace parent. Nous résolvons 95% des problèmes dans les 24h. En dernier recours, nous changeons le professeur."
        },
        {
          q: "Y a-t-il un suivi pendant les vacances scolaires ?",
          a: "Oui, nous proposons des programmes de remise à niveau pendant les vacances, ainsi que de la préparation à la rentrée. Les professeurs restent disponibles selon vos besoins."
        }
      ]
    }
  ];

  const allQuestions = faqCategories.flatMap(category => 
    category.questions.map(q => ({
      ...q,
      category: category.title
    }))
  );

  const filteredQuestions = searchTerm 
    ? allQuestions.filter(q => 
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Questions Fréquentes
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-slide-up">
            Trouvez rapidement les réponses à toutes vos questions sur Xelencia
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Recherchez votre question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            {searchTerm && (
              <div className="mt-4 text-center text-muted-foreground">
                {filteredQuestions.length} résultat(s) trouvé(s)
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {searchTerm ? (
            /* Search Results */
            <div className="max-w-4xl mx-auto">
              {filteredQuestions.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`search-${index}`}
                      className="bg-accent rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-semibold">{question.q}</div>
                          <div className="text-sm text-secondary mt-1">{question.category}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {question.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <div className="text-2xl font-semibold text-foreground mb-4">
                    Aucun résultat trouvé
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Essayez avec d'autres mots-clés ou contactez-nous directement
                  </p>
                  <Button variant="secondary" onClick={() => setSearchTerm("")}>
                    Voir toutes les questions
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Categories */
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div 
                  key={categoryIndex} 
                  className="mb-12 animate-slide-up"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm mr-3">
                      {categoryIndex + 1}
                    </div>
                    {category.title}
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((question, questionIndex) => (
                      <AccordionItem 
                        key={questionIndex} 
                        value={`${categoryIndex}-${questionIndex}`}
                        className="bg-accent rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left font-semibold">
                          {question.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {question.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Notre équipe est là pour vous aider
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-background rounded-lg hover-lift">
              <MessageCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Chat en ligne</h3>
              <p className="text-muted-foreground mb-4">Réponse immédiate 9h-18h</p>
              <Button variant="outline" className="w-full">
                Démarrer le chat
              </Button>
            </div>

            <div className="text-center p-6 bg-background rounded-lg hover-lift">
              <Phone className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Téléphone</h3>
              <p className="text-muted-foreground mb-4">01 23 45 67 89</p>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:0123456789">Nous appeler</a>
              </Button>
            </div>

            <div className="text-center p-6 bg-background rounded-lg hover-lift">
              <Mail className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">Réponse sous 2h</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Nous écrire</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prêt à commencer l'aventure Xelencia ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plus de questions ? Lancez-vous et découvrez pourquoi des milliers de familles nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/inscription">Commencer maintenant</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/offres">Voir nos offres</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;