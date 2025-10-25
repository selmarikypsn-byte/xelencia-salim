import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, MessageSquare, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  userType: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const subjects = [
  "Question générale",
  "Inscription parent/élève",
  "Candidature professeur",
  "Problème technique",
  "Facturation",
  "Réclamation",
  "Partenariat",
  "Autre",
];

const officeHours = [
  { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
  { day: "Samedi", hours: "9h00 - 13h00" },
  { day: "Dimanche", hours: "Fermé" },
];

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "ko">(null);
  // Honeypot (anti-spam)
  const [hp, setHp] = useState("");

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // clear field error on change
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = "Votre nom est requis.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Email invalide.";
    if (!data.subject) e.subject = "Choisissez un sujet.";
    if (data.message.trim().length < 10) e.message = "Message trop court (10 caractères min).";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSent(null);

    // honeypot
    if (hp) return;

    const v = validate(formData);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      setSent("ko");
      return;
    }

    try {
      setLoading(true);
      // TODO: branchement backend (ex: Supabase Edge Function / Resend / endpoint perso)
      // const res = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error("Send error");

      // Simu succès pour l’instant
      await new Promise((r) => setTimeout(r, 700));
      setSent("ok");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", userType: "" });
    } catch {
      setSent("ko");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Téléphone",
      info: "01 23 45 67 89",
      details: "Lun–Ven : 9h–18h",
      action: "Nous appeler",
      href: "tel:0123456789",
      internal: false,
    },
    {
      icon: Mail,
      title: "Email",
      info: "contact@xelencia.fr",
      details: "Réponse sous 2h",
      action: "Nous écrire",
      href: "mailto:contact@xelencia.fr",
      internal: false,
    },
    {
      icon: MapPin,
      title: "Adresse",
      info: "75 Avenue de la République",
      details: "75011 Paris, France",
      action: "Voir sur la carte",
      href:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("75 Avenue de la République, 75011 Paris, France"),
      internal: false,
      targetBlank: true,
    },
    {
      icon: MessageSquare,
      title: "Chat en ligne",
      info: "Support instantané",
      details: "9h–18h tous les jours",
      action: "Démarrer le chat",
      href: "#", // branche ton widget ici
      internal: false,
    },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="py-20 bg-gradient-to-r from-primary to-tertiary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Contactez-nous</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-slide-up">
            Notre équipe vous répond en général <span className="font-semibold">sous 2 heures</span> (jours ouvrés).
          </p>
        </div>
      </section>

      {/* MÉTHODES RAPIDES */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 h-12 w-12 grid place-items-center rounded-xl bg-secondary/15">
                    <method.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
                  <p className="text-foreground font-medium mb-1">{method.info}</p>
                  <p className="text-muted-foreground text-sm mb-4">{method.details}</p>

                  {method.internal ? (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={method.href}>{method.action}</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a
                        href={method.href}
                        target={method.targetBlank ? "_blank" : undefined}
                        rel={method.targetBlank ? "noopener noreferrer" : undefined}
                      >
                        {method.action}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE + INFOS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* FORM */}
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-foreground mb-6">Envoyez-nous un message</h2>
              <p className="text-muted-foreground mb-8">
                Décrivez votre besoin : niveau de l’élève, matières, disponibilités. Nous vous recontactons
                rapidement avec une proposition claire.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Honeypot anti-spam */}
                <input
                  type="text"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                      required
                    />
                    {errors.name && (
                      <p id="err-name" className="text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      required
                    />
                    {errors.email && (
                      <p id="err-email" className="text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      pattern="^(\+?\d[\d\s\-]{6,})$"
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userType">Vous êtes</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(v) => handleInputChange("userType", v)}
                    >
                      <SelectTrigger id="userType">
                        <SelectValue placeholder="Sélectionnez votre profil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent/Élève</SelectItem>
                        <SelectItem value="teacher">Professeur candidat</SelectItem>
                        <SelectItem value="teacher-active">Professeur actif</SelectItem>
                        <SelectItem value="partner">Partenaire</SelectItem>
                        <SelectItem value="journalist">Journaliste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(v) => handleInputChange("subject", v)}
                  >
                    <SelectTrigger id="subject" aria-invalid={!!errors.subject}>
                      <SelectValue placeholder="Choisissez un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s, idx) => (
                        <SelectItem key={idx} value={s.toLowerCase().replace(/ /g, "-")}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Niveau, matières, créneaux, objectifs (ex : reprendre confiance, viser la spécialité maths, préparation bac...)"
                    autoComplete="off"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "err-message" : undefined}
                    required
                  />
                  {errors.message && (
                    <p id="err-message" className="text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  👋 En général, **réponse sous 2 heures** les jours ouvrés.
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Envoi..." : "Envoyer le message"}
                </Button>

                <div role="status" aria-live="polite" className="mt-3 text-sm">
                  {sent === "ok" && (
                    <span className="text-green-600">
                      Merci, votre message a bien été envoyé. Nous revenons vers vous rapidement.
                    </span>
                  )}
                  {sent === "ko" && (
                    <span className="text-red-600">
                      Impossible d’envoyer. Vérifiez les champs requis et réessayez.
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* PANNEAU D'INFOS */}
            <div className="space-y-8">
              {/* Horaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 text-secondary mr-2" />
                    Horaires d'ouverture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {officeHours.map((s, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="font-medium">{s.day}</span>
                        <span className="text-muted-foreground">{s.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Accès rapide */}
              <Card>
                <CardHeader>
                  <CardTitle>Accès rapide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                    <Users className="h-6 w-6 text-secondary" />
                    <div className="flex-1">
                      <div className="font-medium">Parents & Élèves</div>
                      <div className="text-sm text-muted-foreground">Découvrir nos offres</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/offres">Voir</Link>
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                    <GraduationCap className="h-6 w-6 text-secondary" />
                    <div className="flex-1">
                      <div className="font-medium">Futurs Professeurs</div>
                      <div className="text-sm text-muted-foreground">Rejoindre notre équipe</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/devenir-professeur">Postuler</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card>
                <CardContent className="p-0">
                  <div className="h-64 bg-accent rounded-lg flex items-center justify-center">
                    <div className="text-center px-4">
                      <MapPin className="h-12 w-12 text-secondary mx-auto mb-2" />
                      <div className="font-medium">75 Avenue de la République</div>
                      <div className="text-muted-foreground">75011 Paris, France</div>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a
                          href={
                            "https://www.google.com/maps/search/?api=1&query=" +
                            encodeURIComponent("75 Avenue de la République, 75011 Paris, France")
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Voir sur Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgence pédagogique */}
              <Card className="border-secondary">
                <CardHeader>
                  <CardTitle className="text-secondary">Urgence pédagogique</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Pour les situations urgentes (cours non effectué, problème grave), contactez notre ligne directe :
                  </p>
                  <Button variant="secondary" className="w-full" asChild>
                    <a href="tel:0123456789">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligne urgence : 01 23 45 67 89
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ligne prioritaire pour incidents — pour les demandes courantes, utilisez le formulaire.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Peut-être trouverez-vous votre réponse dans notre FAQ
          </h2>
          <p className="text-muted-foreground mb-6">Consultez nos questions fréquentes pour des réponses immédiates</p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/faq">Voir la FAQ</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
