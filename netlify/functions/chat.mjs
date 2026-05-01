import {
  chatbotModel,
  chatbotResponseSchema,
  chatbotSystemPrompt
} from "../lib/chatbot-config.mjs";
import { chatbotPublicKnowledge } from "../../src/lib/chatbot-content.mjs";

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

const normalizeText = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const messageIncludes = (message, terms) => terms.some((term) => message.includes(term));

const visitorShowsIntent = (message) =>
  messageIncludes(message, [
    "need",
    "want",
    "looking for",
    "project",
    "build",
    "automate",
    "saas",
    "mvp",
    "crm",
    "chatbot",
    "voice agent",
    "ai agent",
    "internal tool",
    "workflow"
  ]);

const createFallbackPayload = (message) => {
  const text = normalizeText(message);
  const interested = visitorShowsIntent(text);

  if (messageIncludes(text, ["price", "pricing", "cost", "budget", "quote"])) {
    return {
      reply:
        "Pricing depends on the workflow, integrations, and whether you need automation, a customer-facing AI system, or a custom SaaS build. If you share the problem you want to solve, ApexArc can qualify the scope and point you to the right next step without guessing on numbers too early.",
      shouldCaptureLead: true,
      qualificationStage: "interested",
      suggestedNextStep: "capture_lead",
      quickReplies: [
        "I need an automation system",
        "I want a custom SaaS MVP",
        "What details should I share?"
      ]
    };
  }

  if (messageIncludes(text, ["timeline", "how long", "deadline", "launch", "ship"])) {
    return {
      reply:
        "Timeline depends on scope, business logic, and how much of the workflow or product already exists. ApexArc usually starts with discovery and workflow mapping first, then turns that into a realistic build path so you know what can ship quickly and what needs deeper implementation.",
      shouldCaptureLead: true,
      qualificationStage: "interested",
      suggestedNextStep: "capture_lead",
      quickReplies: [
        "How do projects start?",
        "I need help this month",
        "What do you need from me?"
      ]
    };
  }

  if (messageIncludes(text, ["saas", "mvp", "product", "app", "platform", "dashboard", "internal tool"])) {
    return {
      reply:
        "ApexArc builds custom SaaS MVPs, AI-first product features, internal platforms, and business tools for teams that need software built around their workflow. A strong fit is a founder, startup, or growing team that wants a practical first version, better internal operations, or a product that does not exist yet.",
      shouldCaptureLead: interested,
      qualificationStage: interested ? "interested" : "early",
      suggestedNextStep: interested ? "capture_lead" : "continue_chat",
      quickReplies: [
        "Can you build an MVP from an idea?",
        "Do you make internal tools?",
        "How does discovery work?"
      ]
    };
  }

  if (messageIncludes(text, ["chatbot", "voice", "phone", "call", "support", "assistant"])) {
    return {
      reply:
        "ApexArc handles website chatbots, AI agents for qualification and support, and voice agents for small businesses that need intake, call handling, or appointment support. The goal is to improve customer interaction without forcing your team to answer the same questions manually all day.",
      shouldCaptureLead: interested,
      qualificationStage: interested ? "interested" : "early",
      suggestedNextStep: interested ? "capture_lead" : "continue_chat",
      quickReplies: [
        "Do you handle voice agents too?",
        "Can this connect to our workflow?",
        "What businesses are a fit?"
      ]
    };
  }

  if (messageIncludes(text, ["crm", "workflow", "automation", "operations", "ops", "handoff"])) {
    return {
      reply:
        "ApexArc helps teams automate agentic workflows, CRM routing, follow-ups, internal approvals, and the repeated handoffs that slow operations down. The work usually starts with mapping how the process really moves today, then turning that into a cleaner automation system or custom internal tool.",
      shouldCaptureLead: interested,
      qualificationStage: interested ? "interested" : "early",
      suggestedNextStep: interested ? "capture_lead" : "continue_chat",
      quickReplies: [
        "What can you automate first?",
        "Do you build internal tools too?",
        "How do projects usually start?"
      ]
    };
  }

  if (messageIncludes(text, ["process", "start", "discovery", "how do projects"])) {
    return {
      reply:
        "Projects usually move through four steps: discovery and workflow mapping, system design and prototype direction, build and integration, then launch and iteration. ApexArc uses that process to reduce ambiguity early so the final automation or product is grounded in real business logic instead of guesswork.",
      shouldCaptureLead: interested,
      qualificationStage: interested ? "interested" : "early",
      suggestedNextStep: interested ? "capture_lead" : "continue_chat",
      quickReplies: [
        "What happens in discovery?",
        "Can you help with custom SaaS too?",
        "Share project details"
      ]
    };
  }

  if (messageIncludes(text, ["fit", "who is this for", "who do you work with", "startup", "small business"])) {
    return {
      reply:
        "ApexArc is a strong fit for startups, founder-led businesses, and growing small teams dealing with repetitive operations, fragmented tools, or customer interaction bottlenecks. It also fits teams that want a custom SaaS product, internal operating system, or AI layer built around how the business actually works.",
      shouldCaptureLead: interested,
      qualificationStage: interested ? "interested" : "early",
      suggestedNextStep: interested ? "capture_lead" : "continue_chat",
      quickReplies: [
        "We need automation help",
        "We want a custom product",
        "How should we start?"
      ]
    };
  }

  return {
    reply:
      `${chatbotPublicKnowledge.positioning} ApexArc can help with agentic workflows, AI agents, chatbots, voice agents, CRM automation, custom SaaS MVPs, and internal tools. If you tell me what you want to automate, build, or improve, I can point you toward the right next step.`,
    shouldCaptureLead: interested,
    qualificationStage: interested ? "interested" : "early",
    suggestedNextStep: interested ? "capture_lead" : "continue_chat",
    quickReplies: fallbackQuickReplies
  };
};

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

  if (!process.env.OPENROUTER_API_KEY) {
    return createJsonResponse(200, createFallbackPayload(message));
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://apexarcglobal.com",
        "X-Title": "ApexArc Global Chatbot"
      },
      body: JSON.stringify({
        model: chatbotModel,
        messages: [
          {
            role: "system",
            content: chatbotSystemPrompt
          },
          ...history,
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.5,
        max_tokens: 500,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "apexarc_chat_response",
            strict: true,
            schema: chatbotResponseSchema
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter chat request failed", response.status, errorText);

      return createJsonResponse(200, createFallbackPayload(message));
    }

    const payload = await response.json();
    const outputText = payload.choices?.[0]?.message?.content;

    if (!outputText) {
      throw new Error("Missing structured response text.");
    }

    const parsedPayload = JSON.parse(outputText);
    const normalizedPayload = normalizeAssistantPayload(parsedPayload);

    return createJsonResponse(200, normalizedPayload);
  } catch (error) {
    console.error("Chat function failed", error);

    return createJsonResponse(200, createFallbackPayload(message));
  }
};
