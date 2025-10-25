import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import MultiRoleSignupForm from "@/components/auth/MultiRoleSignupForm"; // 🔥 Nouveau formulaire
import { getCurrentProfile, routeByRole } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const Inscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await getCurrentProfile();
          if (profile) {
            const route = routeByRole(profile.role);
            navigate(route);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkExistingSession();
  }, [navigate]);

  return (
    <Layout>
      <section className="py-20 bg-accent min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="animate-fade-in">
              {/* 🔥 Nouveau composant */}
              <MultiRoleSignupForm />
            </div>
            
            <div className="mt-8 text-center space-y-4">
              <Button variant="outline" asChild>
                <Link to="/connexion" className="text-tertiary hover:text-secondary">
                  Déjà un compte ? Se connecter
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/" className="text-tertiary hover:text-secondary">
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Inscription;
