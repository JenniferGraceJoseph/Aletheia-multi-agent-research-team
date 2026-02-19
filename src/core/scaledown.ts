import { AgentMessage, TokenMetrics, AgentRole } from "@/types/agent";

export function computeTokenMetrics(messages: AgentMessage[]): TokenMetrics {
  const byAgent: Record<AgentRole, { raw: number; compressed: number }> = {
    researcher: { raw: 0, compressed: 0 },
    critic: { raw: 0, compressed: 0 },
    synthesizer: { raw: 0, compressed: 0 },
    writer: { raw: 0, compressed: 0 },
  };

  let totalRaw = 0;
  let totalCompressed = 0;

  for (const msg of messages) {
    byAgent[msg.sender].raw += msg.tokensBefore;
    byAgent[msg.sender].compressed += msg.tokensAfter;
    totalRaw += msg.tokensBefore;
    totalCompressed += msg.tokensAfter;
  }

  return { totalRaw, totalCompressed, byAgent };
}
