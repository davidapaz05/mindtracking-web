"use client";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { corelacoes } from "@/lib/api/questionario";
import { setAuthToken } from "@/lib/api/axios";

interface Correlacao {
  total_ocorrencias: number;
  // agora usamos pontuacao (1-4) quando disponível
  pontuacao?: number | string;
  texto_alternativa: string;
  texto_pergunta?: string;
  icone: string;
}

interface CorrelacaoAPI {
  total_ocorrencias: string | number;
  pontuacao?: number | string;
  classificacao?: number | string;
  texto_alternativa: string;
  texto_pergunta?: string;
}

export default function CorrelacoesCard() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-slate-800";

  const [correlacoes, setCorrelacoes] = useState<Correlacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o carrossel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para calcular quantos itens cabem no espaço disponível
  const calculateVisibleItems = useCallback(() => {
    if (!containerRef.current || correlacoes.length === 0) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const itemHeight = 100; // Altura mais conservadora para garantir que caiba completamente
    const maxItems = Math.floor(containerHeight / itemHeight);

    // Calcular quantas correlações cabem no espaço disponível
    // Ser mais conservador: se não cabe completamente, não renderizar
    const newVisibleItems = Math.max(1, Math.min(maxItems, correlacoes.length));
    setVisibleItems(newVisibleItems);

    // Ativar carrossel apenas se houver mais correlações do que o espaço disponível
    const shouldActivateCarousel = correlacoes.length > newVisibleItems;
    setIsCarouselActive(shouldActivateCarousel);

    // Reset do índice se não precisar mais do carrossel
    if (!shouldActivateCarousel) {
      setCurrentIndex(0);
    }

    console.log("Calculando itens visíveis:", {
      containerHeight,
      itemHeight,
      maxItems,
      newVisibleItems,
      shouldActivateCarousel,
    });
  }, [correlacoes.length]);

  // Função para avançar o carrossel
  const nextSlide = useCallback(() => {
    if (!isCarouselActive || correlacoes.length === 0) return;

    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, correlacoes.length - visibleItems);
      let newIndex = prev + 1; // Avançar de um em um
      if (newIndex > maxIndex) {
        newIndex = 0; // Voltar ao início se exceder
      }

      console.log("Navegando carrossel:", {
        prev,
        newIndex,
        maxIndex,
        visibleItems,
        correlacoesLength: correlacoes.length,
      });

      return newIndex;
    });
  }, [isCarouselActive, visibleItems, correlacoes.length]);

  // Função para iniciar o carrossel automático
  const startCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isCarouselActive) {
      intervalRef.current = setInterval(nextSlide, 3000); // 3 segundos
    }
  }, [isCarouselActive, nextSlide]);

  // Função para parar o carrossel
  const stopCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Função para processar as correlações da API
  const processarCorrelacoes = (data: {
    correlacoes?: CorrelacaoAPI[];
  }): Correlacao[] => {
    const correlacoesList = data?.correlacoes || [];

    // Ordenar por total_ocorrencias em ordem decrescente
    const correlacoesOrdenadas = [...correlacoesList].sort(
      (a: CorrelacaoAPI, b: CorrelacaoAPI) => {
        return (
          parseInt(String(b.total_ocorrencias)) -
          parseInt(String(a.total_ocorrencias))
        );
      },
    );

    // Mapear pontuação para ícone: 1 or 2 => thumbs-down, 3 or 4 => thumbs-up
    const obterIcone = (pontuacao?: number | string): string => {
      const p =
        typeof pontuacao === "number"
          ? pontuacao
          : parseInt(String(pontuacao || ""), 10);

      if (p === 1 || p === 2) {
        return "/images/icons/thumbs-down-red.svg";
      } else if (p === 3 || p === 4) {
        return "/images/icons/thumbs-up-green.svg";
      } else {
        return "/images/icons/thumbs-up-green.svg"; // Default
      }
    };

    // Processar dados
    return correlacoesOrdenadas.map((correlacao: CorrelacaoAPI) => {
      // tente extrair pontuacao numérica; alguns retornos podem usar 'classificacao' em vez de 'pontuacao'
      const rawPont = correlacao.pontuacao ?? correlacao.classificacao ?? "";
      const pontNum =
        rawPont !== ""
          ? isNaN(Number(rawPont))
            ? undefined
            : Number(rawPont)
          : undefined;
      return {
        pontuacao: pontNum ?? rawPont,
        texto_alternativa: correlacao.texto_alternativa || "",
        texto_pergunta: correlacao.texto_pergunta || "",
        icone: obterIcone(pontNum ?? rawPont),
      } as Correlacao;
    });
  };

  useEffect(() => {
    const carregarCorrelacoes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Configurar token JWT
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("mt_token");
          if (token) {
            setAuthToken(token);
          }
        }

        // Buscar ID do usuário
        const userStr = localStorage.getItem("mt_user");
        if (!userStr) {
          throw new Error("Usuário não encontrado no localStorage");
        }

        const user = JSON.parse(userStr);
        const userId = user.id || user.user_id || user.usuario_id;

        if (!userId) {
          throw new Error("ID do usuário não encontrado");
        }

        // Buscar correlações da API
        const correlacaoData = await corelacoes(userId);

        if (!correlacaoData.success) {
          throw new Error(
            correlacaoData.message || "Erro ao carregar correlações",
          );
        }

        // Processar dados
        const correlacaoProcessadas = processarCorrelacoes(correlacaoData);
        setCorrelacoes(correlacaoProcessadas);
      } catch (error: unknown) {
        console.error("Erro ao carregar correlações:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar correlações",
        );
      } finally {
        setLoading(false);
      }
    };

    carregarCorrelacoes();
  }, []);

  // Effect para calcular itens visíveis quando as correlações mudam
  useEffect(() => {
    if (correlacoes.length > 0) {
      // Pequeno delay para garantir que o DOM foi renderizado
      setTimeout(calculateVisibleItems, 100);
    }
  }, [correlacoes, calculateVisibleItems]);

  // Effect para iniciar/parar o carrossel
  useEffect(() => {
    if (isCarouselActive) {
      startCarousel();
    } else {
      stopCarousel();
    }

    return () => stopCarousel();
  }, [isCarouselActive, startCarousel, stopCarousel]);

  // Effect para detectar mudanças de tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      calculateVisibleItems();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateVisibleItems]);

  // Cleanup do interval ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Função para obter as correlações visíveis no carrossel
  const visibleCorrelacoes = useMemo(() => {
    if (!isCarouselActive) {
      return correlacoes;
    }

    // Debug: log para entender o que está acontecendo
    console.log("Carrossel Debug:", {
      currentIndex,
      visibleItems,
      correlacoesLength: correlacoes.length,
      isCarouselActive,
    });

    // Garantir que não excedemos o limite de correlações
    const endIndex = Math.min(currentIndex + visibleItems, correlacoes.length);
    const result = correlacoes.slice(currentIndex, endIndex);

    console.log(
      "Correlações visíveis:",
      result.map((c) => c.texto_alternativa),
    );

    return result;
  }, [isCarouselActive, currentIndex, visibleItems, correlacoes]);

  if (loading) {
    return (
      <BaseCard>
        <div className="flex items-center justify-center h-full min-h-[150px]">
          <div className={`text-lg ${textColor}`}>Carregando...</div>
        </div>
      </BaseCard>
    );
  }

  if (error) {
    return (
      <BaseCard>
        <div className="flex items-center justify-center h-full min-h-[150px]">
          <div className={`text-sm ${textColor}`}>Erro: {error}</div>
        </div>
      </BaseCard>
    );
  }

  if (correlacoes.length === 0) {
    return (
      <BaseCard>
        <div className="flex flex-col">
          <h1 className={`text-[20px] font-semibold mb-4 ${textColor}`}>
            Respostas frequentes:
          </h1>
          <div className={`text-sm ${textColor} text-center py-8`}>
            Nenhuma correlação encontrada ainda.
            <br />
            Responda mais questionários para ver padrões!
          </div>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard className="min-h-[520px] lg:h-full lg:min-h-0 w-full flex flex-col">
      <div className="flex flex-col h-full min-h-0">
        {/* Título */}
        <h1 className={`text-[20px] font-semibold mb-3 ${textColor}`}>
          Respostas frequentes:
        </h1>

        {/* Container do carrossel */}
        <div ref={containerRef} className="flex-1">
          {/* Lista de correlações */}
          <div
            className={`space-y-4 text-[16px] font-semibold font-inter mb-5 ${textColor} transition-all duration-500 ease-in-out`}
          >
            {visibleCorrelacoes.map((correlacao, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className="flex flex-col gap-2"
              >
                {correlacao.texto_pergunta && (
                  <div className={`text-[18px] font-semibold ${textColor}`}>
                    {correlacao.texto_pergunta}
                  </div>
                )}
                <div className="flex items-center gap-3 text-[16px] font-light">
                  <Image
                    src={correlacao.icone}
                    alt={`Ícone ${correlacao.pontuacao ?? correlacao.texto_alternativa}`}
                    width={20}
                    height={20}
                  />
                  <span>{correlacao.texto_alternativa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
