const root = document.documentElement;

root.classList.add("js");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

const syncHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if (navToggle instanceof HTMLButtonElement && mobilePanel instanceof HTMLElement) {
  const closePanel = () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobilePanel.hidden = true;
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobilePanel.hidden = expanded;
  });

  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closePanel);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closePanel();
    }
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  if (revealItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  document.querySelectorAll("[data-parallax-root]").forEach((scene) => {
    const layers = [...scene.querySelectorAll("[data-depth]")];

    if (layers.length === 0) {
      return;
    }

    const handleMove = (event) => {
      const rect = scene.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width - 0.5;
      const ratioY = (event.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer) => {
        const depth = Number(layer.getAttribute("data-depth") || 0);
        const offsetX = ratioX * depth;
        const offsetY = ratioY * depth;
        layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });
    };

    const resetLayers = () => {
      layers.forEach((layer) => {
        layer.style.transform = "";
      });
    };

    scene.addEventListener("pointermove", handleMove);
    scene.addEventListener("pointerleave", resetLayers);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach((item) => {
    item.classList.add("is-visible");
  });
}

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  const status = button.closest(".contact-card")?.querySelector("[data-copy-status]");
  const originalText = button.textContent;
  let resetTimer;

  const setCopyState = (label, message) => {
    button.textContent = label;

    if (status) {
      status.textContent = message;
    }

    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      button.textContent = originalText;

      if (status) {
        status.textContent = "";
      }
    }, 1600);
  };

  const fallbackCopy = (value) => {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "true");
    field.style.position = "absolute";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, value.length);

    const copied = document.execCommand("copy");
    document.body.removeChild(field);
    return copied;
  };

  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");

    if (!email) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else if (!fallbackCopy(email)) {
        throw new Error("Clipboard API unavailable");
      }

      setCopyState("Email Copied", `${email} copied to clipboard.`);
    } catch (error) {
      if (fallbackCopy(email)) {
        setCopyState("Email Copied", `${email} copied to clipboard.`);
        return;
      }

      console.error("Could not copy email", error);

      if (status) {
        status.textContent = `Copy failed. Email ApexArc directly at ${email}.`;
      }
    }
  });
});

document.querySelectorAll("[data-chatbot]").forEach((root) => {
  const mobileQuery = window.matchMedia("(max-width: 820px)");
  const endpoint = root.getAttribute("data-chat-endpoint");
  const leadFormName = root.getAttribute("data-lead-form-name") || "chatbot-lead";
  const contactHref = root.getAttribute("data-contact-href") || "mailto:ceo@apexarcglobal.com";

  const teaser = root.querySelector("[data-chat-teaser]");
  const panel = root.querySelector("[data-chat-panel]");
  const status = root.querySelector("[data-chat-status]");
  const messages = root.querySelector("[data-chat-messages]");
  const suggestions = root.querySelector("[data-chat-suggestions]");
  const chatForm = root.querySelector("[data-chat-form]");
  const textarea = root.querySelector("[data-chat-textarea]");
  const sendButton = root.querySelector("[data-chat-send]");
  const openButtons = root.querySelectorAll("[data-chat-open]");
  const closeButton = root.querySelector("[data-chat-close]");
  const leadPanel = root.querySelector("[data-chat-lead-panel]");
  const leadForm = root.querySelector("[data-chat-lead-form]");
  const leadOpenButtons = root.querySelectorAll("[data-chat-open-lead]");
  const leadCancelButton = root.querySelector("[data-chat-lead-cancel]");
  const successPanel = root.querySelector("[data-chat-success]");

  if (
    !(panel instanceof HTMLElement) ||
    !(messages instanceof HTMLElement) ||
    !(suggestions instanceof HTMLElement) ||
    !(chatForm instanceof HTMLFormElement) ||
    !(textarea instanceof HTMLTextAreaElement) ||
    !(sendButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const starterPrompts = [...root.querySelectorAll("[data-chat-prompt]")]
    .map((button) => button.getAttribute("data-chat-prompt") || "")
    .filter(Boolean)
    .slice(0, 4);

  const conversation = [];
  let qualificationStage = "early";
  let isSubmitting = false;

  const updateLayoutState = () => {
    if (mobileQuery.matches && !root.classList.contains("is-lead-capture")) {
      root.classList.remove("is-open");
    }
  };

  const setStatus = (message, isError = false) => {
    if (!(status instanceof HTMLElement)) {
      return;
    }

    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };

  const scrollMessagesToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const addMessage = (role, text) => {
    const article = document.createElement("article");
    article.className = `chat-message ${role === "user" ? "is-user" : "is-assistant"}`;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    article.appendChild(paragraph);
    messages.appendChild(article);
    scrollMessagesToBottom();

    conversation.push({ role, content: text });

    if (conversation.length > 10) {
      conversation.splice(0, conversation.length - 10);
    }
  };

  const setSuggestions = (items) => {
    const promptList = Array.isArray(items) && items.length > 0 ? items.slice(0, 4) : starterPrompts;
    suggestions.innerHTML = "";

    promptList.forEach((prompt) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-chip";
      button.setAttribute("data-chat-prompt", prompt);
      button.textContent = prompt;
      suggestions.appendChild(button);
    });
  };

  const setBusy = (busy) => {
    isSubmitting = busy;
    textarea.disabled = busy;
    sendButton.disabled = busy;

    if (leadForm instanceof HTMLFormElement) {
      leadForm.querySelectorAll("input, textarea, button").forEach((field) => {
        field.disabled = busy;
      });
    }
  };

  const openChat = () => {
    root.classList.add("is-open");
    textarea.focus();
  };

  const closeChat = () => {
    if (leadPanel instanceof HTMLElement) {
      leadPanel.hidden = true;
    }

    root.classList.remove("is-open", "is-lead-capture");

    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = true;
    }

    setStatus("Ask another question or share project details when you are ready.");
  };

  const openLeadCapture = (prefillSummary = "") => {
    if (!(leadPanel instanceof HTMLElement) || !(leadForm instanceof HTMLFormElement)) {
      return;
    }

    const summaryField = leadForm.elements.namedItem("project_summary");

    root.classList.add("is-open", "is-lead-capture");
    leadPanel.hidden = false;

    if (successPanel instanceof HTMLElement) {
      successPanel.hidden = true;
    }

    if (summaryField instanceof HTMLTextAreaElement && !summaryField.value.trim() && prefillSummary) {
      summaryField.value = prefillSummary;
    }

    const nameField = leadForm.elements.namedItem("name");

    if (nameField instanceof HTMLInputElement) {
      nameField.focus();
    }

    setStatus("Share a few details and ApexArc can follow up with the right next step.");
  };

  const closeLeadCapture = () => {
    if (leadPanel instanceof HTMLElement) {
      leadPanel.hidden = true;
    }

    root.classList.remove("is-lead-capture");

    if (mobileQuery.matches) {
      root.classList.remove("is-open");
    }
  };

  const buildTranscriptExcerpt = () =>
    conversation
      .slice(-8)
      .map((item) => `${item.role === "user" ? "Visitor" : "Assistant"}: ${item.content}`)
      .join("\n");

  const sendLeadSubmission = async () => {
    if (!(leadForm instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(leadForm);
    const payload = new URLSearchParams();

    payload.set("form-name", leadFormName);
    payload.set("name", String(formData.get("name") || ""));
    payload.set("email", String(formData.get("email") || ""));
    payload.set("project_summary", String(formData.get("project_summary") || ""));
    payload.set("transcript_excerpt", buildTranscriptExcerpt());
    payload.set("qualification_summary", qualificationStage);
    payload.set("page_path", window.location.pathname);
    payload.set("page_title", document.title);
    payload.set("context", "homepage-chatbot");

    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload.toString()
    });

    if (!response.ok) {
      throw new Error("Lead submission failed.");
    }
  };

  const sendChatMessage = async (rawMessage) => {
    const message = rawMessage.trim();

    if (!message || !endpoint || isSubmitting) {
      return;
    }

    openChat();
    addMessage("user", message);
    textarea.value = "";
    setStatus("ApexArc AI is preparing a response...");
    setBusy(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          history: conversation.slice(0, -1)
        })
      });

      const payload = await response.json();

      if (payload.qualificationStage) {
        qualificationStage = payload.qualificationStage;
      }

      if (payload.reply) {
        addMessage("assistant", payload.reply);
      }

      if (payload.quickReplies) {
        setSuggestions(payload.quickReplies);
      }

      if (!response.ok) {
        setStatus("The assistant needs a little help right now. Email is still available.", true);
      } else if (payload.shouldCaptureLead || payload.suggestedNextStep === "capture_lead") {
        openLeadCapture(message);
      } else if (payload.suggestedNextStep === "email_cta") {
        setStatus("If you want a direct handoff, email ApexArc next.");
      } else {
        setStatus("Ask another question or share project details when you are ready.");
      }
    } catch (error) {
      console.error("Chat request failed", error);
      setStatus("The assistant is temporarily unavailable. You can still email ApexArc directly.", true);
      addMessage(
        "assistant",
        `The live assistant is temporarily unavailable. You can still continue the conversation by email: ${contactHref.replace(
          "mailto:",
          ""
        )}`
      );
    } finally {
      setBusy(false);
    }
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openChat();
    });
  });

  closeButton?.addEventListener("click", () => {
    closeChat();
  });

  suggestions.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest("[data-chat-prompt]") : null;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    sendChatMessage(target.getAttribute("data-chat-prompt") || "");
  });

  teaser?.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest("[data-chat-prompt]") : null;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    sendChatMessage(target.getAttribute("data-chat-prompt") || "");
  });

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChatMessage(textarea.value);
  });

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });

  leadOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lastUserMessage = [...conversation].reverse().find((item) => item.role === "user");
      openLeadCapture(lastUserMessage?.content || "");
    });
  });

  leadCancelButton?.addEventListener("click", () => {
    closeLeadCapture();
    setStatus("You can keep chatting or reopen the project detail form anytime.");
  });

  leadForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      setBusy(true);
      setStatus("Saving your project details...");
      await sendLeadSubmission();

      if (leadPanel instanceof HTMLElement) {
        leadPanel.hidden = true;
      }

      if (successPanel instanceof HTMLElement) {
        successPanel.hidden = false;
      }

      root.classList.remove("is-lead-capture");
      setStatus("Project details saved. You can keep chatting or email ApexArc directly.");
      addMessage(
        "assistant",
        "Thanks. Your project details were saved for follow-up. If you want to move faster, you can also email ApexArc directly."
      );
    } catch (error) {
      console.error("Lead submission failed", error);
      setStatus("Could not save the lead just now. Please try again or use direct email.", true);
    } finally {
      setBusy(false);
    }
  });

  mobileQuery.addEventListener("change", updateLayoutState);
  updateLayoutState();
  setSuggestions(starterPrompts);
});
