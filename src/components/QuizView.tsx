import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquareQuote,
  Clock,
  Sparkles,
  BookOpen,
  RotateCcw,
  Check,
  Award,
  Save,
  Target,
  Flame,
} from 'lucide-react';
import { Questao, ConfiguracaoSimulado, ProgressoDiario } from '../types';

interface QuizViewProps {
  questoes: Questao[];
  config: ConfiguracaoSimulado;
  onUpdateQuestion: (index: number, answer: 'A' | 'B' | 'C' | 'D') => void;
  onFinishQuiz: () => void;
  onOpenTutorForQuestion: (questaoIndex: number, markedLetter: string) => void;
  onResetQuiz: () => void;
  isDarkMode?: boolean;
  dailyProgress?: ProgressoDiario;
  metaDiaria?: number;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questoes,
  config,
  onUpdateQuestion,
  onFinishQuiz,
  onOpenTutorForQuestion,
  onResetQuiz,
  isDarkMode = true,
  dailyProgress,
  metaDiaria = 20,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questoes[currentIndex];
  if (!currentQ) return null;

  const isAnswered = !!currentQ.selectedAnswer;
  const isCorrect = currentQ.isCorrect;

  const handleSelectOption = (letter: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return; // already answered
    onUpdateQuestion(currentIndex, letter);

    if (letter === currentQ.resposta_correta) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0284c7', '#ea580c', '#38bdf8', '#f97316'],
      });
    }
  };

  const totalRespondidas = questoes.filter((q) => q.selectedAnswer).length;
  const totalCorretas = questoes.filter((q) => q.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Header & Status */}
      <div
        className={`rounded-2xl p-5 border shadow-xs mb-6 transition-all ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
            isDarkMode ? 'border-[#1c2637]' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isDarkMode
                  ? 'bg-[#142338] text-[#38bdf8] border border-[#0284c7]/40'
                  : 'bg-sky-100 text-[#0369a1]'
              }`}
            >
              Questão {currentIndex + 1} de {questoes.length}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isDarkMode
                  ? 'bg-[#1c2536] text-slate-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {config.nivel}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isDarkMode
                  ? 'bg-[#291712] text-[#f97316] border-[#ea580c]/30'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}
            >
              {config.estilo}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold flex-wrap">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] ${
                isDarkMode
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
              title="Todas as questões e respostas estão salvas automaticamente no cache local do seu navegador"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salvo no Cache</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                isDarkMode
                  ? 'bg-[#17202f] border-[#223046] text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                isDarkMode
                  ? 'bg-[#122238] text-[#38bdf8] border-[#0284c7]/30'
                  : 'bg-sky-50 text-[#0369a1] border-sky-200'
              }`}
            >
              <Award className="w-4 h-4 text-[#0284c7]" />
              <span>
                {totalCorretas} acertos de {totalRespondidas}
              </span>
            </div>
          </div>
        </div>

        {dailyProgress && (
          <div className="pt-3 pb-1 border-b border-slate-100 dark:border-[#1c2637] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Meta diária: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{dailyProgress.questoesRespondidas}</strong> de <strong>{metaDiaria}</strong> questões hoje
              </span>
              {dailyProgress.metaAlcancada && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Meta Batida! 🎉
                </span>
              )}
            </div>

            {dailyProgress.streakAtual > 0 && (
              <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Sequência: {dailyProgress.streakAtual} {dailyProgress.streakAtual === 1 ? 'dia' : 'dias'}</span>
              </div>
            )}
          </div>
        )}

        {/* Question Selector Dots / Palette */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto">
          {questoes.map((q, idx) => {
            const isCurr = idx === currentIndex;
            let statusColor = isDarkMode
              ? 'bg-[#17202f] text-slate-400 border-[#223046] hover:bg-[#1f2b3e]'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';

            if (q.selectedAnswer) {
              statusColor = q.isCorrect
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                : 'bg-rose-500 text-white font-black border-rose-400';
            } else if (isCurr) {
              statusColor = isDarkMode
                ? 'bg-[#0284c7] text-white font-black border-[#0284c7] shadow-sm'
                : 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all shrink-0 border cursor-pointer ${statusColor} ${
                  isCurr ? 'ring-2 ring-[#ea580c] ring-offset-1 ring-offset-[#0d121c]' : ''
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 transition-all ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Source Material Reference */}
        <div
          className={`flex items-center gap-2 text-xs font-medium pb-2 border-b ${
            isDarkMode
              ? 'text-slate-400 border-[#1c2637]'
              : 'text-slate-500 border-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#0284c7]" />
          <span>
            Baseado no Material:{' '}
            <strong className={isDarkMode ? 'text-white' : 'text-slate-800'}>
              {config.materialNome}
            </strong>
          </span>
        </div>

        {/* Statement / Enunciado */}
        <div
          className={`text-base sm:text-lg leading-relaxed font-medium ${
            isDarkMode ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          <p className="whitespace-pre-line">{currentQ.enunciado}</p>
        </div>

        {/* Alternatives A, B, C, D */}
        <div className="space-y-3 pt-2">
          {(['A', 'B', 'C', 'D'] as const).map((letra) => {
            const optionText = currentQ.alternativas[letra];
            if (!optionText) return null;

            const isSelected = currentQ.selectedAnswer === letra;
            const isCorrectAnswer = currentQ.resposta_correta === letra;

            let cardStyle = isDarkMode
              ? 'border-[#222e42] bg-[#17202f] hover:border-[#0284c7]/50 hover:bg-[#1b2638] text-slate-200'
              : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/70 text-slate-800';
            let circleStyle = isDarkMode
              ? 'bg-[#121824] text-slate-300 border-[#2b3a52]'
              : 'bg-slate-100 text-slate-700 border-slate-300';

            if (isAnswered) {
              if (isCorrectAnswer) {
                cardStyle = isDarkMode
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500'
                  : 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500';
                circleStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-400';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle = isDarkMode
                  ? 'border-rose-500 bg-rose-950/40 text-rose-300 line-through opacity-85'
                  : 'border-rose-400 bg-rose-50/70 text-rose-950 line-through opacity-85';
                circleStyle = 'bg-rose-500 text-white border-rose-500';
              } else {
                cardStyle = isDarkMode
                  ? 'border-[#1b2434] bg-[#111722] text-slate-500 opacity-50'
                  : 'border-slate-200 bg-slate-50/50 text-slate-500 opacity-60';
                circleStyle = isDarkMode
                  ? 'bg-[#151c28] text-slate-600 border-[#222e42]'
                  : 'bg-slate-200 text-slate-500 border-slate-300';
              }
            }

            return (
              <button
                key={letra}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(letra)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${cardStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border mt-0.5 ${circleStyle}`}
                >
                  {isAnswered && isCorrectAnswer ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    letra
                  )}
                </div>
                <div className="text-sm sm:text-base leading-snug pt-0.5 flex-1">{optionText}</div>
              </button>
            );
          })}
        </div>

        {/* Preceptor Feedback & Medical Justification (Shows after answering) */}
        {isAnswered && (
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${
              isCorrect
                ? isDarkMode
                  ? 'bg-[#0f2421] border-emerald-500/40 text-emerald-200'
                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : isDarkMode
                ? 'bg-[#291b15] border-amber-500/40 text-amber-200'
                : 'bg-amber-50/60 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <h3 className="font-bold text-sm sm:text-base">
                  {isCorrect ? 'Resposta Correta! Padrão Ouro.' : 'Resposta Incorreta.'}
                  <span className="font-normal text-xs ml-2 opacity-80">
                    (Gabarito Oficial: Letra <strong>{currentQ.resposta_correta}</strong>)
                  </span>
                </h3>
              </div>

              {/* Instant Tutor Trigger Button */}
              <button
                type="button"
                onClick={() => onOpenTutorForQuestion(currentIndex, currentQ.selectedAnswer || 'B')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#142338] hover:bg-[#1a2d45] border-[#0284c7]/40 text-[#38bdf8]'
                    : 'bg-white border-slate-200 text-[#0369a1] hover:bg-sky-50 shadow-2xs'
                }`}
                title="Tirar dúvida direta com o Preceptor no Chat"
              >
                <MessageSquareQuote className="w-4 h-4 text-[#f97316]" />
                <span>Pedir Explicação ao Tutor</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm leading-relaxed space-y-2">
              <p
                className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Justificativa do Preceptor Médico:
              </p>
              <div
                className={`p-3.5 rounded-xl border leading-relaxed ${
                  isDarkMode
                    ? 'bg-[#0d141e] border-[#1e2a3c] text-slate-300'
                    : 'bg-white/80 border-slate-200/60 text-slate-800'
                }`}
              >
                <p className="whitespace-pre-line">{currentQ.justificativa}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div
          className={`flex items-center justify-between pt-4 border-t ${
            isDarkMode ? 'border-[#1c2637]' : 'border-slate-100'
          }`}
        >
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-30 transition-all cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:bg-[#1b2536]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetQuiz}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-[#182333]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Reiniciar questões"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>

            {currentIndex < questoes.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questoes.length - 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-[#0284c7] hover:bg-[#0369a1] text-white transition-all shadow-sm cursor-pointer"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onFinishQuiz}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 shadow-md shadow-sky-600/25 transition-all font-black cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finalizar Simulado
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
