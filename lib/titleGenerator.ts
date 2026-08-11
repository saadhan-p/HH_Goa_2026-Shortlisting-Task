export const TITLES_BY_STACK: Record<string, string[]> = {
  cybersecurity: [
    "THE SIGNAL HUNTER",
    "PROTOCOL BREAKER",
    "PACKET WHISPERER",
    "ZERO-DAY DREAMER",
    "NETWORK NOMAD",
    "THE DECRYPTOR"
  ],
  python: [
    "PYTHON ALCHEMIST",
    "AUTOMATION FORGER",
    "DATA SHAPER",
    "SCRIPT WEAVER"
  ],
  frontend: [
    "PIXEL ARCHITECT",
    "INTERFACE SHAPER",
    "DOM WRANGLER",
    "LAYOUT WIZARD",
    "CSS ALCHEMIST"
  ],
  backend: [
    "API ARCHITECT",
    "SYSTEM BUILDER",
    "SHIPPING ENGINE",
    "QUERY OPTIMIZER",
    "DATABASE BENDER"
  ],
  aiml: [
    "MODEL BREAKER",
    "DATA FORGER",
    "TENSOR SHAPESHIFTER",
    "NEURAL ARCHITECT"
  ],
  cloud: [
    "CLOUD RUNNER",
    "INFRA ARCHITECT",
    "CONTAINER PILOT",
    "KUBERNETES SHAMAN"
  ]
};

export const ALL_TITLES = [
  "THE SIGNAL HUNTER",
  "PACKET WHISPERER",
  "BUG BREAKER",
  "CODE ARCHITECT",
  "PROTOCOL SHIFTER",
  "STACK SURFER",
  "ZERO-DAY DREAMER",
  "CLOUD RUNNER",
  "THE DEBUGGER",
  "SYSTEM BREAKER",
  "API ARCHITECT",
  "SHIP ENGINE",
  "DATA FORGER",
  "NETWORK NOMAD",
  "CODE RUNNER",
  "PIXEL ARCHITECT",
  "INTERFACE SHAPER",
  "COMPILER COMPANION",
  "BYTE WHISPERER",
  "KERNEL NAVIGATOR"
];

/**
 * Returns a collection of titles suited for a given stack.
 * Categorizes the stack into known groups by checking keywords.
 */
export function getTitlesForStack(stack: string): string[] {
  const norm = stack.toLowerCase().trim();
  if (!norm) return ALL_TITLES;

  if (norm.includes("cyber") || norm.includes("security") || norm.includes("crypt") || norm.includes("hack")) {
    return TITLES_BY_STACK.cybersecurity;
  }
  if (norm.includes("python") || norm.includes("django") || norm.includes("fastapi")) {
    return TITLES_BY_STACK.python;
  }
  if (norm.includes("front") || norm.includes("react") || norm.includes("ui") || norm.includes("css") || norm.includes("next")) {
    return TITLES_BY_STACK.frontend;
  }
  if (norm.includes("back") || norm.includes("api") || norm.includes("node") || norm.includes("database") || norm.includes("sql") || norm.includes("go") || norm.includes("rust")) {
    return TITLES_BY_STACK.backend;
  }
  if (norm.includes("ai") || norm.includes("ml") || norm.includes("model") || norm.includes("learn") || norm.includes("data")) {
    return TITLES_BY_STACK.aiml;
  }
  if (norm.includes("cloud") || norm.includes("infra") || norm.includes("devops") || norm.includes("docker") || norm.includes("aws")) {
    return TITLES_BY_STACK.cloud;
  }

  // Fallback for general matches
  return ALL_TITLES;
}

/**
 * Deterministically generates or randomly selects a title.
 */
export function generateTitle(stack: string, currentTitle?: string): string {
  const candidates = getTitlesForStack(stack);
  
  // Filter out current title to ensure a change on regenerate
  const filtered = currentTitle ? candidates.filter(t => t !== currentTitle) : candidates;
  const list = filtered.length > 0 ? filtered : candidates;
  
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
