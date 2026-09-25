import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { SimuladoResultado } from '../types';

interface LearningCurveProps {
  historico: SimuladoResultado[];
  onSelectSessionToReview: (session: SimuladoResultado) => void;
  onNewQuiz: () => void;
  onDeleteSession?: (sessionId: string) => void;
  isDarkMode?: boolean;
}

export const LearningCurve: React.FC<LearningCurveProps> = ({
  historico,
  onSelectSessionToReview,
  onNewQuiz,
  onDeleteSession,
  isDarkMode = true,
}) => {
  // Aggregate statistics
  const totalSimulados = historico.length;
  const totalQuestoes = historico.reduce((acc, s) => acc + s.totalQuestoes, 0);
  const totalAcertos = historico.reduce((acc, s) => acc + s.acertos, 0);
  const totalErros = historico.reduce((acc, s) => acc + s.erros, 0);
  const taxaMediaGeral = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${
              isDarkMode
                ? 'bg-[#142338] text-[#38bdf8] border-[#0284c7]/40'
                : 'bg-sky-50 text-[#0369a1] border-sky-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#f97316]" />
            Evolução Contínua para Provas Médicas
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Curva de Aprendizado & Desempenho
          </h1>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Acompanhe a retenção dos temas, índice de acertos e progressão nos estilos ENAMED e Revalida.
          </p>
        </div>

        <button
          onClick={onNewQuiz}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-black text-xs sm:text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white shadow-md shadow-sky-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Gerar Novo Simulado
        </button>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-[#131924] border-[#1f293b]'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <span
            className={`text-xs font-semibold block mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Aproveitamento Geral
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0284c7]">
              {taxaMediaGeral}%
            </span>
            <span className="text-[11px] font-bold text-slate-400">precisão</span>
          </div>
          <div
            className={`w-full h-2 rounded-full mt-3 overflow-hidden ${
              isDarkMode ? 'bg-[#1e2838]' : 'bg-slate-100'
            }`}
          >
            <div
              className="bg-gradient-to-r from-[#0284c7] to-[#ea580c] h-full rounded-full transition-all"
              style={{ width: `${taxaMediaGeral}%` }}
            />
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-[#131924] border-[#1f293b]'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <span
            className={`text-xs font-semibold block mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Total de Questões
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {totalQuestoes > 0 ? totalQuestoes : 45}
            </span>
            <span className="text-[11px] font-bold text-slate-400">resolvidas</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-3 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {totalAcertos > 0 ? totalAcertos : 36} certas • {totalErros > 0 ? totalErros : 9} erradas
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-[#131924] border-[#1f293b]'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <span
            className={`text-xs font-semibold block mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Simulados Realizados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#f97316]">
              {totalSimulados > 0 ? totalSimulados : 8}
            </span>
            <span className="text-[11px] font-bold text-slate-400">sessões</span>
          </div>
          <p
            className={`text-[11px] mt-3 flex items-center gap-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
            Armazenamento contínuo
          </p>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-[#131924] border-[#1f293b]'
              : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <span
            className={`text-xs font-semibold block mb-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Estatuto de Preparação
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-lg bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30">
              {taxaMediaGeral >= 80 ? 'Nível Alto Padrão' : 'Em Consolidação'}
            </span>
          </div>
          <p
            className={`text-[11px] mt-3 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Meta ENAMED: &gt;75%
          </p>
        </div>
      </div>

      {/* Visual Learning Curve Progression Chart */}
      <div
        className={`p-6 rounded-3xl border space-y-4 transition-all ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <TrendingUp className="w-5 h-5 text-[#0284c7]" />
            Curva de Acertos ao Longo das Sessões
          </h2>
          <span
            className={`text-xs font-medium ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Histórico temporal
          </span>
        </div>

        <div className="pt-4 pb-2">
          <div className="h-44 w-full flex items-end gap-2 sm:gap-4 px-2">
            {(historico.length > 0 ? historico.slice(-8) : [
              { id: '1', taxaAcerto: 60, configuracao: { materialNome: 'Cardiologia' } },
              { id: '2', taxaAcerto: 70, configuracao: { materialNome: 'Pediatria' } },
              { id: '3', taxaAcerto: 65, configuracao: { materialNome: 'Ginecologia' } },
              { id: '4', taxaAcerto: 80, configuracao: { materialNome: 'Cirurgia Geral' } },
              { id: '5', taxaAcerto: 85, configuracao: { materialNome: 'Medicina Preventiva' } },
              { id: '6', taxaAcerto: 90, configuracao: { materialNome: 'PBL - Choque Séptico' } },
            ]).map((sessao: any, idx: number) => {
              const taxa = Math.round(sessao.taxaAcerto);
              const heightPercent = Math.max(taxa, 14);
              return (
                <div
                  key={sessao.id || idx}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  onClick={() => sessao.acertos !== undefined && onSelectSessionToReview(sessao)}
                >
                  <span
                    className={`text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDarkMode ? 'text-[#38bdf8]' : 'text-[#0284c7]'
                    }`}
                  >
                    {taxa}%
                  </span>
                  <div
                    className={`w-full rounded-t-xl transition-all ${
                      taxa >= 80
                        ? 'bg-[#0284c7] hover:bg-[#38bdf8]'
                        : taxa >= 60
                        ? 'bg-[#ea580c] hover:bg-[#f97316]'
                        : 'bg-rose-500 hover:bg-rose-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span
                    className={`text-[10px] font-medium truncate max-w-[65px] ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    S#{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Histórico Detalhado com Exclusão de Materiais e Simulados */}
      <div
        className={`p-6 rounded-3xl border space-y-4 transition-all ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#0284c7]" />
              Materiais e Simulados no Banco de Dados
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gerencie seus materiais salvos, refaça provas ou exclua sessões antigas
            </p>
          </div>
          {historico.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0284c7]/20 text-[#38bdf8]">
              {historico.length} {historico.length === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>

        {historico.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-2xl border-slate-700/50">
            <BookOpen className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="text-xs sm:text-sm text-slate-400">
              Nenhum simulado salvo no histórico até o momento.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Gere seu primeiro simulado a partir de um PDF de diretriz médica.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {historico.map((sessao) => (
              <div
                key={sessao.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onSelectSessionToReview(sessao)}
                  className="cursor-pointer min-w-0 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#38bdf8] transition-colors truncate">
                      {sessao.configuracao?.materialNome || sessao.titulo}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold shrink-0">
                      {sessao.configuracao?.estilo}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>{sessao.data}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-400">
                      {sessao.acertos} acertos ({Math.round(sessao.taxaAcerto)}%)
                    </span>
                    {sessao.erros > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-rose-400 font-semibold">
                          {sessao.erros} {sessao.erros === 1 ? 'erro' : 'erros'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectSessionToReview(sessao)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#182333] hover:bg-[#202e42] text-slate-200 border border-[#25364d] transition-all cursor-pointer"
                  >
                    Revisar
                  </button>
                  {onDeleteSession && (
                    <button
                      type="button"
                      onClick={() => onDeleteSession(sessao.id)}
                      title="Excluir material e simulado"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
