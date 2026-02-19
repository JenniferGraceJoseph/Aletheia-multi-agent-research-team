export type AgentRole = "researcher" | "critic" | "synthesizer" | "writer";

export interface AgentMessage {
  id: string;
  sender: AgentRole;
  content: string;
  confidence: number;
  sources: { title: string; url: string }[];
  timestamp: Date;
  iteration: number;
  tokensBefore: number;
  tokensAfter: number;
}

export interface TrustSnapshot {
  iteration: number;
  researcher: number;
  critic: number;
  synthesizer: number;
  writer: number;
}

export interface TokenMetrics {
  totalRaw: number;
  totalCompressed: number;
  byAgent: Record<AgentRole, { raw: number; compressed: number }>;
}

export interface ResearchReport {
  topic: string;
  executiveSummary: string;
  technicalDeepDive: string;
  bulletedInsights: string[];
  weightedConfidence: number;
  iterations: number;
  sources: { title: string; url: string }[];
}

export interface ResearchState {
  status: "idle" | "running" | "complete";
  topic: string;
  messages: AgentMessage[];
  trustHistory: TrustSnapshot[];
  trustScores: Record<AgentRole, number>;
  tokenMetrics: TokenMetrics;
  currentIteration: number;
  report: ResearchReport | null;
}

export const AGENT_META: Record<AgentRole, { label: string; icon: string; colorClass: string }> = {
  researcher: { label: "Researcher", icon: "Search", colorClass: "text-agent-researcher" },
  critic: { label: "Critic", icon: "ShieldAlert", colorClass: "text-agent-critic" },
  synthesizer: { label: "Synthesizer", icon: "GitMerge", colorClass: "text-agent-synthesizer" },
  writer: { label: "Writer", icon: "PenTool", colorClass: "text-agent-writer" },
};
