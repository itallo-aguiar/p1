import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  isDarkMode?: boolean;
}

/**
 * EstudoVagLogo: Emblema oficial do EstudoVag baseado na imagem de referência do usuário:
 * - Círculo com gradiente azul e laranja
 * - Estudante relaxado/reclinado apoiado em um livro aberto estilizado
 * - Estudante segurando um livro com faíscas/brilhos de inspiração
 * - Tipografia 'estudo' em azul e 'vag' em laranja com subtítulo 'APLICATIVO DE ESTUDOS INTELIGENTES'
 */
export const EstudoVagLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  isDarkMode = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Símbolo / Ícone */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          {/* Gradiente do Anel Circular Exterior */}
          <linearGradient id="ringGrad" x1="20" y1="40" x2="180" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Gradiente do Corpo / Roupas */}
          <linearGradient id="bodyGrad" x1="70" y1="80" x2="150" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Gradiente das Pernas / Calça */}
          <linearGradient id="legGrad" x1="100" y1="100" x2="160" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Gradiente do Livro Aberto / Páginas Azuis */}
          <linearGradient id="bookLeft" x1="40" y1="120" x2="100" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Gradiente do Livro Aberto / Páginas Laranjas */}
          <linearGradient id="bookRight" x1="100" y1="120" x2="170" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Gradiente da Pele */}
          <linearGradient id="skinGrad" x1="80" y1="70" x2="105" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Gradiente do Livro Pequeno na Mão */}
          <linearGradient id="miniBookGrad" x1="110" y1="60" x2="130" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Fundo do círculo suave para contraste em dark/light */}
        <circle cx="100" cy="100" r="88" fill={isDarkMode ? '#0f172a' : '#ffffff'} fillOpacity="0.4" />

        {/* Anel Circular Externo */}
        <circle
          cx="100"
          cy="92"
          r="74"
          stroke="url(#ringGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Raios sutis de relógio / foco no topo */}
        <line x1="100" y1="36" x2="100" y2="44" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="82" y1="42" x2="86" y2="48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="118" y1="42" x2="114" y2="48" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

        {/* Brilho de estrela no livro */}
        <path
          d="M 142 66 L 144 71 L 149 73 L 144 75 L 142 80 L 140 75 L 135 73 L 140 71 Z"
          fill="#fbbf24"
        />

        {/* LIVRO ABERTO (Base / Camas de Páginas) */}
        {/* Lado Esquerdo do Livro (Páginas Azuis) */}
        <path
          d="M 100 138 C 76 138 48 128 36 122 C 34 121 32 123 33 125 C 42 144 68 156 100 156 Z"
          fill="url(#bookLeft)"
        />
        <path
          d="M 100 144 C 74 144 48 135 38 129 C 36 128 35 130 36 132 C 44 149 70 162 100 162 Z"
          fill="#0369a1"
        />

        {/* Lado Direito do Livro (Páginas Laranja) */}
        <path
          d="M 100 138 C 124 138 152 128 164 122 C 166 121 168 123 167 125 C 158 144 132 156 100 156 Z"
          fill="url(#bookRight)"
        />
        <path
          d="M 100 144 C 126 144 152 135 162 129 C 164 128 165 130 164 132 C 156 149 130 162 100 162 Z"
          fill="#ea580c"
        />

        {/* Lombada Inferior do Livro */}
        <path
          d="M 94 156 C 98 160 102 160 106 156 L 100 152 Z"
          fill="#cbd5e1"
        />

        {/* CORPO DO ESTUDANTE RECLINADO */}
        {/* Braço de Apoio Esquerdo atrás da cabeça */}
        <path
          d="M 68 104 C 60 96 66 84 76 82 C 84 80 88 88 84 96 Z"
          fill="url(#skinGrad)"
        />

        {/* Cabeça do Estudante */}
        <circle cx="88" cy="84" r="10" fill="url(#skinGrad)" />

        {/* Cabelo Azul Escuro Estilizado */}
        <path
          d="M 80 84 C 78 74 88 68 96 72 C 98 73 95 78 92 80 C 89 82 82 82 80 84 Z"
          fill="#0c4a6e"
        />

        {/* Tronco / Camisa Azul Reclinada */}
        <path
          d="M 83 94 C 88 92 104 98 116 112 C 104 118 90 114 78 105 C 76 100 78 95 83 94 Z"
          fill="url(#bodyGrad)"
        />

        {/* Faixa Laranja da Cintura */}
        <path
          d="M 112 110 C 116 114 119 120 120 125 C 114 128 109 124 106 118 Z"
          fill="#ea580c"
        />

        {/* Braço Direito Estendido segurando o Livro */}
        <path
          d="M 96 95 C 104 88 114 80 122 78 C 125 79 123 85 116 90 C 109 95 101 98 96 95 Z"
          fill="url(#skinGrad)"
        />

        {/* Livreto / Tablet Aberto nas Mãos */}
        <path
          d="M 121 72 L 132 68 L 136 82 L 125 86 Z"
          fill="url(#miniBookGrad)"
          rx="1"
        />
        <path
          d="M 125 70 L 129 69 L 133 83 L 129 84 Z"
          fill="#e0f2fe"
        />

        {/* Pernas Cruzadas / Reclinadas (Azul / Laranja) */}
        {/* Perna Direita dobrada para cima */}
        <path
          d="M 115 118 C 126 118 140 108 148 94 C 152 90 156 94 153 98 C 144 112 130 126 116 128 Z"
          fill="url(#legGrad)"
        />
        {/* Pé Direito estendido descalço/apoio */}
        <path
          d="M 148 94 C 153 90 158 92 159 95 C 158 98 153 99 150 97 Z"
          fill="url(#skinGrad)"
        />

        {/* Perna Esquerda apoiada sobre o livro */}
        <path
          d="M 122 122 C 132 120 144 114 152 114 C 158 114 162 120 156 125 C 145 130 134 130 122 126 Z"
          fill="#f97316"
        />
      </svg>

      {/* Tipografia da Marca com estudo (azul) + vag (laranja) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight">
            <span className="text-[#0284c7]">estudo</span>
            <span className="text-[#ea580c]">vag</span>
          </div>
          <span
            className={`text-[9px] font-extrabold tracking-wider uppercase mt-0.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Aplicativo de Estudos Inteligentes
          </span>
        </div>
      )}
    </div>
  );
};
