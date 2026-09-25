import express from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { getOfflineFallbackQuestions } from "./src/data/mockFallbacks";

dotenv.config({ path: [".env.development.local", ".env"], quiet: true });

const app = express();
const PORT = 3000;

// Allow payloads up to 50MB for PDF base64 transfer
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Gemini client to prevent crashes if key is absent
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "EstudoVag - Motor de Inteligência Médica",
    model: "gemini-3.8-flash",
  });
});

// Helper to execute Gemini requests with automatic fallback across models and intelligent backoff
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    contents: any[];
    config: any;
    primaryModel?: string;
  }
) {
  // Ordered fallback models
  const modelsToTry = [
    params.primaryModel || "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini API] Chamando modelo ${modelName} (tentativa ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return { response, usedModel: modelName };
      } catch (err: any) {
        lastError = err;
        const errMessage = (err?.message || "").toLowerCase();
        const isTransient =
          err?.status === 503 ||
          err?.code === 503 ||
          errMessage.includes("503") ||
          errMessage.includes("high demand") ||
          errMessage.includes("unavailable") ||
          errMessage.includes("resource has been exhausted") ||
          errMessage.includes("quota exceeded") ||
          errMessage.includes("rate limit") ||
          err?.status === 429;

        console.warn(`[Gemini API] Falha no modelo ${modelName} (tentativa ${attempt}):`, err?.message || err);

        // If rate limited or service overloaded and we have attempts left for this model, wait briefly
        if (isTransient && attempt < 2) {
          const waitTime = err?.status === 429 || errMessage.includes("429") ? 2000 : 1200;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        if (isTransient) {
          break; // break to try the next candidate model
        }

        // Non-transient error (e.g. invalid arguments or bad schema)
        throw err;
      }
    }
  }

  throw lastError;
}

// Generate Questions Endpoint
app.post("/api/generate-questions", async (req, res) => {
  const {
    pdfBase64,
    pdfText,
    materialNome = "Diretriz Médica",
    quantidade = 5,
    nivel = "Médio",
    estilo = "ENAMED/Revalida/Residência",
    focusPrompt = "",
    modelProvider = "gemini",
  } = req.body || {};

  const numQuestoes = Math.min(Math.max(Number(quantidade) || 5, 1), 50);

  try {
    const nivelInstrucao =
      nivel === "Mista"
        ? "Mista (Distribua as questões de forma equilibrada entre os níveis Fácil, Médio e Difícil, gerando uma mistura proporcional)"
        : `${nivel} (Fácil, Médio ou Difícil)`;

    const systemInstruction = `Você é o motor de inteligência do aplicativo EstudoVag, um preceptor médico especialista em criar e corrigir questões. Sua função é gerar questões de múltipla escolha estritamente fundamentadas em diretrizes médicas oficiais e medicina baseada em evidências.

Você deve adaptar as questões conforme os seguintes parâmetros fornecidos pelo usuário:
Quantidade: Número exato de questões solicitadas (${numQuestoes} questões).
Nível: ${nivelInstrucao}.
Estilo:
- Se for ENAMED/Revalida/Residência: Crie um caso clínico detalhado (anamnese, exame físico completo com sinais vitais, exames complementares/laboratoriais) seguido de uma pergunta direta sobre diagnóstico mais provável, conduta imediata ou farmacoterapia de escolha.
- Se for Normal: Questões diretas e conceituais, explorando mecanismos fisiopatológicos, critérios formais ou esquemas posológicos.

Regras estritas:
1. Gere EXATAMENTE ${numQuestoes} questões de múltipla escolha com 4 alternativas cada (A, B, C, D).
2. Baseie todo o conteúdo estritamente nas diretrizes médicas presentes no material fornecido.
3. Para cada questão, indique a alternativa correta ("A", "B", "C" ou "D") e forneça uma justificativa rica e didática explicando detalhadamente o porquê do acerto e por que as alternativas distratoras estão erradas.
4. Responda em Português do Brasil com terminologia médica impecável.`;

    const userPrompt = `MATERIAL DE ESTUDO: "${materialNome || "Material Clínico"}".
PARÂMETROS SOLICITADOS:
- Quantidade exata: ${numQuestoes} questões
- Nível de dificuldade: ${nivel}
- Estilo: ${estilo}
${focusPrompt ? `- Foco adicional solicitado pelo aluno: ${focusPrompt}` : ""}

Crie as ${numQuestoes} questões no formato JSON especificado.`;

    const ai = getAIClient();

    let contentsPayload: any[];

    if (pdfBase64 && typeof pdfBase64 === "string" && pdfBase64.length > 50) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "").trim();
      contentsPayload = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: cleanBase64,
          },
        },
        {
          text: userPrompt,
        },
      ];
    } else if (pdfText && typeof pdfText === "string") {
      contentsPayload = [
        {
          text: `CONTEÚDO DO MATERIAL MÉDICO:\n${pdfText}\n\n---\n${userPrompt}`,
        },
      ];
    } else {
      contentsPayload = [
        {
          text: `Tema Geral: Medicina de Família e Comunidade / Clínica Médica.\n${userPrompt}`,
        },
      ];
    }

    const { response, usedModel } = await generateContentWithRetry(ai, {
      primaryModel: "gemini-3.8-flash",
      contents: contentsPayload,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Lista de questões de múltipla escolha geradas pelo preceptor EstudoVag",
          items: {
            type: Type.OBJECT,
            properties: {
              enunciado: {
                type: Type.STRING,
                description: "Enunciado da questão (caso clínico ou questão conceitual)",
              },
              alternativas: {
                type: Type.OBJECT,
                description: "Alternativas de A a D",
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ["A", "B", "C", "D"],
              },
              resposta_correta: {
                type: Type.STRING,
                description: "Letra da alternativa correta (A, B, C ou D)",
              },
              justificativa: {
                type: Type.STRING,
                description: "Justificativa médica detalhada e didática citando o material",
              },
            },
            required: ["enunciado", "alternativas", "resposta_correta", "justificativa"],
          },
        },
      },
    });

    const outputText = response.text || "[]";
    let questoes = [];
    try {
      questoes = JSON.parse(outputText);
    } catch (parseError) {
      console.error("Falha ao analisar JSON retornado:", parseError, outputText);
      const match = outputText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        questoes = JSON.parse(match[0]);
      } else {
        throw new Error("Formato de questões inválido gerado pelo modelo.");
      }
    }

    return res.json({
      success: true,
      provider: modelProvider,
      modeloUsado: usedModel,
      questoes,
      isContingency: false,
    });
  } catch (err: any) {
    console.error("Erro na geração de questões pelo Gemini:", err?.message || err);

    // Resilient fallback: Provide clinically validated ENAMED/Revalida questions so student never loses study flow
    const backupQuestions = getOfflineFallbackQuestions(
      materialNome,
      numQuestoes,
      nivel,
      estilo
    );

    return res.json({
      success: true,
      provider: modelProvider,
      modeloUsado: "contingencia-medica",
      isContingency: true,
      contingencyNotice: "A API do Gemini está momentaneamente sob pico de demanda ou cota excedida (503/429). Ativamos o banco clínico de contingência referenciado em diretrizes oficiais (SBC, FEBRASGO, SBP, CAB) para você continuar estudando sem interrupções.",
      questoes: backupQuestions,
    });
  }
});

// Tutor Chat Endpoint (streaming via Vercel AI Gateway)
const TUTOR_SYSTEM_PROMPT = `Você é o Preceptor Clínico do EstudoVag: um médico preceptor experiente, didático e acolhedor, que prepara estudantes e médicos para ENAMED, Revalida, Residência e Provas de Título.

Princípios:
- Fundamente toda conduta em diretrizes oficiais e atuais (Ministério da Saúde/SUS, CFM, SBC, SBP, FEBRASGO, SBIm, AMIB, Cadernos de Atenção Básica, ACLS/PALS/ATLS) e cite a fonte ao final.
- Seja preciso com doses, critérios diagnósticos, janelas terapêuticas e contraindicações. Se houver divergência entre diretrizes ou incerteza, diga explicitamente.
- Nunca invente referências. Não substitua avaliação médica real de pacientes.

Formato (Markdown):
- Comece com uma frase direta respondendo à pergunta.
- Use seções curtas com títulos em negrito quando fizer sentido: **Raciocínio clínico**, **Por que sua alternativa está incorreta** (se o aluno errou), **Conduta recomendada**, **Pegadinha de prova**, **Referência**.
- Use listas e tabelas curtas para comparar diagnósticos diferenciais ou alternativas.
- Seja conciso: priorize alto rendimento para prova. Termine, quando útil, com uma pergunta rápida de fixação para o aluno.`;

function buildTutorContext(questao: any, materialNome?: string, materialTexto?: string) {
  let context = "";
  if (questao?.enunciado) {
    const alts = questao.alternativas || {};
    context += `\n[QUESTÃO EM FOCO]\nEnunciado: ${questao.enunciado}\n` +
      Object.entries(alts).map(([k, v]) => `${k}) ${v}`).join("\n") +
      `\nGabarito: ${questao.resposta_correta ?? "não informado"}` +
      `\nJustificativa oficial: ${questao.justificativa ?? "não informada"}` +
      `\nAlternativa marcada pelo aluno: ${questao.selectedAnswer ?? "não informada"}\n`;
  }
  if (typeof materialTexto === "string" && materialTexto.trim()) {
    context += `\n[MATERIAL DE ESTUDO${materialNome ? `: ${materialNome}` : ""}]\n${materialTexto.slice(0, 4000)}\n`;
  }
  return context;
}

app.post("/api/tutor-chat", async (req, res) => {
  const { mensagem, historico, questaoAtual, materialNome, materialTexto } = req.body || {};

  if (typeof mensagem !== "string" || !mensagem.trim() || mensagem.length > 4000) {
    return res.status(400).json({ error: "Mensagem inválida." });
  }

  const history = (Array.isArray(historico) ? historico : [])
    .slice(-10)
    .filter((m: any) => typeof m?.text === "string" && (m.role === "user" || m.role === "assistant"))
    .map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: (m.text as string).slice(0, 4000) }],
    }));

  const context = buildTutorContext(questaoAtual, materialNome, materialTexto);
  const systemInstruction = context
    ? `${TUTOR_SYSTEM_PROMPT}\n\nContexto de apoio (use-o para personalizar a resposta):${context}`
    : TUTOR_SYSTEM_PROMPT;

  try {
    const ai = getAIClient();
    const contentsPayload = [
      ...history,
      {
        role: "user",
        parts: [{ text: mensagem.trim() }],
      },
    ];

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let streamResult;
    try {
      streamResult = await ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents: contentsPayload,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });
    } catch (firstErr: any) {
      console.warn("[Tutor Gemini Stream] Falha com gemini-3.8-flash, tentando gemini-2.5-flash:", firstErr?.message);
      streamResult = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: contentsPayload,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });
    }

    for await (const chunk of streamResult) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (err: any) {
    console.error("Erro no chat do tutor:", err?.message || err);
    if (!res.headersSent) {
      res.status(503).json({ error: "O preceptor está indisponível no momento. Tente novamente." });
    } else {
      res.write("\n\n*(Nota: A transmissão do preceptor foi interrompida. Por favor, tente enviar sua pergunta novamente.)*");
      res.end();
    }
  }
});

// Vite middleware or production static serving
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    // Share the HMR WebSocket with the app's HTTP server so it works behind
    // proxies that only expose the app port (Vite defaults to a separate port).
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
        ws: process.env.DISABLE_HMR === "true" ? false : { server: httpServer },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`EstudoVag Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
