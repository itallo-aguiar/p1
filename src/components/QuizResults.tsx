import React from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BarChart3,
  Clock,
  BookOpen,
} from 'lucide-react';
import { SimuladoResultado } from '../types';

interface QuizResultsProps {
  resultado: SimuladoResultado;
  onRetryErrorsOnly: () => void;
  onNewQuiz: () => void;
  onOpenPdfModal: () => void;
  onGoToLearningCurve: () => void;
  onOpenTutorForQuestion: (questaoIndex: number, markedLetter: string) => void;
  isDarkMode?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  resultado,
  onRetryErrorsOnly,
  onNewQuiz,
  onOpenPdfModal,
  onGoToLearningCurve,
  onOpenTutorForQuestion,
  isDarkMode = true,
}) => {
  const taxa = Math.round(resultado.taxaAcerto);
  const isAprovado = taxa >= 70;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Score Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border ${
          isAprovado
            ? 'bg-gradient-to-r from-[#023e8a] via-[#0284c7] to-[#ea580c] border-sky-400/40'
            : 'bg-gradient-to-r from-slate-900 via-[#142338] to-slate-900 border-[#1f3654]'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              Simulado Concluído • {resultado.configuracao.estilo}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isAprovado ? 'Excelente Rendimento Clínico!' : 'Treino Concluído com Sucesso!'}
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-md">
              Material: <strong>{resultado.configuracao.materialNome}</strong> ({resultado.configuracao.nivel})
            </p>
          </div>

          {/* Big Score Ring */}
          <div className="flex flex-col items-center justify-center p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 min-w-[140px]">
            <span className="text-3xl sm:text-4xl font-black text-white">{taxa}%</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-100 mt-1">
              Aproveitamento
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-xs text-slate-300 block font-medium">Acertos</span>
            <span className="text-lg font-extrabold text-emerald-300">{resultado.acertos}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-xs text-slate-300 block font-medium">Erros</span>
            <span className="text-lg font-extrabold text-rose-300">{resultado.erros}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-xs text-slate-300 block font-medium">Total Questões</span>
            <span className="text-lg font-extrabold text-white">{resultado.totalQuestoes}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-xs text-slate-300 block font-medium">Tempo Gasto</span>
            <span className="text-lg font-extrabold text-amber-200">
              {Math.floor(resultado.tempoGastoSegundos / 60)}m {resultado.tempoGastoSegundos % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {resultado.erros > 0 && (
            <button
              onClick={onRetryErrorsOnly}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-rose-400 bg-rose-950/40 hover:bg-rose-950/60 border-rose-500/30'
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Treinar {resultado.erros} Incorretas
            </button>
          )}

          <button
            onClick={onOpenPdfModal}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-orange-300 bg-orange-950/30 hover:bg-orange-950/50 border-orange-500/30'
                : 'text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200'
            }`}
          >
            <FileText className="w-4 h-4 text-[#f97316]" />
            Exportar Folha de Prova (PDF)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToLearningCurve}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-slate-200 bg-[#192231] hover:bg-[#202b3d] border-[#25344a]'
                : 'text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#0284c7]" />
            Curva de Aprendizado
          </button>

          <button
            onClick={onNewQuiz}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 shadow-md shadow-sky-600/25 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Novo Simulado
          </button>
        </div>
      </div>

      {/* Detailed Clinical Review List */}
      <div className="space-y-4">
        <h2
          className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <BookOpen className="w-5 h-5 text-[#0284c7]" />
          Revisão Detalhada das Questões com o Preceptor
        </h2>

        {resultado.questoes.map((q, idx) => {
          const isCorrect = q.isCorrect;
          return (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                isDarkMode
                  ? isCorrect
                    ? 'bg-[#131924] border-[#1f293b]'
                    : 'bg-[#1e1722] border-rose-500/20'
                  : isCorrect
                  ? 'bg-white border-slate-200'
                  : 'bg-rose-50/20 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                      ✓
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30">
                      ✕
                    </span>
                  )}
                  <h3
                    className={`font-bold text-sm sm:text-base ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Questão {idx + 1}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenTutorForQuestion(idx, q.selectedAnswer || 'B')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#142338] hover:bg-[#1a2d45] border-[#0284c7]/40 text-[#38bdf8]'
                      : 'bg-white hover:bg-sky-50 border-slate-200 text-[#0369a1]'
                  }`}
                >
                  Discutir com Tutor
                </button>
              </div>

              <p
                className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {q.enunciado}
              </p>

              {/* Justification Box */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDarkMode
                    ? 'bg-[#0d141e] border-[#1e2a3c] text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <p className="font-semibold text-[#0284c7] mb-1">Gabarito: Letra {q.resposta_correta}</p>
                <p>{q.justificativa}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
