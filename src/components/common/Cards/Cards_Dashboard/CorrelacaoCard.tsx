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
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Função para verificar se o conteúdo quebra o card e calcular quantos itens cabem
  const checkIfContentOverflows = useCallback(() => {
    // Em telas menores que 1024px (mobile/tablet), desabilitamos o carrossel
    // e deixamos todas as correlações empilhadas com espaçamento normal.
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsCarouselActive(false);
      setItemsPerView(1);
      return;
    }

    if (!containerRef.current || !contentRef.current || correlacoes.length === 0) {
      setIsCarouselActive(false);
      setItemsPerView(1);
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;

    // Verificar se o conteúdo excede a altura do container
    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight;
    const hasOverflow = contentHeight > containerHeight;

    // Calcular quantos itens cabem no espaço disponível
    let itemsThatFit = 1;
    
    // Tentar usar a referência do item renderizado primeiro
    if (itemRef.current && itemRef.current.offsetHeight > 0) {
      const itemHeight = itemRef.current.offsetHeight;
      const availableHeight = containerHeight;
      const gapBetweenItems = 16; // space-y-4 = 16px
      
      // Calcular quantos itens cabem considerando o espaço entre eles
      // Altura total para 2 itens: altura do item * 2 + espaço entre eles
      const twoItemsHeight = itemHeight * 2 + gapBetweenItems;
      
      if (twoItemsHeight <= availableHeight && correlacoes.length >= 2) {
        itemsThatFit = 2;
      } else {
        itemsThatFit = 1;
      }
    } else {
      // Fallback: usar altura estimada baseada no conteúdo
      // Altura estimada de um item (texto_pergunta + texto_alternativa + espaçamentos)
      const estimatedItemHeight = 80; // altura conservadora
      const availableHeight = containerHeight;
      const gapBetweenItems = 16;
      const twoItemsHeight = estimatedItemHeight * 2 + gapBetweenItems;
      
      if (twoItemsHeight <= availableHeight && correlacoes.length >= 2) {
        itemsThatFit = 2;
      } else {
        itemsThatFit = 1;
      }
    }

    setItemsPerView(itemsThatFit);
    setIsCarouselActive(hasOverflow);

    // Reset do índice se não precisar mais do carrossel
    if (!hasOverflow) {
      setCurrentIndex(0);
    }
  }, [correlacoes.length]);

  // Função para avançar o carrossel
  const nextSlide = useCallback(() => {
    if (!isCarouselActive || correlacoes.length === 0) return;

    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, correlacoes.length - itemsPerView);
      const newIndex = prev + itemsPerView;
      if (newIndex > maxIndex) {
        return 0; // Voltar ao início
      }
      return newIndex;
    });
  }, [isCarouselActive, correlacoes.length, itemsPerView]);

  // Função para retroceder o carrossel
  const prevSlide = useCallback(() => {
    if (!isCarouselActive || correlacoes.length === 0) return;

    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerView;
      if (newIndex < 0) {
        // Ir para o último grupo possível
        const maxIndex = Math.max(0, correlacoes.length - itemsPerView);
        return maxIndex;
      }
      return newIndex;
    });
  }, [isCarouselActive, correlacoes.length, itemsPerView]);

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

  // Effect para verificar overflow quando as correlações mudam
  useEffect(() => {
    if (correlacoes.length > 0) {
      // Delay maior para garantir que o DOM foi renderizado e as medidas estão corretas
      const timeoutId = setTimeout(() => {
        checkIfContentOverflows();
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [correlacoes, checkIfContentOverflows]);

  // Effect para detectar mudanças de tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      checkIfContentOverflows();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkIfContentOverflows]);

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
        <div className="flex flex-col h-full items-center justify-center text-center">
          <h1 className={`text-[20px] font-semibold mb-4 ${textColor}`}>
            Respostas frequentes:
          </h1>
          <div className={`text-sm ${textColor}`}>
            Nenhuma correlação encontrada ainda.
            <br />
            Responda mais questionários para ver padrões!
          </div>
        </div>
      </BaseCard>
    );
  }

  // Componente de seta
  const ArrowButton = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    disabled: boolean;
  }) => {
    const arrowColor = theme === "dark" ? "#F7F9FB" : "#1e293b";
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          flex items-center justify-center
          w-8 h-8 rounded-full
          transition-all duration-200
          ${disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-opacity-20 hover:bg-slate-400 cursor-pointer"}
          ${theme === "dark" ? "hover:bg-white" : "hover:bg-slate-800"}
        `}
        aria-label={direction === "left" ? "Anterior" : "Próximo"}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={direction === "left" ? "rotate-90" : "-rotate-90"}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke={arrowColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  return (
    <BaseCard className="min-h-[520px] lg:h-full lg:min-h-0 w-full flex flex-col">
      <div className="flex flex-col h-full min-h-0">
        {/* Título com setas de navegação */}
        <div className="flex items-center justify-between mb-3">
          <h1 className={`text-[20px] font-semibold ${textColor}`}>
            Respostas frequentes:
          </h1>
          
          {/* Setas de navegação - apenas quando o carrossel está ativo */}
          {isCarouselActive && correlacoes.length > 1 && (
            <div className="flex items-center gap-2">
              <ArrowButton
                direction="left"
                onClick={prevSlide}
                disabled={false}
              />
              <ArrowButton
                direction="right"
                onClick={nextSlide}
                disabled={false}
              />
            </div>
          )}
        </div>

        {/* Container do carrossel */}
        <div ref={containerRef} className="flex-1 overflow-hidden relative flex">
          {/* Conteúdo oculto para medir altura total (todas as correlações) */}
          <div
            ref={contentRef}
            className={`space-y-4 text-[16px] font-semibold font-inter mb-3 ${textColor} absolute opacity-0 pointer-events-none`}
            style={{ visibility: "hidden" }}
          >
            {correlacoes.map((correlacao, index) => (
              <div key={`measure-${index}`} className="flex flex-col gap-2 mb-2">
                {/* Seção 1: Resposta da Athena (texto_pergunta) */}
                {correlacao.texto_pergunta && (
                  <div
                    className={`text-[16px] font-semibold ${textColor} mb-2`}
                  >
                    {correlacao.texto_pergunta}
                  </div>
                )}

                {/* Seção 2: Outras informações (ícone + texto_alternativa) */}
                <div className="flex items-center gap-3 text-[15px] font-light">
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

          {/* Conteúdo visível (apenas as correlações visíveis quando carrossel ativo) */}
          <div className="flex-1 flex items-center">
            <div
              className={`space-y-4 text-[16px] font-semibold font-inter mb-3 ${textColor} transition-opacity duration-300`}
            >
              {isCarouselActive
                ? // Mostrar apenas as correlações visíveis quando carrossel está ativo
                  correlacoes
                    .slice(currentIndex, currentIndex + itemsPerView)
                    .map((correlacao, index) => (
                      <div
                        key={currentIndex + index}
                        ref={index === 0 ? itemRef : null}
                        className="flex flex-col gap-2"
                      >
                        {/* Seção 1: Resposta da Athena (texto_pergunta) */}
                        {correlacao.texto_pergunta && (
                          <div
                            className={`text-[14px] font-semibold ${textColor} mb-2`}
                          >
                            {correlacao.texto_pergunta}
                          </div>
                        )}

                        {/* Seção 2: Outras informações (ícone + texto_alternativa) */}
                        <div className="flex items-center gap-3 text-[15px] font-light">
                          <Image
                            src={correlacao.icone}
                            alt={`Ícone ${correlacao.pontuacao ?? correlacao.texto_alternativa}`}
                            width={20}
                            height={20}
                          />
                          <span>{correlacao.texto_alternativa}</span>
                        </div>
                      </div>
                    ))
                : // Mostrar todas as correlações quando carrossel não está ativo
                  correlacoes.map((correlacao, index) => (
                    <div
                      key={index}
                      ref={index === 0 ? itemRef : null}
                      className="flex flex-col gap-2 mb-2"
                    >
                      {/* Seção 1: Resposta da Athena (texto_pergunta) */}
                      {correlacao.texto_pergunta && (
                        <div
                          className={`text-[20px] font-semibold ${textColor} mb-2`}
                        >
                          {correlacao.texto_pergunta}
                        </div>
                      )}

                      {/* Seção 2: Outras informações (ícone + texto_alternativa) */}
                      <div className="flex items-center gap-3 text-[18px] font-light">
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

          {/* Indicador de posição - apenas quando o carrossel está ativo */}
          {/* {isCarouselActive && correlacoes.length > itemsPerView && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {Array.from({
                length: Math.ceil(correlacoes.length / itemsPerView),
              }).map((_, groupIndex) => {
                const startIndex = groupIndex * itemsPerView;
                const isActive =
                  currentIndex >= startIndex &&
                  currentIndex < startIndex + itemsPerView;
                return (
                  <button
                    key={groupIndex}
                    onClick={() => setCurrentIndex(startIndex)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-200
                      ${
                        isActive
                          ? theme === "dark"
                            ? "bg-white"
                            : "bg-slate-800"
                          : theme === "dark"
                            ? "bg-white/30"
                            : "bg-slate-800/30"
                      }
                    `}
                    aria-label={`Ir para grupo ${groupIndex + 1}`}
                  />
                );
              })}
            </div>
          )} */}
        </div>
      </div>
    </BaseCard>
  );
}
