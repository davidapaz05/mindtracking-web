"use client";

import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function Diario() {
  const { theme } = useTheme();

  const cards = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: "Título do card",
    date: "08/08/2025 - 08:53",
    description:
      "Este é um texto fictício utilizado como preenchimento em projetos gráficos, websites e documentos. O objetivo é simular o conteúdo real de forma neutra e sem di...",
  }));

  return (
    <div className="w-full p-6 md:p-10">
      {/* Título */}
      <h1
        className={`text-2xl font-bold mb-6 font-inter ${
          theme === "dark" ? "text-white" : "text-gray-900"
        } transition-all duration-300 ease-in-out`}
      >
        Diário Emocional
      </h1>

      {/* Container externo com rolagem */}
      <div
        className={`rounded-xl p-6 
          ${theme === "dark"
            ? "border-2 border-blue-600 bg-slate-900"
            : "bg-white border-2 border-black"
          } max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out`}
      >
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                p-4 rounded-lg transition-shadow transition-all duration-300 ease-in-out 
                ${theme === "dark"
                  ? "bg-slate-800 text-gray-200 border-2 border-blue-600 shadow-none hover:shadow-[-4px_4px_12px_rgba(37,99,235,0.3)]"
                  : "bg-slate-50 text-gray-800 border-none shadow-lg hover:shadow-md"
                }
              `}
            >
              {/* Header do card */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-inter font-bold">{card.title}</h2>
                <span className="text-sm text-gray-500 font-inter font-normal">
                  {card.date}
                </span>
              </div>

              {/* Texto */}
              <p className="text-sm mb-4 font-inter font-normal">
                {card.description}
              </p>

              {/* Botão */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition duration-300 ease-in-out font-inter font-normal">
                <img
                  src="/images/icons/lupa.svg"
                  alt="Lupa"
                  className="w-4 h-4 "
                />
                Ver Análise
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
