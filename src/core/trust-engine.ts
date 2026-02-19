import { AgentRole, TrustSnapshot } from "@/types/agent";

export function initTrustScores(): Record<AgentRole, number> {
  return { researcher: 1.0, critic: 1.0, synthesizer: 1.0, writer: 1.0 };
}

export function updateTrustScores(
  current: Record<AgentRole, number>,
  iteration: number
): Record<AgentRole, number> {
  const updated = { ...current };

  // Simulate critic finding issues early, researcher improving
  if (iteration === 1) {
    updated.researcher = Math.max(0.3, current.researcher - 0.15 - Math.random() * 0.05);
    updated.critic = Math.min(1.0, current.critic + 0.05);
    updated.synthesizer = Math.max(0.5, current.synthesizer - 0.05);
  } else if (iteration === 2) {
    updated.researcher = Math.min(1.0, current.researcher + 0.1 + Math.random() * 0.05);
    updated.critic = Math.min(1.0, current.critic + 0.03);
    updated.synthesizer = Math.min(1.0, current.synthesizer + 0.08);
  } else {
    updated.researcher = Math.min(1.0, current.researcher + 0.05);
    updated.critic = Math.min(1.0, current.critic + 0.02);
    updated.synthesizer = Math.min(1.0, current.synthesizer + 0.04);
    updated.writer = Math.min(1.0, current.writer + 0.03);
  }

  return updated;
}

export function createTrustSnapshot(scores: Record<AgentRole, number>, iteration: number): TrustSnapshot {
  return { iteration, ...scores };
}

export function computeWeightedConfidence(
  agentConfidences: Record<AgentRole, number>,
  trustScores: Record<AgentRole, number>
): number {
  const roles: AgentRole[] = ["researcher", "critic", "synthesizer", "writer"];
  const totalTrust = roles.reduce((sum, r) => sum + trustScores[r], 0);
  if (totalTrust === 0) return 0;
  const weighted = roles.reduce((sum, r) => sum + agentConfidences[r] * trustScores[r], 0);
  return weighted / totalTrust;
}
