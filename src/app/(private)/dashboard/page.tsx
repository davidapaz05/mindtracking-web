"use client";
import { useState, useEffect } from "react";
import QuestionarioCard from "@/components/common/Cards/Cards_Dashboard/QuestionarioCard";
import EstadoEmocionalCard from "@/components/common/Cards/Cards_Dashboard/EstadoEmocionalCard";
import RecomendacoesCard from "@/components/common/Cards/Cards_Dashboard/RecomendacoesCard";
import GraficoCard from "@/components/common/Cards/Cards_Dashboard/GraficoCard";
import DiarioEmocionalCard from "@/components/common/Cards/Cards_Dashboard/DiarioEmocionalCard";
import CorrelacaoCard from "@/components/common/Cards/Cards_Dashboard/CorrelacaoCard";
import AthenaCard from "@/components/common/Cards/Cards_Dashboard/AthenaCard";
import api, { setAuthToken } from "@/lib/api/axios";
import { verificarDiario, historico } from "@/lib/api/questionario";

export default function Dashboard() {
  const [questionarioStatus, setQuestionarioStatus] = useState({
    respondeuHoje: false,
    respondidos: 0,
    loading: true,
  });
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [historicoData, setHistoricoData] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("mt_token");
        if (token) setAuthToken(token);
      }

      const userStr = localStorage.getItem("mt_user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const id = user.id || user.user_id || user.usuario_id;
      if (id) setUsuarioId(id);
      else return;

      try {
        const respVerif = await verificarDiario(id);

        const jaRespondido =
          respVerif?.ja_respondido === true ||
          respVerif?.data?.ja_respondido === true;

        // Buscar e guardar histórico no estado
        const respHistorico = await historico(id);
        setHistoricoData(respHistorico);

        const estatisticasResponse = await api.get(
          `/questionario/estatisticas/${id}`,
        );

        setQuestionarioStatus({
          respondeuHoje: jaRespondido,
          respondidos:
            estatisticasResponse?.data?.estatisticas?.total_questionarios || 0,
          loading: false,
        });
      } catch {
        setQuestionarioStatus({
          respondeuHoje: false,
          respondidos: 0,
          loading: false,
        });
      }
    };

    init();
  }, []);

  return (
    <div className="ml-0 lg:ml-[150px] min-h-0 h-screen">
      <div className="ml-0 lg:ml-[50px] flex flex-col min-h-0 h-full">
        <div className="flex-shrink-0">
          <h2 className="text-[30px] font-semibold mb-2 mt-2">
            Seu resumo de saúde mental semanal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[98%] auto-rows-fr min-h-0">
          <QuestionarioCard
            respondidos={questionarioStatus.respondidos}
            respondeuHoje={questionarioStatus.respondeuHoje}
            loading={questionarioStatus.loading}
          />
          {usuarioId && <EstadoEmocionalCard usuarioId={usuarioId} />}
          <RecomendacoesCard />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[98%] my-4 auto-rows-fr min-h-0">
          <GraficoCard historicoData={historicoData} />
          <DiarioEmocionalCard />

          <div className="flex flex-col gap-2">
            <CorrelacaoCard />
            <AthenaCard />
          </div>
        </div>
      </div>
    </div>
  );
}
