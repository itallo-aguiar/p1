import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Stethoscope,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  FileText,
  Brain,
  ShieldCheck,
  Layers,
  Award,
  TrendingUp,
  ChevronRight,
  Star,
  Activity,
  Check,
  Sliders,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { EstudoVagLogo } from './EstudoVagLogo';

interface LandingPageProps {
  onGoToLogin: () => void;
  onQuickStartGuest?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onQuickStartGuest,
  isDarkMode,
  onToggleTheme,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const modalidades = [
    {
      title: 'ENAMED',
      badge: 'Exame Nacional',
      desc: 'Questões baseadas na matriz de competências oficiais do MEC/INEP para avaliação dos formandos em medicina.',
      icon: <Award className="w-5 h-5 text-[#0284c7]" />,
      cor: 'border-sky-500/30 bg-sky-500/5',
    },
    {
      title: 'Revalida INEP',
      badge: 'Diplomação',
      desc: 'Foco intensivo nas 5 grandes áreas: Clínica Médica, Cirurgia, Ginecologia e Obstetrícia, Pediatria e MFC/Saúde Coletiva.',
      icon: <GraduationCap className="w-5 h-5 text-[#ea580c]" />,
      cor: 'border-orange-500/30 bg-orange-500/5',
    },
    {
      title: 'Residência Médica',
      badge: 'Acesso Direto',
      desc: 'Casos clínicos de alta complexidade no padrão das maiores bancas do país (ENARE, SUS-SP, USP, UNICAMP, SMS-RJ).',
      icon: <Stethoscope className="w-5 h-5 text-[#38bdf8]" />,
      cor: 'border-sky-500/30 bg-sky-500/5',
    },
    {
      title: 'Faculdade & Internato',
      badge: 'Graduação',
      desc: 'Suba apostilas e diretrizes hospitalares para gerar simulados imediatos de provas modulares e internato.',
      icon: <BookOpen className="w-5 h-5 text-emerald-500" />,
      cor: 'border-emerald-500/30 bg-emerald-500/5',
    },
    {
      title: 'PBL & Discussão Clínica',
      badge: 'Metodologia Ativa',
      desc: 'Discuta casos clínicos com o preceptor virtual e elabore hipóteses diagnósticas e condutas terapêuticas.',
      icon: <Brain className="w-5 h-5 text-violet-500" />,
      cor: 'border-violet-500/30 bg-violet-500/5',
    },
  ];

  const passos = [
    {
      num: '01',
      title: 'Defina seu Conteúdo',
      desc: 'Gere questões diretamente por tema clínico, faça upload da sua apostila em PDF ou cole anotações médicas.',
      icon: <FileText className="w-5 h-5 text-[#0284c7]" />,
    },
    {
      num: '02',
      title: 'Calibre os Parâmetros',
      desc: 'Escolha de 1 a 50 questões e selecione a dificuldade exata: Fácil, Médio, Difícil ou Mista equilibrada.',
      icon: <Sliders className="w-5 h-5 text-[#ea580c]" />,
    },
    {
      num: '03',
      title: 'Treine com Justificativas Reais',
      desc: 'Responda no simulador clínico, visualize gabarito comentado alternativa por alternativa e tire dúvidas com o preceptor IA.',
      icon: <Activity className="w-5 h-5 text-emerald-500" />,
    },
  ];

  const faqs = [
    {
      q: 'Como a IA do EstudoVag gera questões médicas confiáveis?',
      a: 'O motor utiliza modelos calibrados especificamente com diretrizes médicas vigentes (SBC, SBEM, SBP, FEBRASGO, Ministério da Saúde e UpToDate). As questões são formuladas com casos clínicos contextualizados, alternativas plausíveis e gabarito minucioso justificando por que a correta é a conduta padrão ouro e os motivos de cada distrator estar incorreto.',
    },
    {
      q: 'Posso usar meus próprios PDFs e apostilas da faculdade?',
      a: 'Sim! A plataforma conta com leitor nativo de documentos em PDF. Você pode anexar qualquer apostila, artigo ou protocolo hospitalar; o sistema extrai os tópicos mais relevantes e cria questões inéditas e focadas estritamente naquele conteúdo.',
    },
    {
      q: 'O que significa o nível de dificuldade "Mista"?',
      a: 'O modo Misto cria uma distribuição proporcional e calibrada entre questões fáceis (conceitos fundamentais e sinais patognomônicos), médias (casos clínicos práticos de conduta) e difíceis (diagnósticos diferenciais e exceções de diretrizes), reproduzindo a curva real dos exames como o ENAMED e o Revalida.',
    },
    {
      q: 'O progresso dos meus simulados fica salvo?',
      a: 'Sim. Todas as resoluções, respostas e taxas de acerto ficam preservadas no cache local e no seu perfil, permitindo retomar de onde parou mesmo se fechar o navegador.',
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0a0e17] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 1. TOP NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
          isDarkMode
            ? 'bg-[#0a0e17]/90 border-[#1a2333]'
            : 'bg-white/90 border-slate-200 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <EstudoVagLogo size={40} isDarkMode={isDarkMode} />
            <div className="flex items-baseline">
              <span className="text-xl font-black tracking-tight text-[#0284c7]">estudo</span>
              <span className="text-xl font-black tracking-tight text-[#ea580c]">vag</span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0284c7]/10 text-[#0284c7] dark:text-[#38bdf8] border border-[#0284c7]/20">
              Preceptor Médico IA
            </span>
          </div>

          {/* Nav Links & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-[#1f293b] text-slate-300 hover:text-white hover:bg-[#131924]'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              type="button"
              onClick={onGoToLogin}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#0284c7] to-[#ea580c] hover:opacity-95 shadow-md shadow-sky-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#0284c7]/15 to-[#ea580c]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border bg-white/60 dark:bg-[#111827]/80 backdrop-blur-md border-slate-200 dark:border-[#223046] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-800 dark:text-slate-200">
              Preparação Médica Inteligente com Evidências Clínicas
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            Gere questões e domine provas médicas a partir do{' '}
            <span className="bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#ea580c] bg-clip-text text-transparent">
              seu material de estudo
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            O <strong>EstudoVag</strong> transforma apostilas, PDFs, diretrizes hospitalares e temas clínicos em
            simulados completos para o <strong>ENAMED</strong>, <strong>Revalida</strong>, <strong>Residência</strong> e{' '}
            <strong>Internato</strong>, com gabarito comentado alternativa por alternativa.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-black text-white bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] hover:opacity-95 shadow-xl shadow-sky-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Entrar na Plataforma</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onQuickStartGuest && (
              <button
                type="button"
                onClick={onQuickStartGuest}
                className={`w-full sm:w-auto px-7 py-4 rounded-full text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? 'border-[#223046] bg-[#121926] text-slate-200 hover:border-slate-500 hover:bg-[#182335]'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Explorar Demonstração Direta</span>
              </button>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Diretrizes Oficiais (CFM, SBC, MS)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Gabarito Comentado em 100% dos Casos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Suporte a PDF, Notas e Geração por IA</span>
            </div>
          </div>
        </div>

        {/* 3. PLATFORM PREVIEW MOCKUP */}
        <div className="max-w-5xl mx-auto mt-14 relative">
          <div
            className={`rounded-3xl border p-4 sm:p-7 shadow-2xl transition-all ${
              isDarkMode
                ? 'bg-[#111726]/90 border-[#1f2c42] shadow-black/60'
                : 'bg-white border-slate-200 shadow-slate-300/50'
            }`}
          >
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1e2a3c] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-400 ml-2">
                  EstudoVag • Simulado Clínico em Andamento
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30">
                  ENAMED • Nível Misto
                </span>
              </div>
            </div>

            {/* Question Card Sample */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border text-left ${
                isDarkMode ? 'bg-[#0a0e17] border-[#1f2a3c]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-[#ea580c] tracking-wider">
                  Questão 01 de 10 • Caso Clínico
                </span>
                <span className="text-xs font-semibold text-slate-400">Cardiologia</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200 mb-5">
                Homem, 58 anos, hipertenso e tabagista, dá entrada na emergência com dor retroesternal opressiva há 2 horas,
                irradiada para membro superior esquerdo e mandíbula. Ao exame: PA 150/95 mmHg, FC 92 bpm, SatO2 96% em ar ambiente.
                O ECG de admissão evidencia supradesnivelamento do segmento ST de 2,5 mm em DII, DIII e aVF. Considerando o quadro clínico
                e as diretrizes cardiológicas vigentes, assinale a conduta inicial imediata mais adequada:
              </p>

              {/* Sample Alternatives */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-500 text-white font-black flex items-center justify-center text-[10px]">
                      A
                    </span>
                    <span>
                      Administrar AAS 200 mg mastigável + Clopidogrel 300 mg e encaminhar para cineangiocoronariografia de urgência (angioplastia primária).
                    </span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2a3c] text-slate-600 dark:text-slate-400 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                    B
                  </span>
                  <span>
                    Solicitar imediatamente curva de troponina ultrassensível e aguardar resultado antes de iniciar antiagregação.
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2a3c] text-slate-600 dark:text-slate-400 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                    C
                  </span>
                  <span>
                    Prescrever oxigenoterapia em máscara com reservatório a 10 L/min independentemente da oximetria de pulso.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODALIDADES DE ESTUDO */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-[#1a2333] bg-slate-100/60 dark:bg-[#0d121d]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
              Modalidades Médicas
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Projetado para cada etapa da sua formação
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Seja na graduação, na preparação para o internato ou nas provas mais disputadas de residência do país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modalidades.slice(0, 3).map((mod) => (
              <div
                key={mod.title}
                className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
                  isDarkMode ? 'bg-[#121927] border-[#1e2a3c]' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/10 flex items-center justify-center">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black mb-2">{mod.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {modalidades.slice(3).map((mod) => (
              <div
                key={mod.title}
                className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
                  isDarkMode ? 'bg-[#121927] border-[#1e2a3c]' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#ea580c]/10 flex items-center justify-center">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black mb-2">{mod.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#ea580c]">
              Fluxo em 3 Passos
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Como funciona o ecossistema de estudo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Simplicidade de uso aliada a rigor acadêmico médico e inteligência artificial de última geração.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {passos.map((passo) => (
              <div
                key={passo.num}
                className={`relative p-7 rounded-3xl border text-left transition-all ${
                  isDarkMode ? 'bg-[#111726] border-[#1e2a3c]' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="text-3xl font-black text-slate-300 dark:text-slate-700 mb-4 font-mono">
                  {passo.num}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/10 flex items-center justify-center mb-4">
                  {passo.icon}
                </div>
                <h3 className="text-base font-black mb-2">{passo.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {passo.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-[#1a2333] bg-slate-100/50 dark:bg-[#0d121d]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tudo o que você precisa saber sobre a metodologia do EstudoVag.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDarkMode ? 'bg-[#121927] border-[#1e2a3c]' : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-[#0284c7] transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-[#1a2333] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#ea580c] text-white shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Pronto para transformar sua rotina de estudos médicos?
          </h2>
          <p className="text-xs sm:text-sm max-w-xl mx-auto text-sky-100 leading-relaxed">
            Acesse agora a plataforma, crie simulados em segundos e estude com o preceptor mais avançado para suas provas.
          </p>
          <div>
            <button
              type="button"
              onClick={onGoToLogin}
              className="px-8 py-3.5 rounded-full text-sm font-black bg-white text-slate-900 hover:bg-slate-100 shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Acessar o EstudoVag Agora</span>
              <ArrowRight className="w-4 h-4 text-[#ea580c]" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-[#1a2333] py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <EstudoVagLogo size={24} isDarkMode={isDarkMode} />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              estudovag • Preceptor Médico Inteligente
            </span>
          </div>
          <p>© {new Date().getFullYear()} EstudoVag. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
