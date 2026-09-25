import React, { useState } from 'react';
import {
  Users,
  Trophy,
  Flame,
  Award,
  Crown,
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Target,
  BarChart3,
  Search,
  GraduationCap,
  Shield,
  X,
} from 'lucide-react';
import { GrupoEstudo, GrupoMembro, UserProfile } from '../types';

interface StudyGroupsViewProps {
  isDarkMode: boolean;
  group: GrupoEstudo;
  allGroups: GrupoEstudo[];
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: (name: string, description: string) => void;
  onAddMember: (memberData: { nome: string; instituicao: string; foco: string; temas: string[] }) => void;
  onAddMaterial: (material: { titulo: string; tema: string }) => void;
  onStartWeeklyExam: () => void;
  userProfile: UserProfile;
}

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  isDarkMode,
  group,
  allGroups,
  onSelectGroup,
  onCreateGroup,
  onAddMember,
  onAddMaterial,
  onStartWeeklyExam,
  userProfile,
}) => {
  const [rankingFilter, setRankingFilter] = useState<'desempenho' | 'questoes' | 'pontos'>('pontos');
  const [isCopiedCode, setIsCopiedCode] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState<boolean>(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupDesc, setNewGroupDesc] = useState<string>('');

  // New Friend Form State
  const [friendName, setFriendName] = useState<string>('');
  const [friendInstitution, setFriendInstitution] = useState<string>('');
  const [friendFoco, setFriendFoco] = useState<string>('');
  const [friendTemas, setFriendTemas] = useState<string>('');

  // New Material Form State
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [materialTema, setMaterialTema] = useState<string>('');

  const currentUser = group.membros.find((m) => m.isCurrentUser);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.codigoConvite);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2500);
  };

  // Sort members based on selected filter
  const sortedMembers = [...group.membros].sort((a, b) => {
    if (rankingFilter === 'desempenho') {
      return b.taxaAcertoSemana - a.taxaAcertoSemana;
    }
    if (rankingFilter === 'questoes') {
      return b.questoesSemana - a.questoesSemana;
    }
    return b.pontosTotais - a.pontosTotais;
  });

  const currentUserPosition = sortedMembers.findIndex((m) => m.isCurrentUser) + 1;

  const top3 = sortedMembers.slice(0, 3);

  // Handle submit create group
  const handleSubmitCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateGroup(newGroupName.trim(), newGroupDesc.trim());
    setNewGroupName('');
    setNewGroupDesc('');
    setIsCreateModalOpen(false);
  };

  // Handle submit add friend
  const handleSubmitAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    const temasArray = friendTemas
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    onAddMember({
      nome: friendName.trim(),
      instituicao: friendInstitution.trim() || 'Faculdade de Medicina',
      foco: friendFoco.trim() || 'Residência Médica',
      temas: temasArray.length > 0 ? temasArray : ['Clínica Médica Geral'],
    });
    setFriendName('');
    setFriendInstitution('');
    setFriendFoco('');
    setFriendTemas('');
    setIsAddFriendModalOpen(false);
  };

  // Handle submit add material
  const handleSubmitAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;
    onAddMaterial({
      titulo: materialTitle.trim(),
      tema: materialTema.trim() || 'Medicina Geral',
    });
    setMaterialTitle('');
    setMaterialTema('');
    setIsAddMaterialModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Top Header & Group Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span
            className={`text-[11px] font-extrabold tracking-widest uppercase block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            COMUNIDADE DE ESTUDOS & COMPETIÇÃO
          </span>
          <div className="flex items-center gap-3 mt-0.5">
            <h1
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {group.nome}
            </h1>
            {allGroups.length > 1 && (
              <select
                value={group.id}
                onChange={(e) => onSelectGroup(e.target.value)}
                className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                  isDarkMode
                    ? 'bg-[#152336] border-[#0284c7]/40 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {allGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome}
                  </option>
                ))}
              </select>
            )}
          </div>
          <p
            className={`text-xs mt-1 max-w-2xl ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {group.descricao}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Invite Code Button */}
          <button
            type="button"
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isCopiedCode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : isDarkMode
                ? 'bg-[#152336] hover:bg-[#1c2e47] border-[#0284c7]/40 text-[#38bdf8]'
                : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-[#0369a1]'
            }`}
            title="Copiar código de convite para enviar a um amigo"
          >
            {isCopiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Código: {group.codigoConvite}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddFriendModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDarkMode
                ? 'bg-[#121a28] hover:bg-[#1a2538] border-[#223048] text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Adicionar Amigo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-sm shadow-sky-600/30 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Novo Grupo</span>
          </button>
        </div>
      </div>

      {/* Hero Banner: Prova Geral Semanal com 30 Questões & Regras de Pontos */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border transition-all relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#121c2d] via-[#101724] to-[#161f30] border-[#1e2e46] shadow-xl'
            : 'bg-gradient-to-br from-white via-sky-50/50 to-orange-50/30 border-slate-200 shadow-sm'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Details & Rules */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-[#ea580c] text-white shadow-xs flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>PROVA GERAL SEMANAL (30 QUESTÕES)</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Prazo: {group.provaSemanal.dataTermino}
              </span>
            </div>

            <div>
              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {group.provaSemanal.titulo}
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                A prova semanal unifica os materiais e diretrizes médicas que todos os membros do grupo estão
                estudando nesta semana (Clínica, Pediatria, Cirurgia, GO e Preventiva).
              </p>
            </div>

            {/* Reward Badges specified by User */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="px-3 py-1.5 rounded-xl border bg-yellow-500/10 border-yellow-500/30 text-yellow-500 dark:text-yellow-400 flex items-center gap-1.5 text-xs font-black">
                <span>🥇 1º Lugar:</span>
                <span className="text-sm font-black">+50 PONTOS</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl border bg-slate-300/15 border-slate-400/30 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs font-black">
                <span>🥈 2º Lugar:</span>
                <span className="text-sm font-black">+30 PONTOS</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl border bg-amber-700/15 border-amber-600/30 text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-xs font-black">
                <span>🥉 3º Lugar:</span>
                <span className="text-sm font-black">+15 PONTOS</span>
              </div>

              <div className="text-[11px] text-slate-400 font-bold px-2 py-1">
                +5 pts por participação
              </div>
            </div>

            {/* Integrated Themes preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">
                Conteúdos dos Membros Integrados na Prova:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.provaSemanal.temasIncluidos.map((t, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                      isDarkMode
                        ? 'bg-[#152132] border-[#22354f] text-[#38bdf8]'
                        : 'bg-white border-sky-200 text-[#0284c7]'
                    }`}
                  >
                    • {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: User Exam Status & CTA */}
          <div
            className={`lg:col-span-4 p-5 rounded-2xl border text-center space-y-3 ${
              isDarkMode ? 'bg-[#0e141f] border-[#1d273a]' : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            {currentUser?.provaSemanalResultado ? (
              <div className="space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4
                  className={`text-sm font-black ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Você já realizou esta prova!
                </h4>
                <div className="text-2xl font-black text-emerald-400">
                  {currentUser.provaSemanalResultado.notaPercent}%
                  <span className="text-xs text-slate-400 block font-normal">
                    {currentUser.provaSemanalResultado.acertos} de {currentUser.provaSemanalResultado.total} acertos
                  </span>
                </div>
                <div className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 py-1 px-2.5 rounded-lg">
                  {currentUser.provaSemanalResultado.posicaoRank
                    ? `${currentUser.provaSemanalResultado.posicaoRank}º Lugar na Prova • +${currentUser.provaSemanalResultado.pontosGanhos} pts`
                    : 'Classificação em apuração'}
                </div>
                <button
                  type="button"
                  onClick={onStartWeeklyExam}
                  className="w-full py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Refazer como Treino
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/15 border border-[#0284c7]/30 text-[#0284c7] dark:text-[#38bdf8] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4
                    className={`text-sm font-black ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Sua vez de pontuar!
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    30 questões de múltipla escolha com gabarito e justificativas médicas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onStartWeeklyExam}
                  className="w-full py-3 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 text-white transition-all transform active:scale-95 shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Prova Geral (30 q.)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Podium for Top 3 Members */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-[#131924] border-[#1f293b]' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={`text-base font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Pódio do Grupo & Ranking da Semana
              </h3>
              <p className="text-xs text-slate-400">
                Sua posição atual: <strong className="text-amber-500">{currentUserPosition}º Lugar</strong> de {group.membros.length} membros
              </p>
            </div>
          </div>

          {/* Dual Ranking Filter requested by User */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-[#0c121c]">
            <button
              type="button"
              onClick={() => setRankingFilter('pontos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rankingFilter === 'pontos'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pontuação Geral
            </button>

            <button
              type="button"
              onClick={() => setRankingFilter('desempenho')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rankingFilter === 'desempenho'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Melhor Desempenho (%)
            </button>

            <button
              type="button"
              onClick={() => setRankingFilter('questoes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                rankingFilter === 'questoes'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mais Questões
            </button>
          </div>
        </div>

        {/* Visual 3-Pedestal Podium */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 pb-6 items-end max-w-xl mx-auto text-center">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-black text-slate-400 mb-1">2º LUGAR</span>
              <div className="relative mb-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {top3[1].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-white text-[11px] font-black flex items-center justify-center border-2 border-white dark:border-[#131924]">
                  🥈
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black truncate max-w-full">
                {top3[1].isCurrentUser ? 'Você' : top3[1].nome.split(' ')[0]}
              </h4>
              <span className="text-[11px] font-extrabold text-amber-500">
                {rankingFilter === 'desempenho'
                  ? `${top3[1].taxaAcertoSemana}% acerto`
                  : rankingFilter === 'questoes'
                  ? `${top3[1].questoesSemana} questões`
                  : `${top3[1].pontosTotais} pts`}
              </span>
              <div className="w-full h-18 sm:h-22 rounded-t-2xl bg-slate-200/80 dark:bg-slate-800/80 mt-2 border-t-2 border-slate-300 dark:border-slate-600" />
            </div>
          )}

          {/* 1st Place (Center, Tallest) */}
          {top3[0] && (
            <div className="flex flex-col items-center">
              <Crown className="w-6 h-6 text-yellow-400 mb-1 animate-bounce" />
              <div className="relative mb-2">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-500/25">
                  {top3[0].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 text-white text-xs font-black flex items-center justify-center border-2 border-white dark:border-[#131924] shadow-xs">
                  🥇
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black truncate max-w-full">
                {top3[0].isCurrentUser ? 'Você' : top3[0].nome.split(' ')[0]}
              </h4>
              <span className="text-xs font-black text-amber-500">
                {rankingFilter === 'desempenho'
                  ? `${top3[0].taxaAcertoSemana}% acerto`
                  : rankingFilter === 'questoes'
                  ? `${top3[0].questoesSemana} questões`
                  : `${top3[0].pontosTotais} pts`}
              </span>
              <div className="w-full h-26 sm:h-32 rounded-t-2xl bg-gradient-to-t from-amber-500/20 to-yellow-500/40 dark:from-amber-950/40 dark:to-yellow-500/20 mt-2 border-t-4 border-yellow-400" />
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 mb-1">3º LUGAR</span>
              <div className="relative mb-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {top3[2].avatar}
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-[11px] font-black flex items-center justify-center border-2 border-white dark:border-[#131924]">
                  🥉
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black truncate max-w-full">
                {top3[2].isCurrentUser ? 'Você' : top3[2].nome.split(' ')[0]}
              </h4>
              <span className="text-[11px] font-extrabold text-amber-500">
                {rankingFilter === 'desempenho'
                  ? `${top3[2].taxaAcertoSemana}% acerto`
                  : rankingFilter === 'questoes'
                  ? `${top3[2].questoesSemana} questões`
                  : `${top3[2].pontosTotais} pts`}
              </span>
              <div className="w-full h-14 sm:h-16 rounded-t-2xl bg-amber-900/10 dark:bg-amber-950/30 mt-2 border-t-2 border-amber-700/50" />
            </div>
          )}
        </div>

        {/* Detailed Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b text-[10px] font-black uppercase tracking-wider ${
                  isDarkMode
                    ? 'border-slate-800 text-slate-400'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                <th className="py-3 px-3">Posição</th>
                <th className="py-3 px-3">Membro do Grupo</th>
                <th className="py-3 px-3">Foco & Instituição</th>
                <th className="py-3 px-3 text-center">Questões (Semana)</th>
                <th className="py-3 px-3 text-center">Aproveitamento (%)</th>
                <th className="py-3 px-3 text-center">Prova Semanal</th>
                <th className="py-3 px-3 text-right">Pontuação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {sortedMembers.map((membro, index) => {
                const pos = index + 1;
                return (
                  <tr
                    key={membro.id}
                    className={`transition-colors ${
                      membro.isCurrentUser
                        ? isDarkMode
                          ? 'bg-[#152336]/60 font-semibold'
                          : 'bg-sky-50/80 font-semibold'
                        : isDarkMode
                        ? 'hover:bg-slate-800/30'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-xs ${
                          pos === 1
                            ? 'bg-yellow-400 text-yellow-900 shadow-2xs'
                            : pos === 2
                            ? 'bg-slate-300 text-slate-800'
                            : pos === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {pos}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#ea580c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {membro.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-black truncate ${
                                isDarkMode ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {membro.nome}
                            </span>
                            {membro.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded-md bg-[#0284c7]/20 text-[#38bdf8] text-[9px] font-extrabold border border-[#0284c7]/40">
                                Você
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      <span className="block text-slate-300 dark:text-slate-300 font-semibold truncate max-w-xs">
                        {membro.foco}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {membro.instituicao}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {membro.questoesSemana}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {membro.questoesTotal} total
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-black ${
                          membro.taxaAcertoSemana >= 80
                            ? 'text-emerald-500'
                            : membro.taxaAcertoSemana >= 60
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {membro.taxaAcertoSemana}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {membro.provaSemanalResultado ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {membro.provaSemanalResultado.acertos}/30 ({membro.provaSemanalResultado.notaPercent}%)
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Pendente</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-black text-sm text-amber-500 dark:text-amber-400">
                        {membro.pontosTotais}
                      </span>
                      <span className="text-[10px] text-slate-500 block">pontos</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared Topics & Materials from Friends ("Temas e Materiais do Grupo") */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDarkMode ? 'bg-[#131924] border-[#1f293b]' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3
              className={`text-base font-black ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Materiais & Temas Estudados pelos Membros
            </h3>
            <p className="text-xs text-slate-400">
              Todos esses temas alimentam a prova geral com 30 questões da semana.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddMaterialModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDarkMode
                ? 'bg-[#152336] text-[#38bdf8] border-[#0284c7]/40 hover:bg-[#1b2d45]'
                : 'bg-sky-50 text-[#0369a1] border-sky-200 hover:bg-sky-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compartilhar Meu Material / Tema</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.membros.map((membro) => (
            <div
              key={membro.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-[#0f1622] border-[#1c283a]'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#ea580c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {membro.avatar}
                </div>
                <div className="min-w-0">
                  <h4
                    className={`text-xs font-bold truncate ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {membro.nome}
                  </h4>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {membro.foco}
                  </span>
                </div>
              </div>

              {/* Temas */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Temas que está estudando:
                </span>
                <div className="space-y-1">
                  {membro.temasEstudados.map((t, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] font-medium text-slate-300 dark:text-slate-300 flex items-center gap-1.5 truncate"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] shrink-0" />
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materiais compartilhados */}
              {membro.materiaisCompartilhados.length > 0 && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Material anexado:
                  </span>
                  {membro.materiaisCompartilhados.map((mat) => (
                    <div
                      key={mat.id}
                      className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                        isDarkMode
                          ? 'bg-[#141d2a] border-[#223046] text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                        <span className="truncate text-[11px] font-semibold">
                          {mat.titulo}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 shrink-0">
                        {mat.data}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Criar Novo Grupo */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 transition-all shadow-2xl ${
              isDarkMode
                ? 'bg-[#101724] border-[#1e2a3c] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black">Criar Novo Grupo de Estudos</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Nome do Grupo:
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Rumo à Residência USP / EPM"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Descrição ou Objetivo:
                </label>
                <textarea
                  rows={3}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Ex: Grupo focado em resolver questões diárias e prova semanal integrativa."
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs"
                >
                  Criar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Amigo */}
      {isAddFriendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 transition-all shadow-2xl ${
              isDarkMode
                ? 'bg-[#101724] border-[#1e2a3c] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black">Convidar / Adicionar Amigo</h3>
              <button
                type="button"
                onClick={() => setIsAddFriendModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddFriend} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Nome do Amigo(a):
                </label>
                <input
                  type="text"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="Ex: Dra. Mariana Costa"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Faculdade / Hospital:
                </label>
                <input
                  type="text"
                  value={friendInstitution}
                  onChange={(e) => setFriendInstitution(e.target.value)}
                  placeholder="Ex: UFRJ / Hospital São Paulo"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Foco ou Especialidade de Interesse:
                </label>
                <input
                  type="text"
                  value={friendFoco}
                  onChange={(e) => setFriendFoco(e.target.value)}
                  placeholder="Ex: Infectologia & Medicina de Emergência"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Temas que está estudando (separados por vírgula):
                </label>
                <input
                  type="text"
                  value={friendTemas}
                  onChange={(e) => setFriendTemas(e.target.value)}
                  placeholder="Ex: Meningites, Arboviroses, Antimicrobianos"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFriendModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs"
                >
                  Adicionar ao Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Compartilhar Meu Material / Tema */}
      {isAddMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 transition-all shadow-2xl ${
              isDarkMode
                ? 'bg-[#101724] border-[#1e2a3c] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black">Compartilhar Tema / Material</h3>
              <button
                type="button"
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddMaterial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Título do Material ou Diretriz:
                </label>
                <input
                  type="text"
                  required
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="Ex: Diretriz de Reanimação Cardiopulmonar 2024"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-400">
                  Área / Especialidade Médica:
                </label>
                <input
                  type="text"
                  value={materialTema}
                  onChange={(e) => setMaterialTema(e.target.value)}
                  placeholder="Ex: Terapia Intensiva & Emergências"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#141d2b] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs"
                >
                  Anexar ao Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
