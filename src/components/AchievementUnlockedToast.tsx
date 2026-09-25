import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, X, ArrowRight, Flame, Target } from 'lucide-react';
import { Conquista } from '../types';

interface AchievementUnlockedToastProps {
  achievement: Conquista | null;
  dailyGoalReached?: boolean;
  onClose: () => void;
  onViewAchievements: () => void;
  isDarkMode: boolean;
}

export const AchievementUnlockedToast: React.FC<AchievementUnlockedToastProps> = ({
  achievement,
  dailyGoalReached = false,
  onClose,
  onViewAchievements,
  isDarkMode,
}) => {
  useEffect(() => {
    if (achievement || dailyGoalReached) {
      // Fire festive celebratory confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.2, x: 0.85 },
        colors: ['#0284c7', '#ea580c', '#eab308', '#10b981', '#38bdf8'],
      });

      // Auto dismiss after 7 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [achievement, dailyGoalReached, onClose]);

  if (!achievement && !dailyGoalReached) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div
        className={`p-4 rounded-3xl border shadow-2xl backdrop-blur-md relative overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-[#101827]/95 border-amber-500/40 text-white shadow-amber-500/10'
            : 'bg-white/95 border-amber-300 text-slate-900 shadow-xl'
        }`}
      >
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
            {dailyGoalReached ? (
              <Flame className="w-6 h-6 animate-pulse" />
            ) : (
              <Award className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 block">
              {dailyGoalReached ? '🎉 META DIÁRIA CONCLUÍDA!' : '🏆 NOVA MEDALHA DESBLOQUEADA!'}
            </span>

            <h4 className="text-sm font-black tracking-tight leading-snug">
              {achievement?.titulo || 'Meta Diária Batida!'}
            </h4>

            <p className="text-xs text-slate-400 leading-tight">
              {achievement?.descricao || 'Parabéns pela dedicação e foco diário!'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              {achievement?.recompensa && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {achievement.recompensa}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  onViewAchievements();
                  onClose();
                }}
                className="text-xs font-bold text-[#0284c7] dark:text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Conquistas</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
