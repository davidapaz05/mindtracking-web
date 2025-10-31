"use client";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface DadosGrafico {
  name: string;
  valor: number;
  data_completa: string;
  questionario_id: string;
}

interface EstadisticasHistorico {
  dados_grafico: DadosGrafico[];
  media: number;
  melhor_dia: DadosGrafico | null;
  total_questionarios: number;
}

interface HistoricoItem {
  data: string;
  nota_convertida: string;
  questionario_id: string;
}

interface HistoricoResponse {
  success: boolean;
  message?: string;
  historico?: HistoricoItem[];
}

type DotPositionProps = { cx?: number; cy?: number; size?: number };

function CustomDot(props: DotPositionProps) {
  const { cx, cy, size: sizeProp } = props;
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  const size = typeof sizeProp === "number" ? sizeProp : 18;
  const half = size / 2;
  return (
    <image
      href="/images/icons/DotGrafico.svg"
      x={cx - half}
      y={cy - half}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

interface GraficoCardProps {
  historicoData: HistoricoResponse | null;
}

export default function GraficoCard({ historicoData }: GraficoCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mainText = isDark ? "text-white" : "text-slate-800";
  const secondaryText = isDark ? "text-gray-300" : "text-slate-800";
  const axisColor = isDark ? "#e3eafc" : "#64748b";

  const [dados, setDados] = useState<EstadisticasHistorico>({
    dados_grafico: [],
    media: 0,
    melhor_dia: null,
    total_questionarios: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Resposta da API historico dentro do GraficoCard:", historicoData);

  const processarHistoricoUltimos7 = (
    historicoData: HistoricoResponse
  ): EstadisticasHistorico => {
    const historicoList = historicoData?.historico || [];

    if (!historicoList || historicoList.length === 0) {
      return {
        dados_grafico: [],
        media: 0,
        melhor_dia: null,
        total_questionarios: 0,
      };
    }

    const historicoOrdenado = [...historicoList].sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return dataB - dataA;
    });

    const ultimos7 = historicoOrdenado.slice(0, 7);

    const dadosGrafico: DadosGrafico[] = [];
    const notas: number[] = [];

    for (const item of ultimos7) {
      const dataIso = item.data;
      const nota = parseFloat(item.nota_convertida);

      // Ajuste: cria uma data local usando os componentes UTC para evitar deslocamento do fuso
      const dataUtc = new Date(dataIso);
      const dataLocalSemHora = new Date(
        dataUtc.getUTCFullYear(),
        dataUtc.getUTCMonth(),
        dataUtc.getUTCDate()
      );

      const dataFormatada = `${String(dataLocalSemHora.getDate()).padStart(2, "0")}/${String(
        dataLocalSemHora.getMonth() + 1
      ).padStart(2, "0")}`;

      dadosGrafico.push({
        name: dataFormatada,
        valor: nota,
        data_completa: dataIso,
        questionario_id: item.questionario_id,
      });

      notas.push(nota);
    }

    dadosGrafico.sort(
      (a, b) =>
        new Date(a.data_completa).getTime() - new Date(b.data_completa).getTime()
    );

    const media =
      notas.length > 0 ? notas.reduce((acc, cur) => acc + cur, 0) / notas.length : 0;

    let melhorDia: DadosGrafico | null = null;

    if (dadosGrafico.length > 0) {
      melhorDia = dadosGrafico.reduce((melhor, atual) =>
        atual.valor > melhor.valor ? atual : melhor
      );
    }

    return {
      dados_grafico: dadosGrafico,
      media: Math.round(media * 10) / 10,
      melhor_dia: melhorDia,
      total_questionarios: dadosGrafico.length,
    };
  };

  useEffect(() => {
    if (!historicoData) {
      setLoading(true);
      return;
    }
    try {
      setLoading(false);
      setError(null);

      if (!historicoData.success) {
        setError(historicoData.message || "Erro ao carregar histórico");
        setDados({
          dados_grafico: [],
          media: 0,
          melhor_dia: null,
          total_questionarios: 0,
        });
        return;
      }

      const dadosProcessados = processarHistoricoUltimos7(historicoData);
      setDados(dadosProcessados);
    } catch (error: unknown) {
      console.error("Erro ao processar histórico:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar dados do gráfico";
      setError(errorMessage);
    }
  }, [historicoData]);

  const dadosPadrao = [{ name: "Sem dados", valor: 0 }];

  const dadosGrafico = dados.dados_grafico.length > 0 ? dados.dados_grafico : dadosPadrao;

  if (loading) {
    return (
      <BaseCard>
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className={`text-lg ${mainText}`}>Carregando...</div>
        </div>
      </BaseCard>
    );
  }

  if (error) {
    return (
      <BaseCard>
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className={`text-lg ${mainText}`}>Erro: {error}</div>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard>
      <div className="mb-4 flex-shrink-0">
        <div className={`text-[20px] font-semibold ${mainText}`}>Seu Bem-Estar Essa Semana</div>
        <div className={`text-lg font-semibold ${mainText}`}>
          Média: {dados.media.toFixed(1)}
          <span className={`${secondaryText} mx-2`}>|</span>
          {dados.melhor_dia ? (
            <>
              Melhor: {dados.melhor_dia.valor.toFixed(1)} (
              {obterDiaSemana(dados.melhor_dia.data_completa)})
            </>
          ) : (
            "Sem dados suficientes"
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dadosGrafico} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid
              stroke={isDark ? "rgba(59,130,246,0.15)" : "rgba(120,120,154,0.18)"}
              vertical
            />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              interval={0}
              tick={{ fontSize: 12, fontWeight: "regular", fill: axisColor }}
              scale="point"
              padding={{ left: 0, right: 0 }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              stroke={axisColor}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              interval={0}
              tick={{ fontSize: 12, fontWeight: "regular", fill: axisColor }}
              width={22}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e344e",
                borderRadius: "10px",
                border: "none",
                color: "#fff",
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value: number) => [`${value.toFixed(1)}`, "Nota"]}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#0890B1"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={<CustomDot size={22} />}
            />
            <Legend
              verticalAlign="bottom"
              content={() => (
                <div className="flex justify-center mt-0 text-blue-300 text-sm">
                  <div className={`flex items-center ${isDark ? "text-slate-50" : "text-gray-500"}`}>
                    <Image
                      src="/images/icons/DotGrafico.svg"
                      alt="Ponto"
                      width={15}
                      height={15}
                      className="mr-2"
                    />
                    Esta semana
                  </div>
                </div>
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </BaseCard>
  );

  function obterDiaSemana(dataCompleta: string): string {
    const data = new Date(dataCompleta);
    const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
    return diasSemana[data.getDay()];
  }
}