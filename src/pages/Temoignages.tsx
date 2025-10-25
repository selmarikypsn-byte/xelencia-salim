import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ⚠️ Assure-toi que ces fichiers existent dans src/assets/
import mamanFel from "@/assets/maman_felicite.png";
import papaTem from "@/assets/papa_témoignage.png";

/* ===================== Types ===================== */
type Testimonial = {
  photo: string;
  name: string;
  role: string;
  quote: string;
  highlights: string[];
  proof: string; // résultat/impact concret
};

type LiteTestimonial = {
  name: string;
  role: string;
  quote: string;
  proof?: string;
};

/* ===================== Données ===================== */
const testimonials: Testimonial[] = [
  {
    photo: mamanFel,
    name: "Nadia B.",
    role: "Mère de Yassine, Seconde",
    quote:
      "Xelencia lui a permis d’obtenir la spécialité qu’il voulait. Il a gagné en confiance et en autonomie, et gère désormais ses révisions tout seul.",
    highlights: ["Gagné en confiance", "Gagné en autonomie", "Méthode claire et durable"],
    proof: "Admis en spécialité Maths • +5 pts en 8 semaines",
  },
  {
    photo: papaTem,
    name: "Jean-Marc R.",
    role: "Père d’Arthur, Terminale Générale",
    quote:
      "L’accompagnement structuré a tout changé : exercices ciblés, retours précis, oral régulier. Arthur a pris de l’assurance et a atteint son vœu Parcoursup.",
    highlights: ["Spécialité & orientation clarifiées", "Méthode de travail efficace", "Parent rassuré, suivi transparent"],
    proof: "Parcoursup : vœu n°1 validé • 11→17 au bac blanc",
  },
];

const moreTestimonials: LiteTestimonial[] = [
  {
    name: "Hélène D.",
    role: "Mère de Lina, 3e",
    quote:
      "Lina a gagné en confiance et en autonomie. La méthode (fiches + planning) lui a permis de remonter rapidement.",
    proof: "Brevet mention Bien • 9→15 de moyenne",
  },
  {
    name: "Sonia P.",
    role: "Mère d’Inès, L1 Économie",
    quote:
      "Les rappels espacés et la méthodologie ont relancé son autonomie. Les partiels se sont beaucoup mieux passés.",
    proof: "Validation de L1 • Moyenne 13,2/20",
  },
  {
    name: "Christophe L.",
    role: "Père de Mehdi, 1re STMG",
    quote:
      "Objectifs clairs et routine hebdo : on a évité le décrochage et il s’organise enfin seul.",
    proof: "Passage en Terminale validé",
  },
  {
    name: "Nadia B.",
    role: "Mère de Yassine, Seconde",
    quote:
      "Il a obtenu la spécialité qu’il voulait. Sa confiance et son autonomie ont explosé.",
    proof: "Spé Maths confirmée • +5 pts en 8 semaines",
  },
];

/* ===================== Page ===================== */
const Temoignages = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge className="mb-4 bg-secondary text-secondary-foreground">
            Cas réels de familles accompagnées
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Ils nous font confiance</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Des résultats concrets : <span className="font-semibold">confiance</span>,{" "}
            <span className="font-semibold">autonomie</span>,{" "}
            <span className="font-semibold">spécialité choisie</span>.
          </p>
        </div>
      </section>

      {/* TEMOIGNAGES PREMIUM (avec photos) */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid gap-8 md:gap-10">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="hover-lift overflow-hidden border-2 border-border/60"
              data-analytics-id={`premium_testimonial_${i}`}
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  {/* Photo */}
                  <div className="md:col-span-2 relative">
                    <img
                      src={t.photo}
                      alt={`${t.name} — ${t.role}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="shadow">
                        Parent vérifié
                      </Badge>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="md:col-span-3 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="h-6 w-6 text-secondary shrink-0 mt-1" />
                      <p className="text-lg md:text-xl leading-relaxed text-foreground">{t.quote}</p>
                    </div>

                    <ul className="grid sm:grid-cols-2 gap-2 mb-5">
                      {t.highlights.map((h, k) => (
                        <li key={k} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="h-4 w-4 text-secondary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-sm font-medium text-foreground mb-6">{t.proof}</div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Button asChild className="sm:w-auto w-full" data-analytics-id="cta_contact_parent">
                        <Link to="/contact">Parler à un conseiller</Link>
                      </Button>
                      <Button asChild variant="outline" className="sm:w-auto w-full" data-analytics-id="cta_view_offers">
                        <Link to="/offres">Voir les tarifs</Link>
                      </Button>
                      <div className="ml-auto text-right hidden md:block">
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AUTRES AVIS (sans photo) */}
      <CompactTestimonialSlider items={moreTestimonials} />

      {/* CTA FINAL */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-3">Prêt à échanger ?</h2>
          <p className="text-muted-foreground mb-6">
            Parlons du niveau de votre enfant et bâtissons un plan simple et efficace.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="hero">
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/offres">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Temoignages;

/* ===================== Slider compact sans photo ===================== */
function CompactTestimonialSlider({
  items = moreTestimonials,
  interval = 7000, // 7s
}: {
  items?: LiteTestimonial[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  const go = (dir: 1 | -1) => setIndex((prev) => (prev + dir + items.length) % items.length);

  // autoplay
  useEffect(() => {
    const tick = () => {
      if (!isHoveringRef.current) setIndex((i) => (i + 1) % items.length);
    };
    timerRef.current = window.setInterval(tick, interval) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length, interval]);

  // keyboard (← →)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const t = items[index];

  return (
    <section
      className="py-12 bg-accent"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
      aria-label="Avis de parents"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">D’autres avis de parents</h2>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => go(-1)} aria-label="Avis précédent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => go(1)} aria-label="Avis suivant">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-md bg-background">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>

            <div className="flex items-start gap-3 mb-4">
              <Quote className="h-6 w-6 text-secondary shrink-0 mt-1" />
              <p className="text-lg text-foreground leading-relaxed">{t.quote}</p>
            </div>

            {t.proof && <div className="text-sm font-medium text-foreground mb-4">{t.proof}</div>}

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </div>

              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-secondary" : "bg-muted"}`}
                    aria-label={`Aller à l’avis ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* CTA sous l’avis */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="sm:w-auto w-full">
                <Link to="/contact">Parler à un conseiller</Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-auto w-full">
                <Link to="/offres">Voir les tarifs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contrôles mobiles */}
        <div className="mt-4 flex md:hidden items-center justify-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => go(-1)} aria-label="Avis précédent">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => go(1)} aria-label="Avis suivant">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
