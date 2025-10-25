// src/pages/Connexion.tsx
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentProfile, routeByRole } from "@/lib/auth"; // garde ton lib/auth existant

const Connexion = () => {
  const navigate = useNavigate();

  // ✅ Si une session existe déjà, on route directement sans relogin
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await getCurrentProfile();
          const next = routeByRole(profile?.role ?? null);
          navigate(next, { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkExistingSession();
  }, [navigate]);

  // ✅ onSubmit fourni au LoginForm
  const handleLogin = async (email: string, password: string) => {
    // Tu peux utiliser ici soit supabaseService.signInAndRoute, soit ton couple getCurrentProfile/routeByRole
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const profile = await getCurrentProfile();
    const next = routeByRole(profile?.role ?? null);
    navigate(next, { replace: true });
  };

  return (
    <Layout>
      <section className="py-20 bg-accent min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto animate-fade-in">
            <LoginForm onSubmit={handleLogin} />
            <div className="mt-8 text-center">
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

export default Connexion;
