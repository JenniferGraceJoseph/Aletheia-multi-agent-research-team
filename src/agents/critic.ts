import { AgentMessage } from "@/types/agent";

const CRITIC_OUTPUTS = [
  "Analysis of Researcher output reveals several concerns: (1) The 94.5% accuracy claim lacks specificity — accuracy varies dramatically by imaging modality (CT: 96%, X-ray: 89%, MRI: 92%). (2) The '60% reduction in drug discovery time' conflates different pipeline stages. (3) No mention of cost-effectiveness data — a critical gap for real-world adoption. Reliability assessment: moderate. Recommend expanded search with cost analysis.",
  "Re-evaluation after additional data: (1) Federated learning claims are substantiated but the 31% error reduction figure comes from a single meta-analysis with significant heterogeneity (I²=73%). (2) Bias critique is well-founded — found 4 additional studies confirming demographic performance gaps. (3) Missing: comparison with traditional statistical methods that may perform comparably for simpler diagnostic tasks. Overall improvement noted but gaps remain.",
  "Final critical assessment: Research quality has improved significantly across iterations. Remaining minor concerns: (1) Regulatory timeline projections are speculative. (2) Some source redundancy detected. Confidence in overall findings is now above threshold. Approving for synthesis with noted caveats.",
];

export function generateCriticMessage(topic: string, iteration: number, prevMessages: AgentMessage[]): Omit<AgentMessage, "id" | "timestamp"> {
  const idx = Math.min(iteration - 1, CRITIC_OUTPUTS.length - 1);
  const content = CRITIC_OUTPUTS[idx];
  const rawTokens = content.split(/\s+/).length * 1.3;

  return {
    sender: "critic",
    content,
    confidence: Math.min(0.55 + iteration * 0.12 + Math.random() * 0.05, 0.95),
    sources: [
      { title: "Cochrane Systematic Review Standards", url: "https://cochrane.org/methodology" },
    ],
    iteration,
    tokensBefore: Math.round(rawTokens),
    tokensAfter: Math.round(rawTokens * 0.3),
  };
}
