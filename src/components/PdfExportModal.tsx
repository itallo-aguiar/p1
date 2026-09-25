import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import {
  Printer,
  Download,
  X,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Questao, ConfiguracaoSimulado } from '../types';
import { EstudoVagLogo } from './EstudoVagLogo';

interface PdfExportModalProps {
  questoes: Questao[];
  config: ConfiguracaoSimulado;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  questoes,
  config,
  isOpen,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJsPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 15;

    // Header matching user's template
    // Blue banner
    doc.setFillColor(2, 132, 199); // #0284c7 Ocean Blue
    doc.rect(10, currentY, pageWidth - 20, 22, 'F');

    // Orange accent side bar
    doc.setFillColor(234, 88, 12); // #ea580c Radiant Orange
    doc.rect(10, currentY, 3, 22, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('EstudoVag', 16, currentY + 9);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('APLICATIVO DE ESTUDOS INTELIGENTES', 16, currentY + 16);

    // Meta right
    doc.setFontSize(9);
    doc.text(`Assunto: ${config.materialNome.slice(0, 30)}`, pageWidth - 80, currentY + 8);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 80, currentY + 14);
    doc.text(`Nível: ${config.nivel} | Estilo: ${config.estilo.slice(0, 15)}`, pageWidth - 80, currentY + 19);

    currentY += 28;

    // Orange/Blue separator bar
    doc.setFillColor(234, 88, 12); // #ea580c
    doc.rect(10, currentY, pageWidth - 20, 1.5, 'F');
    currentY += 8;

    // Questions loop
    questoes.forEach((q, idx) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Questão ${idx + 1} (${config.estilo}):`, 12, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const splitText = doc.splitTextToSize(q.enunciado, pageWidth - 26);
      doc.text(splitText, 12, currentY);
      currentY += splitText.length * 4.5 + 3;

      // Alternatives
      const letras = ['A', 'B', 'C', 'D'] as const;
      letras.forEach((l) => {
        const altText = q.alternativas[l];
        if (altText) {
          if (currentY > 275) {
            doc.addPage();
            currentY = 20;
          }
          doc.setFont('helvetica', 'bold');
          doc.text(`( ${l} )`, 15, currentY);
          doc.setFont('helvetica', 'normal');
          const splitAlt = doc.splitTextToSize(altText, pageWidth - 35);
          doc.text(splitAlt, 25, currentY);
          currentY += splitAlt.length * 4.2 + 2;
        }
      });

      currentY += 6;
    });

    // Answer Key / Gabarito on new page
    doc.addPage();
    currentY = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(3, 105, 161);
    doc.text('GABARITO COMENTADO & JUSTIFICATIVAS MÉDICAS', 12, currentY);
    currentY += 10;

    questoes.forEach((q, idx) => {
      if (currentY > 255) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(`Questão ${idx + 1}: Alternativa Correta [ ${q.resposta_correta} ]`, 12, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const splitJust = doc.splitTextToSize(`Justificativa: ${q.justificativa}`, pageWidth - 26);
      doc.text(splitJust, 12, currentY);
      currentY += splitJust.length * 4 + 6;
    });

    doc.save(`EstudoVag_Simulado_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Controls Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Folha de Prova EstudoVag (Impressão / PDF)
              </h2>
              <p className="text-xs text-slate-500">
                Formatado com o cabeçalho oficial do aplicativo para resolução em papel ou tablet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJsPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Preview */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-100" ref={printAreaRef}>
          <div className="bg-white p-8 sm:p-12 rounded-xl shadow-md border border-slate-200 max-w-3xl mx-auto space-y-6 text-slate-900 print:shadow-none print:p-0 print:border-none">
            {/* Header Layout directly replicating the user's PDF screenshot with brand styling */}
            <div className="bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#ea580c] text-white p-5 rounded-t-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-[#0369a1]">
              <div className="flex items-center gap-3">
                <EstudoVagLogo size={44} isDarkMode={false} />
                <div>
                  <div className="flex items-center text-2xl font-black tracking-tight leading-none">
                    <span className="text-white">estudo</span>
                    <span className="text-orange-200">vag</span>
                  </div>
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-sky-100 mt-1 block">
                    APLICATIVO DE ESTUDOS INTELIGENTES
                  </span>
                </div>
              </div>
              <div className="text-xs space-y-1 text-right sm:text-right font-medium text-sky-50">
                <p>
                  <strong>Assunto:</strong> {config.materialNome}
                </p>
                <p>
                  <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')} &nbsp;|&nbsp; <strong>Página:</strong> 1 de 1
                </p>
              </div>
            </div>

            {/* Orange separator line */}
            <div className="w-full h-1 bg-gradient-to-r from-[#0284c7] to-[#ea580c]" />

            {/* Exam metadata */}
            <div className="flex items-center justify-between text-xs text-slate-600 pb-3 border-b border-slate-200">
              <span>
                <strong>Estilo:</strong> {config.estilo}
              </span>
              <span>
                <strong>Nível:</strong> {config.nivel}
              </span>
              <span>
                <strong>Total:</strong> {questoes.length} Questões
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questoes.map((q, idx) => (
                <div key={idx} className="space-y-2 pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Questão {idx + 1}:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {q.enunciado}
                  </p>
                  <div className="space-y-1.5 pt-2 pl-2">
                    {(['A', 'B', 'C', 'D'] as const).map((letra) => (
                      <div key={letra} className="flex items-start gap-2 text-xs sm:text-sm">
                        <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {letra}
                        </span>
                        <span className="text-slate-800">{q.alternativas[letra]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Gabarito Comentado at bottom */}
            <div className="pt-6 border-t-2 border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-sky-800 uppercase tracking-wide">
                Gabarito Comentado pelo Preceptor Médico
              </h3>
              <div className="space-y-3">
                {questoes.map((q, idx) => (
                  <div key={idx} className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-900">
                      Questão {idx + 1}: Resposta Correta: [ {q.resposta_correta} ]
                    </p>
                    <p className="text-slate-600 mt-1 italic">
                      {q.justificativa}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
