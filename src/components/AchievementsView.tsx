import React, { useState } from 'react';
import {
  Award,
  Flame,
  Target,
  Zap,
  Sparkles,
  ShieldCheck,
  Crown,
  Medal,
  GraduationCap,
  Sun,
  Brain,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sliders,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Conquista, ProgressoDiario, ConquistaCategoria, MedalhaTipo } from '../types';
import { getLast7Days } from '../utils/achievements';

interface AchievementsViewProps {
  isDarkMode: boolean;
  dailyProgress: ProgressoDiario;
  achievements: Conquista[];
  metaDiaria: number;
  onGoToStudy: () => void;
  onOpenProfileToEditGoal: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Target,
  Sparkles,
  Brain,
  Flame,
  ShieldCheck,
  Award,
  Crown,
  CheckCircle2,
  Medal,
  GraduationCap,
  Sun,
};

const MEDAL_STYLES: Record<
  MedalhaTipo,
  {
    border: string;
    bg: string;
    text: string;
    gradient: string;
    label: string;
    glow: string;
    iconBg: string;
  }
> = {
  bronze: {
    border: 'border-amber-700/40 dark:border-amber-600/30',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-800 dark:text-amber-300',
    gradient: 'from-amber-600 to-amber-800',
    label: 'Medalha Bronze',
    glow: 'shadow-amber-500/10',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  prata: {
    border: 'border-slate-300 dark:border-slate-600/50',
    bg: 'bg-slate-50 dark:bg-slate-800/30',
    text: 'text-slate-700 dark:text-slate-200',
    gradient: 'from-slate-400 to-slate-600',
    label: 'Medalha Prata',
    glow: 'shadow-slate-500/10',
    iconBg: 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200',
  },
  ouro: {
    border: 'border-yellow-400/50 dark:border-yellow-500/40',
    bg: 'bg-amber-50/70 dark:bg-yellow-950/20',
    text: 'text-yellow-800 dark:text-yellow-300',
    gradient: 'from-yellow-400 via-amber-500 to-amber-600',
    label: 'Medalha Ouro',
    glow: 'shadow-yellow-500/20',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
  },
  diamante: {
    border: 'border-cyan-400/50 dark:border-cyan-500/40',
    bg: 'bg-cyan-50/70 dark:bg-cyan-950/20',
    text: 'text-cyan-800 dark:text-cyan-300',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    label: 'Medalha Diamante',
    glow: 'shadow-cyan-500/25',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300',
  },
  especial: {
    border: 'border-purple-400/50 dark:border-purple-500/40',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    text: 'text-purple-800 dark:text-purple-300',
    gradient: 'from-purple-500 to-indigo-600',
    label: 'Distintivo Especial',
    glow: 'shadow-purple-500/20',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
  },
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  isDarkMode,
  dailyProgress,
  achievements,
  metaDiaria,
  onGoToStudy,
  onOpenProfileToEditGoal,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentComplete = Math.round((unlockedCount / totalCount) * 100);

  const percentToday = Math.min(
    100,
    metaDiaria > 0 ? Math.round((dailyProgress.questoesRespondidas / metaDiaria) * 100) : 0
  );
  const remainingToday = Math.max(0, metaDiaria - dailyProgress.questoesRespondidas);

  const last7Days = getLast7Days(dailyProgress, metaDiaria);

  const filteredAchievements = achievements.filter((ach) => {
    if (filterCategory === 'todas') return true;
    if (filterCategory === 'desbloqueadas') return ach.unlocked;
    if (filterCategory === 'bloqueadas') return !ach.unlocked;
    return ach.categoria === filterCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span
            className={`text-[11px] font-extrabold tracking-widest uppercase block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            MOTIVAÇÃO & CONSISTÊNCIA
          </span>
          <h1
            className={`text-xl sm:text-2xl font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Conquistas & Medalhas Diárias
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenProfileToEditGoal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDarkMode
                ? 'bg-[#152336] text-slate-200 hover:text-white border-[#0284c7]/40 hover:bg-[#1e2f47]'
                : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Ajustar Meta ({metaDiaria} q/dia)</span>
          </button>

          <button
            type="button"
            onClick={onGoToStudy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-sm shadow-sky-600/30 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resolver Questões</span>
          </button>
        </div>
      </div>

      {/* Hero Card: Today's Goal Progress & Current Streak */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border transition-all relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b] shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#0284c7]/20 via-[#ea580c]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column: Progress towards today's goal */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                  dailyProgress.metaAlcancada
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : isDarkMode
                    ? 'border-[#0284c7]/40 text-[#38bdf8] bg-[#0284c7]/10'
                    : 'border-sky-300 text-[#0369a1] bg-sky-50'
                }`}
              >
                {dailyProgress.metaAlcancada ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Meta Diária Batida Hoje!</span>
                  </>
                ) : (
                  <>
                    <Target className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span>Meta em Andamento</span>
                  </>
                )}
              </span>

              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Data: {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <h2
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {dailyProgress.questoesRespondidas}{' '}
                  <span className="text-base sm:text-lg font-bold text-slate-400">
                    / {metaDiaria} questões hoje
                  </span>
                </h2>
                <span className="text-sm font-black text-[#0284c7] dark:text-[#38bdf8]">
                  {percentToday}%
                </span>
              </div>

              {/* Sleek Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    dailyProgress.metaAlcancada
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm shadow-emerald-500/50'
                      : 'bg-gradient-to-r from-[#0284c7] via-sky-500 to-[#ea580c]'
                  }`}
                  style={{ width: `${Math.min(100, (dailyProgress.questoesRespondidas / metaDiaria) * 100)}%` }}
                />
              </div>
            </div>

            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {dailyProgress.metaAlcancada ? (
                <>
                  Excelente trabalho! Você concluiu sua meta estipulada de {metaDiaria} questões hoje.
                  {dailyProgress.questoesRespondidas >= Math.ceil(metaDiaria * 1.5)
                    ? ' Você ultrapassou 150% e desbloqueou a Superação Diária! 🔥'
                    : ' Continue resolvendo para acumular medalhas de volume e superação.'}
                </>
              ) : remainingToday > 0 ? (
                <>
                  Faltam apenas <strong className="text-[#0284c7] dark:text-[#38bdf8]">{remainingToday} questão(ões)</strong> para
                  concluir seu objetivo de hoje e manter sua sequência de estudos acesa.
                </>
              ) : (
                'Inicie um bloco de questões no gerador ou resolva um simulado para registrar seu progresso hoje.'
              )}
            </p>

            {/* Quick stats mini-row */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Sequência Atual
                  </span>
                  <span className="text-sm font-black text-amber-500">
                    {dailyProgress.streakAtual} {dailyProgress.streakAtual === 1 ? 'dia' : 'dias'} seguidos
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Maior Sequência
                  </span>
                  <span className="text-sm font-black text-purple-400">
                    {dailyProgress.maiorStreak} {dailyProgress.maiorStreak === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total de Dias Batidos
                  </span>
                  <span className="text-sm font-black text-sky-400">
                    {dailyProgress.totalDiasMetasCumpridas} metas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Habit Strip */}
          <div
            className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#0f1520] border-[#1d273a]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0284c7]" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Últimos 7 Dias
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Consistência
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {last7Days.map((dia) => {
                const isToday = dia.data === dailyProgress.data;
                return (
                  <div
                    key={dia.data}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      dia.atingida
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-2xs'
                        : isToday
                        ? isDarkMode
                          ? 'bg-[#152336] border-[#0284c7]/50 text-[#38bdf8]'
                          : 'bg-sky-50 border-sky-300 text-sky-700'
                        : isDarkMode
                        ? 'bg-[#141b27] border-slate-800 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">
                      {dia.diaSemana}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        dia.atingida
                          ? 'bg-emerald-500 text-white'
                          : dia.questoes > 0
                          ? 'bg-[#0284c7]/20 text-[#0284c7] dark:text-[#38bdf8]'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dia.atingida ? <Check className="w-3.5 h-3.5" /> : dia.questoes}
                    </div>
                    <span className="text-[9px] font-bold opacity-80 truncate max-w-full">
                      {dia.questoes}/{dia.meta}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Resolvidas Hoje: <strong className="text-slate-800 dark:text-slate-200">{dailyProgress.questoesRespondidas}</strong></span>
              <span>Acertos: <strong className="text-emerald-500">{dailyProgress.questoesAcertos}</strong></span>
              <span>Aproveitamento: <strong className="text-[#0284c7] dark:text-[#38bdf8]">{dailyProgress.questoesRespondidas > 0 ? Math.round((dailyProgress.questoesAcertos / dailyProgress.questoesRespondidas) * 100) : 0}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Medal Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'todas', label: 'Todas as Medalhas' },
            { id: 'diaria', label: 'Metas Diárias' },
            { id: 'streak', label: 'Sequência & Foco' },
            { id: 'volume', label: 'Volume' },
            { id: 'precisao', label: 'Precisão' },
            { id: 'desbloqueadas', label: `Conquistadas (${unlockedCount})` },
            { id: 'bloqueadas', label: 'A Conquistar' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-[#131924] text-slate-400 hover:text-white hover:bg-[#1a2333] border border-[#1f293b]'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Unlocked Summary Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0">
          <span>{unlockedCount} de {totalCount} desbloqueadas</span>
          <div className="w-20 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0284c7] to-[#ea580c] rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="text-[#0284c7] dark:text-[#38bdf8] font-black">{percentComplete}%</span>
        </div>
      </div>

      {/* Medals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((item) => {
          const IconComp = ICON_MAP[item.icone] || Award;
          const style = MEDAL_STYLES[item.medalhaTipo] || MEDAL_STYLES.bronze;
          const progressPercent = Math.min(
            100,
            item.progressoTotal > 0
              ? Math.round((item.progressoAtual / item.progressoTotal) * 100)
              : 0
          );

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                item.unlocked
                  ? isDarkMode
                    ? `${style.bg} ${style.border} shadow-lg ${style.glow}`
                    : `bg-white ${style.border} shadow-sm ${style.glow}`
                  : isDarkMode
                  ? 'bg-[#10151f]/80 border-[#1a2230] opacity-85 hover:opacity-100'
                  : 'bg-white/80 border-slate-200 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Top Row: Medal Icon & Tier Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="relative">
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${
                      item.unlocked
                        ? `${style.iconBg} shadow-md`
                        : isDarkMode
                        ? 'bg-slate-800/80 text-slate-500'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <IconComp className="w-6 h-6 shrink-0" />
                  </div>

                  {item.unlocked ? (
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs text-[10px] font-black border-2 border-white dark:border-[#0f1724]"
                      title="Conquista Desbloqueada"
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-500 dark:bg-slate-700 text-white flex items-center justify-center text-[10px] border-2 border-white dark:border-[#0f1724]"
                      title="Bloqueada"
                    >
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      item.unlocked
                        ? `${style.text} ${style.border} ${style.bg}`
                        : 'text-slate-400 border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50'
                    }`}
                  >
                    {style.label}
                  </span>

                  <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400">
                    {item.recompensa}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-4 flex-1">
                <h3
                  className={`text-sm sm:text-base font-black tracking-tight ${
                    item.unlocked
                      ? isDarkMode
                        ? 'text-white'
                        : 'text-slate-900'
                      : isDarkMode
                      ? 'text-slate-300'
                      : 'text-slate-700'
                  }`}
                >
                  {item.titulo}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {item.descricao}
                </p>
              </div>

              {/* Bottom: Progress Bar or Unlock Date */}
              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/60">
                {item.unlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-emerald-500 font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Desbloqueada</span>
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {item.unlockedAt ? `em ${item.unlockedAt}` : 'Conquistada'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Progresso</span>
                      <span>
                        {item.progressoAtual} / {item.progressoTotal}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0284c7]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
