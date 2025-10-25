// src/components/Layout/Footer.tsx
import { Link } from "react-router-dom";

import { useAuth } from "@/components/auth/AuthProvider";
import { routeByRole } from "@/lib/auth";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, LogIn, LayoutDashboard, UserPlus } from "lucide-react";
import logoUrl from "../../assets/logo-xelencia.png";

export const Footer = () => {
  // Remonter en haut à chaque clic sur un lien interne
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const { profile, loading } = useAuth();
  const year = new Date().getFullYear();
  const dashboardPath = routeByRole(profile?.role ?? null);


  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo + description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">


              <img src={logoUrl} alt="Xelencia" className="h-10 w-auto" />
              <span className="text-xl font-bold">XELENCIA</span>
            </div>
            <p className="text-background/80 mb-4">
              Plateforme de cours particuliers de qualité. 
              Bénéficiez de l&apos;Avance Immédiate pour payer moitié prix.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-background/60 hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-secondary transition-colors" aria-label="LinkedIn">

                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/offres" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Nos offres
                </Link>
              </li>
              <li>

       <Link to="/comment-ca-marche" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/qui-sommes-nous" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Qui sommes nous
                </Link>
              </li>
              <li>
                <Link to="/nos-enseignants" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Nos enseignants
                </Link>
              </li>
              <li>
                <Link to="/temoignages" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Pour les professeurs */}
          <div>
            <h3 className="font-semibold mb-4">Professeurs</h3>
            <ul className="space-y-2">
              <li>


                <Link to="/devenir-professeur" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Devenir professeur
                </Link>
              </li>
              <li>
                <Link to="/connexion" onClick={scrollTop} className="text-background/80 hover:text-secondary transition-colors">
                  Espace professeur
                </Link>
              </li>
              <li>
                <a href="#" className="text-background/80 hover:text-secondary transition-colors">
                  Formation
                </a>
              </li>
              <li>
                <a href="#" className="text-background/80 hover:text-secondary transition-colors">
                  Rémunération
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary" />
                <a
                  href="mailto:contact@xelencia.fr"
                  className="text-background/80 hover:text-secondary transition-colors"
                >
                  contact@xelencia.fr
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary" />
                <a
                  href="tel:+33123456789"
                  className="text-background/80 hover:text-secondary transition-colors"
                >
                  01 23 45 67 89
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-background/80">Paris, France</span>
              </li>
            </ul>

            {/* Espace compte (adapté à l'auth) */}
            <div className="mt-6">
              {!loading && profile ? (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 text-background hover:text-secondary transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Accéder au tableau de bord
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/connexion"
                    className="inline-flex items-center gap-2 text-background hover:text-secondary transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    className="inline-flex items-center gap-2 text-background/80 hover:text-secondary transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/60 text-sm">
            © {year} Xelencia. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/mentions-legales" onClick={scrollTop} className="text-background/60 hover:text-secondary text-sm transition-colors">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" onClick={scrollTop} className="text-background/60 hover:text-secondary text-sm transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/cgu" onClick={scrollTop} className="text-background/60 hover:text-secondary text-sm transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
