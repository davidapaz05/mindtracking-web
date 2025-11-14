"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createDiario } from "@/lib/api/diario";
import { hasEmoji } from "@/lib/validation";

interface DiarioCreated {
  id?: string | number;
  _id?: string | number;
  titulo?: string;
  title?: string;
  texto?: string;
  text?: string;
  descricao?: string;
  data_hora?: string;
  createdAt?: string;
  comentario_athena?: string;
  comentario?: string;
  athena?: string;
  emocao_predominante?: string;
  emocao?: string;
  intensidade_emocional?: string;
  intensidade?: string;
}

interface ModalDiarioProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  title?: string;
  onTitleChange?: (t: string) => void;
  onSave?: (created?: DiarioCreated) => void;
}

export default function ModalDiario({
  isOpen,
  onClose,
  value,
  onChange,
  title = "",
  onTitleChange = () => {},
  onSave,
}: ModalDiarioProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  if (!isOpen) return null;

  const validateTitle = (t: string): string | null => {
    const trimmed = t.trim();
    if (!trimmed) return "Título é obrigatório";
    if (hasEmoji(trimmed)) return "O título não pode conter emoji";
    if (trimmed.length > 30) return "Título muito longo (máximo 30 caracteres)";
    return null;
  };

  const validateTexto = (txt: string): string | null => {
    if (!txt || txt.trim().length === 0) return "Texto é obrigatório";
    return null;
  };

  const onTitleChangeHandler = (t: string) => {
    onTitleChange(t);
    const validationError = validateTitle(t);
    setError(validationError);
  };

  const onTextoChangeHandler = (txt: string) => {
    onChange(txt);
    if (error === "Texto é obrigatório" && txt.trim().length > 0) {
      setError(null);
    }
  };

  const handleSave = async () => {
    const titleError = validateTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }
    const textoError = validateTexto(value);
    if (textoError) {
      setError(textoError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const resp = await createDiario({ texto: value, titulo: title });
      const created = (resp && (resp.entrada ?? resp)) as DiarioCreated;
      if (resp && typeof resp.success !== "undefined" && !resp.success) {
        throw new Error(resp.message || "Erro ao criar entrada");
      }
      onSave?.(created);
      onClose();
    } catch (err: unknown) {
      console.error("Erro ao salvar diário:", err);
      setError(
        "Não foi possível salvar seu diário. Por favor, tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 py-[70px]">
      <div
        className={`p-6 rounded-2xl w-full max-w-[600px] relative shadow-xl transition-all duration-300 mt-[50px] mb-[50px]
        ${theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-900"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 cursor-pointer"
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
            className="w-10 h-10"
          />
        </button>

        <div className="flex flex-col items-center gap-2 text-center mt-10">
          <Image
            src={
              theme === "dark"
                ? "/images/icons/IconeDiario.svg"
                : "/images/icons/IconeDiarioDark.svg"
            }
            alt="Ícone Diário"
            width={42}
            height={42}
            className="mb-2"
          />
          <h2 className="text-xl md:text-2xl font-bold">Escrita no Diário</h2>
          <p className="text-xs md:text-sm text-gray-500">
            Escreva livremente – somente você verá isso.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChangeHandler(e.target.value)}
            placeholder="Adicione um Título"
            maxLength={30}
            className={`w-full rounded-lg p-3 text-sm md:text-base border-blue-600 border-[2.5px] focus:border-blue-600 focus:ring-0
              ${theme === "dark"
                ? "bg-slate-800 text-white placeholder:text-slate-400"
                : "bg-white text-gray-900 placeholder:text-slate-400"
              }`}
          />

          <textarea
            className={`w-full min-h-[180px] max-h-[270px] resize-none rounded-lg p-4 text-sm md:text-base leading-relaxed outline-none
              border-blue-600 border-[2.5px] focus:border-blue-600 focus:ring-0
              ${theme === "dark"
                ? "bg-slate-800 text-white placeholder:text-slate-400"
                : "bg-white text-gray-900 placeholder:text-slate-400"
              }`}
            placeholder="Descreva aqui seu texto do diário..."
            value={value}
            onChange={(e) => onTextoChangeHandler(e.target.value)}
          />
        </div>

        {error && <div className="text-red-400 mt-2">{error}</div>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="min-w-[120px] py-2 px-4 cursor-pointer rounded-2xl text-sm font-medium text-white bg-gray-400 hover:bg-slate-800 transition-colors"
            type="button"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="min-w-[120px] py-2 px-4 cursor-pointer rounded-2xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            type="button"
            disabled={saving || !title || value.trim().length === 0}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
