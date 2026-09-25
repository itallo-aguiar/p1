import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Layers,
  ChevronRight,
  Loader2,
  Trash2,
  Sliders,
  ClipboardPaste,
  RotateCcw,
  Minus,
  Plus,
  HelpCircle,
  Brain,
  Hash,
  Gauge,
} from 'lucide-react';
import { Dificuldade, EstiloQuestao, ConfiguracaoSimulado } from '../types';

interface GeneratorPanelProps {
  onGenerate: (config: ConfiguracaoSimulado, pdfBase64?: string, pdfText?: string) => Promise<void>;
  isLoading: boolean;
  modelProvider: 'gemini' | 'chatgpt' | 'claude';
  onSelectModelProvider?: (provider: 'gemini' | 'chatgpt' | 'claude') => void;
  isDarkMode?: boolean;
  cachedQuizInfo?: {
    totalQuestoes: number;
    materialNome: string;
    isCompleted: boolean;
    savedAt?: number;
  } | null;
  onRestoreCachedQuiz?: () => void;
  onDiscardCachedQuiz?: () => void;
  modalityTitle?: string;
  defaultEstilo?: EstiloQuestao;
}

const TEMAS_SUGERIDOS = [
  'Cardiologia: Síndrome Coronariana Aguda & HAS',
  'Endocrinologia: Cetoacidose Diabética & EHH',
  'Pediatria: Bronquiolite Viral & Meningite',
  'GO: Pré-Eclâmpsia & Hemorragia Pós-Parto',
  'Cirurgia: Abdome Agudo & Apendicite',
  'Infectologia: Sepse & Choque Séptico',
  'Atenção Primária: Rastreamento & Puericultura',
];

export const GeneratorPanel: React.FC<GeneratorPanelProps> = ({
  onGenerate,
  isLoading,
  modelProvider,
  onSelectModelProvider,
  isDarkMode = true,
  cachedQuizInfo,
  onRestoreCachedQuiz,
  onDiscardCachedQuiz,
  modalityTitle = 'ENAMED',
  defaultEstilo = 'ENAMED/Revalida/Residência',
}) => {
  // 3 distinct input methods: 'ai' | 'upload' | 'text'
  const [sourceType, setSourceType] = useState<'ai' | 'upload' | 'text'>('ai');

  // AI Topic Generation state
  const [aiTopic, setAiTopic] = useState<string>('');

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeKb: number;
    base64: string;
  } | null>(null);

  // Manual text state
  const [manualText, setManualText] = useState<string>('');
  const [manualTitle, setManualTitle] = useState<string>('');

  // Generator parameters: 1 a 50 questões, fácil/médio/difícil/mista
  const [quantidade, setQuantidade] = useState<number>(5);
  const [nivel, setNivel] = useState<Dificuldade>('Médio');
  const [estilo, setEstilo] = useState<EstiloQuestao>(defaultEstilo);
  const [focusPrompt, setFocusPrompt] = useState<string>('');

  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEstilo(defaultEstilo);
  }, [defaultEstilo, modalityTitle]);

  // Handle PDF file selection
  const processFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Por favor, selecione um arquivo em formato PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setUploadedFile({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        base64: base64String,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Clipboard paste handler with graceful fallback for iframe restrictions
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setManualText((prev) => (prev ? `${prev}\n\n${text}` : text));
          return;
        }
      }
    } catch {
      // Browser permission blocked or not in direct window context
    }

    const promptText = window.prompt('Cole o texto ou resumo médico aqui:');
    if (promptText) {
      setManualText((prev) => (prev ? `${prev}\n\n${promptText}` : promptText));
    }
  };

  const handleStartGeneration = async () => {
    let materialNome = '';
    let pdfBase64: string | undefined = undefined;
    let pdfText: string | undefined = undefined;

    if (sourceType === 'ai') {
      const topicClean = aiTopic.trim();
      materialNome = topicClean || `${modalityTitle} - Foco Clínico Abrangente`;
      pdfText = `Foco temático para a prova ${modalityTitle}: ${materialNome}.\nGere questões com rigor técnico, critérios diagnósticos, condutas baseadas em evidências e justificativas detalhadas.`;
    } else if (sourceType === 'upload') {
      if (!uploadedFile) {
        alert('Por favor, faça upload de um documento PDF primeiro.');
        return;
      }
      materialNome = uploadedFile.name;
      pdfBase64 = uploadedFile.base64;
    } else {
      if (!manualText.trim()) {
        alert('Por favor, insira ou cole o texto médico nas notas.');
        return;
      }
      materialNome = manualTitle.trim() || `${modalityTitle} - Notas de Estudo`;
      pdfText = manualText;
    }

    const config: ConfiguracaoSimulado = {
      quantidade,
      nivel,
      estilo,
      assunto: materialNome,
      materialNome,
      modelProvider,
    };

    await onGenerate(config, pdfBase64, pdfText);
  };

  const charCount = manualText.length;
  const wordCount = manualText.trim() ? manualText.trim().split(/\s+/).length : 0;

  // Quantity stepper helpers
  const handleDecrementQuantity = () => {
    setQuantidade((prev) => Math.max(1, prev - 1));
  };

  const handleIncrementQuantity = () => {
    setQuantidade((prev) => Math.min(50, prev + 1));
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setQuantidade(1);
    } else {
      setQuantidade(Math.min(50, Math.max(1, val)));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-3 px-4 sm:px-6 space-y-6">
      {/* Cached Quiz Restoration Banner */}
      {cachedQuizInfo && onRestoreCachedQuiz && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs ${
            isDarkMode
              ? 'bg-[#122033] border-[#0284c7]/40 text-slate-100'
              : 'bg-sky-50 border-sky-200 text-slate-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#ea580c] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">
                  Simulado salvo no cache local
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/30">
                  {cachedQuizInfo.totalQuestoes} questões
                </span>
              </div>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Tema: <strong className="text-white font-semibold">{cachedQuizInfo.materialNome}</strong>
                {cachedQuizInfo.isCompleted
                  ? ' • Concluído com análise'
                  : ' • Em andamento (respostas salvas no navegador)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onDiscardCachedQuiz && (
              <button
                type="button"
                onClick={onDiscardCachedQuiz}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border-[#1f293b]'
                    : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200'
                }`}
                title="Descartar este simulado do cache"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onRestoreCachedQuiz}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0284c7] to-[#ea580c] hover:opacity-95 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Continuar Simulado</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modality Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#1f293b]">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {modalityTitle}
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0284c7]/10 text-[#0284c7] dark:text-[#38bdf8] border border-[#0284c7]/30">
            Configurar Simulado
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Escolha o método de entrada do conteúdo e personalize a quantidade e o nível das questões.
        </p>
      </div>

      {/* 1. SELEÇÃO DOS 3 MÉTODOS DE ENTRADA (CARDS) */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
          1. Escolha o Método de Entrada de Conteúdo
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Método 1: Gerar Questões por IA */}
          <button
            type="button"
            onClick={() => setSourceType('ai')}
            className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
              sourceType === 'ai'
                ? isDarkMode
                  ? 'bg-gradient-to-b from-[#142338] to-[#0f1927] border-[#0284c7] ring-2 ring-[#0284c7]/40 shadow-md'
                  : 'bg-gradient-to-b from-sky-50 to-white border-sky-400 ring-2 ring-sky-300/60 shadow-md'
                : isDarkMode
                ? 'bg-[#131924] border-[#1e2a3c] hover:border-slate-600 hover:bg-[#161f2c]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    sourceType === 'ai'
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#1b2636] text-slate-400 group-hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 group-hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                {sourceType === 'ai' ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                    Selecionado
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">Opção 1</span>
                )}
              </div>
              <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Gerar Questões por IA
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Geração direta por tema, assunto ou especialidade médica.
              </p>
            </div>
          </button>

          {/* Método 2: Upload de PDF */}
          <button
            type="button"
            onClick={() => setSourceType('upload')}
            className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
              sourceType === 'upload'
                ? isDarkMode
                  ? 'bg-gradient-to-b from-[#142338] to-[#0f1927] border-[#0284c7] ring-2 ring-[#0284c7]/40 shadow-md'
                  : 'bg-gradient-to-b from-sky-50 to-white border-sky-400 ring-2 ring-sky-300/60 shadow-md'
                : isDarkMode
                ? 'bg-[#131924] border-[#1e2a3c] hover:border-slate-600 hover:bg-[#161f2c]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    sourceType === 'upload'
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#1b2636] text-slate-400 group-hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 group-hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-5 h-5 text-sky-400" />
                </div>
                {sourceType === 'upload' ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                    Selecionado
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">Opção 2</span>
                )}
              </div>
              <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Upload de PDF
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Área de arrastar/soltar apostilas, diretrizes e artigos.
              </p>
            </div>
          </button>

          {/* Método 3: Colar Texto / Notas */}
          <button
            type="button"
            onClick={() => setSourceType('text')}
            className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
              sourceType === 'text'
                ? isDarkMode
                  ? 'bg-gradient-to-b from-[#142338] to-[#0f1927] border-[#0284c7] ring-2 ring-[#0284c7]/40 shadow-md'
                  : 'bg-gradient-to-b from-sky-50 to-white border-sky-400 ring-2 ring-sky-300/60 shadow-md'
                : isDarkMode
                ? 'bg-[#131924] border-[#1e2a3c] hover:border-slate-600 hover:bg-[#161f2c]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    sourceType === 'text'
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#1b2636] text-slate-400 group-hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600 group-hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-5 h-5 text-orange-400" />
                </div>
                {sourceType === 'text' ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                    Selecionado
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">Opção 3</span>
                )}
              </div>
              <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Colar Texto / Notas
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Campo amplo com botão de colar e contador de caracteres.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. FORMULÁRIO LIMPO DO MÉTODO DE ENTRADA ESCOLHIDO */}
      <div
        className={`rounded-3xl p-6 border shadow-xs transition-all ${
          isDarkMode ? 'bg-[#131924] border-[#1f293b]' : 'bg-white border-slate-200'
        }`}
      >
        {/* Formulário 1: Gerar Questões por IA */}
        {sourceType === 'ai' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e2a3c]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f97316]" />
                <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Geração Direta por IA
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Modalidade: <strong>{modalityTitle}</strong>
              </span>
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                Tema, Assunto ou Especialidade Médica:
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Ex: Síndrome Coronariana Aguda, Cetoacidose Diabética, Sepse, Puericultura, Abdome Agudo..."
                className={`w-full text-xs font-medium px-3.5 py-3 rounded-xl border focus:outline-hidden transition-all ${
                  isDarkMode
                    ? 'bg-[#0d121c] border-[#1f293b] text-white focus:border-[#0284c7]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                }`}
              />
              <p
                className={`text-[11px] mt-1.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Digite qualquer assunto clínico ou clique nas sugestões frequentes abaixo.
              </p>
            </div>

            {/* Quick high-yield topic chips */}
            <div>
              <span
                className={`text-[11px] font-bold block mb-2 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Sugestões de temas frequentes de prova:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TEMAS_SUGERIDOS.map((tema) => (
                  <button
                    key={tema}
                    type="button"
                    onClick={() => setAiTopic(tema)}
                    className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer text-left ${
                      aiTopic === tema
                        ? isDarkMode
                          ? 'bg-[#0284c7]/20 border-[#0284c7] text-[#38bdf8]'
                          : 'bg-sky-50 border-sky-400 text-sky-900'
                        : isDarkMode
                        ? 'bg-[#0e141f] border-[#1e2a3c] text-slate-300 hover:border-[#0284c7]/50'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tema}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Formulário 2: Upload de PDF */}
        {sourceType === 'upload' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e2a3c]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#0284c7]" />
                <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Upload de Arquivo PDF
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Apostilas, artigos e protocolos
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              accept=".pdf,application/pdf"
              className="hidden"
            />

            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? isDarkMode
                      ? 'border-[#0284c7] bg-[#142338]'
                      : 'border-sky-500 bg-sky-50'
                    : isDarkMode
                    ? 'border-[#233247] hover:border-[#0284c7] bg-[#0f1522]'
                    : 'border-slate-300 hover:border-sky-500 bg-slate-50/50'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#0284c7]/20 to-[#ea580c]/20 text-[#0284c7] flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h3
                  className={`text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  Arraste e solte seu arquivo PDF aqui
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  ou clique para selecionar apostila, diretriz hospitalar ou artigo
                </p>
              </div>
            ) : (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDarkMode
                    ? 'bg-[#142233] border-[#1e3b5c]'
                    : 'bg-sky-50 border-sky-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#0284c7] to-[#ea580c] text-white flex items-center justify-center font-black shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {uploadedFile.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {uploadedFile.sizeKb} KB • PDF pronto para formulação
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#192231] border border-[#26374f] text-slate-200 hover:bg-[#202d42] cursor-pointer"
                  >
                    Trocar
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Remover arquivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulário 3: Colar Texto / Notas */}
        {sourceType === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e2a3c]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ea580c]" />
                <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Colar Texto / Notas de Estudo
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Colar Texto</span>
                </button>
                {manualText && (
                  <button
                    type="button"
                    onClick={() => setManualText('')}
                    className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Limpar texto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Título ou Identificador (Opcional):
              </label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Ex: Resumo de Manejo da Crise Hipertensiva na Gestação"
                className={`w-full text-xs font-medium px-3 py-2 rounded-lg border focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-[#0d121c] border-[#1f293b] text-white focus:border-[#0284c7]'
                    : 'bg-white border-slate-200 text-slate-900 focus:border-sky-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className={`text-xs font-bold ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Conteúdo Amplo do Estudo:
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {charCount.toLocaleString('pt-BR')} caracteres • {wordCount} palavras
                </span>
              </div>
              <textarea
                rows={8}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Cole aqui o trecho do protocolo hospitalar, critérios diagnósticos, condutas de diretrizes ou apontamentos de aula..."
                className={`w-full text-xs p-3.5 rounded-xl border focus:outline-hidden font-sans leading-relaxed transition-all ${
                  isDarkMode
                    ? 'bg-[#0d121c] border-[#1f293b] text-slate-100 focus:border-[#0284c7]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. PARÂMETROS DE GERAÇÃO DAS QUESTÕES (ABAIXO DO MÉTODO DE ENTRADA ESCOLHIDO) */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border shadow-xs space-y-7 transition-all ${
          isDarkMode ? 'bg-[#131924] border-[#1f293b]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e2a3c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2
                className={`text-base sm:text-lg font-extrabold ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Parâmetros de Geração das Questões
              </h2>
              <p className="text-xs text-slate-400">
                Configure os dois controles principais para calibrar o volume e o rigor técnico do simulado.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0284c7]/10 text-[#0284c7] dark:text-[#38bdf8] border border-[#0284c7]/20">
            {quantidade} questões • Nível {nivel}
          </span>
        </div>

        {/* OS DOIS CONTROLES PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CONTROLE 1: QUANTIDADE DE QUESTÕES (1 a 50) */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-[#0f1522] border-[#1e2a3c]'
                : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            {/* Header do Controle 1 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <label
                    htmlFor="input-quantidade"
                    className={`text-sm font-bold block ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Quantidade de Questões
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Intervalo de 1 a 50 questões
                  </span>
                </div>
              </div>

              {/* Seletor Numérico Compacto com botões [-] [+] e Input Direto */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#182232] p-1 rounded-xl border border-slate-200 dark:border-[#223046] shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrementQuantity}
                  disabled={quantidade <= 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202d40] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Diminuir 1 questão"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  id="input-quantidade"
                  type="number"
                  min={1}
                  max={50}
                  value={quantidade}
                  onChange={handleQuantityInputChange}
                  className="w-10 text-center font-extrabold text-sm text-[#0284c7] dark:text-[#38bdf8] bg-transparent focus:outline-hidden"
                  aria-label="Número de questões"
                />

                <button
                  type="button"
                  onClick={handleIncrementQuantity}
                  disabled={quantidade >= 50}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202d40] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Aumentar 1 questão"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider interativo de 1 a 50 questões */}
            <div className="space-y-2 mt-4">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0284c7] focus:outline-hidden"
                  aria-label="Controle deslizante de quantidade de questões"
                />
              </div>

              {/* Marcadores de régua do slider */}
              <div className="flex justify-between text-[11px] font-mono font-semibold text-slate-400 px-0.5">
                <span>1</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
              </div>
            </div>

            {/* Atalhos Rápidos de Quantidade (Chips) */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1a2536]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                Atalhos Frequentes:
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 10, 20, 30, 50].map((num) => {
                  const isCurrent = quantidade === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantidade(num)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                        isCurrent
                          ? 'bg-[#0284c7] text-white font-extrabold border-[#0284c7] shadow-xs'
                          : isDarkMode
                          ? 'bg-[#141c28] text-slate-300 border-[#223046] hover:bg-[#1a2434] hover:text-white'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} q
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CONTROLE 2: NÍVEL DE DIFICULDADE (Fácil, Médio, Difícil, Mista) */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              isDarkMode
                ? 'bg-[#0f1522] border-[#1e2a3c]'
                : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <label
                      className={`text-sm font-bold block ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Nível de Dificuldade
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Selecione uma das 4 opções de calibração
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide border ${
                    nivel === 'Fácil'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : nivel === 'Médio'
                      ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                      : nivel === 'Difícil'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  }`}
                >
                  {nivel}
                </span>
              </div>

              {/* As 4 Opções: Fácil, Médio, Difícil, Mista */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {/* Opção 1: Fácil */}
                <button
                  type="button"
                  onClick={() => setNivel('Fácil')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    nivel === 'Fácil'
                      ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#141c28] border-[#223046] text-slate-300 hover:border-emerald-500/40 hover:bg-[#182333]'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Fácil
                    </span>
                    {nivel === 'Fácil' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[10.5px] leading-snug text-slate-500 dark:text-slate-400">
                    Critérios clássicos e sinais típicos.
                  </p>
                </button>

                {/* Opção 2: Médio */}
                <button
                  type="button"
                  onClick={() => setNivel('Médio')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    nivel === 'Médio'
                      ? 'bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/30 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#141c28] border-[#223046] text-slate-300 hover:border-orange-500/40 hover:bg-[#182333]'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-orange-300 hover:bg-orange-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black flex items-center gap-1.5 text-orange-500 dark:text-orange-400">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                      Médio
                    </span>
                    {nivel === 'Médio' && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <p className="text-[10.5px] leading-snug text-slate-500 dark:text-slate-400">
                    Casos comuns de prova e condutas.
                  </p>
                </button>

                {/* Opção 3: Difícil */}
                <button
                  type="button"
                  onClick={() => setNivel('Difícil')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    nivel === 'Difícil'
                      ? 'bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/30 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#141c28] border-[#223046] text-slate-300 hover:border-rose-500/40 hover:bg-[#182333]'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-rose-300 hover:bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      Difícil
                    </span>
                    {nivel === 'Difícil' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <p className="text-[10.5px] leading-snug text-slate-500 dark:text-slate-400">
                    Casos atípicos e pegadinhas de prova.
                  </p>
                </button>

                {/* Opção 4: Mista (com texto explícito de distribuição equilibrada) */}
                <button
                  type="button"
                  onClick={() => setNivel('Mista')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    nivel === 'Mista'
                      ? 'bg-indigo-500/15 border-indigo-500 ring-2 ring-indigo-500/30 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-[#141c28] border-[#223046] text-slate-300 hover:border-indigo-500/40 hover:bg-[#182333]'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      Mista
                    </span>
                    {nivel === 'Mista' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10px] leading-snug text-slate-500 dark:text-slate-400 font-medium">
                    Equilíbrio entre fácil, médio e difícil.
                  </p>
                </button>
              </div>
            </div>

            {/* Explicação detalhada do nível selecionado */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#1a2536] text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="font-semibold text-slate-300">
                {nivel === 'Mista' ? 'Mista:' : `${nivel}:`}
              </span>
              <span>
                {nivel === 'Fácil' && 'Foco em memorização ativa, valores de referência e quadros patognomônicos.'}
                {nivel === 'Médio' && 'Padrão ouro para ENAMED e Residência: casos práticos e condutas imediatas.'}
                {nivel === 'Difícil' && 'Casos de alta complexidade com diagnósticos diferenciais desafiadores.'}
                {nivel === 'Mista' && 'distribuição equilibrada entre fácil, médio e difícil.'}
              </span>
            </div>
          </div>
        </div>

        {/* COMPLEMENTOS: ESTILO DA QUESTÃO & MOTOR MULTI-IA */}
        <div className="pt-2 border-t border-slate-200 dark:border-[#1c2637] grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Estilo da Questão */}
          <div>
            <label
              className={`block text-xs font-bold mb-2 flex items-center gap-1.5 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#0284c7]" />
              Estilo das Questões:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEstilo('ENAMED/Revalida/Residência')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  estilo === 'ENAMED/Revalida/Residência'
                    ? isDarkMode
                      ? 'border-[#0284c7] bg-[#142338] text-white ring-1 ring-[#0284c7]'
                      : 'border-[#0284c7] bg-sky-50 text-sky-900 ring-1 ring-[#0284c7]'
                    : isDarkMode
                    ? 'border-[#223046] bg-[#182130] text-slate-300 hover:bg-[#1f2a3c]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">Caso Clínico</span>
                  {estilo === 'ENAMED/Revalida/Residência' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  ENAMED / Revalida
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEstilo('Normal')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  estilo === 'Normal'
                    ? isDarkMode
                      ? 'border-[#ea580c] bg-[#291712] text-white ring-1 ring-[#ea580c]'
                      : 'border-[#ea580c] bg-orange-50 text-orange-900 ring-1 ring-[#ea580c]'
                    : isDarkMode
                    ? 'border-[#223046] bg-[#182130] text-slate-300 hover:bg-[#1f2a3c]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">Direta / Conceitual</span>
                  {estilo === 'Normal' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  Fisiopatologia / Mecanismos
                </span>
              </button>
            </div>
          </div>

          {/* Motor de Inteligência Artificial */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`text-xs font-bold flex items-center gap-1.5 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-800'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-[#f97316]" />
                Motor de Inteligência Artificial:
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Multi-IA</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'gemini', label: 'Gemini 3.8', sub: 'Padrão Google' },
                { id: 'chatgpt', label: 'GPT-4o', sub: 'OpenAI' },
                { id: 'claude', label: 'Claude 3.5', sub: 'Anthropic' },
              ].map((m) => {
                const isSelected = modelProvider === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectModelProvider && onSelectModelProvider(m.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? 'border-[#0284c7] bg-[#142338] ring-1 ring-[#0284c7]'
                          : 'border-[#0284c7] bg-sky-50 ring-1 ring-[#0284c7]'
                        : isDarkMode
                        ? 'border-[#223046] bg-[#182130] hover:bg-[#1f2a3c]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-black block truncate ${
                        isSelected
                          ? 'text-[#38bdf8]'
                          : isDarkMode
                          ? 'text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      {m.label}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">{m.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Foco Clínico Adicional (Opcional) */}
        <div className="pt-2">
          <label
            className={`block text-xs font-bold mb-1 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            Foco Específico ou Instrução Adicional (Opcional):
          </label>
          <input
            type="text"
            value={focusPrompt}
            onChange={(e) => setFocusPrompt(e.target.value)}
            placeholder="Ex: Ênfase em contraindicações farmacológicas, doses pediátricas ou condutas de emergência"
            className={`w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border focus:outline-hidden transition-all ${
              isDarkMode
                ? 'bg-[#0d121c] border-[#1f293b] text-white focus:border-[#0284c7]'
                : 'bg-white border-slate-200 text-slate-900 focus:border-[#0284c7]'
            }`}
          />
        </div>

        {/* BOTÃO PRINCIPAL DE AÇÃO */}
        <div className="pt-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleStartGeneration}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-black text-white bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#ea580c] hover:opacity-95 shadow-md shadow-sky-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base group cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  Elaborando {quantidade} Questões ({nivel}) para {modalityTitle}...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  Gerar {quantidade} Questões • Nível {nivel} ({modalityTitle})
                </span>
                <ChevronRight className="w-5 h-5 ml-1 opacity-70 group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2.5">
            Geração calibrada com medicina baseada em evidências, diretrizes vigentes e gabarito comentado.
          </p>
        </div>
      </div>
    </div>
  );
};
