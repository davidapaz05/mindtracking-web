"use client";

import React, { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import axios from "axios";

interface ModalEscritaDiarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (analysisId: string) => void; // callback para abrir análise depois
}

export default function ModalEscritaDiario({
  isOpen,
  onClose,
  onSaved,
}: ModalEscritaDiarioProps) {
  const { theme } = useTheme();
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!texto.trim()) return; // não enviar texto vazio
    setLoading(true);
    try {
      // Envia para o backend
      const response = await axios.post("/api/diario", { texto });
      // Recebe o ID ou dados da análise gerada
      const { id } = response.data;
      onSaved(id); // callback para abrir o modal de análise
      setTexto("");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar a escrita:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 py-[70px]">
      <div
        className={`p-6 rounded-2xl w-full max-w-[600px] relative shadow-xl transition-all duration-300 
        ${theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-900"}`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1">
          <img
            src={
              theme === "dark"
                ? "/images/icons/fechar_b.svg"
                : "/images/icons/fechar.svg"
            }
            alt="Fechar"
            className="w-8 h-8"
          />
        </button>

        <div className="flex flex-col items-center gap-2 text-center mt-10">
          <img
            src={
              theme === "dark"
                ? "/images/icons/diario_b.svg"
                : "/images/icons/diario.svg"
            }
            alt="Logo Diário"
            className="w-12 md:w-12"
          />
          <h2 className="text-xl md:text-2xl font-bold">Escrita no Diário</h2>
          <p className="text-xs md:text-sm text-gray-500">
            Escreva livremente – somente você verá isso.
          </p>
        </div>

        <div className="mt-6">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva aqui..."
            className={`w-full min-h-[180px] rounded-lg p-4 text-sm md:text-base leading-relaxed resize-none
              border-blue-600 border-[2.5px] focus:border-blue-600 focus:ring-0
              ${
                theme === "dark"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-gray-900"
              }`}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="min-w-[120px] py-2 px-4 rounded-2xl text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="min-w-[120px] py-2 px-4 rounded-2xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
