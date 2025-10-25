import { createContext, useContext } from "react";

/** Vrai si on est déjà rendu à l'intérieur du layout racine (RootLayout). */
export const LayoutContext = createContext(false);
export const useInRootLayout = () => useContext(LayoutContext);
