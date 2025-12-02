"use client";

import React from "react";
import Image from "next/image";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-3 sm:px-4 py-4 overflow-y-auto">
      <div
        className={`p-4 sm:p-6 rounded-2xl w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[800px] relative shadow-xl transition-all duration-300 max-h-[90vh] overflow-y-auto my-4
        ${
          theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer transition-colors p-1 z-10"
          aria-label="Fechar modal"
        >
          <Image
            src={
              theme === "dark"
                ? "/images/icons/fechar_b.svg"
                : "/images/icons/fechar.svg"
            }
            alt="Fechar"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </button>

        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center mt-4 sm:mt-0">
          {/* Logo */}
          <Image
            src={
              theme === "dark"
                ? "/images/icons/Logo_branca.svg"
                : "/images/icons/Logo_p.svg"
            }
            alt="Logo Athena"
            width={72}
            height={72}
            className="w-16 h-16 sm:w-18 sm:h-18"
          />

          {/* Título */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Análise da Athena</h2>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 text-left">
          <div className="break-words">
            <p className="text-xs sm:text-sm md:text-base leading-relaxed">
              <span className="font-bold">Mensagem: </span>&quot;{analysis.message}&quot;
            </p>
          </div>

          <div className="break-words">
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-bold">Emoção predominante: </span>
              {analysis.emotion}
            </p>
          </div>

          <div className="break-words">
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-bold">Intensidade: </span>
              {analysis.intensity}
            </p>
          </div>

          {/* Athena diz: com font-mixed */}
          <div className="break-words">
            <p
              className={`text-xs sm:text-sm md:text-base ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              <span className="font-bold">Athena diz:</span> &quot;{analysis.athena}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
