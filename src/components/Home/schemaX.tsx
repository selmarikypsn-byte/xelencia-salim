// src/components/Home/SchemaX.tsx
import React from "react";
import logo from "@/assets/Logo_complet_claire_XELENCIA.jpg";

type Step = { label: string };

const left: Step[] = [
  { label: "Prise de contact" },
  { label: "Envoi du dossier et mandat" },
  { label: "Inscription" },
  { label: "Bilan gratuit" },
];

const right: Step[] = [
  { label: "Plan de réussite" },
  { label: "Validation du plan" },
  { label: "Démarrage officiel" },
  { label: "Validation des séances" },
];

export default function SchemaX() {
  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Grille 3 colonnes: liste gauche / X / liste droite */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(520px,680px)_1fr] gap-8 items-center">
        {/* Colonne gauche */}
        <ul className="space-y-6 order-1">
          {left.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-orange-400 to-orange-500 text-white text-lg font-bold shadow"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="text-lg md:text-xl font-semibold text-foreground">
                {s.label}
              </span>
            </li>
          ))}
        </ul>

        {/* X central en SVG + logo */}
        <div className="relative order-3 lg:order-2 aspect-[16/10] w-full">
          <svg
            viewBox="0 0 800 500"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Schéma Xelencia en 8 étapes"
          >
            <defs>
              <linearGradient id="gX" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="softshadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="14" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Branches du “X” */}
            <rect
              x="180"
              y="40"
              width="120"
              height="420"
              rx="22"
              transform="rotate(55 240 250)"
              fill="url(#gX)"
              filter="url(#softshadow)"
              opacity="0.95"
            />
            <rect
              x="500"
              y="40"
              width="120"
              height="420"
              rx="22"
              transform="rotate(125 560 250)"
              fill="url(#gX)"
              filter="url(#softshadow)"
              opacity="0.95"
            />

            {/* Cercle central */}
            <circle cx="400" cy="250" r="110" fill="#e9f7fb" />
            <circle cx="400" cy="250" r="110" fill="none" stroke="#0ea5e9" strokeOpacity="0.15" strokeWidth="6" />
          </svg>

          {/* Logo au centre */}
          <div className="absolute inset-0 grid place-items-center">
            <img
              src={logo}
              alt="Logo Xelencia"
              className="h-28 md:h-36 w-auto drop-shadow"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Colonne droite */}
        <ul className="space-y-6 order-2 lg:order-3">
          {right.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-fuchsia-500 to-pink-500 text-white text-lg font-bold shadow"
                aria-hidden
              >
                {i + 5}
              </span>
              <span className="text-lg md:text-xl font-semibold text-foreground">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
