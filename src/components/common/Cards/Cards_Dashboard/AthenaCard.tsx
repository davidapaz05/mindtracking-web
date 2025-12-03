"use client";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useRef, useCallback } from "react";
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

  // Estados para o carrossel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Seções do conteúdo para o carrossel
  const sections = [
    { id: "header-text", component: "header-text" },
    { id: "button", component: "button" },
  ];

  // Função para verificar se o conteúdo quebra o card
  const checkIfContentOverflows = useCallback(() => {
    if (!containerRef.current || !contentRef.current) {
      setIsCarouselActive(false);
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;

    // Verificar se o conteúdo excede a altura do container
    const contentHeight = content.scrollHeight;
    const containerHeight = container.clientHeight;
    const hasOverflow = contentHeight > containerHeight;

    setIsCarouselActive(hasOverflow);

    // Reset do índice se não precisar mais do carrossel
    if (!hasOverflow) {
      setCurrentIndex(0);
    }
  }, []);

  // Função para avançar o carrossel
  const nextSlide = useCallback(() => {
    if (!isCarouselActive || sections.length === 0) return;

    setCurrentIndex((prev) => {
      const maxIndex = sections.length - 1;
      const newIndex = prev < maxIndex ? prev + 1 : 0;
      return newIndex;
    });
  }, [isCarouselActive, sections.length]);

  // Função para retroceder o carrossel
  const prevSlide = useCallback(() => {
    if (!isCarouselActive || sections.length === 0) return;

    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : sections.length - 1;
      return newIndex;
    });
  }, [isCarouselActive, sections.length]);

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

  // Effect para verificar overflow quando o conteúdo muda
  useEffect(() => {
    if (!loading) {
      // Em telas menores que 1024px (mobile/tablet), desabilitamos o carrossel
      // e mostramos sempre texto + botão empilhados, sem setas.
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsCarouselActive(false);
        setCurrentIndex(0);
        return;
      }

      // Delay para garantir que o DOM foi renderizado
      const timeoutId = setTimeout(() => {
        checkIfContentOverflows();
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, conversasComAthena, error, checkIfContentOverflows]);

  // Effect para detectar mudanças de tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      checkIfContentOverflows();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkIfContentOverflows]);

  // Texto dinâmico baseado na quantidade de conversas
  const textoConversa =
    !loading && !error && (conversasComAthena ?? 0) > 0
      ? `É muito bom conversar com você! Já tivemos ${conversasComAthena} conversas juntos.`
      : "Fale livremente sobre como está se sentindo, Athena está aqui para ouvir e apoiar você.";

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
    <BaseCard className="min-h-[150px] lg:h-full lg:min-h-0 w-full flex flex-col">
      <div className="flex flex-col h-full min-h-0">
        {/* Cabeçalho com setas de navegação */}
        <div className="flex items-center justify-between mb-3">
          <h1 className={`text-[20px] font-semibold ${textColor}`}>
            Converse com a Athena
          </h1>
          
          <div className="flex items-center gap-2">
            {/* Setas de navegação - apenas quando o carrossel está ativo */}
            {isCarouselActive && sections.length > 1 && (
              <>
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
              </>
            )}
            
            {/* Ícone Athena */}
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
        </div>

        {/* Container do carrossel */}
        <div ref={containerRef} className="flex-1 overflow-hidden relative">
          {/* Conteúdo oculto para medir altura total */}
          <div
            ref={contentRef}
            className="absolute opacity-0 pointer-events-none"
            style={{ visibility: "hidden" }}
          >
            <div className="flex flex-col justify-between h-full min-h-0">
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
          </div>

          {/* Conteúdo visível */}
          <div className="flex flex-col h-full min-h-0 transition-opacity duration-300">
            {isCarouselActive ? (
              // Mostrar apenas a seção atual quando carrossel está ativo
              <>
                {currentIndex === 0 && (
                  <div className="flex-1 flex items-center">
                    {/* Texto Dinâmico */}
                    <p className={`text-[15px] font-semibold font-inter ${textColor}`}>
                      {loading
                        ? "Carregando..."
                        : error
                          ? "Fale livremente sobre como está se sentindo, Athena está aqui para ouvir e apoiar você."
                          : textoConversa}
                    </p>
                  </div>
                )}
                {currentIndex === 1 && (
                  // Slide apenas com o botão (sem texto em cima)
                  <div className="flex-1 flex items-center">
                    <a href="/athena" className="w-full">
                      <button
                        className={`
                          w-full h-[50px]
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
                )}
              </>
            ) : (
              // Mostrar todo o conteúdo quando carrossel não está ativo
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center">
                  {/* Texto Dinâmico centralizado */}
                  <p className={`text-[15px] font-semibold font-inter mb-5 ${textColor}`}>
                    {loading
                      ? "Carregando..."
                      : error
                        ? "Fale livremente sobre como está se sentindo, Athena está aqui para ouvir e apoiar você."
                        : textoConversa}
                  </p>
                </div>

                {/* Botão fixo embaixo */}
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
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
