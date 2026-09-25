import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Stethoscope,
  BookOpen,
  HelpCircle,
  Loader2,
  Trash2,
  ChevronDown,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { MensagemTutor, Questao } from '../types';
import { TutorMarkdown } from './TutorMarkdown';

interface TutorChatProps {
  currentQuestion?: Questao;
  currentQuestionIndex?: number;
  materialName?: string;
  materialText?: string;
  initialMessage?: string;
  onClearInitialMessage?: () => void;
  onBack?: () => void;
  isDarkMode?: boolean;
}

export const TutorChatDrawer: React.FC<TutorChatProps> = ({
  currentQuestion,
  currentQuestionIndex = 0,
  materialName,
  materialText,
  initialMessage,
  onClearInitialMessage,
  onBack,
  isDarkMode = true,
}) => {
  const [mensagens, setMensagens] = useState<MensagemTutor[]>([
    {
      id: 'welcome',
      remetente: 'tutor',
      conteudo: `Olá! Sou o **Preceptor Clínico do EstudoVag**. Estou aqui para esclarecer qualquer dúvida sobre as questões geradas, explicar pegadinhas de prova e fundamentar as condutas com as diretrizes médicas atualizadas (SUS, SBC, CFM, SBP, FEBRASGO). 

Se você errou alguma alternativa, me diga o número da questão e qual letra você marcou que analisamos juntos o raciocínio!`,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputTexto, setInputTexto] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const isBusy = isSending || isStreaming;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens, isSending]);

  // Handle external trigger
  useEffect(() => {
    if (initialMessage && initialMessage.trim().length > 0) {
      setInputTexto(initialMessage);
      if (onClearInitialMessage) {
        onClearInitialMessage();
      }
    }
  }, [initialMessage, onClearInitialMessage]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputTexto).trim();
    if (!textToSend || isBusy) return;

    const novaMsgUsuario: MensagemTutor = {
      id: 'user-' + Date.now(),
      remetente: 'usuario',
      conteudo: textToSend,
      horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questaoRef: currentQuestion ? currentQuestionIndex + 1 : undefined,
    };

    const historico = mensagens
      .filter((m) => !m.id.startsWith('welcome') && !m.isError)
      .slice(-10)
      .map((m) => ({
        role: m.remetente === 'usuario' ? 'user' : 'assistant',
        text: m.conteudo,
      }));

    setMensagens((prev) => [...prev, novaMsgUsuario]);
    setInputTexto('');
    setIsSending(true);

    const tutorId = 'tutor-' + Date.now();
    const updateTutor = (patch: Partial<MensagemTutor>) =>
      setMensagens((prev) => prev.map((m) => (m.id === tutorId ? { ...m, ...patch } : m)));

    try {
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: textToSend,
          historico,
          questaoAtual: currentQuestion,
          materialNome: materialName,
          materialTexto: materialText ? materialText.slice(0, 4000) : undefined,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Falha ao consultar o Preceptor');
      }

      setMensagens((prev) => [
        ...prev,
        {
          id: tutorId,
          remetente: 'tutor',
          conteudo: '',
          horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questaoRef: currentQuestion ? currentQuestionIndex + 1 : undefined,
        },
      ]);
      setIsSending(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acumulado = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acumulado += decoder.decode(value, { stream: true });
        updateTutor({ conteudo: acumulado });
      }

      if (!acumulado.trim()) {
        throw new Error('Resposta vazia');
      }
    } catch (err) {
      console.error('Erro no Tutor:', err);
      const erroMsg: Partial<MensagemTutor> = {
        conteudo: 'Não consegui responder agora. Toque em **Tentar novamente** para reenviar sua pergunta.',
        isError: true,
        retryText: textToSend,
      };
      setMensagens((prev) =>
        prev.some((m) => m.id === tutorId)
          ? prev.map((m) => (m.id === tutorId ? { ...m, ...erroMsg } : m))
          : [
              ...prev,
              {
                id: tutorId,
                remetente: 'tutor',
                conteudo: '',
                horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ...erroMsg,
              },
            ]
      );
    } finally {
      setIsSending(false);
      setIsStreaming(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Deseja limpar o histórico desta conversa com o preceptor?')) {
      setMensagens([
        {
          id: 'welcome-reset',
          remetente: 'tutor',
          conteudo: 'Histórico de conversa reiniciado. Como posso te auxiliar nos seus estudos agora?',
          horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      chipsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const quickPrompts = [
    currentQuestion
      ? `Errei a questão ${currentQuestionIndex + 1}, marquei a letra ${currentQuestion.selectedAnswer || 'D'}. Me explique por que está errado.`
      : 'Qual a pegadinha clássica deste caso clínico no Revalida/ENAMED?',
    'Explique detalhadamente o mecanismo fisiopatológico deste tema.',
    'Quais as diretrizes mais recentes do Ministério da Saúde para este manejo?',
    'Cite 3 pegadinhas clássicas de banca examinadora para este conteúdo.',
    'Como diferenciar este diagnóstico na prática de beira de leito?',
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-6 h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Header with explicit Back Button */}
      <div
        className={`rounded-t-2xl p-3.5 sm:p-4 border flex items-center justify-between transition-colors shrink-0 shadow-xs ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-[#17202f] hover:bg-[#1f2b3e] text-slate-300 hover:text-[#38bdf8] border-[#223046]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-sky-700 border-slate-200'
              }`}
              title="Voltar ao Painel"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#ea580c] text-white flex items-center justify-center shadow-xs font-black shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2
                className={`text-xs sm:text-base font-extrabold truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Preceptor Médico EstudoVag
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse shrink-0" />
            </div>
            <p
              className={`text-[11px] sm:text-xs truncate ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Tutor especializado em resolução de casos clínicos e diretrizes atualizadas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentQuestion && (
            <div
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${
                isDarkMode
                  ? 'bg-[#142338] border-[#0284c7]/40 text-[#38bdf8]'
                  : 'bg-sky-50 text-[#0369a1] border-sky-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Foco: Questão {currentQuestionIndex + 1}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleClearChat}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#17202f] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border-[#223046] hover:border-rose-900/40'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200'
            }`}
            title="Limpar conversa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area with custom styled scrollbar and generous top padding */}
      <div
        className={`flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 border-x transition-colors ${
          isDarkMode
            ? 'bg-[#0b0f17] border-[#1f293b]'
            : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        {mensagens.map((msg) => {
          const isUser = msg.remetente === 'usuario';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#ea580c] text-white font-black shadow-xs'
                    : isDarkMode
                    ? 'bg-[#142338] text-[#38bdf8] border border-[#0284c7]/40'
                    : 'bg-[#0284c7] text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#0284c7] text-white font-medium rounded-tr-none'
                    : isDarkMode
                    ? 'bg-[#131924] text-slate-200 border border-[#1f293b] rounded-tl-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message Content */}
                {isUser ? (
                  <p className="whitespace-pre-wrap">{msg.conteudo}</p>
                ) : (
                  <TutorMarkdown content={msg.conteudo} isDarkMode={isDarkMode} />
                )}

                {msg.isError && msg.retryText && (
                  <button
                    type="button"
                    onClick={() => {
                      setMensagens((prev) => prev.filter((m) => m.id !== msg.id));
                      handleSendMessage(msg.retryText);
                    }}
                    disabled={isBusy}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0284c7] text-white hover:bg-[#0369a1] disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tentar novamente
                  </button>
                )}

                <div
                  className={`text-[10px] mt-2 font-medium flex items-center justify-end ${
                    isUser
                      ? 'text-sky-100'
                      : isDarkMode
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  {msg.horario}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#142338] text-[#38bdf8] border border-[#0284c7]/40' : 'bg-[#0284c7] text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
            </div>
            <div
              className={`rounded-2xl rounded-tl-none p-4 border text-xs flex items-center gap-2 ${
                isDarkMode
                  ? 'bg-[#131924] border-[#1f293b] text-slate-300'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <Loader2 className="w-4 h-4 animate-spin text-[#0284c7]" />
              <span>Preceptor consultando diretrizes médicas e redigindo explicação didática...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts with NO visible horizontal scrollbar, smooth scrolling and edge fade-out indicators */}
      <div
        className={`relative border-x px-3 py-2.5 transition-colors shrink-0 ${
          isDarkMode
            ? 'bg-[#0f1420] border-[#1f293b]'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Left and Right Subtle Fade Indicators */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r ${
            isDarkMode
              ? 'from-[#0f1420] via-[#0f1420]/80 to-transparent'
              : 'from-white via-white/80 to-transparent'
          }`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l ${
            isDarkMode
              ? 'from-[#0f1420] via-[#0f1420]/80 to-transparent'
              : 'from-white via-white/80 to-transparent'
          }`}
        />

        <div
          ref={chipsContainerRef}
          className="overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth py-0.5"
        >
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0 cursor-pointer ${
                isDarkMode
                  ? 'bg-[#17202f] text-slate-300 hover:text-[#38bdf8] hover:bg-[#1f2b3e] border-[#223046] hover:border-[#0284c7]/40'
                  : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 border-slate-200 hover:border-sky-300'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div
        className={`rounded-b-2xl p-3 sm:p-4 border shadow-md transition-colors shrink-0 ${
          isDarkMode
            ? 'bg-[#131924] border-[#1f293b]'
            : 'bg-white border-slate-200'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Ex: Errei a questão 2, marquei a letra B. Me explique por que está errado..."
            disabled={isBusy}
            className={`flex-1 text-xs sm:text-sm font-medium px-4 py-3 rounded-xl border focus:outline-hidden transition-all ${
              isDarkMode
                ? 'bg-[#0d121c] border-[#1f293b] text-white focus:border-[#0284c7] placeholder:text-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500 placeholder:text-slate-400'
            }`}
          />

          <button
            type="submit"
            disabled={!inputTexto.trim() || isBusy}
            className="px-4 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0284c7] to-[#ea580c] text-white hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
