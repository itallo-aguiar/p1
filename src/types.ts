export type Dificuldade = 'Fácil' | 'Médio' | 'Difícil' | 'Mista';
export type EstiloQuestao = 'ENAMED/Revalida/Residência' | 'Normal';
export type AppNavTab =
  | 'visao_geral'
  | 'enamed'
  | 'revalida'
  | 'faculdade'
  | 'pbl'
  | 'desempenho'
  | 'curva'
  | 'revisoes'
  | 'gerador'
  | 'simulado'
  | 'tutor'
  | 'conquistas'
  | 'grupos';

export interface GrupoMembro {
  id: string;
  nome: string;
  avatar: string;
  isCurrentUser?: boolean;
  instituicao: string;
  foco: string;
  questoesSemana: number;
  questoesTotal: number;
  acertosSemana: number;
  taxaAcertoSemana: number;
  pontosTotais: number;
  temasEstudados: string[];
  materiaisCompartilhados: {
    id: string;
    titulo: string;
    tema: string;
    data: string;
  }[];
  provaSemanalResultado?: {
    notaPercent: number;
    acertos: number;
    total: number;
    tempoSegundos: number;
    posicaoRank?: number;
    pontosGanhos?: number;
    realizadaEm: string;
  };
}

export interface ProvaSemanalConfig {
  id: string;
  semanaNumero: number;
  titulo: string;
  dataTermino: string;
  totalQuestoes: number; // 30
  temasIncluidos: string[];
  recompensas: {
    primeiroLugar: number; // 50
    segundoLugar: number; // 30
    terceiroLugar: number; // 15
    participacao: number; // 5
  };
  concluida: boolean;
  questoes?: Questao[];
}

export interface GrupoEstudo {
  id: string;
  nome: string;
  descricao: string;
  codigoConvite: string;
  criadoEm: string;
  membros: GrupoMembro[];
  provaSemanal: ProvaSemanalConfig;
}

export type MedalhaTipo = 'bronze' | 'prata' | 'ouro' | 'diamante' | 'especial';
export type ConquistaCategoria = 'diaria' | 'streak' | 'volume' | 'precisao';

export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  categoria: ConquistaCategoria;
  medalhaTipo: MedalhaTipo;
  icone: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressoAtual: number;
  progressoTotal: number;
  recompensa: string;
}

export interface HistoricoDiaMeta {
  data: string; // YYYY-MM-DD
  diaSemana: string;
  questoes: number;
  meta: number;
  atingida: boolean;
}

export interface ProgressoDiario {
  data: string; // YYYY-MM-DD
  questoesRespondidas: number;
  questoesAcertos: number;
  metaAlcancada: boolean;
  streakAtual: number;
  maiorStreak: number;
  totalDiasMetasCumpridas: number;
  historicoDias: Record<string, { questoes: number; acertos: number; meta: number; atingida: boolean }>;
}

export interface UserProfile {
  nome: string;
  email: string;
  faseMedica: string;
  instituicao: string;
  focoPrincipal: string;
  crmOuMatricula: string;
  membroDesde: string;
  plano: string;
  metaDiariaQuestoes: number;
}

export interface Alternativas {
  A: string;
  B: string;
  C: string;
  D: string;
  E?: string;
}

export interface Questao {
  id?: string;
  enunciado: string;
  alternativas: Alternativas;
  resposta_correta: 'A' | 'B' | 'C' | 'D' | 'E';
  justificativa: string;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect?: boolean;
}

export interface ConfiguracaoSimulado {
  quantidade: number;
  nivel: Dificuldade;
  estilo: EstiloQuestao;
  assunto: string;
  materialNome: string;
  modelProvider: 'gemini' | 'chatgpt' | 'claude';
}

export interface SimuladoResultado {
  id: string;
  titulo: string;
  data: string;
  configuracao: ConfiguracaoSimulado;
  questoes: Questao[];
  totalQuestoes: number;
  acertos: number;
  erros: number;
  taxaAcerto: number;
  tempoGastoSegundos: number;
}

export interface MensagemTutor {
  id: string;
  remetente: 'usuario' | 'tutor';
  conteudo: string;
  horario: string;
  questaoRef?: number;
  isError?: boolean;
  retryText?: string;
}

export interface DocumentoExemplo {
  id: string;
  titulo: string;
  especialidade: string;
  paginas: number;
  resumo: string;
  conteudoTexto: string;
}

export interface RevisaoItem {
  id: string;
  titulo: string;
  modalidade: 'PBL' | 'ENAMED' | 'Revalida' | 'Faculdade';
  dataAgendada: string;
  atrasada: boolean;
  totalQuestoes: number;
  respondidas: number;
  acertos: number;
}

export interface TemaDificuldade {
  id: string;
  titulo: string;
  acertoPercent: number;
  questoesCount: number;
}
