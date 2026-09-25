export interface OfflineFallbackQuestion {
  enunciado: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  resposta_correta: 'A' | 'B' | 'C' | 'D';
  justificativa: string;
  tags?: string[];
}

export const QUESTOES_CONTINGENCIA_MEDICA: OfflineFallbackQuestion[] = [
  {
    enunciado:
      "Paciente do sexo feminino, 34 anos, comparece à Unidade Básica de Saúde queixando-se de desânimo acentuado, fadiga diária e anedonia iniciados há cerca de 6 semanas após perda de emprego. Refere alteração do sono (acorda às 3h da manhã sem conseguir retomar o sono), choro fácil e perda de 4 kg no último mês. Nega planos de suicídio ou sintomas psicóticos. Ao exame físico e psíquico: afeto deprimido, lentificação psicomotora leve, sem alterações laboratoriais tireoidianas. Segundo os critérios do DSM-5-TR e do Caderno de Atenção Básica nº 34, assinale a conduta farmacológica e abordagem de primeira linha mais apropriada:",
    alternativas: {
      A: "Iniciar monoterapia com Diazepam 10 mg à noite para normalizar o padrão de sono, aguardando 30 dias para avaliar necessidade de antidepressivo.",
      B: "Iniciar Inibidor Seletivo da Recaptação de Serotonina (como Sertralina 50 mg/dia) associado a psicoterapia (TCC) e seguimento ambulatorial longitudinal.",
      C: "Prescrever Haloperidol 5 mg/dia e Amitriptilina 75 mg/dia como primeira escolha imediata pela alta eficácia anticolinérgica.",
      D: "Prescrever Fluoxetina 20 mg/dia associada obrigatoriamente a Clonazepam contínuo por no mínimo 12 meses."
    },
    resposta_correta: "B",
    justificativa:
      "A paciente preenche critérios formais para Transtorno Depressivo Maior (TDM) moderado a grave (mais de 5 sintomas por mais de 2 semanas, com presença de humor deprimido e anedonia). A diretriz nacional (CAB 34) e internacional preconizam os ISRS (como a Sertralina) como primeira escolha devido à eficácia comprovada, tolerabilidade e baixo potencial de interações adversas. Benzodiazepínicos não são antidepressivos e trazem risco de dependência e tolerância."
  },
  {
    enunciado:
      "Homem de 58 anos, hipertenso e tabagista de longa data, dá entrada na sala de emergência com dor precordial em aperto de forte intensidade (8/10), irradiada para a mandíbula e membro superior esquerdo, com 45 minutos de evolução, acompanhada de sudorese fria e náuseas. PA: 150/95 mmHg, FC: 88 bpm, SatO2: 97% em ar ambiente. O eletrocardiograma (ECG) realizado em 7 minutos da admissão evidencia supradesnivelamento do segmento ST de 3,0 mm nas derivações V1 a V4. Considerando as diretrizes da Sociedade Brasileira de Cardiologia (SBC) para Síndrome Coronariana Aguda com Supra de ST (SCACSST), qual é a conduta imediata prioritária?",
    alternativas: {
      A: "Solicitar curva seriada de troponina ultrassensível (0h e 3h) e aguardar resultado antes de iniciar antiagregação ou terapia de reperfusão.",
      B: "Administrar oxigênio sob máscara com reservatório a 10 L/min, solicitar ecocardiograma transtorácico de urgência e aguardar vaga em enfermaria.",
      C: "Ativar imediatamente estratégia de reperfusão miocárdica (angioplastia primária se tempo porta-balão < 120 min ou fibrinolítico se indisponível), além de AAS mastigado, segundo antiagregante e anticoagulação plena.",
      D: "Administrar nitrato sublingual, morfina intravenosa e encaminhar o paciente para teste ergométrico de esforço precoce."
    },
    resposta_correta: "C",
    justificativa:
      "Trata-se de um IAM com supradesnível de ST de parede anterior (V1-V4). O tempo porta-eletro foi adequado (< 10 min) e a prioridade absoluta é a reperfusão imediata (porta-balão < 90-120 min para angioplastia primária ou porta-agulha < 30 min com tenecteplase/alteplase se transferência inviável). Nunca se deve atrasar a reperfusão aguardando troponina em caso de SCACSST evidente. Oxigênio suplementar só é indicado se SatO2 < 90%."
  },
  {
    enunciado:
      "Lactente masculino de 4 meses de vida é levado à UPA pelos pais com história de tosse seca, coriza hialina e febre baixa há 3 dias. Há 24 horas evoluiu com cansaço para mamar, respiração rápida e chiado no peito. Ao exame físico: corado, hidratado, afebril no momento, FR: 58 irpm, tiragem intercostal e subcostal leves, tempo de enchimento capilar < 2s, ausculta pulmonar com sibilos e estertores subcrepitantes difusos. SatO2: 94% em ar ambiente. De acordo com a Diretriz da Sociedade Brasileira de Pediatria (SBP) sobre Bronquiolite Viral Aguda (BVA), a conduta preconizada é:",
    alternativas: {
      A: "Prescrição de Prednisolona oral (1 mg/kg/dia) por 5 dias e inalação contínua com Salbutamol a cada 20 minutos.",
      B: "Suporte com desobstrução/lavagem nasal com soro fisiológico a 0,9%, oferta fracionada de aleitamento e monitorização clínica, não sendo indicados corticoide ou broncodilatador rotineiros.",
      C: "Solicitação imediata de radiografia de tórax de rotina, hemograma completo e introdução empírica de Amoxicilina oral.",
      D: "Nebulização com adrenalina associada a fisioterapia respiratória motora vigorosa para descolamento de secreções."
    },
    resposta_correta: "B",
    justificativa:
      "A Bronquiolite Viral Aguda (BVA) tem diagnóstico estritamente clínico e etiologia viral (principalmente VSR). Evidências sólidas e diretrizes da SBP contraindicam formalmente o uso de rotina de corticosteroides (sistêmicos ou inalatórios), broncodilatadores beta-2 agonistas e antibióticos. A base do tratamento é suporte: hidratação/nutrição fracionada, aspiração/lavagem nasal cuidadosa com SF 0,9% e oxigenioterapia se SatO2 cair abaixo de 90-92%."
  },
  {
    enunciado:
      "Gestante de 32 semanas, primigesta de 24 anos, comparece à consulta de pré-natal assintomática. Ao exame obstétrico, constata-se PA de 155/100 mmHg, confirmada após 4 horas de repouso (150/100 mmHg). Exames laboratoriais revelam: Relação proteína/creatinina urinária de 0,45 mg/mg (normal < 0,3), plaquetas 185.000/mm³, Creatinina sérica 0,8 mg/dL, TGO 28 U/L e TGP 24 U/L. O feto apresenta crescimento adequado e índice de líquido amniótico normal. Com base nos consensos da FEBRASGO, qual é o diagnóstico e o manejo apropriado?",
    alternativas: {
      A: "Hipertensão Gestacional transitória; conduta expectante com alta e retorno no termo.",
      B: "Hipertensão Arterial Crônica; prescrever diuréticos tiazídicos e restrição hídrica rigorosa.",
      C: "Pré-eclâmpsia sem sinais de gravidade; manter acompanhamento materno-fetal semanal estrito, orientar sintomas de alarme e não indicar parto imediato neste momento.",
      D: "Eclâmpsia iminente; infusão imediata de Sulfato de Magnésio e indicação de cesariana de urgência nas próximas 2 horas."
    },
    resposta_correta: "C",
    justificativa:
      "A paciente apresenta hipertensão surgida após a 20ª semana gestacional com proteinúria significativa (relação P/C urinária ≥ 0,3 mg/mg), preenchendo o diagnóstico de Pré-eclâmpsia. Como não há sinais de gravidade (PA < 160/110 mmHg, plaquetas normais, sem lesão renal, hepática ou neurológica), a conduta em gestações com menos de 37 semanas é conservadora, com vigilância fetal frequente, monitorização pressórica e orientação clara de sinais de gravidade."
  },
  {
    enunciado:
      "Em relação ao tratamento das crises hipertensivas com sinais de gravidade na gestação (PA sistólica ≥ 160 mmHg ou diastólica ≥ 110 mmHg) e profilaxia de convulsões na pré-eclâmpsia grave, assinale a opção que apresenta as drogas preconizadas pela FEBRASGO:",
    alternativas: {
      A: "Nitroprussiato de Sódio contínuo para controle da PA e Diazepam intravenoso para profilaxia de convulsões.",
      B: "Hidralazina IV (ou Nifedipino oral de liberação rápida) para crise hipertensiva e Sulfato de Magnésio (esquema Zuspan ou Pritchard) para prevenção de convulsões.",
      C: "Enalapril IV para controle pressórico e Fenitoína em dose de ataque para prevenção de crises eclâmpticas.",
      D: "Atenolol oral para redução rápida da PA e Carbonato de Lítio como estabilizador neurológico profilático."
    },
    resposta_correta: "B",
    justificativa:
      "Para emergências hipertensivas gestacionais (PA ≥ 160/110 mmHg), os fármacos de primeira linha são a Hidralazina intravenosa ou o Nifedipino oral (liberação imediata). Inibidores da ECA (como Enalapril) são contraindicados na gravidez por risco de teratogenicidade e disfunção renal fetal. Para prevenção e tratamento da eclâmpsia, o Sulfato de Magnésio é a droga de escolha e padrão ouro absoluto, superior ao Diazepam e à Fenitoína."
  }
];

export function getOfflineFallbackQuestions(
  materialNome: string,
  quantidade: number = 5,
  nivel: string = "Médio",
  estilo: string = "ENAMED/Revalida/Residência"
) {
  const count = Math.min(Math.max(quantidade, 1), 50);
  const result = [];

  for (let i = 0; i < count; i++) {
    const baseIndex = i % QUESTOES_CONTINGENCIA_MEDICA.length;
    const q = QUESTOES_CONTINGENCIA_MEDICA[baseIndex];
    const cycle = Math.floor(i / QUESTOES_CONTINGENCIA_MEDICA.length);
    const prefix = cycle > 0 ? `[Caso ${i + 1} - ${materialNome || "Prática Clínica"}] ` : `[Questão Prática - ${materialNome || "Diretriz Clínica"}] `;

    result.push({
      enunciado: `${prefix}${q.enunciado}`,
      alternativas: q.alternativas,
      resposta_correta: q.resposta_correta,
      justificativa: `${q.justificativa} (Nota do Preceptor: Questão referenciada em protocolos de saúde pública e residência médica - Nível: ${nivel}).`,
    });
  }

  return result;
}
