export type NavItem = {
  href: string;
  label: string;
};

export type Outcome = {
  title: string;
  intro: string;
  items: string[];
};

export type ServiceTrack = {
  title: string;
  summary: string;
  idealFor: string;
  deliverables: string[];
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
  points: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const site = {
  name: "ApexArc Global",
  domain: "apexarcglobal.com",
  email: "ceo@apexarcglobal.com",
  emailHref:
    "mailto:ceo@apexarcglobal.com?subject=Project%20Inquiry%20-%20ApexArc%20Global",
  tagline: "Agentic automation, AI agents, and custom SaaS built for startup momentum.",
  description:
    "ApexArc Global helps startups automate operations, deploy customer-facing AI systems, and build custom SaaS products with product-minded execution.",
  location: "Built for startup teams and growing small businesses worldwide."
};

export const navigation: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export const hero = {
  eyebrow: "Automation Partner For Startups",
  title: "Build the systems that move faster than your backlog.",
  intro:
    "ApexArc Global helps startups automate operations, deploy AI agents, and launch custom SaaS products without the drag of bloated delivery cycles.",
  primaryCta: {
    label: "Email ApexArc",
    href: site.emailHref
  },
  secondaryCta: {
    label: "Explore Services",
    href: "/services"
  },
  highlights: [
    "Agentic workflows for ops, sales, and customer support",
    "Chatbots and voice agents that handle real conversations",
    "Custom SaaS and internal tools designed around your workflow"
  ]
};

export const outcomes: Outcome[] = [
  {
    title: "Automate operations without adding headcount",
    intro:
      "We map how work actually moves through your business, then turn repetitive operational loops into agentic workflows your team can trust.",
    items: [
      "Agentic workflows for multi-step internal operations",
      "CRM automation for lead routing, follow-ups, and handoffs",
      "Internal tools that remove manual updates and spreadsheet drift"
    ]
  },
  {
    title: "Create faster customer conversations with AI",
    intro:
      "We build AI touchpoints that help small teams respond faster, qualify better, and stay available beyond office hours.",
    items: [
      "Website chatbots tuned to your service and sales process",
      "Voice agents for inbound questions, intake, and appointment support",
      "Customer-facing AI systems that integrate with your business stack"
    ]
  },
  {
    title: "Launch custom SaaS and AI products with clarity",
    intro:
      "When your team needs software that does not exist yet, we shape, prototype, and build it with the discipline of a product partner.",
    items: [
      "Custom SaaS MVPs for startups and operator-led businesses",
      "AI-first product features embedded into your workflow",
      "Internal platforms that become the operating system of your team"
    ]
  }
];

export const capabilityCards = [
  {
    title: "Agentic Workflow Design",
    description:
      "We define triggers, decisions, approvals, and automations that connect your fragmented tools into one operating flow."
  },
  {
    title: "AI Agents And Chatbots",
    description:
      "Customer-facing and internal agents built for qualification, support, intake, and repeated knowledge work."
  },
  {
    title: "Voice Automation",
    description:
      "Voice agents for small businesses that can answer, route, collect details, and reduce missed opportunities."
  },
  {
    title: "Custom SaaS Development",
    description:
      "Product-minded delivery for new SaaS builds, AI-assisted software, and internal systems that need long-term structure."
  },
  {
    title: "Internal Business Tools",
    description:
      "Purpose-built dashboards, portals, and operations tools that fit your team instead of forcing a generic workflow."
  },
  {
    title: "CRM Automation",
    description:
      "Automated lead capture, status movement, reminders, and lifecycle workflows that remove manual bottlenecks."
  }
];

export const serviceTracks: ServiceTrack[] = [
  {
    title: "Operations Automation",
    summary:
      "For startups that have grown past manual coordination and need a more reliable operating rhythm.",
    idealFor:
      "Teams juggling handoffs across sales, delivery, support, or back-office work.",
    deliverables: [
      "Workflow mapping and automation architecture",
      "CRM automation and internal routing logic",
      "Internal dashboards and business tool interfaces",
      "Documentation for how the new system works"
    ]
  },
  {
    title: "Customer AI Systems",
    summary:
      "For teams that want smarter customer interaction without adding more manual response load.",
    idealFor:
      "Businesses that need chat, intake, support, or phone coverage at startup speed.",
    deliverables: [
      "Website chatbots and guided conversation flows",
      "Voice agents for common inbound paths",
      "AI-assisted intake, qualification, and follow-up loops",
      "Integration planning with your existing stack"
    ]
  },
  {
    title: "Custom SaaS And Product Builds",
    summary:
      "For founders and operators who need custom software, not another stitched-together workaround.",
    idealFor:
      "New SaaS concepts, internal products, and teams replacing brittle manual systems.",
    deliverables: [
      "Product scoping and MVP definition",
      "Custom SaaS interfaces and backend-ready architecture",
      "AI features designed into the product from the start",
      "Launch support and iteration planning"
    ]
  }
];

export const processSteps: ProcessStep[] = [
  {
    id: "01",
    title: "Discovery and workflow mapping",
    description:
      "We start by understanding the business logic behind your current bottlenecks, not just the tool symptoms.",
    points: [
      "Clarify the exact outcome the system needs to produce",
      "Map manual handoffs, repetitive actions, and failure points",
      "Decide where AI, automation, or custom software actually adds leverage"
    ]
  },
  {
    id: "02",
    title: "System design and prototype direction",
    description:
      "Once the flow is clear, we define the interaction model, automation rules, and user experience before heavy build work begins.",
    points: [
      "Shape the delivery into a practical build roadmap",
      "Outline core screens, automations, and data movement",
      "Create a realistic implementation sequence"
    ]
  },
  {
    id: "03",
    title: "Build and integration",
    description:
      "We implement the system with a strong focus on usability, business logic, and maintainable structure.",
    points: [
      "Build interfaces, automations, and AI behaviors",
      "Connect the solution to relevant internal or customer touchpoints",
      "Refine the experience based on how the system performs in context"
    ]
  },
  {
    id: "04",
    title: "Launch and iterate",
    description:
      "After launch, we tighten weak spots, improve clarity, and make sure the solution supports real workflows over time.",
    points: [
      "Review rollout quality and user experience",
      "Adjust flows based on friction or missed edge cases",
      "Plan the next layer of automation or product expansion"
    ]
  }
];

export const processArtifacts = [
  {
    title: "Outcome framing",
    description:
      "A shared picture of what success looks like before features start multiplying."
  },
  {
    title: "Workflow blueprint",
    description:
      "A visual map of decisions, triggers, actors, and system handoffs."
  },
  {
    title: "Product-ready build scope",
    description:
      "A practical implementation direction that can be shipped without ambiguity."
  }
];

export const productModes = [
  {
    title: "MVP Launches",
    description:
      "For startup teams validating a new software concept with a focused first release."
  },
  {
    title: "AI-First Products",
    description:
      "For founders who want AI agents, copilots, or smart workflow layers embedded into the product itself."
  },
  {
    title: "Internal Platforms",
    description:
      "For teams replacing patchwork processes with one tool built around how the business actually operates."
  },
  {
    title: "SaaS Rebuilds",
    description:
      "For businesses that have an existing product or process but need a sharper architecture and better experience."
  }
];

export const principles = [
  "Clarity before complexity",
  "Systems that match real workflows",
  "Product-minded execution over generic delivery",
  "Automation that helps teams move, not babysit tools"
];

export const faqs: FaqItem[] = [
  {
    question: "Who is ApexArc Global best suited for?",
    answer:
      "ApexArc Global is best suited for startups and fast-moving small businesses that need better systems, faster operations, or custom software without building a large in-house team first."
  },
  {
    question: "Do you only build AI agents?",
    answer:
      "No. AI agents are one part of the work. We also design automation workflows, chatbots, voice systems, internal tools, CRM automations, and custom SaaS products."
  },
  {
    question: "Can you build a SaaS product from scratch?",
    answer:
      "Yes. We can help shape the product scope, define the first release, and build a custom SaaS experience aligned with your business model and workflow."
  },
  {
    question: "Do you offer ready-made SaaS products today?",
    answer:
      "The current focus is custom SaaS and automation work. The site presents ApexArc Global as a partner for building tailored products rather than listing a generic product catalog."
  },
  {
    question: "How do projects usually start?",
    answer:
      "Most engagements start with a conversation about the business problem, the existing workflow, and the fastest path to a useful first version. From there we shape the solution and recommend the right scope."
  }
];

export const aboutStory = {
  eyebrow: "About ApexArc Global",
  title: "Built for teams that need sharper systems, not slower process.",
  intro:
    "ApexArc Global exists to help ambitious businesses turn messy operations and unbuilt product ideas into systems that actually move work forward.",
  body: [
    "The focus is practical leverage: automate what slows the team down, build AI where it creates real advantage, and shape custom software around the way the business already works.",
    "That means every engagement starts with workflow logic and business outcomes, not random feature lists. The goal is always the same: fewer bottlenecks, clearer systems, and better momentum."
  ]
};

export const contactGuidance = [
  "What you want to automate, build, or replace",
  "Which team or workflow is feeling the most friction",
  "Any timeline or launch target you already have",
  "Whether you need an AI agent, internal tool, chatbot, voice system, or full SaaS product"
];
