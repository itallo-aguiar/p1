import { GrupoEstudo, GrupoMembro, ProvaSemanalConfig, Questao, UserProfile } from '../types';

const STORAGE_KEY = 'estudovag_study_groups_v1';
const ACTIVE_GROUP_ID_KEY = 'estudovag_active_group_id_v1';

export const DEFAULT_WEEKLY_THEMES = [
  'Clínica Médica: Manejo da Insuficiência Cardíaca Aguda e Crônica',
  'Pediatria: Bronquiolite Viral Aguda e Reanimação Neonatal em Sala de Parto',
  'Cirurgia Geral: Diagnóstico e Conduta no Abdome Agudo Inflamatório',
  'Ginecologia e Obstetrícia: Pré-Eclâmpsia Grave e Síndrome HELLP',
  'Medicina Preventiva: Indicadores Epidemiológicos e Vigilância em Saúde',
  'Trauma e Emergência: Princípios Atualizados do ATLS (10ª Edição)',
];

export function getInitialWeeklyQuestions(): Questao[] {
  return [
    {
      id: 'sem-q1',
      enunciado:
        'Paciente de 58 anos, portador de insuficiência cardíaca com fração de ejeção reduzida (ICFEr, FE 32%), comparece à consulta assintomático em classe funcional NYHA II. Faz uso regular de Enalapril 20mg 2x/dia e Carvedilol 25mg 2x/dia. Exame físico: PA 115x70 mmHg, FC 68 bpm, sem turgência jugular ou edema. Qual medicação deve ser associada para redução comprovada de mortalidade cardiovascular?',
      alternativas: {
        A: 'Digoxina',
        B: 'Inibidor de SGLT2 (Dapagliflozina ou Empagliflozina)',
        C: 'Hidralazina isolada',
        D: 'Furosemida em dose plena contínua',
      },
      resposta_correta: 'B',
      justificativa:
        'Segundo as diretrizes SBC/ESC/AHA mais recentes, os 4 pilares modificadores de mortalidade na ICFEr são: iSGLT2 (Dapa ou Empa), Betabloqueador, IECA/BRA/INRA e Antagonista de Receptor Mineralocorticoide (Espironolactona). O iSGLT2 reduz hospitalização e morte cardiovascular independente da presença de diabetes.',
    },
    {
      id: 'sem-q2',
      enunciado:
        'Recém-nascido a termo, peso 3.200g, nascido de parto vaginal sem intercorrências com líquido amniótico claro. Ao nascer, apresenta respiração irregular e FC de 85 bpm. Após colocação em berço aquecido, posicionamento da cabeça e secagem com aspiração rápida de vias aéreas, a FC permanece em 80 bpm com apneia. Qual é a conduta imediata indicada?',
      alternativas: {
        A: 'Administrar adrenalina endotraqueal imediatamente.',
        B: 'Iniciar ventilação com pressão positiva (VPP) com máscara facial e ar ambiente (FiO2 21%).',
        C: 'Iniciar massagem cardíaca externa com compressões 3:1.',
        D: 'Oferecer oxigênio inalatório a 100% em fluxo livre.',
      },
      resposta_correta: 'B',
      justificativa:
        'Pelas diretrizes da SBP de Reanimação Neonatal, se após os passos iniciais o RN a termo mantiver FC < 100 bpm ou apneia/respiração irregular, a indicação imediata é iniciar VPP com máscara facial em ar ambiente (21%). A massagem só é indicada se FC < 60 bpm após 30 segundos de VPP efetiva.',
    },
    {
      id: 'sem-q3',
      enunciado:
        'Mulher de 24 anos, nuligesta, dá entrada no pronto-socorro com dor abdominal há 24 horas, iniciada em mesogástrio e que migrou para a fossa ilíaca direita. Ao exame: febrícula de 37,8°C, descompressão brusca dolorosa no ponto de McBurney e sinal de Rovsing positivo. Qual o diagnóstico clínico mais provável?',
      alternativas: {
        A: 'Diverticulite aguda de cólon descendente',
        B: 'Apendicite aguda',
        C: 'Salpingite aguda leve',
        D: 'Cólica nefrética com cálculo ureteral',
      },
      resposta_correta: 'B',
      justificativa:
        'A história de dor migratória para FID com sinal de Blumberg/McBurney e sinal de Rovsing (dor em FID ao comprimir FIE) é o quadro patognomônico de apendicite aguda. O diagnóstico na apresentação clássica é eminentemente clínico.',
    },
    {
      id: 'sem-q4',
      enunciado:
        'Gestante de 34 semanas comparece à maternidade com cefaleia holocraniana e queixa de turvação visual (escotomas cintilantes). PA aferida: 165x110 mmHg repetida após 15 minutos. Reflexos patelares vivos (hiper-reflexia). Qual é a primeira conduta terapêutica para prevenção de convulsões eclâmpticas?',
      alternativas: {
        A: 'Diazepam 10mg intravenoso lento',
        B: 'Sulfato de Magnésio pelo esquema de Pritchard ou Zuspan',
        C: 'Hidralazina intravenosa isolada sem outra intervenção',
        D: 'Fenitoína intravenosa profilática',
      },
      resposta_correta: 'B',
      justificativa:
        'Na pré-eclâmpsia com sinais de gravidade (PA >= 160x110 mmHg, sintomas visuais e neurológicos), o Sulfato de Magnésio é a droga de escolha e padrão ouro para prevenção e tratamento da eclâmpsia, devendo ser iniciado imediatamente (esquema de Zuspan ou Pritchard).',
    },
    {
      id: 'sem-q5',
      enunciado:
        'Vítima de colisão moto x anteparo, trazido pelo SAMU com colar cervical e prancha rígida. Apresenta dispneia grave, saturação de 82%, ausculta pulmonar com murmúrio abolido no hemitórax direito, hipertimpanismo à percussão e turgência jugular importante. Traqueia desviada para a esquerda. Qual a intervenção descompressiva imediata?',
      alternativas: {
        A: 'Aguardar tomografia computadorizada de tórax',
        B: 'Toracocentese descompressiva com cateter calibroso no 4º ou 5º espaço intercostal, entre as linhas axilar anterior e média',
        C: 'Intubação orotraqueal imediata sem descompressão prévia',
        D: 'Drenagem de tórax em selo d água após raio-X de confirmação',
      },
      resposta_correta: 'B',
      justificativa:
        'Trata-se de pneumotórax hipertensivo, uma emergência com diagnóstico clínico. O ATLS 10ª edição preconiza a descompressão imediata por toracocentese no 4º ou 5º espaço intercostal na linha axilar anterior/média (ou no 2º espaço na linha hemiclavicular).',
    },
    {
      id: 'sem-q6',
      enunciado:
        'Lactente de 5 meses apresenta tosse, coriza e febre baixa há 3 dias. Hoje evoluiu com taquipneia (FR 58 irpm), batimento de asa de nariz e tiragem subcostal. Ausculta: sibilos expiratórios disseminados e estertores crepitantes esparsos. O diagnóstico provável é Bronquiolite Viral Aguda. De acordo com as diretrizes da SBP, a conduta recomendada é:',
      alternativas: {
        A: 'Nebulização contínua com salbutamol e corticoide oral.',
        B: 'Antibioticoterapia empírica com amoxicilina.',
        C: 'Oxigenoterapia se SpO2 < 90-92%, lavagem nasal com soro fisiológico e hidratação adequada.',
        D: 'Fisioterapia respiratória motora forçada na fase aguda.',
      },
      resposta_correta: 'C',
      justificativa:
        'A bronquiolite viral aguda (geralmente por VSR) não tem benefício comprovado com o uso rotineiro de broncodilatadores, corticoides ou antibióticos. O manejo preconizado é de suporte: oxigenoterapia conforme saturação, desobstrução das vias aéreas superiores com soro fisiológico e manutenção da hidratação.',
    },
    {
      id: 'sem-q7',
      enunciado:
        'Em uma cidade de 100.000 habitantes, foram diagnosticados 250 novos casos de tuberculose no ano de 2025. Ao mesmo tempo, havia 400 casos totais de indivíduos em tratamento na cidade. Qual indicador epidemiológico é representado pela taxa de 250 casos por 100.000 habitantes no período?',
      alternativas: {
        A: 'Prevalência',
        B: 'Incidência',
        C: 'Letalidade',
        D: 'Mortalidade proporcional',
      },
      resposta_correta: 'B',
      justificativa:
        'A incidência mede a frequência de casos novos surgidos em uma determinada população durante um período específico. Já a prevalência mede os casos existentes (novos + antigos) em um momento determinado.',
    },
    {
      id: 'sem-q8',
      enunciado:
        'Homem de 62 anos hipertenso e tabagista procura a emergência com dor retroesternal em queimação e opressão há 40 minutos, com irradiação para mandíbula e membro superior esquerdo. ECG revela supra de segmento ST de 3mm em DII, DIII e aVF. O tempo estimado de transferência para um centro com hemodinâmica é de 45 minutos. Qual a estratégia de reperfusão preferencial?',
      alternativas: {
        A: 'Trombólise química imediata no pronto-socorro com Tenecteplase.',
        B: 'Angioplastia coronária primária, pois o tempo porta-balão estimado é menor que 120 minutos.',
        C: 'Administrar apenas heparina e esperar evolução das enzimas cardíacas.',
        D: 'Prescrever nitrato sublingual e aguardar 6 horas para repetir o eletrocardiograma.',
      },
      resposta_correta: 'B',
      justificativa:
        'No IAM com supra de ST, a intervenção coronária percutânea (angioplastia primária) é a estratégia de escolha quando pode ser realizada em até 120 minutos do primeiro contato médico. Com tempo de transporte de 45 minutos, o limite preconizado é plenamente atingível.',
    },
    {
      id: 'sem-q9',
      enunciado:
        'Paciente feminina, 38 anos, relata dor em cólica intensa no hipocôndrio direito após ingestão de alimentos gordurosos, com parada da inspiração profunda à palpação do rebordo costal direito. Qual sinal semiológico foi detectado e qual a principal hipótese diagnóstica?',
      alternativas: {
        A: 'Sinal de Murphy positivo; Colecistite aguda.',
        B: 'Sinal de Cullen positivo; Pancreatite aguda necrosante.',
        C: 'Sinal de Blumberg positivo; Apendicite pélvica.',
        D: 'Sinal de Grey-Turner positivo; Rotura de gravidez ectópica.',
      },
      resposta_correta: 'A',
      justificativa:
        'A parada da inspiração profunda durante a palpação profunda do hipocôndrio direito corresponde ao Sinal de Murphy, altamente sugestivo de colecistite aguda calculosa.',
    },
    {
      id: 'sem-q10',
      enunciado:
        'Gestante de 28 semanas, Rh negativo com Coombs indireto positivo com titulação de 1:32. Qual é a conduta diagnóstica fetal não invasiva mais indicada para avaliação de anemia fetal secundária à aloimunização Rh?',
      alternativas: {
        A: 'Amniocentese seriada semanal',
        B: 'Ultrassonografia com Doppler da velocidade sistólica máxima da artéria cerebral média fetal',
        C: 'Cordocentese de rotina imediata',
        D: 'Administração empírica de Imunoglobulina anti-D em altas doses',
      },
      resposta_correta: 'B',
      justificativa:
        'O Doppler do pico da velocidade sistólica da artéria cerebral média fetal é o método não invasivo padrão ouro para estimar a gravidade da anemia fetal em gestantes aloimunizadas com títulos críticos (>= 1:16).',
    },
  ];
}

// Generate the remaining 20 dynamic questions based on integrated themes
export function getFull30QuestionsExam(): Questao[] {
  const base10 = getInitialWeeklyQuestions();

  const additional20Data = [
    {
      enunciado: 'Homem de 45 anos com tosse produtiva e febre alta há 4 dias. Exame: estertores crepitantes em base direita, FR 24 irpm, PA 120x80 mmHg, lúcido e orientado (CURB-65 = 1). Qual o tratamento antimicrobiano ambulatorial recomendado?',
      alternativas: {
        A: 'Amoxicilina + Clavulanato isolado ou Azitromicina',
        B: 'Amoxicilina associada a Macrolídeo (ex: Claritromicina) ou Quinolona respiratória isolada',
        C: 'Vancomicina oral',
        D: 'Ceftriaxona intramuscular diária em regime hospitalar compulsório',
      },
      resposta_correta: 'B',
      justificativa: 'Pelas diretrizes brasileiras de pneumonia adquirida na comunidade (PAC), em pacientes hígidos ou com comorbidades leves tratados ambulatorialmente, a combinação de betalactâmico com macrolídeo cobre patógenos típicos e atípicos.',
    },
    {
      enunciado: 'Mulher de 32 anos no puerpério imediato apresenta sangramento vaginal abundante logo após dequitação placentária. Útero amolecido e palpável acima da cicatriz umbilical. Qual a principal causa e primeira conduta medicamentosa?',
      alternativas: {
        A: 'Laceração do trajeto; Sutura em fio cromado.',
        B: 'Atonia uterina; Massagem uterina bimanual de Hamilton e Ocitocina intravenosa.',
        C: 'Retenção de restos placentários; Curetagem uterina de urgência imediata.',
        D: 'Coagulopatia congênita; Transfusão de crioprecipitado.',
      },
      resposta_correta: 'B',
      justificativa: 'A atonia uterina responde por 70-80% das hemorragias pós-parto imediatas. A conduta inicial inclui massagem uterina e uterotônicos imediatos, iniciando com Ocitocina.',
    },
    {
      enunciado: 'Criança de 3 anos é levada ao posto de saúde após ingestão acidental de produto de limpeza à base de soda cáustica (álcali forte) há 30 minutos. Está chorosa e com sialorreia. Qual conduta é PROIBIDA no atendimento inicial?',
      alternativas: {
        A: 'Provocar vômitos ou administrar substâncias ácidas para neutralização.',
        B: 'Manter a criança em jejum oral absoluto.',
        C: 'Avaliar estabilidade de vias aéreas e saturação de O2.',
        D: 'Programar endoscopia digestiva alta precoce (em 12 a 24 horas).',
      },
      resposta_correta: 'A',
      justificativa: 'Na ingestão de cáusticos, induzir o vômito ou tentar neutralização química com ácidos provoca reexposição esofágica e reação exotérmica, aumentando drasticamente o risco de perfuração e estenose.',
    },
    {
      enunciado: 'Na avaliação de um teste diagnóstico para diabetes em fase pré-clínica, observou-se alta taxa de verdadeiros positivos e baixíssima taxa de falsos negativos. Essa característica traduz alta:',
      alternativas: {
        A: 'Especificidade',
        B: 'Sensibilidade',
        C: 'Valor preditivo positivo',
        D: 'Acurácia aparente',
      },
      resposta_correta: 'B',
      justificativa: 'Sensibilidade é a capacidade do teste em identificar corretamente os indivíduos verdadeiramente doentes (poucos falsos negativos). É a propriedade mais desejada em testes de triagem e rastreamento.',
    },
    {
      enunciado: 'Homem de 70 anos com dor lombar há 2 semanas que piora à deambulação, acompanhada de perda de força no membro inferior direito e incontinência urinária de início recente. Ao exame: anestesia em sela e tônus anal diminuído. Qual a hipótese diagnóstica de emergência neurocirúrgica?',
      alternativas: {
        A: 'Síndrome da cauda equina',
        B: 'Lombalgia mecânica postural',
        C: 'Espondilólise lítica congênita',
        D: 'Neuropatia periférica diabética simétrica',
      },
      resposta_correta: 'A',
      justificativa: 'A síndrome da cauda equina é caracterizada por déficit neurológico motor/sensitivo em MMII, anestesia em sela e disfunção esfincteriana (urinária ou fecal). Exige descompressão cirúrgica de emergência.',
    },
    {
      enunciado: 'Em relação ao rastreamento do câncer de colo uterino no Brasil segundo as diretrizes do Ministério da Saúde / INCA, qual a faixa etária recomendada e a periodicidade do exame citopatológico após dois exames anuais normais?',
      alternativas: {
        A: '18 aos 60 anos; a cada 2 anos.',
        B: '25 aos 64 anos; a cada 3 anos.',
        C: '30 aos 70 anos; a cada 5 anos.',
        D: 'Qualquer idade com vida sexual ativa; anual indefinidamente.',
      },
      resposta_correta: 'B',
      justificativa: 'O rastreamento pelo método de Papanicolaou é recomendado para mulheres de 25 a 64 anos que já iniciaram atividade sexual. Após dois exames anuais consecutivos negativos, o exame deve ser repetido a cada 3 anos.',
    },
    {
      enunciado: 'Paciente admitido com quadro de sepse de foco pulmonar. Apresenta lactato sérico de 3,8 mmol/L e hipotensão arterial com PAM de 55 mmHg refratária à ressuscitação volêmica com cristaloides (30 mL/kg). Qual o vasopressor de primeira linha indicado para restaurar a PAM >= 65 mmHg?',
      alternativas: {
        A: 'Dopamina',
        B: 'Noradrenalina',
        C: 'Adrenalina',
        D: 'Fenilefrina',
      },
      resposta_correta: 'B',
      justificativa: 'Pelas diretrizes do Surviving Sepsis Campaign, a Noradrenalina é o vasopressor de primeira escolha no choque séptico devido à sua potência vasoconstritora alfa-1 com menor indução de taquiarritmias quando comparada à dopamina.',
    },
    {
      enunciado: 'Um jovem de 19 anos sofreu queimadura térmica de 2º grau superficial em toda a extensão do membro superior direito e na face anterior do tronco. Utilizando a Regra dos Nove de Wallace, qual é a porcentagem aproximada de superfície corporal queimada?',
      alternativas: {
        A: '18%',
        B: '27%',
        C: '36%',
        D: '45%',
      },
      resposta_correta: 'B',
      justificativa: 'Pela Regra dos Nove de Wallace no adulto: Membro superior inteiro = 9%; Tronco anterior = 18%. Somando 9% + 18% = 27% de superfície corpórea queimada.',
    },
    {
      enunciado: 'Primigesta de 30 anos com 39 semanas de gestação entra em trabalho de parto ativo: dilatação cervical de 5 cm, colo 90% esvaecido, 3 contrações moderadas a cada 10 minutos. Qual a conduta obstétrica recomendada segundo a OMS e FEBRASGO?',
      alternativas: {
        A: 'Amniotomia imediata e infusão profilática de ocitocina.',
        B: 'Apoio contínuo, estímulo à livre movimentação e ausculta intermitente dos batimentos cardíacos fetais.',
        C: 'Encaminhamento mandatário para parto cesárea.',
        D: 'Repouso absoluto no leito em decúbito dorsal horizontal.',
      },
      resposta_correta: 'B',
      justificativa: 'Em trabalho de parto com evolução fisiológica, preconizam-se medidas humanizadas de suporte: estímulo à livre movimentação, presença de acompanhante, métodos não farmacológicos de alívio da dor e monitorização com ausculta intermitente.',
    },
    {
      enunciado: 'Paciente diabético tipo 2 de 50 anos apresenta hemoglobina glicada (HbA1c) de 9,2% sob uso de metformina 2g/dia. Não possui doença cardiovascular estabelecida ou insuficiência renal. De acordo com as diretrizes da Sociedade Brasileira de Diabetes, a melhor conduta é:',
      alternativas: {
        A: 'Manter monoterapia e reforçar dieta por mais 6 meses.',
        B: 'Associar uma segunda classe de antidiabético (ex: iSGLT2 ou análogo de GLP-1 ou sulfonilureia).',
        C: 'Suspender a metformina e iniciar apenas dieta cetogênica.',
        D: 'Prescrever insulina NPH e regular em 4 doses sem metformina.',
      },
      resposta_correta: 'B',
      justificativa: 'Com HbA1c distante da meta (< 7%), a diretriz recomenda intensificação rápida associando um segundo fármaco à metformina, priorizando iSGLT2 ou análogos de GLP-1 para proteção metabólica e cardiorrenal.',
    },
    {
      enunciado: 'Homem de 35 anos apresenta febre, sudorese noturna e perda de 6 kg no último mês. Exame físico revela linfonodomegalia cervical indolor, elástica e aderida aos planos profundos. A biópsia excisional revela células gigantes multinucleadas com núcleos em "olhos de coruja" (Reed-Sternberg). Esse achado confirma:',
      alternativas: {
        A: 'Linfoma de Hodgkin',
        B: 'Linfoma Não-Hodgkin Difuso de Grandes Células B',
        C: 'Tuberculose ganglionar caseosa',
        D: 'Toxoplasmose subaguda',
      },
      resposta_correta: 'A',
      justificativa: 'A presença de células de Reed-Sternberg em um infiltrado inflamatório reacional característico é o marcador histopatológico definidor do Linfoma de Hodgkin.',
    },
    {
      enunciado: 'Lactente de 8 meses sem antecedentes mórbidos apresenta febre alta súbita (39,5°C) que dura 3 dias, sem sintomas respiratórios ou digestivos. No 4º dia, a febre cessa subitamente e surge um exantema maculopapular róseo no tronco, que se espalha para pescoço e membros. O diagnóstico mais provável é:',
      alternativas: {
        A: 'Sarampo',
        B: 'Escarlatina',
        C: 'Exantema Súbito (Roséola Infantil)',
        D: 'Eritema Infeccioso',
      },
      resposta_correta: 'C',
      justificativa: 'O exantema súbito (roséola, causada pelo herpesvírus humano tipo 6) é caracterizado pelo desaparecimento da febre alta coincidindo exatamente com o surgimento do rash maculopapular predominantemente no tronco.',
    },
    {
      enunciado: 'Na abordagem de uma parada cardiorrespiratória em ritmo chocável (Fibrilação Ventricular ou TV sem pulso) no suporte avançado de vida (ACLS), após o primeiro choque e 2 minutos de RCP de alta qualidade, o ritmo persiste chocável. Qual a droga e momento indicado para sua primeira administração?',
      alternativas: {
        A: 'Amiodarona 300mg imediatamente após o primeiro choque.',
        B: 'Epinefrina (Adrenalina) 1mg IV após o segundo choque durante os ciclos de compressão.',
        C: 'Atropina 1mg IV.',
        D: 'Bicarbonato de Sódio 8,4% profilático.',
      },
      resposta_correta: 'B',
      justificativa: 'No algoritmo de ritmos chocáveis do ACLS: após o 2º choque e reavaliação com persistência da PCR, administra-se a primeira dose de Epinefrina 1mg IV/IO a cada 3 a 5 minutos. Amiodarona entra após o 3º choque.',
    },
    {
      enunciado: 'Paciente de 68 anos com dor súbita e intensa em membros inferiores, palidez e frialdade no pé direito, associado à ausência de pulso pedioso e tibial posterior ipsilaterais. Apresenta fibrilação atrial crônica sem anticoagulação regular. Qual o diagnóstico clínico?',
      alternativas: {
        A: 'Oclusão arterial aguda de membro inferior direito por embolia',
        B: 'Trombose venosa profunda íleo-femoral',
        C: 'Erisipela bolhosa com celulite difusa',
        D: 'Neuropatia compressiva do ciático',
      },
      resposta_correta: 'A',
      justificativa: 'Os "6 Ps" da oclusão arterial aguda são: Pain (dor), Pallor (palidez), Pulselessness (ausência de pulsos), Paresthesia (parestesia), Paralysis (paralisia) e Poikilothermia (frialdade). A FA não anticoagulada é a fonte embólica clássica.',
    },
    {
      enunciado: 'Qual dos seguintes tipos de estudo epidemiológico é considerado observacional, longitudinal, parte de uma população exposta e não exposta a determinado fator de risco e avalia a incidência de novos desfechos ao longo do tempo?',
      alternativas: {
        A: 'Estudo Transversal (Seccional)',
        B: 'Estudo de Coorte',
        C: 'Estudo de Caso-Controle',
        D: 'Ensaio Clínico Randomizado',
      },
      resposta_correta: 'B',
      justificativa: 'O estudo de Coorte parte da exposição para o desfecho, acompanhando participantes no tempo para calcular incidência e risco relativo (RR).',
    },
    {
      enunciado: 'Mulher de 22 anos, sexualmente ativa, comparece com queixa de corrimento vaginal acinzentado, com odor fétido semelhante a peixe podre que piora após a menstruação e relação sexual. Ao exame a fresco, visualizam-se "clue cells" (células-guia) e teste das aminas (Whiff test) positivo. Qual o tratamento de primeira escolha?',
      alternativas: {
        A: 'Metronidazol oral 500mg 2x/dia por 7 dias ou gel vaginal',
        B: 'Fluconazol oral 150mg em dose única',
        C: 'Ceftriaxona 500mg IM + Azitromicina 1g VO',
        D: 'Nistatina creme vaginal por 14 noites',
      },
      resposta_correta: 'A',
      justificativa: 'O quadro fecha critérios de Amsel para Vaginose Bacteriana (Gardnerella vaginalis). O tratamento de escolha é Metronidazol oral ou tópico vaginal.',
    },
    {
      enunciado: 'Criança de 6 anos com febre e lesões vesiculares e crostosas em diferentes estágios evolutivos (pleomorfismo regional) disseminadas pelo couro cabeludo, tronco e mucosas, com intenso prurido. Qual o diagnóstico e medida preventiva pós-exposição para contactantes suscetíveis imunocompetentes?',
      alternativas: {
        A: 'Varicela; Vacina contra varicela até 72 a 120 horas após o contato.',
        B: 'Rubéola; Imunoglobulina venosa em até 24 horas.',
        C: 'Impetigo bolhoso; Antibioticoterapia tópica profilática.',
        D: 'Doença Mão-Pé-Boca; Isolamento sem necessidade de imunoprofilaxia.',
      },
      resposta_correta: 'A',
      justificativa: 'O polimorfismo regional (mácula, pápula, vesícula e crosta simultâneas) é característico da Varicela. Para contactantes domiciliares suscetíveis imunocompetentes com >= 9 meses, a vacina pode ser administrada até 72-120h pós-exposição.',
    },
    {
      enunciado: 'Paciente internado no pós-operatório de gastroplastia evolui no 4º dia com dor torácica pleurítica súbita, taquipneia (FR 28 irpm) e taquicardia sinusal no ECG. A gasometria arterial demonstra hipoxemia com alcalose respiratória. Qual o exame padrão ouro para confirmar Tromboembolismo Pulmonar (TEP)?',
      alternativas: {
        A: 'Angiotomografia computadorizada de artérias pulmonares',
        B: 'Raio-X simples de tórax em PA e perfil',
        C: 'Ecocardiograma transtorácico isolado',
        D: 'Gasometria arterial seriada',
      },
      resposta_correta: 'A',
      justificativa: 'A Angio-TC de tórax com contraste para protocolo de TEP é o exame de escolha diagnóstica com alta sensibilidade e especificidade para visualização de falhas de enchimento tromboembólicas nas artérias pulmonares.',
    },
    {
      enunciado: 'Em um paciente com acidocetose diabética (CAD), após expansão inicial vigorosa com soro fisiológico a 0,9% e início de insulina regular em bomba, a glicemia atinge 250 mg/dL. Qual ajuste deve ser realizado na fluidoterapia?',
      alternativas: {
        A: 'Suspender a insulina imediatamente para evitar hipoglicemia.',
        B: 'Adicionar solução de glicose a 5% à hidratação venosa mantendo a infusão de insulina.',
        C: 'Administrar bicarbonato de sódio em bólus.',
        D: 'Aumentar a vazão de soro fisiológico para 1.000 mL/h sem glicose.',
      },
      resposta_correta: 'B',
      justificativa: 'Quando a glicemia atinge 200 a 250 mg/dL na CAD, deve-se adicionar soro glicosado a 5% para evitar hipoglicemia e edema cerebral, mantendo a insulinoterapia até que a cetose/acidose seja resolvida (gap anterm normal e bicarbonato > 18).',
    },
    {
      enunciado: 'Homem de 29 anos, após briga de trânsito, sofre ferimento por arma branca no 4º espaço intercostal esquerdo. Dá entrada sonolento, com PA 70x40 mmHg, bulhas cardíacas hipofonéticas e turgência jugular visível. A tríade descrita (Tríade de Beck) indica:',
      alternativas: {
        A: 'Tamponamento Cardíaco',
        B: 'Pneumotórax Hipertensivo',
        C: 'Hemotórax Maciço',
        D: 'Contusão Miocárdica Simples',
      },
      resposta_correta: 'A',
      justificativa: 'A Tríade de Beck (hipotensão arterial, abafamento de bulhas cardíacas e turgência jugular) é o achado clássico de Tamponamento Cardíaco, exigindo pericardiocentese descompressiva imediata ou toracotomia.',
    },
  ];

  const parsedAdditional: Questao[] = additional20Data.map((d, index) => ({
    id: `sem-q${index + 11}`,
    enunciado: d.enunciado,
    alternativas: d.alternativas as any,
    resposta_correta: d.resposta_correta as any,
    justificativa: d.justificativa,
  }));

  return [...base10, ...parsedAdditional];
}

export function createDefaultGroup(userProfile: UserProfile): GrupoEstudo {
  return {
    id: 'grp-elite-med-2026',
    nome: 'Elite Internato & Residência Médica 2026',
    descricao:
      'Grupo colaborativo de discussão de casos, compartilhamento de materiais e prova semanal integrativa para aprovação em Residência / ENAMED.',
    codigoConvite: 'MED-7749',
    criadoEm: '15/02/2026',
    membros: [
      {
        id: 'usr-current',
        nome: userProfile.nome || 'Ítallo Carvalho',
        avatar: (userProfile.nome || 'I').charAt(0).toUpperCase(),
        isCurrentUser: true,
        instituicao: userProfile.instituicao || 'Faculdade de Medicina',
        foco: userProfile.focoPrincipal || 'ENAMED / Residência Médica',
        questoesSemana: 28,
        questoesTotal: 142,
        acertosSemana: 24,
        taxaAcertoSemana: 86,
        pontosTotais: 320,
        temasEstudados: [
          'Clínica Médica: Insuficiência Cardíaca e DAC',
          'Preventiva: Indicadores de Saúde e SUS',
        ],
        materiaisCompartilhados: [
          {
            id: 'mat-1',
            titulo: 'Resumo Diretrizes SBC - Insuficiência Cardíaca',
            tema: 'Cardiologia',
            data: '22/09/2026',
          },
        ],
      },
      {
        id: 'usr-camila',
        nome: 'Dra. Camila Vasconcelos',
        avatar: 'C',
        instituicao: 'Hospital das Clínicas / FMUSP',
        foco: 'Pediatria & Terapia Intensiva Pediátrica',
        questoesSemana: 34,
        questoesTotal: 215,
        acertosSemana: 30,
        taxaAcertoSemana: 88,
        pontosTotais: 395,
        temasEstudados: [
          'Pediatria: Reanimação Neonatal em Sala de Parto',
          'Pediatria: Bronquiolite e Asma na Infância',
        ],
        materiaisCompartilhados: [
          {
            id: 'mat-2',
            titulo: 'Diretriz SBP 2024 - Reanimação Neonatal no Parto',
            tema: 'Pediatria',
            data: '21/09/2026',
          },
        ],
        provaSemanalResultado: {
          notaPercent: 90,
          acertos: 27,
          total: 30,
          tempoSegundos: 1420,
          realizadaEm: 'Ontem às 19:40',
        },
      },
      {
        id: 'usr-lucas',
        nome: 'Dr. Lucas Mendes',
        avatar: 'L',
        instituicao: 'Escola Paulista de Medicina (EPM/UNIFESP)',
        foco: 'Clínica Médica & Cardiologia Intervencionista',
        questoesSemana: 38,
        questoesTotal: 198,
        acertosSemana: 31,
        taxaAcertoSemana: 82,
        pontosTotais: 375,
        temasEstudados: [
          'Cardiologia: Síndromes Coronarianas Agudas (SCA)',
          'Terapia Intensiva: Sepse e Choque Séptico',
        ],
        materiaisCompartilhados: [
          {
            id: 'mat-3',
            titulo: 'Condutas no Choque Séptico e Surviving Sepsis',
            tema: 'Terapia Intensiva',
            data: '20/09/2026',
          },
        ],
        provaSemanalResultado: {
          notaPercent: 83,
          acertos: 25,
          total: 30,
          tempoSegundos: 1610,
          realizadaEm: 'Ontem às 21:15',
        },
      },
      {
        id: 'usr-beatriz',
        nome: 'Dra. Beatriz Rocha',
        avatar: 'B',
        instituicao: 'Faculdade de Ciências Médicas (UNICAMP)',
        foco: 'Cirurgia Geral & Trauma Cirúrgico',
        questoesSemana: 25,
        questoesTotal: 160,
        acertosSemana: 21,
        taxaAcertoSemana: 84,
        pontosTotais: 290,
        temasEstudados: [
          'Cirurgia Geral: Abdome Agudo e Pancreatite Aguda',
          'Trauma: Protocolo ATLS 10ª Edição e Conduta no Choque Hemorrágico',
        ],
        materiaisCompartilhados: [
          {
            id: 'mat-4',
            titulo: 'Algoritmo Diagnóstico no Abdome Agudo Cirúrgico',
            tema: 'Cirurgia Geral',
            data: '23/09/2026',
          },
        ],
      },
      {
        id: 'usr-rafael',
        nome: 'Dr. Rafael Nogueira',
        avatar: 'R',
        instituicao: 'Faculdade de Medicina de Ribeirão Preto (USP)',
        foco: 'Ginecologia & Obstetrícia de Alto Risco',
        questoesSemana: 22,
        questoesTotal: 135,
        acertosSemana: 17,
        taxaAcertoSemana: 77,
        pontosTotais: 245,
        temasEstudados: [
          'Obstetrícia: Síndromes Hipertensivas e Pré-Eclâmpsia',
          'Obstetrícia: Hemorragias Pós-Parto e Atonia',
        ],
        materiaisCompartilhados: [
          {
            id: 'mat-5',
            titulo: 'Protocolo FEBRASGO - Manejo de Pré-Eclâmpsia',
            tema: 'Obstetrícia',
            data: '19/09/2026',
          },
        ],
      },
    ],
    provaSemanal: {
      id: 'prov-semana-3',
      semanaNumero: 3,
      titulo: 'Simulado Geral Integrado da Semana #3 (30 Questões)',
      dataTermino: 'Domingo às 23:59',
      totalQuestoes: 30,
      temasIncluidos: DEFAULT_WEEKLY_THEMES,
      recompensas: {
        primeiroLugar: 50,
        segundoLugar: 30,
        terceiroLugar: 15,
        participacao: 5,
      },
      concluida: false,
    },
  };
}

export function getStudyGroups(userProfile: UserProfile): GrupoEstudo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GrupoEstudo[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync current user's profile info
        return parsed.map((grp) => {
          const updatedMembros = grp.membros.map((m) => {
            if (m.isCurrentUser) {
              return {
                ...m,
                nome: userProfile.nome || m.nome,
                instituicao: userProfile.instituicao || m.instituicao,
                foco: userProfile.focoPrincipal || m.foco,
                avatar: (userProfile.nome || 'I').charAt(0).toUpperCase(),
              };
            }
            return m;
          });
          return { ...grp, membros: updatedMembros };
        });
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar grupos de estudos:', err);
  }

  const defaultGroup = createDefaultGroup(userProfile);
  saveStudyGroups([defaultGroup]);
  return [defaultGroup];
}

export function saveStudyGroups(groups: GrupoEstudo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (err) {
    console.warn('Erro ao salvar grupos de estudos no localStorage:', err);
  }
}

export function getActiveGroupId(): string {
  try {
    return localStorage.getItem(ACTIVE_GROUP_ID_KEY) || 'grp-elite-med-2026';
  } catch {
    return 'grp-elite-med-2026';
  }
}

export function setActiveGroupId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_GROUP_ID_KEY, id);
  } catch (e) {
    console.error(e);
  }
}

export function syncUserStatsInGroup(
  group: GrupoEstudo,
  userProfile: UserProfile,
  totalQuestoes: number,
  taxaAcertoGeral: number
): GrupoEstudo {
  const updatedMembros = group.membros.map((m) => {
    if (m.isCurrentUser) {
      const currentWeekBonus = Math.max(m.questoesSemana, totalQuestoes > 0 ? Math.min(totalQuestoes, 40) : m.questoesSemana);
      return {
        ...m,
        nome: userProfile.nome || m.nome,
        questoesTotal: Math.max(m.questoesTotal, totalQuestoes),
        questoesSemana: currentWeekBonus,
        taxaAcertoSemana: taxaAcertoGeral > 0 ? taxaAcertoGeral : m.taxaAcertoSemana,
      };
    }
    return m;
  });

  return { ...group, membros: updatedMembros };
}

export interface ExamSubmissionResult {
  group: GrupoEstudo;
  position: number;
  pointsAwarded: number;
  notaPercent: number;
  acertos: number;
  total: number;
}

export function submitWeeklyExamResult(
  group: GrupoEstudo,
  acertos: number,
  total: number,
  tempoSegundos: number
): ExamSubmissionResult {
  const notaPercent = Math.round((acertos / total) * 100);

  // Compute positions of all members based on exam score and time
  const currentExamScores = group.membros.map((m) => {
    if (m.isCurrentUser) {
      return {
        id: m.id,
        notaPercent,
        acertos,
        total,
        tempoSegundos,
      };
    }
    if (m.provaSemanalResultado) {
      return {
        id: m.id,
        notaPercent: m.provaSemanalResultado.notaPercent,
        acertos: m.provaSemanalResultado.acertos,
        total: m.provaSemanalResultado.total,
        tempoSegundos: m.provaSemanalResultado.tempoSegundos,
      };
    }
    // Simulated score for members who took it
    const simulatedPercent = Math.floor(Math.random() * 20) + 70;
    const simAcertos = Math.round((simulatedPercent / 100) * total);
    return {
      id: m.id,
      notaPercent: simulatedPercent,
      acertos: simAcertos,
      total,
      tempoSegundos: 1500,
    };
  });

  // Sort descending by score, ascending by time
  currentExamScores.sort((a, b) => {
    if (b.notaPercent !== a.notaPercent) {
      return b.notaPercent - a.notaPercent;
    }
    return a.tempoSegundos - b.tempoSegundos;
  });

  const userRankIndex = currentExamScores.findIndex((s) => s.id === 'usr-current');
  const position = userRankIndex >= 0 ? userRankIndex + 1 : 1;

  // Award points: 1st => 50 pts, 2nd => 30 pts, 3rd => 15 pts, others => 5 pts
  let pointsAwarded = 5;
  if (position === 1) pointsAwarded = 50;
  else if (position === 2) pointsAwarded = 30;
  else if (position === 3) pointsAwarded = 15;

  const updatedMembros = group.membros.map((m) => {
    if (m.isCurrentUser) {
      return {
        ...m,
        pontosTotais: m.pontosTotais + pointsAwarded,
        questoesSemana: m.questoesSemana + total,
        questoesTotal: m.questoesTotal + total,
        acertosSemana: m.acertosSemana + acertos,
        provaSemanalResultado: {
          notaPercent,
          acertos,
          total,
          tempoSegundos,
          posicaoRank: position,
          pontosGanhos: pointsAwarded,
          realizadaEm: 'Hoje',
        },
      };
    }
    return m;
  });

  const updatedGroup: GrupoEstudo = {
    ...group,
    membros: updatedMembros,
    provaSemanal: {
      ...group.provaSemanal,
      concluida: true,
    },
  };

  return {
    group: updatedGroup,
    position,
    pointsAwarded,
    notaPercent,
    acertos,
    total,
  };
}
