import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Flame, CheckCircle2, ArrowRight, X, Crown, Sparkles } from 'lucide-react';
import { GrupoEstudo } from '../types';

interface WeeklyExamResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: number;
  pointsAwarded: number;
  notaPercent: number;
  acertos: number;
  total: number;
  group: GrupoEstudo;
  onGoToRanking: () => void;
  isDarkMode: boolean;
}

export const WeeklyExamResultModal: React.FC<WeeklyExamResultModalProps> = ({
  isOpen,
  onClose,
  position,
  pointsAwarded,
  notaPercent,
  acertos,
  total,
  group,
  onGoToRanking,
  isDarkMode,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#0284c7', '#ea580c', '#eab308', '#10b981', '#a855f7'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const medalEmoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🎖️';
  const positionText =
    position === 1 ? '1º LUGAR NO GRUPO!' : position === 2 ? '2º LUGAR NO GRUPO!' : position === 3 ? '3º LUGAR NO GRUPO!' : `${position}º Lugar`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border p-6 sm:p-8 transition-all shadow-2xl relative overflow-hidden text-center ${
          isDarkMode
            ? 'bg-[#101725] border-[#1e2e46] text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Icon */}
        <div className="relative mb-3 inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-[#ea580c] text-white flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mx-auto">
            {medalEmoji}
          </div>
          {position === 1 && (
            <span className="absolute -top-3 -right-2">
              <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
            </span>
          )}
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-amber-500 block mb-1">
          RESULTADO DA PROVA GERAL (30 QUESTÕES)
        </span>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          {positionText}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6">
          Você concluiu a prova integrativa da semana baseada nos temas de todos os membros do grupo.
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-[#151f2e] border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Acertos</span>
            <span className="text-lg font-black text-emerald-400">{acertos} / {total}</span>
          </div>

          <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-[#151f2e] border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Nota Geral</span>
            <span className="text-lg font-black text-[#0284c7] dark:text-[#38bdf8]">{notaPercent}%</span>
          </div>

          <div className="p-3 rounded-2xl border bg-amber-500/10 border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-500 block">Bônus Ganho</span>
            <span className="text-lg font-black text-amber-500">+{pointsAwarded} pts</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToRanking();
            }}
            className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
          >
            <span>Ver Ranking e Pódio Atualizado do Grupo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white py-1.5"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
