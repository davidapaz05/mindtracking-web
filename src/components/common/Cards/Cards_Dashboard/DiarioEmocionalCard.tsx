"use client";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import ModalDiario from "@/components/common/Modals/Diario/ModalEscreverDiario";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDiarios, getDiarioById } from "@/lib/api/diario";
import { setAuthToken } from "@/lib/api/axios";

interface DiarioEntrada {
  data_hora: string;
  titulo: string;
  texto: string;
  emocao_predominante: string | null;
  intensidade_emocional: string | null;
  comentario_athena: string | null;
}

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

export default function DiarioEmocionalCard() {
  const { theme } = useTheme();
  const [entrada, setEntrada] = useState<DiarioEntrada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diarioHoje, setDiarioHoje] = useState(false);

  const modalBg =
    theme === "dark"
      ? "bg-slate-800 border-green-600"
      : "bg-white border-green-600";
  const textColor = theme === "dark" ? "text-white" : "text-slate-800";

  // Formata data para "DD/MM às HHhMM"
  const formatarDataHora = (iso: string) => {
    const d = new Date(iso);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dia}/${mes} às ${hora}h${min}`;
  };

  useEffect(() => {
    const fetchDiarios = async () => {
      try {
        setLoading(true);
        // configura token
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("mt_token");
          if (token) setAuthToken(token);
        }
        const resp = await getDiarios();
        if (!resp.success) throw new Error(resp.message);
        const entradas: DiarioEntrada[] = resp.entradas;
        if (entradas.length > 0) {
          // Ordena do mais recente para o mais antigo
          entradas.sort(
            (a, b) =>
              new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime(),
          );
          const ultima = entradas[0];
          setEntrada(ultima);

          // Verifica se já existe um diário nas últimas 24 horas (janela de 24h)
          const ultimaTime = new Date(ultima.data_hora).getTime();
          const now = Date.now();
          const diffMs = now - ultimaTime;
          const twentyFourHoursMs = 24 * 60 * 60 * 1000;
          // considera diário como "já registrado" se foi criado há menos de 24h
          setDiarioHoje(diffMs >= 0 && diffMs < twentyFourHoursMs);
        }
      } catch (err: unknown) {
        console.error("Erro ao carregar diários:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar diários";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchDiarios();
  }, []);

  const [modalAberto, setModalAberto] = useState(false);
  const [textoDiario, setTextoDiario] = useState("");
  const [tituloDiario, setTituloDiario] = useState("");
  const router = useRouter();

  if (loading) {
    return (
      <BaseCard>
        <div className="flex items-center justify-center h-full min-h-[150px]">
          <span className={`text-lg ${textColor}`}>Carregando...</span>
        </div>
      </BaseCard>
    );
  }
  if (error) {
    return (
      <BaseCard>
        <div className="flex items-center justify-center h-full min-h-[150px]">
          <span className={`text-sm ${textColor}`}>Erro: {error}</span>
        </div>
      </BaseCard>
    );
  }

  return (
    <>
      <BaseCard className="max-h-[550px] lg:h-full lg:min-h-0 w-full flex flex-col">
        <div className="flex flex-col justify-between h-full min-h-0">
          {/* Cabeçalho */}
          <div className="flex items-center gap-4">
            <Image
              src={
                theme === "dark"
                  ? "/images/icons/IconeDiario.svg"
                  : "/images/icons/IconeDiarioDark.svg"
              }
              alt="Ícone Diário"
              width={24}
              height={24}
              className="w-8 h-8"
            />
            <h1 className="text-[20px] font-semibold">Seu Diário Emocional</h1>
          </div>
          {/* Conteúdo */}
          {entrada ? (
            <div
              className={`mt-4 space-y-2 text-[15px] font-semibold font-inter ${textColor}`}
            >
              <p>
                Último diário registrado:
                {entrada.titulo ? (
                  <span className="font-normal">{entrada.titulo}</span>
                ) : (
                  <span className="font-normal">Sem título</span>
                )}
              </p>
              <p>{formatarDataHora(entrada.data_hora)}</p>
              {entrada.emocao_predominante && (
                <p>
                  <span className="font-semibold">Emoção predominante:</span>{" "}
                  {entrada.emocao_predominante}
                </p>
              )}
              {entrada.intensidade_emocional && (
                <p>
                  <span className="font-semibold">Intensidade emocional:</span>{" "}
                  {entrada.intensidade_emocional}
                </p>
              )}
              {entrada.comentario_athena && (
                <p>
                  <span className="font-semibold">Athena diz:</span>
                  <br />“{entrada.comentario_athena}”
                </p>
              )}
            </div>
          ) : (
            <div className={`mt-4 text-[15px] font-inter ${textColor}`}>
              Nenhuma entrada registrada.
            </div>
          )}
          {/* Botão */}
          {diarioHoje ? (
            <button
              className="my-6 w-full h-[50px] bg-green-600 hover:bg-green-700 text-white font-bold text-[16px] py-2 rounded-3xl border-4 border-transparent transition-all duration-200 cursor-pointer active:scale-[0.98] active:brightness-95 active:border-green-900 active:drop-shadow-[0_0_15px_#383838]"
              onClick={() => setModalAberto(true)}
            >
              Diário já registrado
            </button>
          ) : (
            <>
              <button
                className="my-6 w-full h-[50px] bg-blue-600 hover:bg-blue-500 text-white font-bold text-[16px] py-2 rounded-3xl border-4 border-transparent transition-all duration-200 cursor-pointer active:scale-[0.98] active:brightness-95 active:border-blue-700 active:drop-shadow-[0_0_15px_#0C4A6E]"
                onClick={() => {
                  // Primeiro navega para a página de diários e inclui query param para abrir o modal lá
                  router.push("/diario?openModal=1");
                }}
              >
                Escrever no diário
              </button>
            </>
          )}
        </div>
      </BaseCard>
      {/* Modal(es) */}
      {/* Quando já há diário hoje mostramos modal informativo */}
      {modalAberto && diarioHoje && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className={`rounded-xl border p-6 w-full max-w-md shadow-lg ${modalBg}`}
          >
            <h2 className={`text-xl font-bold mb-2 ${textColor}`}>
              Sua reflexão de hoje já foi registrada!
            </h2>
            <p className={`mb-4 text-[15px] font-inter ${textColor}`}>
              Para incentivar um registro focado e significativo, nossa
              plataforma limita a um diário por dia. Isso ajuda a consolidar os
              pensamentos e sentimentos mais importantes do seu dia.
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 active:scale-[0.98] active:brightness-95 active:border-green-900 active:drop-shadow-[0_0_15px_#383838] cursor-pointer text-white rounded-full py-2 w-full font-bold text-[16px] transition"
              onClick={() => setModalAberto(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal para escrever no diário */}
      {modalAberto && !diarioHoje && (
        <ModalDiario
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          value={textoDiario}
          onChange={(v: string) => setTextoDiario(v)}
          title={tituloDiario}
          onTitleChange={(t: string) => setTituloDiario(t)}
          onSave={(created?: DiarioCreated) => {
            // O modal já chama a API; aqui apenas atualizamos estado local com o result
            if (created) {
              const createdTitulo =
                created.titulo ??
                created.title ??
                (tituloDiario || textoDiario.split("\n")[0] || "Sem título");
              const createdTexto = created.texto ?? created.text ?? textoDiario;
              setDiarioHoje(true);
              setEntrada({
                data_hora:
                  created.data_hora ??
                  created.createdAt ??
                  new Date().toISOString(),
                titulo: createdTitulo,
                texto: createdTexto,
                emocao_predominante: created.emocao_predominante ?? null,
                intensidade_emocional: created.intensidade_emocional ?? null,
                comentario_athena: created.comentario_athena ?? null,
              });
              setTextoDiario("");
              setTituloDiario("");
              setModalAberto(false);

              // Se a API criou a entrada mas ainda não retornou a análise, tenta reconsultar por alguns segundos
              const needsAnalysis = !(
                created.comentario_athena ||
                created.comentario ||
                created.athena ||
                created.emocao_predominante ||
                created.intensidade_emocional
              );
              if (needsAnalysis && (created.id || created._id)) {
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
                        setEntrada((prev) => ({
                          ...(prev ?? {}),
                          data_hora:
                            entry.data_hora ??
                            entry.createdAt ??
                            prev?.data_hora ??
                            new Date().toISOString(),
                          titulo: entry.titulo ?? prev?.titulo ?? createdTitulo,
                          texto: entry.texto ?? prev?.texto ?? createdTexto,
                          emocao_predominante:
                            entry.emocao_predominante ??
                            entry.emocao ??
                            prev?.emocao_predominante ??
                            null,
                          intensidade_emocional:
                            entry.intensidade_emocional ??
                            entry.intensidade ??
                            prev?.intensidade_emocional ??
                            null,
                          comentario_athena:
                            entry.comentario_athena ??
                            entry.comentario ??
                            entry.athena ??
                            prev?.comentario_athena ??
                            null,
                        }));
                        break;
                      }
                    } catch {
                      // ignora e aguarda
                    }
                    await new Promise((r) => setTimeout(r, 2000));
                  }
                })();
              }
            }
          }}
        />
      )}
    </>
  );
}
