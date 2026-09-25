import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TutorMarkdownProps {
  content: string;
  isDarkMode: boolean;
}

export const TutorMarkdown: React.FC<TutorMarkdownProps> = ({ content, isDarkMode }) => {
  const strong = isDarkMode ? 'text-white' : 'text-slate-900';
  const border = isDarkMode ? 'border-[#1f293b]' : 'border-slate-200';
  const muted = isDarkMode ? 'bg-[#0d121c]' : 'bg-slate-50';

  return (
    <div className="space-y-2.5 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className={`font-bold ${strong}`}>{children}</strong>,
          h1: ({ children }) => <h3 className={`text-sm sm:text-base font-extrabold pt-1 ${strong}`}>{children}</h3>,
          h2: ({ children }) => <h3 className={`text-sm sm:text-base font-extrabold pt-1 ${strong}`}>{children}</h3>,
          h3: ({ children }) => <h4 className={`text-sm font-bold pt-1 ${strong}`}>{children}</h4>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 marker:text-[#f97316]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 marker:text-[#38bdf8] marker:font-bold">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#f97316] pl-3 italic opacity-90">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className={`px-1 py-0.5 rounded text-[0.85em] ${muted}`}>{children}</code>
          ),
          hr: () => <hr className={`my-3 ${border}`} />,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#38bdf8] underline underline-offset-2">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className={`overflow-x-auto rounded-lg border ${border}`}>
              <table className="w-full text-left text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className={muted}>{children}</thead>,
          th: ({ children }) => <th className={`px-2.5 py-1.5 font-bold border-b ${border} ${strong}`}>{children}</th>,
          td: ({ children }) => <td className={`px-2.5 py-1.5 border-b align-top ${border}`}>{children}</td>,
        }}
      >
        {content || '...'}
      </ReactMarkdown>
    </div>
  );
};
