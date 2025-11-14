import React, { useState, useEffect } from "react";
import { getDiarios, getDiarioById } from "@/lib/api/diario";
import ModalDiario from "@/components/common/Modals/Diario/ModalEscreverDiario";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "../../../contexts/ThemeContext";
import Sidebar from "@/components/layout/Sidebar";
import ModalAnalise from "@/components/common/Modals/Diario/ModalAnalise";

interface Analysis {
  message: string;
  emotion: string;
  intensity: string;
  athena: string;
}

interface Card {
  id: string | number;
  title: string;
  date: string;
  description: string;
  analysis?: Analysis;
}

interface DiarioEntry {
  id?: string | number;
  _id?: string | number;
  titulo?: string;
  title?: string;
  texto?: string;
  text?: string;
  descricao?: string;
  mensagem?: string;
  data_hora?: string;
  createdAt?: string;
  date?: string;
  emocao_predominante?: string;
  emocao?: string;
  intensidade_emocional?: string;
  intensidade?: string;
  comentario_athena?: string;
  comentario?: string;
  athena?: string;
}

interface DiarioResponse {
  entradas?: DiarioEntry[];
  data?: DiarioEntry[];
}

export default function DiarioClient() {
  const { theme } = useTheme();
  const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}`;
  };

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const truncateText = (text: string) => {
    let maxLength: number;
    if (screenSize.width < 640) {
      maxLength = 120;
    } else if (screenSize.width < 768) {
      maxLength = 150;
    } else if (screenSize.width < 1024) {
      maxLength = 200;
    } else {
      maxLength = 300;
    }
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [tituloModal, setTituloModal] = useState("");
  const [textoModal, setTextoModal] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const resp = await getDiarios();
        let entradas: DiarioEntry[] = [];
        if (Array.isArray(resp)) entradas = resp as DiarioEntry[];
        else if ((resp as DiarioResponse)?.entradas)
          entradas = (resp as DiarioResponse).entradas || [];
        else if ((resp as DiarioResponse)?.data)
          entradas = (resp as DiarioResponse).data || [];

        const mapped = entradas.map((e: DiarioEntry) => {
          const titulo = e.titulo ?? e.title ?? "Diário";
          const texto = e.texto ?? e.text ?? e.descricao ?? e.mensagem ?? "";
          const data_hora = e.data_hora ?? e.createdAt ?? e.date ?? null;

          const emocao = (e.emocao_predominante ?? e.emocao) || null;
          const intensidade = (e.intensidade_emocional ?? e.intensidade) || null;
          const comentarioAthena = (e.comentario_athena ?? e.comentario ?? e.athena) || null;
          const hasAnalysis = Boolean(comentarioAthena || emocao || intensidade);

          const analysis = hasAnalysis
            ? {
                message: texto,
                emotion: emocao ?? "",
                intensity: intensidade ?? "",
                athena: comentarioAthena ?? "",
              }
            : null;

          return {
            id: e.id ?? e._id ?? Math.random(),
            title: titulo,
            date: data_hora ? formatDate(data_hora) : "",
            description: texto,
            analysis,
          } as Card;
        });
        setCards(mapped as Card[]);
        setFetchError(null);
      } catch (error) {
        setFetchError(String(error ?? "Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const open = searchParams?.get?.("openModal");
    if (open === "1") {
      setOpenModal(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("openModal");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen min-h-0 flex flex-col">
      <Sidebar />
      <div className="flex flex-col min-h-0 h-full p-6 md:p-10 lg:ml-37.5 md:mt-20 mt-25 lg:mt-0 overflow-hidden">
        <h1
          className={`text-2xl font-bold mb-10 font-inter ${theme === "dark" ? "text-white" : "text-gray-900"
            } transition-all duration-300 ease-in-out`}
        >
          Diário Emocional
        </h1>
        <div
          className={`flex-1 min-h-0 flex flex-col rounded-xl p-6 ${theme === "dark"
            ? "border-2 border-blue-600 bg-slate-900"
            : "bg-white border-2 border-black"
            } transition-all duration-300 ease-in-out`}
        >
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
            {loading ? (
              <p className="text-center font-inter">Carregando...</p>
            ) : cards.length === 0 ? (
              <p className="text-center font-inter">
                Nenhum registro encontrado.
              </p>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between shrink-0">
                  <div className="text-sm text-gray-400 pl-4">
                    Registros encontrados:{" "}
                    <span className={`font-medium ${theme === "dark" ? "text-white/90" : "text-gray-800"}`}>
                      {cards.length}
                    </span>
                  </div>
                  {fetchError && (
                    <div className="text-sm text-red-400">
                      Erro: {fetchError}
                    </div>
                  )}
                </div>
                <div className="grid gap-0 w-full max-w-full sm:grid-cols-1 md:grid-cols-2 auto-rows-fr">
                  {cards.map((card) => (
                    <div key={card.id} className="p-4 max-w-full h-full">
                      <div
                        className={`w-full h-full rounded-lg p-4 border-2 flex flex-col justify-between transition-all duration-300 ease-in-out ${theme === "dark"
                          ? "bg-slate-800 text-gray-200 border-blue-600"
                          : "bg-slate-50 text-gray-800 border-none shadow-[0_8px_15px_0_rgba(0,0,0,0.4)]"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h2 className="font-inter font-bold text-base md:text-lg">
                              {card.title}
                            </h2>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-400 font-inter">
                              {card.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-4 font-inter !leading-relaxed text-left whitespace-pre-line overflow-hidden text-ellipsis">
                          {truncateText(card.description)}
                        </p>
                        {card.analysis && (
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                if (card.analysis) {
                                  setSelectedAnalysis({
                                    message: card.analysis.message ?? "",
                                    emotion: card.analysis.emotion ?? "",
                                    intensity: card.analysis.intensity ?? "",
                                    athena: card.analysis.athena ?? "",
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                              aria-label={`Ver análise de ${card.title}`}
                            >
                              <Image
                                src="/images/icons/lupa.svg"
                                alt="Lupa"
                                width={14}
                                height={14}
                              />
                              <span>Ver Análise</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ModalAnalise
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        analysis={selectedAnalysis}
      />

      <ModalDiario
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        value={textoModal}
        onChange={(v: string) => setTextoModal(v)}
        title={tituloModal}
        onTitleChange={(t: string) => setTituloModal(t)}
        onSave={(created: DiarioEntry | undefined) => {
          if (created) {
            const titulo = created.titulo ?? created.title ?? "Diário";
            const texto =
              created.texto ?? created.text ?? created.descricao ?? "";
            const data_hora =
              created.data_hora ??
              created.createdAt ??
              new Date().toISOString();
            const hasAnalysis = Boolean(
              created?.comentario_athena ||
              created?.comentario ||
              created?.athena ||
              created?.emocao_predominante ||
              created?.emocao ||
              created?.intensidade_emocional ||
              created?.intensidade,
            );

            const newCard = {
              id: created.id ?? created._id ?? Math.random(),
              title: titulo,
              date: data_hora ? formatDate(data_hora) : "",
              description: texto,
              analysis: hasAnalysis
                ? {
                  message: texto,
                  emotion:
                    created.emocao_predominante ?? created.emocao ?? "",
                  intensity:
                    created.intensidade_emocional ??
                    created.intensidade ??
                    "",
                  athena:
                    created.comentario_athena ??
                    created.comentario ??
                    created.athena ??
                    "",
                }
                : undefined,
            };
            setCards((prev) => [newCard, ...prev]);

            const hasAnalysisNow = Boolean(newCard.analysis);
            if (!hasAnalysisNow && (created.id || created._id)) {
              const id = created.id ?? created._id;
              (async function poll() {
                for (let i = 0; i < 6; i++) {
                  try {
                    const fresh = await getDiarioById(String(id));
                    const entry = fresh?.entrada ?? fresh;
                    if (
                      entry &&
                      (entry.comentario_athena ||
                        entry.emocao_predominante ||
                        entry.intensidade_emocional)
                    ) {
                      setCards((prev) =>
                        prev.map((c) =>
                          c.id === (entry.id ?? entry._id)
                            ? {
                              ...c,
                              date: formatDate(
                                entry.data_hora ??
                                entry.createdAt ??
                                new Date().toISOString(),
                              ),
                              description:
                                entry.texto ?? entry.text ?? c.description,
                              analysis: {
                                message:
                                  entry.texto ??
                                  entry.text ??
                                  c.description,
                                emotion:
                                  entry.emocao_predominante ??
                                  entry.emocao ??
                                  "",
                                intensity:
                                  entry.intensidade_emocional ??
                                  entry.intensidade ??
                                  "",
                                athena:
                                  entry.comentario_athena ??
                                  entry.comentario ??
                                  entry.athena ??
                                  "",
                              },
                            }
                            : c,
                        ),
                      );
                      break;
                    }
                  } catch {
                    // ignore
                  }
                  await new Promise((r) => setTimeout(r, 2000));
                }
              })();
            }
            setOpenModal(false);
          }
        }}
      />
    </div>
  );
}
