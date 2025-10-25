import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";

import Index from "./pages/Index";
import Offres from "./pages/Offres";
import CommentCaMarche from "./pages/CommentCaMarche";
import NosEnseignants from "./pages/NosEnseignants";
import Temoignages from "./pages/Temoignages";
import DevenirProfesseur from "./pages/DevenirProfesseur";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import QuiSommesNous from "./pages/QuiSommesNous";
import NotFound from "./pages/NotFound";

// Dashboards
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

// Guards/Helpers
import ProtectedRoute from "./lib/ProtectedRoute";
import RoleRouter from "./lib/RoleRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Auth context available to everything inside Router */}
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/offres" element={<Offres />} />
            <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
            <Route path="/nos-enseignants" element={<NosEnseignants />} />
            <Route path="/temoignages" element={<Temoignages />} />
            <Route path="/devenir-professeur" element={<DevenirProfesseur />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/me" element={<RoleRouter />} />

            {/* Protected dashboards */}
            <Route
              path="/dashboard/parent"
              element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/teacher"
              element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/admin"
              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/student"
              element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
