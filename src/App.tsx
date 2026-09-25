import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { GeneratorPanel } from './components/GeneratorPanel';
import { QuizView } from './components/QuizView';
import { QuizResults } from './components/QuizResults';
import { TutorChatDrawer } from './components/TutorChatDrawer';
import { LearningCurve } from './components/LearningCurve';
import { PdfExportModal } from './components/PdfExportModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LoginScreen } from './components/LoginScreen';
import { LandingPage } from './components/LandingPage';
import { AchievementsView } from './components/AchievementsView';
import { AchievementUnlockedToast } from './components/AchievementUnlockedToast';
import { StudyGroupsView } from './components/StudyGroupsView';
import { WeeklyExamResultModal } from './components/WeeklyExamResultModal';
import {
  Questao,
  ConfiguracaoSimulado,
  SimuladoResultado,
  AppNavTab,
  RevisaoItem,
  UserProfile,
  Conquista,
  ProgressoDiario,
  GrupoEstudo,
  GrupoMembro,
} from './types';
import { DOCUMENTOS_EXEMPLO } from './data/sampleDocs';
import { AlertCircle, Sparkles, X, CheckCircle2 } from 'lucide-react';
import {
  getCachedQuiz,
  saveQuizToCache,
  clearQuizCache,
  QuizCacheData,
} from './utils/quizCache';
import {
  getDailyProgress,
  getAchievements,
  recordQuestionAnswered,
  syncAchievements,
} from './utils/achievements';
import {
  getStudyGroups,
  saveStudyGroups,
  getActiveGroupId,
  setActiveGroupId,
  syncUserStatsInGroup,
  submitWeeklyExamResult,
  getFull30QuestionsExam,
} from './utils/studyGroups';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

const EMPTY_USER_PROFILE: UserProfile = {
  nome: '',
  email: '',
  faseMedica: '',
  instituicao: '',
  focoPrincipal: '',
  crmOuMatricula: '',
  membroDesde: '',
  plano: 'Plano Gratuito',
  metaDiariaQuestoes: 20,
};

type ProfileRow = {
  nome: string;
  email: string;
  fase_medica: string;
  instituicao: string;
  foco_principal: string;
  crm_ou_matricula: string;
  plano: string;
  meta_diaria_questoes: number;
  created_at: string;
};

const profileFromRow = (row: ProfileRow | null, fallbackEmail: string): UserProfile => {
  if (!row) return { ...EMPTY_USER_PROFILE, email: fallbackEmail };
  const membroDesde = new Date(row.created_at).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return {
    nome: row.nome,
    email: row.email || fallbackEmail,
    faseMedica: row.fase_medica,
    instituicao: row.instituicao,
    focoPrincipal: row.foco_principal,
    crmOuMatricula: row.crm_ou_matricula,
    membroDesde: membroDesde.charAt(0).toUpperCase() + membroDesde.slice(1),
    plano: row.plano,
    metaDiariaQuestoes: row.meta_diaria_questoes,
  };
};

function MainAppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);
  const isAuthenticated = !!session;
  const [authScreen, setAuthScreen] = useState<'landing' | 'login'>('landing');
  const [currentTab, setCurrentTab] = useState<AppNavTab>('visao_geral');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [modelProvider, setModelProvider] = useState<'gemini' | 'chatgpt' | 'claude'>('gemini');

  // Initial read of active cached quiz
  const initialCache = getCachedQuiz();

  // Active Quiz State - starts clean as first-time entry
  const [questoes, setQuestoes] = useState<Questao[]>(() => initialCache?.questoes || []);
  const [activeConfig, setActiveConfig] = useState<ConfiguracaoSimulado>(() => {
    if (initialCache?.activeConfig) {
      return initialCache.activeConfig;
    }
    return {
      quantidade: 5,
      nivel: 'Médio',
      estilo: 'ENAMED/Revalida/Residência',
      assunto: '',
      materialNome: '',
      modelProvider: 'gemini',
    };
  });
  const [activeMaterialText, setActiveMaterialText] = useState<string>(
    () => initialCache?.activeMaterialText || ''
  );
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(
    () => initialCache?.isQuizCompleted || false
  );
  const [currentResult, setCurrentResult] = useState<SimuladoResultado | null>(
    () => initialCache?.currentResult || null
  );

  const [isLoadingGeneration, setIsLoadingGeneration] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  // History / Learning Curve Persistence
  const [historico, setHistorico] = useState<SimuladoResultado[]>(() => {
    try {
      const saved = localStorage.getItem('estudovag_historico');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Ensure clean first-time state by resetting any legacy mock caches
  useEffect(() => {
    try {
      const hasReset = localStorage.getItem('estudovag_zeroed_v1');
      if (!hasReset) {
        localStorage.removeItem('estudovag_active_quiz_cache_v1');
        localStorage.removeItem('estudovag_historico');
        localStorage.setItem('estudovag_zeroed_v1', 'true');
        setQuestoes([]);
        setHistorico([]);
        setIsQuizCompleted(false);
        setCurrentResult(null);
        setActiveMaterialText('');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Tutor Chat Bridge
  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState<number>(0);
  const [tutorInitialMessage, setTutorInitialMessage] = useState<string>('');

  // PDF Export Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // User Profile & Account Settings
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_USER_PROFILE);

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);

  // Daily Goal & Achievements System (persisted in localStorage)
  const [dailyProgress, setDailyProgress] = useState<ProgressoDiario>(() =>
    getDailyProgress(userProfile.metaDiariaQuestoes || 20)
  );
  const [achievements, setAchievements] = useState<Conquista[]>(() =>
    getAchievements()
  );
  const [latestUnlockedAchievement, setLatestUnlockedAchievement] = useState<Conquista | null>(null);
  const [justReachedGoalToast, setJustReachedGoalToast] = useState<boolean>(false);

  // Study Groups with Friends & Weekly Exam System (persisted in localStorage)
  const [studyGroups, setStudyGroups] = useState<GrupoEstudo[]>(() =>
    getStudyGroups(userProfile)
  );
  const [activeGroupId, setActiveGroupIdState] = useState<string>(() =>
    getActiveGroupId()
  );
  const [isWeeklyExamActive, setIsWeeklyExamActive] = useState<boolean>(false);
  const [weeklyExamModalData, setWeeklyExamModalData] = useState<{
    isOpen: boolean;
    position: number;
    pointsAwarded: number;
    notaPercent: number;
    acertos: number;
    total: number;
  } | null>(null);

  const activeGroup =
    studyGroups.find((g) => g.id === activeGroupId) || studyGroups[0] || null;

  const handleSelectGroup = (id: string) => {
    setActiveGroupIdState(id);
    setActiveGroupId(id);
  };

  // Sync study groups to localStorage
  useEffect(() => {
    saveStudyGroups(studyGroups);
  }, [studyGroups]);

  // Subscribe to Supabase auth state (login, logout, e-mail confirmation, password recovery)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      setSession(data?.session ?? null);
      setIsAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event: string, newSession: Session | null) => {
      setSession(newSession);
      setIsAuthLoading(false);
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      if (newSession && window.location.pathname.startsWith('/auth/')) {
        window.history.replaceState({}, '', '/');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Load the profile that belongs to the signed-in user
  const sessionUserId = session?.user.id;
  const sessionUserEmail = session?.user.email;
  useEffect(() => {
    if (!sessionUserId) {
      setUserProfile(EMPTY_USER_PROFILE);
      return;
    }
    let cancelled = false;
    supabase
      .from('profiles')
      .select(
        'nome, email, fase_medica, instituicao, foco_principal, crm_ou_matricula, plano, meta_diaria_questoes, created_at'
      )
      .eq('id', sessionUserId)
      .maybeSingle()
      .then(({ data, error }: any) => {
        if (cancelled) return;
        if (error) {
          console.error('Erro ao carregar perfil:', error.message);
          return;
        }
        setUserProfile(profileFromRow(data, sessionUserEmail || ''));
      });
    return () => {
      cancelled = true;
    };
  }, [sessionUserId, sessionUserEmail]);

  const handleUpdateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    if (!sessionUserId) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        nome: updated.nome,
        fase_medica: updated.faseMedica,
        instituicao: updated.instituicao,
        foco_principal: updated.focoPrincipal,
        crm_ou_matricula: updated.crmOuMatricula,
        meta_diaria_questoes: Math.min(500, Math.max(1, Math.round(updated.metaDiariaQuestoes || 20))),
      })
      .eq('id', sessionUserId);
    if (error) {
      console.error('Erro ao salvar perfil:', error.message);
      setErrorBanner('Não foi possível salvar seu perfil. Tente novamente.');
    }
  };

  const handleClearHistory = () => {
    setHistorico([]);
    try {
      localStorage.removeItem('estudovag_historico');
    } catch (e) {
      console.error('Erro ao resetar histórico:', e);
    }
  };

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('estudovag_historico', JSON.stringify(historico));
    } catch (e) {
      console.error('Falha ao salvar histórico no localStorage:', e);
    }
  }, [historico]);

  // Automatically sync active quiz questions and user selections to cache
  useEffect(() => {
    if (questoes.length > 0) {
      saveQuizToCache({
        questoes,
        activeConfig,
        activeMaterialText,
        isQuizCompleted,
        currentResult,
      });
    }
  }, [questoes, activeConfig, activeMaterialText, isQuizCompleted, currentResult]);

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Deseja excluir este simulado e seus dados do histórico?')) {
      setHistorico((prev) => prev.filter((s) => s.id !== sessionId));
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('estudovag_session');
    } catch (e) {
      console.error(e);
    }
    await supabase.auth.signOut();
    setSession(null);
    setAuthScreen('landing');
  };

  // Discard cached quiz
  const handleDiscardCachedQuiz = () => {
    if (confirm('Deseja descartar as questões salvas no cache e iniciar do zero?')) {
      clearQuizCache();
      setQuestoes([]);
      setIsQuizCompleted(false);
      setCurrentResult(null);
      setCacheNotice('Cache de questões descartado com sucesso.');
      setTimeout(() => setCacheNotice(null), 3000);
    }
  };

  // Restore/go to cached quiz
  const handleRestoreCachedQuiz = () => {
    setCurrentTab('simulado');
  };

  // Aggregate stats for dashboard
  const totalQuestoesRespondidas = historico.reduce((acc, s) => acc + s.totalQuestoes, 0);
  const totalAcertos = historico.reduce((acc, s) => acc + s.acertos, 0);
  const taxaAcertoGeral = totalQuestoesRespondidas > 0
    ? Math.round((totalAcertos / totalQuestoesRespondidas) * 100)
    : 0;
  const questoesGeradasTotal = totalQuestoesRespondidas + questoes.length;

  const modalidadesStats = {
    enamed: historico.filter((h) => h.configuracao?.estilo?.includes('ENAMED')).reduce((acc, s) => acc + s.totalQuestoes, 0),
    revalida: historico.filter((h) => h.configuracao?.estilo?.includes('Revalida')).reduce((acc, s) => acc + s.totalQuestoes, 0),
    faculdade: historico.filter((h) => h.configuracao?.estilo?.includes('Normal') || h.configuracao?.estilo?.includes('Faculdade')).reduce((acc, s) => acc + s.totalQuestoes, 0),
    pbl: historico.filter((h) => h.configuracao?.estilo?.includes('PBL')).reduce((acc, s) => acc + s.totalQuestoes, 0),
  };

  // Synchronize daily progress and achievements with user settings and history
  useEffect(() => {
    const meta = userProfile.metaDiariaQuestoes || 20;
    const { dailyProgress: syncedProgress, achievements: syncedAchievements } =
      syncAchievements(meta, totalQuestoesRespondidas, historico);
    setDailyProgress(syncedProgress);
    setAchievements(syncedAchievements);
  }, [userProfile.metaDiariaQuestoes, totalQuestoesRespondidas, historico.length]);

  // Synchronize user's stats in active study group
  useEffect(() => {
    if (activeGroup) {
      setStudyGroups((prev) =>
        prev.map((grp) => {
          if (grp.id === activeGroup.id) {
            return syncUserStatsInGroup(
              grp,
              userProfile,
              totalQuestoesRespondidas,
              taxaAcertoGeral
            );
          }
          return grp;
        })
      );
    }
  }, [totalQuestoesRespondidas, taxaAcertoGeral, userProfile.nome]);

  // Start Weekly Exam with 30 Questions
  const handleStartWeeklyExam = () => {
    const weeklyQuestions = getFull30QuestionsExam();
    setActiveConfig({
      quantidade: 30,
      nivel: 'Médio',
      estilo: 'ENAMED/Revalida/Residência',
      assunto: activeGroup ? activeGroup.provaSemanal.titulo : 'Prova Geral Semanal (30 Questões)',
      materialNome: activeGroup ? activeGroup.provaSemanal.titulo : 'Prova Geral Semanal (30 Questões)',
      modelProvider,
    });
    setQuestoes(weeklyQuestions);
    setIsWeeklyExamActive(true);
    setIsQuizCompleted(false);
    setCurrentResult(null);
    setCurrentTab('simulado');
  };

  const handleCreateGroup = (name: string, description: string) => {
    const newGroup: GrupoEstudo = {
      id: `grp-${Date.now()}`,
      nome: name,
      descricao: description,
      codigoConvite: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      membros: [
        {
          id: 'usr-current',
          nome: userProfile.nome || 'Aluno',
          avatar: (userProfile.nome || 'A').charAt(0).toUpperCase(),
          isCurrentUser: true,
          instituicao: userProfile.instituicao || 'Faculdade de Medicina',
          foco: userProfile.focoPrincipal || 'Residência Médica',
          questoesSemana: dailyProgress.questoesRespondidas,
          questoesTotal: totalQuestoesRespondidas,
          acertosSemana: dailyProgress.questoesAcertos,
          taxaAcertoSemana: taxaAcertoGeral,
          pontosTotais: 100,
          temasEstudados: ['Clínica Médica Geral', 'Diretrizes SUS'],
          materiaisCompartilhados: [],
        },
      ],
      provaSemanal: {
        id: `prov-${Date.now()}`,
        semanaNumero: 1,
        titulo: `Prova Geral Integrativa Semanal - ${name}`,
        dataTermino: 'Domingo às 23:59',
        totalQuestoes: 30,
        temasIncluidos: [
          'Clínica Médica Geral',
          'Pediatria e Neonatologia',
          'Cirurgia e Trauma',
          'Ginecologia e Obstetrícia',
        ],
        recompensas: {
          primeiroLugar: 50,
          segundoLugar: 30,
          terceiroLugar: 15,
          participacao: 5,
        },
        concluida: false,
      },
    };

    setStudyGroups((prev) => [newGroup, ...prev]);
    setActiveGroupIdState(newGroup.id);
    setActiveGroupId(newGroup.id);
  };

  const handleAddMember = (memberData: {
    nome: string;
    instituicao: string;
    foco: string;
    temas: string[];
  }) => {
    if (!activeGroup) return;
    const newMember: GrupoMembro = {
      id: `usr-${Date.now()}`,
      nome: memberData.nome,
      avatar: memberData.nome.charAt(0).toUpperCase(),
      instituicao: memberData.instituicao,
      foco: memberData.foco,
      questoesSemana: Math.floor(Math.random() * 20) + 15,
      questoesTotal: Math.floor(Math.random() * 100) + 50,
      acertosSemana: Math.floor(Math.random() * 15) + 10,
      taxaAcertoSemana: Math.floor(Math.random() * 25) + 70,
      pontosTotais: Math.floor(Math.random() * 200) + 150,
      temasEstudados: memberData.temas,
      materiaisCompartilhados: [],
    };

    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === activeGroup.id) {
          return {
            ...g,
            membros: [...g.membros, newMember],
            provaSemanal: {
              ...g.provaSemanal,
              temasIncluidos: Array.from(
                new Set([...g.provaSemanal.temasIncluidos, ...memberData.temas])
              ),
            },
          };
        }
        return g;
      })
    );
  };

  const handleAddMaterial = (material: { titulo: string; tema: string }) => {
    if (!activeGroup) return;
    const newMat = {
      id: `mat-${Date.now()}`,
      titulo: material.titulo,
      tema: material.tema,
      data: new Date().toLocaleDateString('pt-BR'),
    };

    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === activeGroup.id) {
          const updatedMembros = g.membros.map((m) => {
            if (m.isCurrentUser) {
              return {
                ...m,
                temasEstudados: Array.from(
                  new Set([...m.temasEstudados, `${material.tema}: ${material.titulo}`])
                ),
                materiaisCompartilhados: [newMat, ...m.materiaisCompartilhados],
              };
            }
            return m;
          });
          return {
            ...g,
            membros: updatedMembros,
            provaSemanal: {
              ...g.provaSemanal,
              temasIncluidos: Array.from(
                new Set([...g.provaSemanal.temasIncluidos, `${material.tema}: ${material.titulo}`])
              ),
            },
          };
        }
        return g;
      })
    );
  };

  // Generate Questions handler
  const handleGenerateQuestions = async (
    config: ConfiguracaoSimulado,
    pdfBase64?: string,
    pdfText?: string
  ) => {
    setIsLoadingGeneration(true);
    setErrorBanner(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          pdfText,
          materialNome: config.materialNome,
          quantidade: config.quantidade,
          nivel: config.nivel,
          estilo: config.estilo,
          modelProvider,
        }),
      });

      let data: any;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error('Falha na comunicação com o servidor (resposta não é JSON). Por favor, tente novamente.');
      }

      if (!data.success) {
        throw new Error(data.error || 'Falha ao gerar questões médicas.');
      }

      if (!Array.isArray(data.questoes) || data.questoes.length === 0) {
        throw new Error('O modelo não retornou questões no formato esperado.');
      }

      if (data.isContingency && data.contingencyNotice) {
        setErrorBanner(data.contingencyNotice);
      }

      const parsedQuestoes: Questao[] = data.questoes.map((q: any, i: number) => ({
        id: `q-${Date.now()}-${i}`,
        enunciado: q.enunciado || '',
        alternativas: q.alternativas || { A: '', B: '', C: '', D: '' },
        resposta_correta: (q.resposta_correta || 'A').toUpperCase() as any,
        justificativa: q.justificativa || '',
      }));

      setQuestoes(parsedQuestoes);
      setActiveConfig(config);
      if (pdfText) {
        setActiveMaterialText(pdfText);
      }
      setIsQuizCompleted(false);
      setCurrentResult(null);
      setCurrentTab('simulado');
    } catch (err: any) {
      console.error('Erro na requisição:', err);
      const isOverload =
        (err?.message || '').includes('503') ||
        (err?.message || '').includes('alta demanda') ||
        (err?.message || '').includes('high demand') ||
        (err?.message || '').includes('UNAVAILABLE') ||
        (err?.message || '').includes('quota') ||
        (err?.message || '').includes('429');

      const message = isOverload
        ? 'O preceptor médico está com alta demanda momentânea no provedor de IA (Status 503/429). Por favor, aguarde alguns instantes e tente novamente.'
        : err.message || 'Erro ao gerar questões. Verifique o material e tente novamente.';

      setErrorBanner(message);
    } finally {
      setIsLoadingGeneration(false);
    }
  };

  // Answer question & track daily goal / achievements
  const handleUpdateQuestion = (index: number, answer: 'A' | 'B' | 'C' | 'D') => {
    let wasUnanswered = false;
    let isCorrectAnswer = false;

    setQuestoes((prev) => {
      const updated = [...prev];
      const q = updated[index];
      if (q) {
        if (!q.selectedAnswer) {
          wasUnanswered = true;
        }
        isCorrectAnswer = answer === q.resposta_correta;
        updated[index] = {
          ...q,
          selectedAnswer: answer,
          isCorrect: isCorrectAnswer,
        };
      }
      return updated;
    });

    if (wasUnanswered) {
      const totalAllTime = totalQuestoesRespondidas + 1;
      const res = recordQuestionAnswered({
        isCorrect: isCorrectAnswer,
        metaDiaria: userProfile.metaDiariaQuestoes || 20,
        totalQuestoesAllTime: totalAllTime,
      });

      setDailyProgress(res.dailyProgress);
      setAchievements(res.achievements);

      if (res.newlyUnlocked.length > 0) {
        setLatestUnlockedAchievement(res.newlyUnlocked[0]);
      } else if (res.justReachedDailyGoal) {
        setJustReachedGoalToast(true);
      }
    }
  };

  // Finish Quiz and Record Learning Stats
  const handleFinishQuiz = () => {
    const total = questoes.length;
    const acertos = questoes.filter((q) => q.isCorrect).length;
    const erros = total - acertos;
    const taxaAcerto = total > 0 ? (acertos / total) * 100 : 0;

    const novoResultado: SimuladoResultado = {
      id: `sim-${Date.now()}`,
      titulo: activeConfig.materialNome,
      data: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      configuracao: activeConfig,
      questoes,
      totalQuestoes: total,
      acertos,
      erros,
      taxaAcerto,
      tempoGastoSegundos: 120,
    };

    setCurrentResult(novoResultado);
    setHistorico((prev) => [novoResultado, ...prev]);
    setIsQuizCompleted(true);

    // Check perfect quiz achievement
    const isPerfect = total >= 3 && acertos === total;
    if (isPerfect) {
      const res = recordQuestionAnswered({
        isCorrect: true,
        metaDiaria: userProfile.metaDiariaQuestoes || 20,
        totalQuestoesAllTime: totalQuestoesRespondidas + total,
        isPerfectSimulado: true,
      });
      setAchievements(res.achievements);
      if (res.newlyUnlocked.length > 0) {
        setLatestUnlockedAchievement(res.newlyUnlocked[0]);
      }
    }

    // Check if this was the Weekly 30-Question Group Exam: award points and show podium
    if (isWeeklyExamActive && activeGroup) {
      const examRes = submitWeeklyExamResult(activeGroup, acertos, total, 120);
      setStudyGroups((prev) =>
        prev.map((g) => (g.id === activeGroup.id ? examRes.group : g))
      );
      setWeeklyExamModalData({
        isOpen: true,
        position: examRes.position,
        pointsAwarded: examRes.pointsAwarded,
        notaPercent: examRes.notaPercent,
        acertos: examRes.acertos,
        total: examRes.total,
      });
      setIsWeeklyExamActive(false);
    }
  };

  // Triggered when user wants explanation on a specific question
  const handleOpenTutorForQuestion = (questaoIndex: number, markedLetter: string) => {
    setFocusedQuestionIndex(questaoIndex);
    const qNum = questaoIndex + 1;
    const prompt = `Errei a questão ${qNum}, marquei a letra ${markedLetter}. Me explique por que está errado e qual diretriz médica embasa a conduta correta.`;
    setTutorInitialMessage(prompt);
    setCurrentTab('tutor');
  };

  // Reset current quiz
  const handleResetQuiz = () => {
    setQuestoes((prev) =>
      prev.map((q) => ({
        ...q,
        selectedAnswer: undefined,
        isCorrect: undefined,
      }))
    );
    setIsQuizCompleted(false);
  };

  // Retry only errors
  const handleRetryErrorsOnly = () => {
    const errorQuestions = questoes.filter((q) => !q.isCorrect);
    if (errorQuestions.length > 0) {
      setQuestoes(
        errorQuestions.map((q) => ({
          ...q,
          selectedAnswer: undefined,
          isCorrect: undefined,
        }))
      );
      setIsQuizCompleted(false);
      setCurrentTab('simulado');
    }
  };

  // Switch to review past session
  const handleSelectSessionToReview = (session: SimuladoResultado) => {
    setCurrentResult(session);
    setQuestoes(session.questoes);
    setActiveConfig(session.configuracao);
    setIsQuizCompleted(true);
    setCurrentTab('simulado');
  };

  // Quick start a predefined review or clinical case from dashboard
  const handleStartQuickReview = (item?: RevisaoItem) => {
    const sampleDoc = DOCUMENTOS_EXEMPLO[0];
    const initialConfig: ConfiguracaoSimulado = {
      quantidade: 5,
      nivel: 'Médio',
      estilo: 'ENAMED/Revalida/Residência',
      assunto: item ? item.titulo : sampleDoc.titulo,
      materialNome: item ? item.titulo : sampleDoc.titulo,
      modelProvider: 'gemini',
    };
    handleGenerateQuestions(initialConfig, undefined, sampleDoc.conteudoTexto);
  };

  // If user is not authenticated, render LandingPage (presentation) or LoginScreen
  if (isAuthLoading) {
    return (
      <div
        className={`min-h-screen w-full flex items-center justify-center ${
          isDarkMode ? 'bg-[#0a0e17]' : 'bg-slate-100'
        }`}
        role="status"
      >
        <span className="w-8 h-8 border-2 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  if (isPasswordRecovery && isAuthenticated) {
    return (
      <LoginScreen
        initialMode="update-password"
        onPasswordUpdated={() => setIsPasswordRecovery(false)}
        isDarkMode={isDarkMode}
      />
    );
  }

  const handleQuickStartGuest = async () => {
    try {
      setIsAuthLoading(true);
      await supabase.auth.signInWithPassword({
        email: 'medico.demo@estudovag.com',
        password: 'demo',
      });
    } catch (e) {
      console.error('Falha ao iniciar modo demonstração:', e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (!isAuthenticated) {
    if (authScreen === 'login') {
      return (
        <LoginScreen
          onBackToLanding={() => setAuthScreen('landing')}
          isDarkMode={isDarkMode}
        />
      );
    }

    return (
      <LandingPage
        onGoToLogin={() => setAuthScreen('login')}
        onQuickStartGuest={handleQuickStartGuest}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0d121c] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sidebar Navigation matching user prototype */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingReviewsCount={0}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeQuestionsCount={questoes.length}
        userProfile={userProfile}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        dailyStreak={dailyProgress.streakAtual}
        unlockedAchievementsCount={achievements.filter((a) => a.unlocked).length}
        hasWeeklyExam={!activeGroup?.provaSemanal.concluida}
        activeGroup={activeGroup || undefined}
        onStartWeeklyExam={handleStartWeeklyExam}
      />

      {/* Main Content Area with dynamic margin when sidebar is fixed on desktop */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isDarkMode={isDarkMode}
          activeQuestionsCount={questoes.length}
          hasCachedQuiz={questoes.length > 0}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onGoToSimulado={() => setCurrentTab('simulado')}
          onBack={() => setCurrentTab('visao_geral')}
          userProfile={userProfile}
          onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
          dailyProgress={dailyProgress}
          onGoToAchievements={() => setCurrentTab('conquistas')}
        />

        {/* Global Cache Notice */}
        {cacheNotice && (
          <div
            className={`mx-4 sm:mx-6 mt-4 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm border transition-all ${
              isDarkMode
                ? 'bg-sky-950/60 border-sky-500/40 text-sky-200'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{cacheNotice}</span>
            </div>
            <button
              onClick={() => setCacheNotice(null)}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {errorBanner && (
          <div
            className={`mx-4 sm:mx-6 mt-4 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm border transition-all ${
              isDarkMode
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic Body Content based on Navigation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentTab === 'visao_geral' && (
            <DashboardOverview
              isDarkMode={isDarkMode}
              onStartReview={() => handleStartQuickReview()}
              onViewPerformance={() => setCurrentTab('desempenho')}
              onSelectModality={(modality) => setCurrentTab(modality)}
              onOpenPdfGenerator={() => setCurrentTab('gerador')}
              onOpenReviewItem={(item) => handleStartQuickReview(item)}
              totalQuestoesRespondidas={totalQuestoesRespondidas}
              taxaAcertoGeral={taxaAcertoGeral}
              questoesGeradasTotal={questoesGeradasTotal}
              revisoes={[]}
              temasDificuldade={[]}
              modalidadesStats={modalidadesStats}
              dailyProgress={dailyProgress}
              achievements={achievements}
              metaDiaria={userProfile.metaDiariaQuestoes || 20}
              onViewAchievements={() => setCurrentTab('conquistas')}
              cachedQuiz={
                questoes.length > 0
                  ? {
                      totalQuestoes: questoes.length,
                      materialNome: activeConfig.materialNome,
                      isCompleted: isQuizCompleted,
                    }
                  : null
              }
              onResumeCachedQuiz={handleRestoreCachedQuiz}
            />
          )}

          {['gerador', 'enamed', 'revalida', 'faculdade', 'pbl'].includes(currentTab) && (
            <GeneratorPanel
              onGenerate={handleGenerateQuestions}
              isLoading={isLoadingGeneration}
              modelProvider={modelProvider}
              onSelectModelProvider={setModelProvider}
              isDarkMode={isDarkMode}
              cachedQuizInfo={
                questoes.length > 0
                  ? {
                      totalQuestoes: questoes.length,
                      materialNome: activeConfig.materialNome,
                      isCompleted: isQuizCompleted,
                    }
                  : null
              }
              onRestoreCachedQuiz={handleRestoreCachedQuiz}
              onDiscardCachedQuiz={handleDiscardCachedQuiz}
              modalityTitle={
                currentTab === 'revalida'
                  ? 'Revalida'
                  : currentTab === 'faculdade'
                  ? 'Faculdade'
                  : currentTab === 'pbl'
                  ? 'PBL'
                  : 'ENAMED'
              }
              defaultEstilo={
                currentTab === 'faculdade' ? 'Normal' : 'ENAMED/Revalida/Residência'
              }
            />
          )}

          {currentTab === 'simulado' && (
            <div>
              {questoes.length === 0 ? (
                <div
                  className={`max-w-2xl mx-auto my-12 p-8 text-center rounded-3xl border ${
                    isDarkMode
                      ? 'bg-[#131924] border-[#1f293b] text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                  }`}
                >
                  <Sparkles className="w-12 h-12 text-[#0284c7] mx-auto mb-3" />
                  <h2
                    className={`text-lg font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Nenhum simulado ativo no momento
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mb-6">
                    Selecione um PDF ou diretriz de estudo no Gerador para criar seu bloco de questões personalizado.
                  </p>
                  <button
                    onClick={() => setCurrentTab('gerador')}
                    className="px-6 py-2.5 rounded-full font-black text-xs sm:text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                  >
                    Ir para o Gerador de Questões
                  </button>
                </div>
              ) : isQuizCompleted && currentResult ? (
                <QuizResults
                  resultado={currentResult}
                  onRetryErrorsOnly={handleRetryErrorsOnly}
                  onNewQuiz={() => setCurrentTab('gerador')}
                  onOpenPdfModal={() => setIsPdfModalOpen(true)}
                  onGoToLearningCurve={() => setCurrentTab('desempenho')}
                  onOpenTutorForQuestion={handleOpenTutorForQuestion}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <QuizView
                  questoes={questoes}
                  config={activeConfig}
                  onUpdateQuestion={handleUpdateQuestion}
                  onFinishQuiz={handleFinishQuiz}
                  onOpenTutorForQuestion={handleOpenTutorForQuestion}
                  onResetQuiz={handleResetQuiz}
                  isDarkMode={isDarkMode}
                  dailyProgress={dailyProgress}
                  metaDiaria={userProfile.metaDiariaQuestoes || 20}
                />
              )}
            </div>
          )}

          {(currentTab === 'desempenho' || currentTab === 'curva') && (
            <LearningCurve
              historico={historico}
              onSelectSessionToReview={handleSelectSessionToReview}
              onNewQuiz={() => setCurrentTab('gerador')}
              onDeleteSession={handleDeleteSession}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'conquistas' && (
            <AchievementsView
              isDarkMode={isDarkMode}
              dailyProgress={dailyProgress}
              achievements={achievements}
              metaDiaria={userProfile.metaDiariaQuestoes || 20}
              onGoToStudy={() =>
                setCurrentTab(questoes.length > 0 && !isQuizCompleted ? 'simulado' : 'gerador')
              }
              onOpenProfileToEditGoal={() => setIsUserProfileModalOpen(true)}
            />
          )}

          {currentTab === 'grupos' && activeGroup && (
            <StudyGroupsView
              isDarkMode={isDarkMode}
              group={activeGroup}
              allGroups={studyGroups}
              onSelectGroup={handleSelectGroup}
              onCreateGroup={handleCreateGroup}
              onAddMember={handleAddMember}
              onAddMaterial={handleAddMaterial}
              onStartWeeklyExam={handleStartWeeklyExam}
              userProfile={userProfile}
            />
          )}

          {currentTab === 'revisoes' && (
            <DashboardOverview
              isDarkMode={isDarkMode}
              onStartReview={() => handleStartQuickReview()}
              onViewPerformance={() => setCurrentTab('desempenho')}
              onSelectModality={() => setCurrentTab('gerador')}
              onOpenPdfGenerator={() => setCurrentTab('gerador')}
              onOpenReviewItem={(item) => handleStartQuickReview(item)}
              totalQuestoesRespondidas={totalQuestoesRespondidas}
              taxaAcertoGeral={taxaAcertoGeral}
              questoesGeradasTotal={questoesGeradasTotal}
              revisoes={[]}
              temasDificuldade={[]}
              modalidadesStats={modalidadesStats}
              dailyProgress={dailyProgress}
              achievements={achievements}
              metaDiaria={userProfile.metaDiariaQuestoes || 20}
              onViewAchievements={() => setCurrentTab('conquistas')}
              cachedQuiz={
                questoes.length > 0
                  ? {
                      totalQuestoes: questoes.length,
                      materialNome: activeConfig.materialNome,
                      isCompleted: isQuizCompleted,
                    }
                  : null
              }
              onResumeCachedQuiz={handleRestoreCachedQuiz}
            />
          )}

          {currentTab === 'tutor' && (
            <TutorChatDrawer
              currentQuestion={questoes[focusedQuestionIndex]}
              currentQuestionIndex={focusedQuestionIndex}
              materialName={activeConfig.materialNome}
              materialText={activeMaterialText}
              initialMessage={tutorInitialMessage}
              onClearInitialMessage={() => setTutorInitialMessage('')}
              onBack={() => setCurrentTab('visao_geral')}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
      </div>

      {/* Printable Sheet & Official PDF Export Modal */}
      <PdfExportModal
        questoes={questoes.length > 0 ? questoes : DOCUMENTOS_EXEMPLO[0] ? [] : []}
        config={activeConfig}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Functional User Profile Panel & Account Settings Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        historico={historico}
        totalQuestoesRespondidas={totalQuestoesRespondidas}
        taxaAcertoGeral={taxaAcertoGeral}
        modelProvider={modelProvider}
        onSelectModelProvider={(p) => setModelProvider(p)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onClearHistory={handleClearHistory}
        onLogout={handleLogout}
        dailyProgress={dailyProgress}
        achievements={achievements}
        onViewAchievements={() => {
          setIsUserProfileModalOpen(false);
          setCurrentTab('conquistas');
        }}
      />

      {/* Achievement Unlocked Toast Notification */}
      <AchievementUnlockedToast
        achievement={latestUnlockedAchievement}
        dailyGoalReached={justReachedGoalToast}
        onClose={() => {
          setLatestUnlockedAchievement(null);
          setJustReachedGoalToast(false);
        }}
        onViewAchievements={() => setCurrentTab('conquistas')}
        isDarkMode={isDarkMode}
      />

      {/* Weekly Exam Celebration & Podium Modal */}
      {weeklyExamModalData && activeGroup && (
        <WeeklyExamResultModal
          isOpen={weeklyExamModalData.isOpen}
          onClose={() => setWeeklyExamModalData(null)}
          position={weeklyExamModalData.position}
          pointsAwarded={weeklyExamModalData.pointsAwarded}
          notaPercent={weeklyExamModalData.notaPercent}
          acertos={weeklyExamModalData.acertos}
          total={weeklyExamModalData.total}
          group={activeGroup}
          onGoToRanking={() => {
            setWeeklyExamModalData(null);
            setCurrentTab('grupos');
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
