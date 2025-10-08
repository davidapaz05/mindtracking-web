"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../contexts/ThemeContext";
import Sidebar from "@/components/layout/Sidebar";
import ModalAnalise from "@/components/common/Modals/Diario/ModalAnalise";

export default function Diario() {
  const { theme } = useTheme();
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("/api/diario"); // endpoint do backend
        setCards(response.data);
      } catch (error) {
        console.error("Erro ao buscar os registros do diário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="h-screen overflow-y-auto lg:ml-37.5 md:mt-20 mt-25 lg:mt-0">
      <Sidebar />
      <div className="w-full p-6 md:p-10">
        <h1
          className={`text-2xl font-bold mb-10 lg:mb-10 font-inter ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } transition-all duration-300 ease-in-out`}
        >
          Diário Emocional
        </h1>

        <div
          className={`rounded-xl p-6 ${
            theme === "dark"
              ? "border-2 border-blue-600 bg-slate-900"
              : "bg-white border-2 border-black"
          } transition-all duration-300 ease-in-out`}
        >
          {loading ? (
            <p className="text-center font-inter">Carregando...</p>
          ) : cards.length === 0 ? (
            <p className="text-center font-inter">
              Nenhum registro encontrado.
            </p>
          ) : (
            <div
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 
                         overflow-y-scroll scrollbar-hide
                         max-h-[720px]"
            >
              {cards.map((card) => (
                <div
                  key={card.id || Math.random()} // Garante uma key única
                  className={`p-4 rounded-lg transition-shadow transition-all duration-300 ease-in-out 
                    ${
                      theme === "dark"
                        ? "bg-slate-800 text-gray-200 shadow-none hover:shadow-[-4px_4px_12px_rgba(37,99,235,0.3)]"
                        : "bg-slate-50 text-gray-800 shadow-lg hover:shadow-md"
                    }
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-inter font-bold">{card.title}</h2>
                    <span className="text-sm text-gray-500 font-inter font-normal">
                      {card.date}
                    </span>
                  </div>

                  <p className="text-sm mb-4 font-inter font-normal">
                    {card.description}
                  </p>

                  {card.analysis && ( // Verifica se card.analysis existe
                    <button
                      onClick={() => setSelectedAnalysis(card.analysis)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition duration-300 ease-in-out font-inter font-normal"
                      aria-label={`Ver análise de ${card.title}`}
                    >
                      <img
                        src="/images/icons/lupa.svg"
                        alt="Lupa"
                        className="w-4 h-4"
                      />
                      Ver Análise
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalAnalise
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />
    </div>
  );
}


//codigo certo