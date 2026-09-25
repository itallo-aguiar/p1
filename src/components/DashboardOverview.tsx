import React from 'react';
import {
  GraduationCap,
  Stethoscope,
  BookOpen,
  Puzzle,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Play,
  RotateCcw,
  Award,
  Flame,
  Target,
  Zap,
} from 'lucide-react';
import {
  RevisaoItem,
  TemaDificuldade,
  SimuladoResultado,
  ProgressoDiario,
  Conquista,
} from '../types';

interface DashboardOverviewProps {
  isDarkMode: boolean;
  onStartReview: () => void;
  onViewPerformance: () => void;
  onSelectModality: (modality: 'enamed' | 'revalida' | 'faculdade' | 'pbl') => void;
  onOpenPdfGenerator: () => void;
  onOpenReviewItem: (item: RevisaoItem) => void;
  totalQuestoesRespondidas?: number;
  taxaAcertoGeral?: number;
  questoesGeradasTotal?: number;
  revisoes?: RevisaoItem[];
  temasDificuldade?: TemaDificuldade[];
  modalidadesStats?: {
    enamed: number;
    revalida: number;
    faculdade: number;
    pbl: number;
  };
  cachedQuiz?: {
    totalQuestoes: number;
    materialNome: string;
    isCompleted: boolean;
  } | null;
  onResumeCachedQuiz?: () => void;
  dailyProgress?: ProgressoDiario;
  achievements?: Conquista[];
  metaDiaria?: number;
  onViewAchievements?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  isDarkMode,
  onStartReview,
  onViewPerformance,
  onSelectModality,
  onOpenPdfGenerator,
  onOpenReviewItem,
  totalQuestoesRespondidas = 0,
  taxaAcertoGeral = 0,
  questoesGeradasTotal = 0,
  revisoes = [],
  temasDificuldade = [],
  modalidadesStats = { enamed: 0, revalida: 0, faculdade: 0, pbl: 0 },
  cachedQuiz,
  onResumeCachedQuiz,
  dailyProgress,
  achievements = [],
  metaDiaria = 20,
  onViewAchievements,
}) => {
  const isFirstTime = totalQuestoesRespondidas === 0 && questoesGeradasTotal === 0;
  const atrasadasCount = revisoes.filter((r) => r.atrasada).length;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Header directly from prototype */}
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] font-extrabold tracking-widest uppercase ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          PAINEL
        </span>

        {/* Quick CTA to generate PDF questions */}
        <button
          onClick={onOpenPdfGenerator}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isDarkMode
              ? 'bg-[#152336] text-[#38bdf8] hover:bg-[#1a2d45] border border-[#0284c7]/40'
              : 'bg-sky-50 text-[#0369a1] hover:bg-sky-100 border border-sky-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
          <span>Criar Simulado via PDF</span>
        </button>
      </div>

      {/* Main Grid: Left 2 columns (Hero + Stats + Difficult topics) & Right 1 column (Modalidades + Revisões) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Big Hero Card from prototype */}
          <div
            className={`rounded-3xl p-6 sm:p-8 transition-all relative overflow-hidden border ${
              isDarkMode
                ? 'bg-[#131924] border-[#1f293b] shadow-xl'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Top row: Welcome text + Questions answered badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {isFirstTime ? 'Bem-vindo ao EstudoVag,' : 'Bem-vindo de volta,'}
              </span>

              <span
                className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full border ${
                  isDarkMode
                    ? 'border-[#0284c7]/40 text-[#38bdf8] bg-[#0284c7]/10'
                    : 'border-sky-300 text-[#0369a1] bg-sky-50'
                }`}
              >
                {totalQuestoesRespondidas} questões respondidas
              </span>
            </div>

            {/* Headline matching screenshot */}
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isFirstTime
                ? 'Nenhum simulado realizado ainda.'
                : revisoes.length > 0
                ? `Você tem ${revisoes.length} ${revisoes.length === 1 ? 'revisão' : 'revisões'} para fazer.`
                : 'Seus estudos estão 100% em dia.'}
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xs sm:text-sm leading-relaxed mb-6 max-w-xl ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {isFirstTime
                ? 'Selecione uma das modalidades médicas ou gere questões inéditas a partir do seu material em PDF para começar.'
                : revisoes.length > 0
                ? `${atrasadasCount} revisão(ões) atrasada(s) — elas continuam pendentes até você responder.`
                : 'Nenhuma revisão pendente no momento. Parabéns pela dedicação aos estudos!'}
            </p>

            {/* Actions: Iniciar revisão (gradient blue-orange) & Ver desempenho */}
            <div className="flex flex-wrap items-center gap-3">
              {cachedQuiz && onResumeCachedQuiz ? (
                <button
                  type="button"
                  onClick={onResumeCachedQuiz}
                  className="px-6 py-2.5 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Continuar Simulado ({cachedQuiz.totalQuestoes} q.)</span>
                </button>
              ) : isFirstTime ? (
                <button
                  type="button"
                  onClick={onOpenPdfGenerator}
                  className="px-6 py-2.5 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Criar Primeiro Simulado</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartReview}
                  className="px-6 py-2.5 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar revisão</span>
                </button>
              )}

              <button
                type="button"
                onClick={onViewPerformance}
                className={`px-5 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1b2333] hover:bg-[#232d40] text-slate-200 border-[#28354c]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                Ver desempenho
              </button>
            </div>
          </div>

          {/* Widget: Meta Diária & Conquistas */}
          {dailyProgress && (
            <div
              className={`p-5 sm:p-6 rounded-3xl border transition-all relative overflow-hidden ${
                isDarkMode
                  ? 'bg-[#131924] border-[#1f293b] shadow-lg'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      dailyProgress.metaAlcancada
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#0284c7]/15 text-[#0284c7] dark:text-[#38bdf8] border border-[#0284c7]/30'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm sm:text-base font-black ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Meta Diária de Questões
                      </h3>
                      {dailyProgress.metaAlcancada && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Batida Hoje!</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      Incentivo à regularidade no internato e residência
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {dailyProgress.streakAtual > 0 && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{dailyProgress.streakAtual} {dailyProgress.streakAtual === 1 ? 'dia' : 'dias'} seguidos</span>
                    </div>
                  )}

                  {onViewAchievements && (
                    <button
                      type="button"
                      onClick={onViewAchievements}
                      className="text-xs font-extrabold text-[#0284c7] dark:text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Conquistas ({achievements.filter((a) => a.unlocked).length}/{achievements.length})</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar and counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">
                    Progresso de hoje:{' '}
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                      {dailyProgress.questoesRespondidas}
                    </strong>{' '}
                    de <strong>{metaDiaria}</strong> questões
                  </span>
                  <span className="font-black text-[#0284c7] dark:text-[#38bdf8]">
                    {metaDiaria > 0
                      ? Math.min(100, Math.round((dailyProgress.questoesRespondidas / metaDiaria) * 100))
                      : 0}
                    %
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dailyProgress.metaAlcancada
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
                        : 'bg-gradient-to-r from-[#0284c7] to-[#ea580c]'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        metaDiaria > 0 ? (dailyProgress.questoesRespondidas / metaDiaria) * 100 : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quick medal previews */}
              {achievements.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">Medalhas em destaque:</span>
                    <div className="flex items-center -space-x-1.5">
                      {achievements.slice(0, 4).map((ach) => (
                        <div
                          key={ach.id}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                            isDarkMode ? 'border-[#131924]' : 'border-white'
                          } ${
                            ach.unlocked
                              ? 'bg-gradient-to-tr from-amber-400 to-[#ea580c] text-white shadow-2xs'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-60'
                          }`}
                          title={`${ach.titulo} (${ach.unlocked ? 'Desbloqueada' : 'Bloqueada'})`}
                        >
                          <Award className="w-3.5 h-3.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {dailyProgress.questoesRespondidas < metaDiaria && (
                    <span className="text-[11px] font-semibold text-slate-400">
                      Faltam apenas{' '}
                      <strong className="text-[#0284c7] dark:text-[#38bdf8]">
                        {metaDiaria - dailyProgress.questoesRespondidas} questão(ões)
                      </strong>{' '}
                      para bater a meta de hoje
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4 Stat Cards Row directly from prototype */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* 1. Taxa de acerto */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#131924] border-[#1f293b]'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <span
                className={`text-[11px] font-semibold block mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Taxa de acerto
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {totalQuestoesRespondidas > 0 ? `${taxaAcertoGeral}%` : '0%'}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] block mt-1 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {totalQuestoesRespondidas > 0 ? 'das respondidas' : 'sem simulados ainda'}
              </span>
            </div>

            {/* 2. Revisões pendentes */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#131924] border-[#1f293b]'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <span
                className={`text-[11px] font-semibold block mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Revisões pendentes
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {revisoes.length}
              </div>
              {revisoes.length === 0 ? (
                <span className="text-[10px] sm:text-[11px] block mt-1 font-semibold text-emerald-500">
                  todas em dia
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] block mt-1 font-semibold text-rose-500">
                  {atrasadasCount} atrasada(s)
                </span>
              )}
            </div>

            {/* 3. Tempo médio / questão */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#131924] border-[#1f293b]'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <span
                className={`text-[11px] font-semibold block mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Tempo médio / questão
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {totalQuestoesRespondidas > 0 ? '49s' : '--'}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] block mt-1 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {totalQuestoesRespondidas > 0 ? 'por resposta' : 'sem respostas ainda'}
              </span>
            </div>

            {/* 4. Questões geradas */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#131924] border-[#1f293b]'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <span
                className={`text-[11px] font-semibold block mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Questões geradas
              </span>
              <div
                className={`text-2xl sm:text-3xl font-black text-[#0284c7]`}>
                {questoesGeradasTotal}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] block mt-1 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                pela IA
              </span>
            </div>
          </div>

          {/* Temas com maior dificuldade */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDarkMode
                ? 'bg-[#131924] border-[#1f293b]'
                : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-sm sm:text-base font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Temas com maior dificuldade
              </h2>
              <span
                className={`text-xs ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                menor acerto primeiro
              </span>
            </div>

            <div className="space-y-4">
              {temasDificuldade.length === 0 ? (
                <div
                  className={`py-8 px-4 text-center border border-dashed rounded-2xl ${
                    isDarkMode ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-5 h-5 text-[#0284c7]" />
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Nenhum tema mapeado ainda
                  </p>
                  <p
                    className={`text-[11px] mt-1 max-w-sm mx-auto ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Conforme você responder aos simulados, o preceptor identificará automaticamente as áreas com menor rendimento para fixação direcionada.
                  </p>
                </div>
              ) : (
                temasDificuldade.map((tema) => (
                  <div key={tema.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs gap-3">
                      <span
                        className={`font-semibold truncate ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-800'
                        }`}
                      >
                        {tema.titulo}
                      </span>
                      <span
                        className={`shrink-0 font-bold ${
                          tema.acertoPercent < 50 ? 'text-rose-500' : 'text-amber-500'
                        }`}
                      >
                        {tema.acertoPercent}% · {tema.questoesCount} questões
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-[#1b2434]' : 'bg-slate-100'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all ${
                          tema.acertoPercent < 50
                            ? 'bg-rose-500'
                            : tema.acertoPercent < 70
                            ? 'bg-[#ea580c]'
                            : 'bg-[#0284c7]'
                        }`}
                        style={{ width: `${tema.acertoPercent}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Modalidades Card from prototype */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDarkMode
                ? 'bg-[#131924] border-[#1f293b]'
                : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <h3
              className={`text-sm sm:text-base font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Modalidades
            </h3>

            {/* 2x2 Grid from prototype */}
            <div className="grid grid-cols-2 gap-3">
              {/* ENAMED */}
              <button
                type="button"
                onClick={() => onSelectModality('enamed')}
                className={`p-4 rounded-2xl text-left border transition-all group ${
                  isDarkMode
                    ? 'bg-[#142233] hover:bg-[#1a2d45] border-[#1e3b5c]'
                    : 'bg-sky-50/70 hover:bg-sky-50 border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`text-xs sm:text-sm font-black ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    ENAMED
                  </h4>
                  <GraduationCap
                    className={`w-4 h-4 ${
                      isDarkMode ? 'text-[#38bdf8]' : 'text-[#0284c7]'
                    }`}
                  />
                </div>
                <p
                  className={`text-[11px] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {modalidadesStats.enamed} respondidas
                </p>
              </button>

              {/* Revalida */}
              <button
                type="button"
                onClick={() => onSelectModality('revalida')}
                className={`p-4 rounded-2xl text-left border transition-all group ${
                  isDarkMode
                    ? 'bg-[#1e192c] hover:bg-[#261f38] border-[#362750]'
                    : 'bg-purple-50/50 hover:bg-purple-50 border-purple-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`text-xs sm:text-sm font-black ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Revalida
                  </h4>
                  <Stethoscope
                    className={`w-4 h-4 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  />
                </div>
                <p
                  className={`text-[11px] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {modalidadesStats.revalida} respondidas
                </p>
              </button>

              {/* Provas da Faculdade */}
              <button
                type="button"
                onClick={() => onSelectModality('faculdade')}
                className={`p-4 rounded-2xl text-left border transition-all group ${
                  isDarkMode
                    ? 'bg-[#151f2f] hover:bg-[#1a273b] border-[#1e324c]'
                    : 'bg-sky-50/50 hover:bg-sky-50 border-sky-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`text-xs sm:text-sm font-black ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Provas da Faculdade
                  </h4>
                  <BookOpen
                    className={`w-4 h-4 ${
                      isDarkMode ? 'text-sky-400' : 'text-sky-600'
                    }`}
                  />
                </div>
                <p
                  className={`text-[11px] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {modalidadesStats.faculdade} respondidas
                </p>
              </button>

              {/* PBL */}
              <button
                type="button"
                onClick={() => onSelectModality('pbl')}
                className={`p-4 rounded-2xl text-left border transition-all group ${
                  isDarkMode
                    ? 'bg-[#291720] hover:bg-[#341d29] border-[#4c2235]'
                    : 'bg-rose-50/50 hover:bg-rose-50 border-rose-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`text-xs sm:text-sm font-black ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    PBL
                  </h4>
                  <Puzzle
                    className={`w-4 h-4 ${
                      isDarkMode ? 'text-rose-400' : 'text-rose-600'
                    }`}
                  />
                </div>
                <p
                  className={`text-[11px] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {modalidadesStats.pbl} respondidas
                </p>
              </button>
            </div>
          </div>

          {/* Revisões Card from prototype */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDarkMode
                ? 'bg-[#131924] border-[#1f293b]'
                : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-sm sm:text-base font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Revisões
              </h3>
              <button
                type="button"
                onClick={onStartReview}
                className={`text-xs font-semibold hover:underline ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ver todas
              </button>
            </div>

            {/* List of Revisions */}
            <div className="space-y-3">
              {revisoes.length === 0 ? (
                <div
                  className={`py-8 px-4 text-center border border-dashed rounded-2xl ${
                    isDarkMode ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Tudo em dia!
                  </p>
                  <p
                    className={`text-[11px] mt-1 ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Nenhuma revisão pendente no momento. Suas revisões espaçadas serão agendadas após os simulados.
                  </p>
                </div>
              ) : (
                revisoes.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenReviewItem(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      isDarkMode
                        ? 'bg-[#18202e] hover:bg-[#1d2738] border-[#222e42]'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4
                        className={`text-xs sm:text-sm font-extrabold uppercase leading-snug group-hover:text-[#0284c7] transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.titulo}
                      </h4>

                      {item.atrasada && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isDarkMode
                              ? 'bg-[#3b1720] text-[#f43f5e] border border-[#f43f5e]/30'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          Atrasada
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-[11px] ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      agendada para {item.dataAgendada}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
