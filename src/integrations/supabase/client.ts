// src/integrations/supabase/client.ts
// ------------------------------------------------------
// ⚠️ N'édite pas ce fichier généré automatiquement.
// Pour changer les clés, modifie plutôt ton .env.local
// ------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// ⚡ Variables d'environnement (Vite -> import.meta.env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 🚀 Client Supabase typé
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
