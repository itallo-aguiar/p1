import { Conquista, ProgressoDiario, SimuladoResultado } from '../types';

const PROGRESS_KEY = 'estudovag_daily_progress_v1';
const ACHIEVEMENTS_KEY = 'estudovag_achievements_v1';

export const INITIAL_CONQUISTAS: Conquista[] = [
  {
    id: 'primeiro_passo',
    titulo: 'Primeiro Passo do Dia',
    descricao: 'Responda à sua 1ª questão de hoje para dar início aos estudos.',
    categoria: 'diaria',
    medalhaTipo: 'bronze',
    icone: 'Zap',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 1,
    recompensa: '+10 XP',
  },
  {
    id: 'meta_diaria',
    titulo: 'Meta Diária Cumprida!',
    descricao: 'Atinja 100% da sua meta diária de questões configurada no perfil.',
    categoria: 'diaria',
    medalhaTipo: 'ouro',
    icone: 'Target',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 1,
    recompensa: '+50 XP',
  },
  {
    id: 'supermeta',
    titulo: 'Superação Diária (150%)',
    descricao: 'Resolva 150% ou mais da sua meta diária em um único dia.',
    categoria: 'diaria',
    medalhaTipo: 'diamante',
    icone: 'Sparkles',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 1,
    recompensa: '+100 XP',
  },
  {
    id: 'precisao_diaria',
    titulo: 'Precisão Cirúrgica',
    descricao: 'Bata a meta diária mantendo pelo menos 80% de aproveitamento.',
    categoria: 'precisao',
    medalhaTipo: 'ouro',
    icone: 'Brain',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 1,
    recompensa: '+75 XP',
  },
  {
    id: 'streak_3',
    titulo: 'Chama da Constância',
    descricao: 'Cumpra sua meta diária por 3 dias consecutivos.',
    categoria: 'streak',
    medalhaTipo: 'bronze',
    icone: 'Flame',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 3,
    recompensa: 'Emblema Chama',
  },
  {
    id: 'streak_7',
    titulo: 'Hábito de Ferro (7 Dias)',
    descricao: 'Mantenha a meta diária batida por 7 dias seguidos (1 semana invicta).',
    categoria: 'streak',
    medalhaTipo: 'prata',
    icone: 'ShieldCheck',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 7,
    recompensa: 'Medalha de Prata',
  },
  {
    id: 'streak_14',
    titulo: 'Mestre da Disciplina',
    descricao: 'Bata a meta diária por 14 dias consecutivos de dedicação médica.',
    categoria: 'streak',
    medalhaTipo: 'ouro',
    icone: 'Award',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 14,
    recompensa: 'Medalha de Ouro',
  },
  {
    id: 'streak_30',
    titulo: 'Lenda da Residência',
    descricao: '30 dias consecutivos batendo a meta diária de questões.',
    categoria: 'streak',
    medalhaTipo: 'diamante',
    icone: 'Crown',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 30,
    recompensa: 'Coroa de Diamante',
  },
  {
    id: 'gabarito_perfeito',
    titulo: 'Gabarito Perfeito',
    descricao: 'Finalize qualquer bloco de simulado com 100% de taxa de acerto.',
    categoria: 'precisao',
    medalhaTipo: 'ouro',
    icone: 'CheckCircle2',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 1,
    recompensa: '+100 XP',
  },
  {
    id: 'centuriao',
    titulo: 'Centurião dos Estudos',
    descricao: 'Acumule 100 questões resolvidas na plataforma.',
    categoria: 'volume',
    medalhaTipo: 'prata',
    icone: 'Medal',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 100,
    recompensa: 'Título Centurião',
  },
  {
    id: 'especialista_250',
    titulo: 'Especialista Residente',
    descricao: 'Acumule 250 questões resolvidas na plataforma.',
    categoria: 'volume',
    medalhaTipo: 'diamante',
    icone: 'GraduationCap',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 250,
    recompensa: 'Distintivo Clínico',
  },
  {
    id: 'madrugador',
    titulo: 'Plantão da Madrugada',
    descricao: 'Resolva ao menos uma questão de estudo antes das 09:00 da manhã.',
    categoria: 'diaria',
    medalhaTipo: 'bronze',
    icone: 'Sun',
    unlocked: false,
    progressoAtual: 0,
    progressoTotal: 1,
    recompensa: '+25 XP',
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayOfWeekLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()] || '';
}

export function getLast7Days(dailyProgress: ProgressoDiario, metaDiaria: number) {
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const diaSemana = getDayOfWeekLabel(dateStr);

    if (dateStr === dailyProgress.data) {
      result.push({
        data: dateStr,
        diaSemana,
        questoes: dailyProgress.questoesRespondidas,
        meta: metaDiaria,
        atingida: dailyProgress.metaAlcancada,
      });
    } else {
      const past = dailyProgress.historicoDias[dateStr];
      result.push({
        data: dateStr,
        diaSemana,
        questoes: past?.questoes || 0,
        meta: past?.meta || metaDiaria,
        atingida: past?.atingida || false,
      });
    }
  }

  return result;
}

export function getDailyProgress(metaDiaria = 20): ProgressoDiario {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let progress: ProgressoDiario = {
    data: today,
    questoesRespondidas: 0,
    questoesAcertos: 0,
    metaAlcancada: false,
    streakAtual: 0,
    maiorStreak: 0,
    totalDiasMetasCumpridas: 0,
    historicoDias: {},
  };

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        progress = {
          ...progress,
          ...parsed,
          historicoDias: parsed.historicoDias || {},
        };
      }
    }
  } catch (err) {
    console.warn('Erro ao ler progresso diário:', err);
  }

  // Handle day rollover
  if (progress.data !== today) {
    const wasYesterday = progress.data === yesterday;
    const completedYesterday = progress.metaAlcancada;

    // Archive previous day's record
    if (progress.data) {
      progress.historicoDias[progress.data] = {
        questoes: progress.questoesRespondidas,
        acertos: progress.questoesAcertos,
        meta: metaDiaria,
        atingida: progress.metaAlcancada,
      };
    }

    // Streak logic:
    // If previous recorded day was yesterday and goal was met, streak stays preserved
    // If user skipped a day or didn't complete yesterday, streak resets to 0
    let newStreak = progress.streakAtual;
    if (!wasYesterday || !completedYesterday) {
      newStreak = 0;
    }

    progress = {
      ...progress,
      data: today,
      questoesRespondidas: 0,
      questoesAcertos: 0,
      metaAlcancada: false,
      streakAtual: newStreak,
    };

    saveDailyProgress(progress);
  }

  return progress;
}

export function saveDailyProgress(progress: ProgressoDiario): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Erro ao salvar progresso diário no localStorage:', err);
  }
}

export function getAchievements(): Conquista[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Conquista[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with initial list in case new medals were added
        const map = new Map<string, Conquista>();
        INITIAL_CONQUISTAS.forEach((item) => map.set(item.id, { ...item }));
        parsed.forEach((item) => {
          if (map.has(item.id)) {
            map.set(item.id, { ...map.get(item.id)!, ...item });
          } else {
            map.set(item.id, item);
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (err) {
    console.warn('Erro ao ler conquistas do localStorage:', err);
  }

  return INITIAL_CONQUISTAS.map((c) => ({ ...c }));
}

export function saveAchievements(achievements: Conquista[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (err) {
    console.warn('Erro ao salvar conquistas no localStorage:', err);
  }
}

export interface RecordQuestionOptions {
  isCorrect: boolean;
  metaDiaria: number;
  totalQuestoesAllTime: number;
  isPerfectSimulado?: boolean;
}

export interface RecordQuestionResult {
  dailyProgress: ProgressoDiario;
  achievements: Conquista[];
  newlyUnlocked: Conquista[];
  justReachedDailyGoal: boolean;
}

export function recordQuestionAnswered({
  isCorrect,
  metaDiaria,
  totalQuestoesAllTime,
  isPerfectSimulado = false,
}: RecordQuestionOptions): RecordQuestionResult {
  const progress = getDailyProgress(metaDiaria);
  const currentAchievements = getAchievements();

  // Increment today's stats
  progress.questoesRespondidas += 1;
  if (isCorrect) {
    progress.questoesAcertos += 1;
  }

  let justReachedDailyGoal = false;

  // Check daily goal reach
  if (progress.questoesRespondidas >= metaDiaria && !progress.metaAlcancada) {
    progress.metaAlcancada = true;
    progress.streakAtual += 1;
    progress.maiorStreak = Math.max(progress.maiorStreak, progress.streakAtual);
    progress.totalDiasMetasCumpridas += 1;
    justReachedDailyGoal = true;
  }

  // Update today in historical map
  progress.historicoDias[progress.data] = {
    questoes: progress.questoesRespondidas,
    acertos: progress.questoesAcertos,
    meta: metaDiaria,
    atingida: progress.metaAlcancada,
  };

  saveDailyProgress(progress);

  // Check achievements progress and unlocks
  const nowHour = new Date().getHours();
  const supermetaTarget = Math.ceil(metaDiaria * 1.5);
  const accuracyPercent =
    progress.questoesRespondidas > 0
      ? Math.round((progress.questoesAcertos / progress.questoesRespondidas) * 100)
      : 0;

  const newlyUnlocked: Conquista[] = [];
  const updatedAchievements = currentAchievements.map((item) => {
    const updated = { ...item };
    let shouldUnlock = false;

    switch (item.id) {
      case 'primeiro_passo':
        updated.progressoAtual = Math.min(1, progress.questoesRespondidas);
        if (progress.questoesRespondidas >= 1) shouldUnlock = true;
        break;

      case 'meta_diaria':
        updated.progressoAtual = Math.min(metaDiaria, progress.questoesRespondidas);
        updated.progressoTotal = metaDiaria;
        if (progress.questoesRespondidas >= metaDiaria) shouldUnlock = true;
        break;

      case 'supermeta':
        updated.progressoAtual = Math.min(supermetaTarget, progress.questoesRespondidas);
        updated.progressoTotal = supermetaTarget;
        if (progress.questoesRespondidas >= supermetaTarget) shouldUnlock = true;
        break;

      case 'precisao_diaria':
        updated.progressoAtual = accuracyPercent;
        updated.progressoTotal = 80;
        if (progress.questoesRespondidas >= metaDiaria && accuracyPercent >= 80) {
          shouldUnlock = true;
        }
        break;

      case 'streak_3':
        updated.progressoAtual = Math.min(3, progress.streakAtual);
        if (progress.streakAtual >= 3) shouldUnlock = true;
        break;

      case 'streak_7':
        updated.progressoAtual = Math.min(7, progress.streakAtual);
        if (progress.streakAtual >= 7) shouldUnlock = true;
        break;

      case 'streak_14':
        updated.progressoAtual = Math.min(14, progress.streakAtual);
        if (progress.streakAtual >= 14) shouldUnlock = true;
        break;

      case 'streak_30':
        updated.progressoAtual = Math.min(30, progress.streakAtual);
        if (progress.streakAtual >= 30) shouldUnlock = true;
        break;

      case 'gabarito_perfeito':
        if (isPerfectSimulado) {
          updated.progressoAtual = 1;
          shouldUnlock = true;
        }
        break;

      case 'centuriao':
        updated.progressoAtual = Math.min(100, totalQuestoesAllTime);
        if (totalQuestoesAllTime >= 100) shouldUnlock = true;
        break;

      case 'especialista_250':
        updated.progressoAtual = Math.min(250, totalQuestoesAllTime);
        if (totalQuestoesAllTime >= 250) shouldUnlock = true;
        break;

      case 'madrugador':
        if (nowHour < 9) {
          updated.progressoAtual = 1;
          shouldUnlock = true;
        }
        break;

      default:
        break;
    }

    if (shouldUnlock && !updated.unlocked) {
      updated.unlocked = true;
      updated.unlockedAt = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      newlyUnlocked.push(updated);
    }

    return updated;
  });

  saveAchievements(updatedAchievements);

  return {
    dailyProgress: progress,
    achievements: updatedAchievements,
    newlyUnlocked,
    justReachedDailyGoal,
  };
}

export function syncAchievements(
  metaDiaria: number,
  totalQuestoesAllTime: number,
  historico: SimuladoResultado[]
): { dailyProgress: ProgressoDiario; achievements: Conquista[] } {
  const progress = getDailyProgress(metaDiaria);
  const currentAchievements = getAchievements();

  const supermetaTarget = Math.ceil(metaDiaria * 1.5);
  const accuracyPercent =
    progress.questoesRespondidas > 0
      ? Math.round((progress.questoesAcertos / progress.questoesRespondidas) * 100)
      : 0;

  const hasPerfectSimulado = historico.some(
    (h) => h.totalQuestoes >= 3 && h.acertos === h.totalQuestoes
  );

  const updatedAchievements = currentAchievements.map((item) => {
    const updated = { ...item };
    let shouldUnlock = updated.unlocked;

    switch (item.id) {
      case 'primeiro_passo':
        updated.progressoAtual = Math.min(1, progress.questoesRespondidas);
        if (progress.questoesRespondidas >= 1) shouldUnlock = true;
        break;

      case 'meta_diaria':
        updated.progressoAtual = Math.min(metaDiaria, progress.questoesRespondidas);
        updated.progressoTotal = metaDiaria;
        if (progress.questoesRespondidas >= metaDiaria) shouldUnlock = true;
        break;

      case 'supermeta':
        updated.progressoAtual = Math.min(supermetaTarget, progress.questoesRespondidas);
        updated.progressoTotal = supermetaTarget;
        if (progress.questoesRespondidas >= supermetaTarget) shouldUnlock = true;
        break;

      case 'precisao_diaria':
        updated.progressoAtual = accuracyPercent;
        updated.progressoTotal = 80;
        if (progress.questoesRespondidas >= metaDiaria && accuracyPercent >= 80) {
          shouldUnlock = true;
        }
        break;

      case 'streak_3':
        updated.progressoAtual = Math.min(3, progress.streakAtual);
        if (progress.streakAtual >= 3) shouldUnlock = true;
        break;

      case 'streak_7':
        updated.progressoAtual = Math.min(7, progress.streakAtual);
        if (progress.streakAtual >= 7) shouldUnlock = true;
        break;

      case 'streak_14':
        updated.progressoAtual = Math.min(14, progress.streakAtual);
        if (progress.streakAtual >= 14) shouldUnlock = true;
        break;

      case 'streak_30':
        updated.progressoAtual = Math.min(30, progress.streakAtual);
        if (progress.streakAtual >= 30) shouldUnlock = true;
        break;

      case 'gabarito_perfeito':
        if (hasPerfectSimulado) {
          updated.progressoAtual = 1;
          shouldUnlock = true;
        }
        break;

      case 'centuriao':
        updated.progressoAtual = Math.min(100, totalQuestoesAllTime);
        if (totalQuestoesAllTime >= 100) shouldUnlock = true;
        break;

      case 'especialista_250':
        updated.progressoAtual = Math.min(250, totalQuestoesAllTime);
        if (totalQuestoesAllTime >= 250) shouldUnlock = true;
        break;

      default:
        break;
    }

    if (shouldUnlock && !updated.unlocked) {
      updated.unlocked = true;
      updated.unlockedAt = updated.unlockedAt || new Date().toLocaleDateString('pt-BR');
    }

    return updated;
  });

  saveAchievements(updatedAchievements);
  return { dailyProgress: progress, achievements: updatedAchievements };
}

export function resetAchievementsDebug(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch (e) {
    console.error(e);
  }
}
