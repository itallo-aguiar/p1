import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  GraduationCap,
  Building2,
  Target,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  Flame,
  Brain,
  Shield,
  Clock,
  BarChart3,
  Sliders,
  RotateCcw,
  Save,
  LogOut,
  Edit3,
  IdCard,
} from 'lucide-react';
import { UserProfile, SimuladoResultado, ProgressoDiario, Conquista } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  historico: SimuladoResultado[];
  totalQuestoesRespondidas: number;
  taxaAcertoGeral: number;
  modelProvider: 'gemini' | 'chatgpt' | 'claude';
  onSelectModelProvider?: (provider: 'gemini' | 'chatgpt' | 'claude') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onClearHistory?: () => void;
  onLogout?: () => void;
  dailyProgress?: ProgressoDiario;
  achievements?: Conquista[];
  onViewAchievements?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  historico,
  totalQuestoesRespondidas,
  taxaAcertoGeral,
  modelProvider,
  onSelectModelProvider,
  isDarkMode,
  onToggleTheme,
  onClearHistory,
  onLogout,
  dailyProgress,
  achievements = [],
  onViewAchievements,
}) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'estatisticas' | 'preferencias'>('perfil');
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [confirmClearHistory, setConfirmClearHistory] = useState<boolean>(false);

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleClearHistoryClick = () => {
    if (confirmClearHistory) {
      onClearHistory?.();
      setConfirmClearHistory(false);
    } else {
      setConfirmClearHistory(true);
    }
  };

  const simuladosCompletos = historico.length;
  const acertosTotais = historico.reduce((acc, h) => acc + h.acertos, 0);
  const errosTotais = historico.reduce((acc, h) => acc + h.erros, 0);

  // Derive initial for avatar
  const avatarInitial = formData.nome.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all ${
          isDarkMode
            ? 'bg-[#0f1724] border-[#1e2a3c] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Banner with User Card */}
        <div className="relative p-6 bg-gradient-to-r from-[#0284c7]/20 via-[#0369a1]/10 to-[#ea580c]/15 border-b border-slate-200 dark:border-[#1e2a3c]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Fechar painel (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar Pill */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#ea580c] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-sky-600/30">
                {avatarInitial}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0f1724] flex items-center justify-center text-white text-[9px] font-bold" title="Status Online">
                ✓
              </span>
            </div>

            {/* Basic Info */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                  {formData.nome || 'Usuário'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#38bdf8]" />
                  {formData.plano || 'Assinante Pro'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {simuladosCompletos > 0 ? `${simuladosCompletos} simulados realizados` : 'Primeiro acesso'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{formData.email}</span>
                <span className="text-slate-600 dark:text-slate-500">•</span>
                <span className="text-slate-300 font-medium">{formData.faseMedica}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar in Banner */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-800/60">
            <div className="bg-white/60 dark:bg-[#131b28]/80 p-2.5 rounded-xl border border-slate-200/40 dark:border-[#1e2a3c]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                Questões Feitas
              </span>
              <span className="text-base sm:text-lg font-black text-[#0284c7] dark:text-[#38bdf8]">
                {totalQuestoesRespondidas}
              </span>
            </div>

            <div className="bg-white/60 dark:bg-[#131b28]/80 p-2.5 rounded-xl border border-slate-200/40 dark:border-[#1e2a3c]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                Aproveitamento
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-500 dark:text-emerald-400">
                {taxaAcertoGeral}%
              </span>
            </div>

            <div className="bg-white/60 dark:bg-[#131b28]/80 p-2.5 rounded-xl border border-slate-200/40 dark:border-[#1e2a3c]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                Simulados Salvos
              </span>
              <span className="text-base sm:text-lg font-black text-[#f97316]">
                {simuladosCompletos}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-slate-200 dark:border-[#1e2a3c] px-6 bg-slate-50/50 dark:bg-[#0b1019]">
          <button
            type="button"
            onClick={() => setActiveTab('perfil')}
            className={`py-3 px-4 font-extrabold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'perfil'
                ? 'border-[#0284c7] text-[#0284c7] dark:text-[#38bdf8]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Dados do Aluno</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('estatisticas')}
            className={`py-3 px-4 font-extrabold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'estatisticas'
                ? 'border-[#0284c7] text-[#0284c7] dark:text-[#38bdf8]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Estatísticas & Histórico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferencias')}
            className={`py-3 px-4 font-extrabold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'preferencias'
                ? 'border-[#0284c7] text-[#0284c7] dark:text-[#38bdf8]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferências & Conta</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* TAB 1: DADOS DO ALUNO / EDIT PROFILE */}
          {activeTab === 'perfil' && (
            <form onSubmit={handleSave} className="space-y-4">
              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Informações do usuário salvas com sucesso no navegador!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome Completo */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0284c7]" />
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    placeholder="Seu nome"
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#223046] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0284c7]"
                  />
                </div>

                {/* Email Cadastrado */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0284c7]" />
                    Endereço de E-mail:
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="seu.email@exemplo.com"
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#223046] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0284c7]"
                  />
                </div>

                {/* Fase / Etapa Médica */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ea580c]" />
                    Fase Médica / Ano:
                  </label>
                  <select
                    value={formData.faseMedica}
                    onChange={(e) => setFormData({ ...formData, faseMedica: e.target.value })}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#223046] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0284c7]"
                  >
                    <option value="Internato (6º Ano Médico)">Internato (6º Ano Médico)</option>
                    <option value="Internato (5º Ano Médico)">Internato (5º Ano Médico)</option>
                    <option value="Ciclo Clínico (3º/4º Ano)">Ciclo Clínico (3º/4º Ano)</option>
                    <option value="Ciclo Básico (1º/2º Ano)">Ciclo Básico (1º/2º Ano)</option>
                    <option value="Médico Generalista Formado">Médico Generalista Formado</option>
                    <option value="Médico Residente (R1 / R2 / R3)">Médico Residente (R1 / R2 / R3)</option>
                    <option value="Preparatório Revalida">Preparatório Revalida</option>
                  </select>
                </div>

                {/* Instituição / Hospital */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0284c7]" />
                    Faculdade / Hospital Escola:
                  </label>
                  <input
                    type="text"
                    value={formData.instituicao}
                    onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                    placeholder="Ex: Faculdade de Medicina / Hospital das Clínicas"
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#223046] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0284c7]"
                  />
                </div>

                {/* Foco Principal */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    Foco Principal de Estudos:
                  </label>
                  <select
                    value={formData.focoPrincipal}
                    onChange={(e) => setFormData({ ...formData, focoPrincipal: e.target.value })}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#223046] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0284c7]"
                  >
                    <option value="ENAMED (Exame Nacional da Medicina)">ENAMED (Exame Nacional da Medicina)</option>
                    <option value="Revalida INEP">Revalida INEP</option>
                    <option value="Provas de Residência Médica (SUS/USP/UNICAMP)">Provas de Residência Médica</option>
                    <option value="Provas de Faculdade e Internato">Provas de Faculdade e Internato</option>
                    <option value="Discussão de Casos PBL e Tutoria">Discussão de Casos PBL e Tutoria</option>
                  </select>
                </div>

                {/* CRM ou Matrícula */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-300 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-[#0284c7]" />
                    CRM ou Registro Acadêmico:
                  </label>
                  <input
                    type="text"
                    value={formData.crmOuMatricula}
                    onChange={(e) => setFormData({ ...formData, crmOuMatricula: e.target.value })}
                    placeholder="Ex: CRM-SP 214.908 ou RA-2022019"
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#223046] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0284c7]"
                  />
                </div>
              </div>

              {/* Meta Diária de Questões */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#f97316]" />
                    Meta Diária de Resolução de Questões:
                  </label>
                  <span className="text-xs font-black text-[#38bdf8]">
                    {formData.metaDiariaQuestoes} questões/dia
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={formData.metaDiariaQuestoes}
                  onChange={(e) => setFormData({ ...formData, metaDiariaQuestoes: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0284c7]"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    A meta diária alimenta sua sequência de consistência (dias seguidos) e desbloqueia medalhas de bronze, prata, ouro e diamante.
                  </span>
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#0284c7] to-[#ea580c] hover:opacity-95 shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados do Perfil</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ESTATÍSTICAS E HISTÓRICO */}
          {activeTab === 'estatisticas' && (
            <div className="space-y-4">
              {/* Daily Goal & Medals Summary Row */}
              <div className="p-4 rounded-2xl border bg-gradient-to-r from-[#0284c7]/10 via-[#ea580c]/10 to-transparent border-[#0284c7]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      Meta Diária: {userProfile.metaDiariaQuestoes} questões/dia
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Sequência atual: <strong className="text-amber-500">{dailyProgress?.streakAtual || 0} dias seguidos</strong> • Recorde: <strong>{dailyProgress?.maiorStreak || 0} dias</strong>
                    </p>
                  </div>
                </div>

                {onViewAchievements && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewAchievements();
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Ver Medalhas ({achievements.filter((a) => a.unlocked).length}/{achievements.length})</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#1e2a3c]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Acertos Acumulados
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">{acertosTotais}</span>
                    <span className="text-xs text-slate-400">questões certas</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#1e2a3c]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Erros para Revisão
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-rose-400">{errosTotais}</span>
                    <span className="text-xs text-slate-400">a reestudar</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#1e2a3c]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Taxa Geral
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#38bdf8]">{taxaAcertoGeral}%</span>
                    <span className="text-xs text-slate-400">média geral</span>
                  </div>
                </div>
              </div>

              {/* Historic list */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Histórico Recente de Simulados Realizados
                </h3>
                {historico.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed text-center border-slate-300 dark:border-slate-800 text-slate-400 text-xs">
                    Nenhum simulado finalizado ainda. Inicie um simulado para acumular métricas!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {historico.slice(0, 8).map((sim, index) => (
                      <div
                        key={sim.id || index}
                        className="p-3 rounded-xl border flex items-center justify-between bg-white dark:bg-[#131b28] border-slate-200 dark:border-[#1e2a3c]"
                      >
                        <div className="min-w-0 pr-3">
                          <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {sim.titulo}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {sim.data} • {sim.totalQuestoes} questões
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-black ${
                              sim.taxaAcerto >= 70
                                ? 'text-emerald-400'
                                : sim.taxaAcerto >= 50
                                ? 'text-orange-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {Math.round(sim.taxaAcerto)}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {sim.acertos}/{sim.totalQuestoes} acertos
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PREFERÊNCIAS & CONTA */}
          {activeTab === 'preferencias' && (
            <div className="space-y-4">
              {/* IA Provider */}
              <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#1e2a3c]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-[#0284c7]" />
                      Motor de Inteligência Artificial Padrão
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Modelo utilizado prioritariamente para gerar as questões e o tutor.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0284c7]/20 text-[#38bdf8]">
                    {modelProvider.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gemini', label: 'Gemini 3.8 Flash', sub: 'Google (Rápido)' },
                    { id: 'chatgpt', label: 'GPT-4o Medical', sub: 'OpenAI' },
                    { id: 'claude', label: 'Claude 3.5 Sonnet', sub: 'Anthropic' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectModelProvider?.(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        modelProvider === m.id
                          ? 'border-[#0284c7] bg-[#0284c7]/10 ring-1 ring-[#0284c7] text-[#38bdf8]'
                          : 'border-slate-200 dark:border-[#223046] text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="text-xs font-bold block truncate">{m.label}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tema da Aplicação */}
              <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-[#131c2a] border-slate-200 dark:border-[#1e2a3c] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Tema da Aplicação
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Atualmente em {isDarkMode ? 'Modo Escuro (Dark)' : 'Modo Claro (Light)'}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-[#23334a] bg-white dark:bg-[#1a2436] text-slate-700 dark:text-slate-200 hover:opacity-90 cursor-pointer"
                >
                  Alternar para {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </button>
              </div>

              {/* Limpar Histórico de Estudos */}
              <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-rose-400">
                    Limpar Histórico Local de Simulados
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Zera os simulados salvos localmente e as estatísticas acumuladas do navegador.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistoryClick}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                    confirmClearHistory
                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                      : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                  }`}
                >
                  {confirmClearHistory ? 'Confirmar Limpeza?' : 'Limpar Dados'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1e2a3c] bg-slate-50 dark:bg-[#0c121d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Encerrar Sessão</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-[#1a2333] hover:bg-slate-300 dark:hover:bg-[#222e42] text-slate-800 dark:text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
