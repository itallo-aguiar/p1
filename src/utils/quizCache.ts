import { Questao, ConfiguracaoSimulado, SimuladoResultado } from '../types';

export interface QuizCacheData {
  questoes: Questao[];
  activeConfig: ConfiguracaoSimulado;
  activeMaterialText?: string;
  isQuizCompleted: boolean;
  currentResult: SimuladoResultado | null;
  savedAt: number;
}

const CACHE_KEY = 'estudovag_active_quiz_cache_v1';
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const getCachedQuiz = (): QuizCacheData | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed: QuizCacheData = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.questoes) || parsed.questoes.length === 0) {
      return null;
    }

    // Check expiration
    if (parsed.savedAt && Date.now() - parsed.savedAt > CACHE_EXPIRATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn('Erro ao ler cache de questões:', err);
    return null;
  }
};

export const saveQuizToCache = (data: {
  questoes: Questao[];
  activeConfig: ConfiguracaoSimulado;
  activeMaterialText?: string;
  isQuizCompleted: boolean;
  currentResult: SimuladoResultado | null;
}): void => {
  try {
    if (!data.questoes || data.questoes.length === 0) {
      localStorage.removeItem(CACHE_KEY);
      return;
    }

    const payload: QuizCacheData = {
      ...data,
      savedAt: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Erro ao salvar questões em cache local:', err);
  }
};

export const clearQuizCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (err) {
    console.warn('Erro ao limpar cache:', err);
  }
};
