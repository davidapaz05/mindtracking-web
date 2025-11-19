"use client";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { getQtdConversas } from "@/lib/api/dica";
import BaseCard from "./BaseCard";

// conversasComAthena será buscado da API

export default function ConverseAthenaCard() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-slate-800";
  const [conversasComAthena, setConversasComAthena] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchQtd = async () => {
      try {
        setLoading(true);
        const resp = await getQtdConversas();
        // resp expected shape: { success: true, total: number }
        if (mounted)
          setConversasComAthena(
            typeof resp.total === "number" ? resp.total : 0,
          );
      } catch (err: unknown) {
        console.error("Erro ao buscar qtd conversas:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        if (mounted) setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchQtd();
    return () => {
      mounted = false;
    };
  }, []);

  // Texto dinâmico baseado na quantidade de conversas
  const textoConversa =
    !loading && !error && (conversasComAthena ?? 0) > 0
      ? `É muito bom conversar com você! Já tivemos ${conversasComAthena} conversas juntos.`
      : "Fale livremente sobre como está se sentindo, Athena está aqui para ouvir e apoiar você.";

  return (
    <BaseCard className="min-h-[150px] w-full">
      <div className="flex flex-col justify-between h-full">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-3">
          <h1 className={`text-[20px] font-semibold ${textColor}`}>
            Converse com a Athena
          </h1>
          <Image
            src={
              theme === "dark"
                ? "/images/icons/IconeAthenaChat.svg"
                : "/images/icons/IconeAthenaChat-black.svg"
            }
            alt="Ícone Athena"
            width={38}
            height={38}
          />
        </div>

        {/* Texto Dinâmico */}
        <p className={`text-[15px] font-semibold font-inter mb-6 ${textColor}`}>
          {loading
            ? "Carregando..."
            : error
              ? "Fale livremente sobre como está se sentindo, Athena está aqui para ouvir e apoiar você."
              : textoConversa}
        </p>

        {/* Botão */}
        <a href="/athena">
          <button
            className={`
              mb-4 w-full h-[50px]
              ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }
              font-bold text-[16px]  rounded-3xl border-4 border-transparent transition-all duration-200 cursor-pointer
              disabled:opacity-60 disabled:cursor-not-allowed
              active:scale-[0.98] active:brightness-95 active:border-blue-700
              active:drop-shadow-[0_0_15px_#0C4A6E]
            `}
          >
            Comece Agora
          </button>
        </a>
      </div>
    </BaseCard>
  );
}
