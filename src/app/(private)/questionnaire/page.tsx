"use client";
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPerguntas, responderQuestionario, responderDiario } from '@/lib/api/questionario';
import { setAuthToken } from '@/lib/api/axios';

interface AlternativaAPI {
  id?: number | string;
  ID?: number | string;
  value?: number | string;
  texto?: string;
  text?: string;
  label?: string;
  pontuacao?: number;
  score?: number;
  pontuation?: number;
}

interface PerguntaAPI {
  id?: number | string;
  _id?: number | string;
  ID?: number | string;
  texto?: string;
  text?: string;
  pergunta?: string;
  enunciado?: string;
  titulo?: string;
  label?: string;
  alternativas?: AlternativaAPI[];
  options?: AlternativaAPI[];
  opcoes?: AlternativaAPI[];
  respostas?: AlternativaAPI[];
  itens?: AlternativaAPI[];
}

type PerguntasResponse = PerguntaAPI[] | { data?: PerguntaAPI[]; perguntas?: PerguntaAPI[] } | null | undefined;

interface UserLike {
  id?: unknown;
  usuario_id?: unknown;
  user_id?: unknown;
  usuarioId?: unknown;
  ID?: unknown;
  _id?: unknown;
  questionario_inicial?: unknown;
  sub?: unknown;
}

type Alternativa = {
  id: number;
  texto: string;
  pontuacao?: number;
};

type Pergunta = {
  id: number;
  text: string;
  alternativas: Alternativa[];
};

const Questionnaire = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Pergunta[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  type Resposta = { perguntaId: number; alternativaId: number; pontuacao?: number };
  const [answers, setAnswers] = useState<Resposta[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiario, setIsDiario] = useState<boolean>(false);

  const question = questions[currentQuestion];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        console.log("[Questionnaire] Carregando perguntas...");
        setLoadingQuestions(true);
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("mt_token");
          if (token) {
            console.log("[Questionnaire] Token JWT encontrado, configurando axios...");
            setAuthToken(token);
          } else {
            console.warn("[Questionnaire] Token JWT não encontrado.");
          }
        }

        let usuarioJaFezInicial = false;
if (user && (user as UserLike).questionario_inicial === true) {
  usuarioJaFezInicial = true;
} else if (typeof window !== "undefined") {
  try {
    const userStr = localStorage.getItem("mt_user");
    if (userStr) {
      const userFromStorage = JSON.parse(userStr);
      if (userFromStorage.questionario_inicial === true) {
        usuarioJaFezInicial = true;
      }
    }
  } catch (e) {
    console.warn("Erro parsing localStorage.mt_user:", e);
  }
}
setIsDiario(usuarioJaFezInicial);
        console.log("[Questionnaire] isDiario definido como:", usuarioJaFezInicial);

        console.log("[Questionnaire] Chamando getPerguntas com parametro diario =", usuarioJaFezInicial);
        const data = (await getPerguntas(usuarioJaFezInicial)) as PerguntasResponse;

        console.log("[Questionnaire] Dados recebidos de getPerguntas:", data);

        let raw: PerguntaAPI[] = [];
        if (Array.isArray(data)) raw = data;
        else if (data && Array.isArray(data.data)) raw = data.data;
        else if (data && Array.isArray(data.perguntas)) raw = data.perguntas;
        else {
          console.error("[Questionnaire] Formato inesperado dos dados recebidos:", data);
          raw = [];
        }

        const normalize = (item: PerguntaAPI): Pergunta | null => {
          if (!item) return null;
          const id = item.id ?? item._id ?? item.ID ?? null;
          const text = item.texto ?? item.text ?? item.pergunta ?? item.enunciado ?? item.titulo ?? item.label ?? '';
          const rawOptions: AlternativaAPI[] = (item.alternativas ?? item.options ?? item.opcoes ?? item.respostas ?? item.itens ?? []) as AlternativaAPI[];
          const alternativas: Alternativa[] = Array.isArray(rawOptions)
            ? rawOptions.map((o) => ({
                id: Number(o.id ?? o.ID ?? o.value ?? 0),
                texto: (o.texto ?? o.text ?? o.label ?? '').toString(),
                pontuacao: o.pontuacao ?? o.score ?? o.pontuation ?? undefined,
              }))
            : [];
          if (!text || alternativas.length === 0) return null;
          return { id: Number(id ?? 0), text, alternativas };
        };

        const normalized = raw.map(normalize).filter((x): x is Pergunta => x !== null);
        console.log("[Questionnaire] Perguntas normalizadas:", normalized.length);

        if (mounted) {
          setQuestions(normalized);
          setCurrentQuestion(0);
          setAnswers([]);
          setSelected(null);
          console.log("[Questionnaire] Estado atualizado com perguntas.");
        }
      } catch (err) {
        console.error("[Questionnaire] Erro ao carregar perguntas:", err);
        if (mounted) setQuestions([]);
      } finally {
        if (mounted) {
          setLoadingQuestions(false);
          console.log("[Questionnaire] LoadingQuestions definido como false.");
        }
      }
    };
    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleNext = () => {
    if ((selected === null || selected === undefined) || isLoadingNext) return;
    setIsLoadingNext(true);
    const curr = questions[currentQuestion];
    const alt = curr.alternativas.find((a) => a.id === selected);
    const resposta = { perguntaId: curr.id, alternativaId: selected, pontuacao: alt?.pontuacao };
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = resposta;
    setAnswers(updatedAnswers);
    setIsLoadingNext(false);
    setSelected(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      const nextResp = updatedAnswers[currentQuestion + 1];
      setSelected(nextResp ? nextResp.alternativaId : null);
    } else {
      handleSubmit(updatedAnswers);
    }
  };

  const handleBack = () => {
    setCurrentQuestion((prev) => prev - 1);
    const prevResp = answers[currentQuestion - 1];
    setSelected(prevResp ? prevResp.alternativaId : null);
  };

  const handleSelect = (alternativaId: number) => {
    setSelected(alternativaId);
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const isLast = questions.length > 0 && currentQuestion === questions.length - 1;

  const handleSubmit = async (payloadAnswers?: typeof answers) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("mt_token");
        if (token) setAuthToken(token);
      }
      const maybeUser = user as UserLike | null;
      let usuarioId: number | null = null;
      if (maybeUser) {
        usuarioId = Number(maybeUser.id ?? maybeUser.usuario_id ?? maybeUser.user_id ?? maybeUser.usuarioId ?? maybeUser.ID ?? maybeUser._id ?? null) || null;
      }
      if (!usuarioId && typeof window !== 'undefined') {
        const token = localStorage.getItem('mt_token');
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payloadRaw = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
              const payloadObj = JSON.parse(decodeURIComponent(escape(payloadRaw)));
              usuarioId = Number(payloadObj.id ?? payloadObj.usuario_id ?? payloadObj.sub ?? null) || null;
            }
          } catch {}
        }
      }
      const respostasArr = (payloadAnswers ?? answers).map((a) => ({ pergunta_id: a.perguntaId, alternativa_id: a.alternativaId }));
      if (!usuarioId) {
        alert('Não foi possível identificar usuário. Faça login novamente.');
        setIsSubmitting(false);
        return;
      }
      if (!respostasArr || respostasArr.length === 0) {
        alert('Nenhuma resposta selecionada.');
        setIsSubmitting(false);
        return;
      }
      const payload = { usuario_id: usuarioId, respostas: respostasArr };
      if (isDiario) {
        await responderDiario(payload);
      } else {
        await responderQuestionario(payload);
        if (typeof window !== "undefined") {
          try {
            const userStr = localStorage.getItem("mt_user");
            if (userStr) {
              const userFromStorage = JSON.parse(userStr);
              userFromStorage.questionario_inicial = true;
              localStorage.setItem("mt_user", JSON.stringify(userFromStorage));
              setIsDiario(true);
            }
          } catch (e) {
            console.debug("Erro ao atualizar localStorage:", e);
          }
        }
      }
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown }; message?: string };
      const status = err?.response?.status;
      const data = err?.response?.data as unknown;
      if (status === 400) {
        const extractMsg = (d: unknown): string | null => {
          if (!d) return null;
          if (typeof d === 'string') return d;
          if (typeof d === 'object') {
            const maybe = d as { message?: unknown; error?: unknown };
            const msg = maybe.message;
            const errTxt = maybe.error;
            if (typeof msg === 'string') return msg;
            if (typeof errTxt === 'string') return errTxt;
          }
          return null;
        };
        const serverMessage = extractMsg(data);
        if (serverMessage && serverMessage.includes("já respondeu o questionário inicial")) {
          try {
            const userStr = localStorage.getItem("mt_user");
            if (userStr) {
              const userFromStorage = JSON.parse(userStr);
              userFromStorage.questionario_inicial = true;
              localStorage.setItem("mt_user", JSON.stringify(userFromStorage));
              setIsDiario(true);
            }
          } catch (e) {
            console.debug("Erro ao atualizar localStorage após erro 400:", e);
          }
          alert("Você já completou o questionário inicial. Redirecionando para o dashboard...");
          router.push('/dashboard');
          return;
        }
      }
      const extractMsg = (d: unknown): string | null => {
        if (!d) return null;
        if (typeof d === 'string') return d;
        if (typeof d === 'object') {
          const maybe = d as { message?: unknown; error?: unknown };
          const msg = maybe.message;
          const errTxt = maybe.error;
          if (typeof msg === 'string') return msg;
          if (typeof errTxt === 'string') return errTxt;
        }
        return null;
      };
      const serverMessage = extractMsg(data);
      alert(`Erro ao enviar questionário. ${status ? `(${status}) ` : ''}${serverMessage ?? err?.message ?? 'Tente novamente.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const bgPrimary = theme === "dark" ? "bg-gray-900" : "bg-gray-100";

  return (
    <div className={`flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden ${bgPrimary} transition-colors duration-200`}>
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-[90rem] px-4 md:px-12 lg:px-[80px] mx-auto space-y-8">

          <section className="mb-6 md:mb-4">
            {loadingQuestions ? (
              <div className="h-8 flex items-center">Carregando questionário...</div>
            ) : questions.length === 0 ? (
              <div className={`font-medium text-sm ${textSecondary} mb-2`}>Nenhuma pergunta disponível</div>
            ) : (
              <>
                <div className={`font-medium flex justify-between text-sm ${textSecondary} mb-2`}>
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}
          </section>

          <h1 className={`text-xl sm:text-2xl font-bold mt-10 lg:mt-20 ${textPrimary} transition-colors duration-200`}>
            Questionário
          </h1>

          {loadingQuestions ? null : questions.length > 0 ? (
            <p className={`text-base sm:text-lg font-bold mt-4 mb-6 lg:mb-10 ${textPrimary} transition-colors duration-200`}>
              {question?.text}
            </p>
          ) : null}

          <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 w-full font-regular">
            {(!loadingQuestions && question) && question.alternativas?.map((alt: Alternativa, idx: number) => {
              const isSelected = selected === alt.id;
              const borderColor =
                theme === "light"
                  ? "border-blue-600"
                  : isSelected
                  ? "border-blue-600"
                  : "border-gray-600";
              const optionTextColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
              return (
                <div
                  key={alt.id ?? idx}
                  onClick={() => handleSelect(alt.id)}
                  className="flex items-center gap-3 cursor-pointer select-none w-full justify-start transition-colors duration-200"
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${borderColor}`}
                    style={{ borderWidth: "2.5px" }}
                  >
                    {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                  </div>
                  <span className={`text-sm sm:text-base ${optionTextColor}`}>{alt.texto}</span>
                </div>
              );
            })}
          </div>

          <div className="flex sm:gap-3 md:gap-8 justify-between items-center w-full pt-4">
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="px-3 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-sm sm:text-xs md:text-base rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all w-full sm:w-auto max-w-[12rem]"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={(selected === null) || isLoadingNext || isSubmitting}
              className={`px-3 py-1 sm:px-3 sm:py-2 md:px-6 md:py-3 text-sm sm:text-xs md:text-base rounded-full font-bold transition-all w-full sm:w-auto max-w-[12rem] whitespace-nowrap ml-auto
              ${selected && !isLoadingNext
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {isLast ? (isSubmitting ? 'Enviando...' : 'Finalizar') : 'Próxima pergunta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
