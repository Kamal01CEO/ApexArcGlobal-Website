import {
  chatbotModel,
  chatbotResponseSchema,
  chatbotSystemPrompt
} from "../lib/chatbot-config.mjs";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const createJsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: JSON_HEADERS,
  body: JSON.stringify(payload)
});

const fallbackQuickReplies = [
  "What can ApexArc automate for my team?",
  "Can ApexArc build a custom SaaS MVP?",
  "How do projects usually start?"
];

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item && (item.role === "user" || item.role === "assistant"))
    .map((item) => ({
      role: item.role,
      content: typeof item.content === "string" ? item.content.trim().slice(0, 2400) : ""
    }))
    .filter((item) => item.content.length > 0)
    .slice(-8);
};

const extractOutputText = (responsePayload) => {
  if (typeof responsePayload.output_text === "string" && responsePayload.output_text.trim()) {
    return responsePayload.output_text;
  }

  for (const item of responsePayload.output ?? []) {
    if (item.type !== "message") {
      continue;
    }

    for (const content of item.content ?? []) {
      if ((content.type === "output_text" || content.type === "text") && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
};

const normalizeAssistantPayload = (payload) => ({
  reply:
    typeof payload.reply === "string" && payload.reply.trim()
      ? payload.reply.trim()
      : "ApexArc can help with agentic workflows, custom SaaS, chatbots, voice agents, and CRM automation. Share a little about your workflow or project and I can guide the next step.",
  shouldCaptureLead: Boolean(payload.should_capture_lead),
  qualificationStage:
    payload.qualification_stage === "interested" || payload.qualification_stage === "qualified"
      ? payload.qualification_stage
      : "early",
  suggestedNextStep:
    payload.suggested_next_step === "capture_lead" || payload.suggested_next_step === "email_cta"
      ? payload.suggested_next_step
      : "continue_chat",
  quickReplies: Array.isArray(payload.quick_replies)
    ? payload.quick_replies
        .filter((item) => typeof item === "string" && item.trim())
        .slice(0, 3)
    : fallbackQuickReplies
});

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...JSON_HEADERS,
        Allow: "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return createJsonResponse(405, {
      error: "Method not allowed."
    });
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return createJsonResponse(400, {
      error: "Invalid request payload."
    });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = normalizeHistory(body.history);

  if (!message) {
    return createJsonResponse(400, {
      error: "A message is required."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return createJsonResponse(503, {
      reply:
        "The ApexArc AI assistant is being connected right now. You can still email ceo@apexarcglobal.com with your workflow, product idea, or automation goal.",
      shouldCaptureLead: false,
      qualificationStage: "early",
      suggestedNextStep: "email_cta",
      quickReplies: fallbackQuickReplies
    });
  }

  const input = [
    ...history.map((item) => ({
      role: item.role,
      content: [{ type: "input_text", text: item.content }]
    })),
    {
      role: "user",
      content: [{ type: "input_text", text: message }]
    }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: chatbotModel,
        instructions: chatbotSystemPrompt,
        input,
        temperature: 0.5,
        max_output_tokens: 500,
        text: {
          format: {
            type: "json_schema",
            name: "apexarc_chat_response",
            strict: true,
            schema: chatbotResponseSchema
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI chat request failed", response.status, errorText);

      return createJsonResponse(502, {
        reply:
          "The assistant hit a temporary issue while preparing a response. You can try another question or email ceo@apexarcglobal.com for a direct project conversation.",
        shouldCaptureLead: false,
        qualificationStage: "early",
        suggestedNextStep: "email_cta",
        quickReplies: fallbackQuickReplies
      });
    }

    const payload = await response.json();
    const outputText = extractOutputText(payload);

    if (!outputText) {
      throw new Error("Missing structured response text.");
    }

    const parsedPayload = JSON.parse(outputText);
    const normalizedPayload = normalizeAssistantPayload(parsedPayload);

    return createJsonResponse(200, normalizedPayload);
  } catch (error) {
    console.error("Chat function failed", error);

    return createJsonResponse(500, {
      reply:
        "The ApexArc assistant is temporarily unavailable. You can still tell ApexArc about your workflow, AI, or SaaS project by emailing ceo@apexarcglobal.com.",
      shouldCaptureLead: false,
      qualificationStage: "early",
      suggestedNextStep: "email_cta",
      quickReplies: fallbackQuickReplies
    });
  }
};
