import React from 'react';
import {
  Menu,
  ArrowLeft,
  Flame,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { AppNavTab, UserProfile, ProgressoDiario } from '../types';

interface HeaderProps {
  currentTab: AppNavTab;
  onOpenMobileSidebar: () => void;
  isDarkMode: boolean;
  activeQuestionsCount: number;
  onOpenPdfModal: () => void;
  onGoToSimulado?: () => void;
  onBack?: () => void;
  hasCachedQuiz?: boolean;
  userProfile?: UserProfile;
  onOpenUserProfile?: () => void;
  dailyProgress?: ProgressoDiario;
  onGoToAchievements?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  isDarkMode,
  activeQuestionsCount,
  onOpenPdfModal,
  onGoToSimulado,
  onBack,
  hasCachedQuiz,
  userProfile,
  onOpenUserProfile,
  dailyProgress,
  onGoToAchievements,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'visao_geral':
        return 'Visão Geral & Dashboard';
      case 'enamed':
        return 'ENAMED';
      case 'revalida':
        return 'Revalida';
      case 'faculdade':
        return 'Faculdade';
      case 'pbl':
        return 'PBL';
      case 'desempenho':
        return 'Desempenho & Curva de Aprendizado';
      case 'revisoes':
        return 'Revisões Agendadas';
      case 'conquistas':
        return 'Conquistas & Medalhas Diárias';
      case 'grupos':
        return 'Grupos de Estudos & Ranking Semanal';
      case 'gerador':
        return 'Gerador de Questões via PDF / IA';
      case 'simulado':
        return 'Simulador Clínico Interativo';
      case 'tutor':
        return 'Preceptor Clínico IA';
      default:
        return 'Painel';
    }
  };

  const showBackButton = currentTab !== 'visao_geral' && !!onBack;

  return (
    <header
      className={`sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
        isDarkMode
          ? 'bg-[#0d121c]/90 border-[#1c2536] text-white'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}
    >
      {/* Left: Mobile hamburger & Back button & breadcrumb title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className={`p-2 rounded-xl lg:hidden transition-colors ${
            isDarkMode
              ? 'text-slate-300 hover:text-white hover:bg-[#1a2333]'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDarkMode
                ? 'bg-[#151c28] hover:bg-[#1f2a3c] text-slate-200 border-[#233144] hover:text-[#38bdf8]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="Voltar para a Visão Geral"
          >
            <ArrowLeft className="w-4 h-4 text-[#0284c7]" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0 truncate">
          <span
            className={`text-xs sm:text-sm font-extrabold truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {getTabTitle()}
          </span>
        </div>
      </div>

      {/* Right side: Daily Goal Pill & Streak Incentive */}
      <div className="flex items-center shrink-0 gap-2">
        {dailyProgress && onGoToAchievements && (
          <button
            type="button"
            onClick={onGoToAchievements}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              dailyProgress.metaAlcancada
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                : isDarkMode
                ? 'bg-[#152336] border-[#0284c7]/40 text-[#38bdf8] hover:bg-[#1a2d45]'
                : 'bg-sky-50 border-sky-200 text-[#0369a1] hover:bg-sky-100 shadow-2xs'
            }`}
            title="Clique para ver sua meta diária e conquistas"
          >
            <div className="flex items-center gap-1">
              {dailyProgress.metaAlcancada ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Target className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
              )}
              <span className="hidden sm:inline">Meta:</span>
              <span>
                {dailyProgress.questoesRespondidas}/{userProfile?.metaDiariaQuestoes || 20}
              </span>
            </div>

            {dailyProgress.streakAtual > 0 && (
              <span className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-black pl-1.5 border-l border-slate-300 dark:border-slate-700">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{dailyProgress.streakAtual}d</span>
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
