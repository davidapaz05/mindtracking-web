"use client";

import React from "react";
import { useTheme } from "../../../../contexts/ThemeContext";

interface ModalAnaliseProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: {
    message: string;
    emotion: string;
    intensity: string;
    athena: string;
  } | null;
}

export default function ModalAnalise({
  isOpen,
  onClose,
  analysis,
}: ModalAnaliseProps) {
  const { theme } = useTheme();

  if (!isOpen || !analysis) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 py-[70px]">
      <div
        className={`p-8 rounded-2xl w-full max-w-[600px] relative shadow-xl transition-all duration-300 mt-[100px] mb-[100px]
        ${theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-900"}`}
      >
        {/* Botão fechar */}
        <button
  onClick={onClose}
  className="absolute top-4 right-4 transition-colors p-1"
>
  <img
    src={
      theme === "dark"
        ? "/images/icons/fechar_b.svg"
        : "/images/icons/fechar.svg"
    }
    alt="Fechar"
    className="w-10 h-10" // aumentei de 8/10 para 10
  />
</button>


        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <img
            src={
              theme === "dark"
                ? "/images/icons/Logo_branca.svg"
                : "/images/icons/Logo_p.svg"
            }
            alt="Logo Athena"
            className="w-18 md:w-18"
          />

          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold">Análise da Athena</h2>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-4 mt-6 text-left">
          <p className="text-sm md:text-base leading-relaxed">
            <span className="font-bold">Mensagem: </span>
            “{analysis.message}”
          </p>

          <p className="text-sm md:text-base">
            <span className="font-bold">Emoção predominante: </span>
            {analysis.emotion}
          </p>

          <p className="text-sm md:text-base">
            <span className="font-bold">Intensidade: </span>
            {analysis.intensity}
          </p>

          {/* Athena diz: com font-mixed */}
          <p
            className={`text-sm md:text-base ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          >
            <span className="font-bold">Athena diz:</span> “{analysis.athena}”
          </p>
        </div>
      </div>
    </div>
  );
}
