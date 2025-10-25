import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentProfile, routeByRole } from "@/lib/auth";

export default function RoleRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const profile = await getCurrentProfile();
      const next = routeByRole(profile?.role ?? null);
      navigate(next, { replace: true });
    })();
  }, [navigate]);

  return null; // nothing to render; we just redirect
}
