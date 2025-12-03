"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import { getDica } from "@/lib/api/dica";

interface DicaResponse {
  success: boolean;
  dica: string;
  recomendacao?: string;
}

interface RecomendacoesCardProps {
  recomendacao?: string;
}

export default function RecomendacoesCard({ recomendacao }: RecomendacoesCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mainText = isDark ? "text-white" : "text-slate-800";
  const secondaryText = isDark ? "text-white" : "text-slate-800";

  const [dica, setDica] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a recommendation prop is provided, use it and skip fetching from API
    if (recomendacao) {
      setDica(recomendacao);
      setLoading(false);
      return;
    }

    async function fetchDica() {
      setLoading(true);
      try {
        const response: DicaResponse = await getDica();
        if (response.success) {
          // prefer response.dica but allow response.recomendacao if present
          setDica(response.dica ?? response.recomendacao ?? null);
        } else {
          setDica(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dica:", error);
        setDica(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDica();
  }, [recomendacao]);

  return (
    <BaseCard>
      <div className="flex justify-between items-center">
        <h1 className={`text-[20px] font-semibold ${mainText}`}>
          Recomendação
        </h1>
        <Image
          src={
            isDark
              ? "/images/icons/IconeLampada.svg"
              : "/images/icons/IconeLampada-black.svg"
          }
          alt="Ícone lâmpada"
          width={54}
          height={51}
          className="w-9 h-auto"
        />
      </div>
      <p className={`mt-2 mb-3 text-[15px] font-medium ${secondaryText}`}>
        {recomendacao
          ? recomendacao
          : loading
          ? "Carregando dica..."
          : dica ?? "Bem-vindo à MindTracking! Que tal começar conhecendo mais sobre como você está sentindo hoje?"}
      </p>
    </BaseCard>
  );
}