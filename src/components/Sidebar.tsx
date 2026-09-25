import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Stethoscope,
  BookOpen,
  Puzzle,
  BarChart3,
  CalendarClock,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  X,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Layers,
  Award,
  Users,
  Trophy,
  Play,
  ArrowRight,
} from 'lucide-react';
import { AppNavTab, UserProfile, GrupoEstudo } from '../types';
import { EstudoVagLogo } from './EstudoVagLogo';

interface SidebarProps {
  currentTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  pendingReviewsCount?: number;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeQuestionsCount?: number;
  userProfile?: UserProfile;
  onOpenUserProfile?: () => void;
  dailyStreak?: number;
  unlockedAchievementsCount?: number;
  hasWeeklyExam?: boolean;
  activeGroup?: GrupoEstudo;
  onStartWeeklyExam?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  isOpenMobile = false,
  onCloseMobile,
  pendingReviewsCount = 3,
  onLogout,
  isCollapsed = false,
  onToggleCollapse,
  activeQuestionsCount = 0,
  userProfile,
  onOpenUserProfile,
  dailyStreak = 0,
  unlockedAchievementsCount,
  hasWeeklyExam = false,
  activeGroup,
  onStartWeeklyExam,
}) => {
  const navEstudar: { tab: AppNavTab; label: string; icon: React.ReactNode }[] = [
    {
      tab: 'visao_geral',
      label: 'Visão geral',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'enamed',
      label: 'ENAMED',
      icon: <GraduationCap className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'revalida',
      label: 'Revalida',
      icon: <Stethoscope className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'faculdade',
      label: 'Faculdade',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'pbl',
      label: 'PBL',
      icon: <Puzzle className="w-4 h-4 shrink-0" />,
    },
  ];

  const navAcompanhamento: {
    tab: AppNavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeText?: string;
  }[] = [
    {
      tab: 'desempenho',
      label: 'Desempenho',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      tab: 'revisoes',
      label: 'Revisões',
      icon: <CalendarClock className="w-4 h-4 shrink-0" />,
      badge: pendingReviewsCount,
    },
    {
      tab: 'conquistas',
      label: 'Conquistas & Metas',
      icon: <Award className="w-4 h-4 shrink-0" />,
      badge: dailyStreak > 0 ? dailyStreak : undefined,
      badgeText: dailyStreak > 0 ? `${dailyStreak}🔥` : undefined,
    },
    {
      tab: 'grupos',
      label: 'Grupos & Ranking',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: hasWeeklyExam ? 1 : undefined,
      badgeText: hasWeeklyExam ? '30q' : undefined,
    },
  ];

  const handleNavClick = (tab: AppNavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${
          isDarkMode
            ? 'bg-[#0d121c] border-r border-[#1c2536] text-[#94a3b8]'
            : 'bg-white border-r border-slate-200 text-slate-600'
        }`}
      >
        {/* Top Header / Brand with Collapse Toggle */}
        <div
          className={`h-20 flex items-center border-b transition-all relative ${
            isCollapsed ? 'px-2 justify-center' : 'px-5 justify-between'
          } ${isDarkMode ? 'border-[#1c2536]' : 'border-slate-100'}`}
        >
          {isCollapsed ? (
            <div className="relative flex items-center justify-center w-full">
              <button
                type="button"
                onClick={() => handleNavClick('visao_geral')}
                className="p-1 rounded-2xl hover:bg-slate-800/40 transition-colors focus:outline-hidden group"
                title="EstudoVag - Visão Geral"
              >
                <EstudoVagLogo size={38} isDarkMode={isDarkMode} />
              </button>

              {/* Floating Expand Tab on the border */}
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className={`hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full border shadow-lg items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                    isDarkMode
                      ? 'bg-[#152336] text-[#38bdf8] hover:text-white hover:bg-[#0284c7] border-[#223046]'
                      : 'bg-white text-[#0284c7] hover:text-white hover:bg-[#0284c7] border-slate-200'
                  }`}
                  title="Expandir barra lateral"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('visao_geral')}
                className="flex items-center gap-3 text-left focus:outline-hidden group min-w-0"
                title="EstudoVag - Visão Geral"
              >
                {/* EstudoVag Official Brand Logo Mark */}
                <EstudoVagLogo size={40} isDarkMode={isDarkMode} />
                <div className="flex flex-col leading-none truncate">
                  <div className="flex items-center text-base font-extrabold tracking-tight">
                    <span className="text-[#0284c7]">estudo</span>
                    <span className="text-[#ea580c]">vag</span>
                  </div>
                  <span
                    className={`text-[8px] font-extrabold tracking-wider uppercase mt-0.5 truncate ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Estudos Inteligentes
                  </span>
                </div>
              </button>

              {/* Desktop Collapse Button */}
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className={`hidden lg:flex p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-[#1a2333] border-[#222e42]'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  }`}
                  title="Minimizar barra lateral"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className={`p-1.5 rounded-lg lg:hidden absolute right-2 top-1/2 -translate-y-1/2 ${
              isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Gerar com IA / PDF */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => handleNavClick('gerador')}
            title="Gerar Questões via PDF"
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isCollapsed ? 'px-2' : 'px-3.5'
            } ${
              currentTab === 'gerador'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#ea580c] text-white shadow-md shadow-sky-500/20'
                : isDarkMode
                ? 'bg-[#141f2e] hover:bg-[#1a2b3f] text-[#38bdf8] border border-[#23354d]'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-[#f97316]" />
            {!isCollapsed && <span className="truncate">Gerar Questões via PDF</span>}
          </button>
        </div>

        {/* Scrollable Navigation Sections with Custom Dark Scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-6">
          {/* Section: ESTUDAR */}
          <div>
            {!isCollapsed && (
              <div
                className={`px-3 mb-2 text-[10px] font-bold tracking-widest uppercase truncate ${
                  isDarkMode ? 'text-[#64748b]' : 'text-slate-400'
                }`}
              >
                ESTUDAR
              </div>
            )}
            <nav className="space-y-1">
              {navEstudar.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNavClick(item.tab)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                    } py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? isDarkMode
                          ? isCollapsed
                            ? 'bg-[#152336] text-[#38bdf8] font-semibold border border-[#0284c7]/50 shadow-xs'
                            : 'bg-[#152336] text-[#38bdf8] font-semibold border-l-2 border-[#0284c7]'
                          : isCollapsed
                          ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-300 shadow-xs'
                          : 'bg-sky-50 text-sky-900 font-semibold border-l-2 border-[#0284c7]'
                        : isDarkMode
                        ? 'hover:bg-[#131b28] hover:text-slate-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? (isDarkMode ? 'text-[#38bdf8]' : 'text-[#0284c7]') : ''}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: ACOMPANHAMENTO */}
          <div>
            {!isCollapsed && (
              <div
                className={`px-3 mb-2 text-[10px] font-bold tracking-widest uppercase truncate ${
                  isDarkMode ? 'text-[#64748b]' : 'text-slate-400'
                }`}
              >
                ACOMPANHAMENTO
              </div>
            )}
            <nav className="space-y-1">
              {navAcompanhamento.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNavClick(item.tab)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 relative' : 'justify-between px-3'
                    } py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? isDarkMode
                          ? isCollapsed
                            ? 'bg-[#152336] text-[#38bdf8] font-semibold border border-[#0284c7]/50 shadow-xs'
                            : 'bg-[#152336] text-[#38bdf8] font-semibold border-l-2 border-[#0284c7]'
                          : isCollapsed
                          ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-300 shadow-xs'
                          : 'bg-sky-50 text-sky-900 font-semibold border-l-2 border-[#0284c7]'
                        : isDarkMode
                        ? 'hover:bg-[#131b28] hover:text-slate-200'
                        : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? (isDarkMode ? 'text-[#38bdf8]' : 'text-[#0284c7]') : ''}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`${
                          isCollapsed
                            ? 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full p-0 bg-[#ea580c]'
                            : 'text-[10px] font-bold px-2 py-0.5 rounded-full'
                        } ${
                          isDarkMode
                            ? 'bg-[#3b1e15] text-[#f97316] border border-[#f97316]/30'
                            : 'bg-orange-100 text-[#ea580c]'
                        }`}
                      >
                        {!isCollapsed && (item.badgeText || item.badge)}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Active Quiz Link if cached/active */}
              {activeQuestionsCount > 0 && (
                <button
                  onClick={() => handleNavClick('simulado')}
                  title={isCollapsed ? `Simulado (${activeQuestionsCount} q.)` : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 relative' : 'justify-between px-3'
                  } py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    currentTab === 'simulado'
                      ? isDarkMode
                        ? isCollapsed
                          ? 'bg-[#152336] text-[#38bdf8] font-semibold border border-[#0284c7]/50 shadow-xs'
                          : 'bg-[#152336] text-[#38bdf8] font-semibold border-l-2 border-[#0284c7]'
                        : isCollapsed
                        ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-300 shadow-xs'
                        : 'bg-sky-50 text-sky-900 font-semibold border-l-2 border-[#0284c7]'
                      : isDarkMode
                      ? 'hover:bg-[#131b28] hover:text-slate-200'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 shrink-0 text-[#0284c7]" />
                    {!isCollapsed && <span className="truncate">Simulado Ativo</span>}
                  </div>
                  <span
                    className={`${
                      isCollapsed
                        ? 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full p-0 bg-[#0284c7]'
                        : 'text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#ea580c] text-white'
                    }`}
                  >
                    {!isCollapsed && activeQuestionsCount}
                  </span>
                </button>
              )}

              {/* Preceptor Clínico IA Link */}
              <button
                onClick={() => handleNavClick('tutor')}
                title={isCollapsed ? 'Preceptor IA' : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2 relative' : 'justify-between px-3'
                } py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  currentTab === 'tutor'
                    ? isDarkMode
                      ? isCollapsed
                        ? 'bg-[#152336] text-[#ea580c] font-semibold border border-[#ea580c]/50 shadow-xs'
                        : 'bg-[#152336] text-[#38bdf8] font-semibold border-l-2 border-[#ea580c]'
                      : isCollapsed
                      ? 'bg-orange-50 text-[#c2410c] font-semibold border border-orange-300 shadow-xs'
                      : 'bg-orange-50 text-[#c2410c] font-semibold border-l-2 border-[#ea580c]'
                    : isDarkMode
                    ? 'hover:bg-[#131b28] hover:text-slate-200'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-4 h-4 shrink-0 text-[#f97316]" />
                  {!isCollapsed && <span className="truncate">Preceptor IA</span>}
                </div>
                <span
                  className={`${
                    isCollapsed
                      ? 'absolute top-2 right-2 w-2 h-2'
                      : 'w-2 h-2'
                  } rounded-full bg-[#f97316] animate-pulse`}
                />
              </button>
            </nav>

            {/* Grupo de Estudos Widget in Sidebar */}
            {activeGroup && !isCollapsed && (
              <div
                className={`mt-4 p-3 rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-[#121c2d] to-[#0f1624] border-[#1d2d44] shadow-md'
                    : 'bg-gradient-to-br from-sky-50 to-orange-50/50 border-sky-200/80 shadow-2xs'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-[#0284c7]/20 text-[#0284c7] dark:text-[#38bdf8] flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase text-[#0284c7] dark:text-[#38bdf8] tracking-wider block">
                        GRUPO DE ESTUDOS
                      </span>
                      <h4
                        className={`text-xs font-black truncate ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                        title={activeGroup.nome}
                      >
                        {activeGroup.nome}
                      </h4>
                    </div>
                  </div>

                  {/* User Rank Position Pill */}
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>
                      {(() => {
                        const sorted = [...activeGroup.membros].sort(
                          (a, b) => b.pontosTotais - a.pontosTotais
                        );
                        const pos = sorted.findIndex((m) => m.isCurrentUser) + 1;
                        return `${pos || 1}º Lugar`;
                      })()}
                    </span>
                  </span>
                </div>

                {/* Sub info */}
                <div className="flex items-center justify-between text-[11px] mb-2 px-0.5 text-slate-500 dark:text-slate-400">
                  <span>{activeGroup.membros.length} amigos ativos</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {activeGroup.membros.find((m) => m.isCurrentUser)?.pontosTotais || 0} pts
                  </span>
                </div>

                {/* Weekly Exam Mini Pill */}
                <div
                  className={`p-2 rounded-xl border mb-2 ${
                    isDarkMode
                      ? 'bg-[#0b1019]/90 border-[#1a2538]'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-extrabold mb-0.5">
                    <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                      Prova Semanal (30 q.)
                    </span>
                    <span className="text-[9px] font-bold text-amber-500">
                      1º: +50 pts
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Temas unificados: Clínica, Pedi, Cirurgia, GO e Preventiva.
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-1.5">
                  {onStartWeeklyExam && !activeGroup.provaSemanal.concluida && (
                    <button
                      type="button"
                      onClick={() => {
                        onStartWeeklyExam();
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className="w-full py-1.5 px-2 rounded-xl font-black text-[11px] bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Fazer Prova da Semana (30q)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleNavClick('grupos')}
                    className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#152336] hover:bg-[#1a2d45] border-[#0284c7]/40 text-[#38bdf8]'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>Ver Ranking & Materiais</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Collapsed view indicator for groups */}
            {activeGroup && isCollapsed && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleNavClick('grupos')}
                  title={`${activeGroup.nome} - Ranking & Prova Semanal (30q)`}
                  className={`w-full flex items-center justify-center p-2 rounded-xl relative transition-all cursor-pointer ${
                    currentTab === 'grupos'
                      ? isDarkMode
                        ? 'bg-[#152336] text-[#38bdf8] border border-[#0284c7]/50 shadow-xs'
                        : 'bg-sky-50 text-sky-900 border border-sky-300 shadow-xs'
                      : isDarkMode
                      ? 'hover:bg-[#131b28] text-slate-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#0284c7]" />
                  {!activeGroup.provaSemanal.concluida && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ea580c]" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Central Theme Toggle & Bottom User Profile matching prototype */}
        <div
          className={`p-3 border-t space-y-2.5 ${
            isDarkMode ? 'border-[#1c2536] bg-[#0b0f17]' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          {/* Centralized Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={isCollapsed ? (isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro') : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-2'
            } rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#141b27] text-slate-300 hover:text-white hover:bg-[#1a2333] border border-[#232f44]'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-[#38bdf8] shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-[#f59e0b] shrink-0" />
              )}
              {!isCollapsed && <span>{isDarkMode ? 'Modo Escuro' : 'Modo Claro'}</span>}
            </div>
            {!isCollapsed && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isDarkMode ? 'bg-[#0284c7]/20 text-[#38bdf8]' : 'bg-sky-100 text-[#0284c7]'
                }`}
              >
                {isDarkMode ? 'DARK' : 'LIGHT'}
              </span>
            )}
          </button>

          {/* Profile User Pill (Interactive - Opens User Profile Panel) */}
          <div
            onClick={onOpenUserProfile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenUserProfile?.();
              }
            }}
            title="Abrir Painel do Usuário (Ver dados e estatísticas)"
            className={`group flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
            } rounded-xl border transition-all cursor-pointer select-none ${
              isDarkMode
                ? 'bg-[#121824] border-[#1e2738] hover:border-[#0284c7]/70 hover:bg-[#152233] hover:shadow-md hover:shadow-sky-950/40'
                : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/70 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#ea580c] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                title={userProfile?.nome || 'Usuário Conectado'}
              >
                {userProfile?.nome ? userProfile.nome.trim().charAt(0).toUpperCase() : 'U'}
              </div>
              {!isCollapsed && (
                <div className="truncate text-left">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-xs font-black tracking-wide truncate group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {userProfile?.nome || 'Usuário'}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {userProfile?.email || 'usuario@email.com'}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLogout) {
                    onLogout();
                  } else {
                    onSelectTab('visao_geral');
                  }
                }}
                title="Sair da Conta"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-[#1f2838]'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
