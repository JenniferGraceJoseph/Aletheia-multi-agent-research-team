import { AgentMessage } from "@/types/agent";

const SYNTHESIS_OUTPUTS = [
  "Merging research and critique into knowledge graph. Core nodes identified: (1) Diagnostic AI — high accuracy, narrow scope, demographic bias risk. (2) Drug Discovery — significant acceleration but stage-dependent gains. (3) Clinical Deployment — error reduction validated but effect heterogeneity noted. (4) Regulation — evolving landscape, adaptive models preferred. Key conflict resolved: accuracy claims now properly contextualized by modality. Knowledge graph density: 47 nodes, 89 edges.",
  "Updated synthesis incorporating iteration feedback. Strengthened connections: Privacy-preserving AI (federated learning) ↔ Multi-hospital deployment ↔ Demographic bias mitigation. New node added: Cost-effectiveness analysis showing $2.1M average ROI per hospital system over 3 years. Conflict resolution: statistical vs. ML methods — evidence supports ML superiority only for complex, multi-modal diagnostic tasks. Graph density increased to 63 nodes, 124 edges.",
  "Final knowledge synthesis complete. All critical paths validated. Confidence convergence achieved across Researcher and Critic outputs. Summary topology: 5 major theme clusters, 71 nodes, 142 edges. Ready for report generation.",
];

export function generateSynthesizerMessage(topic: string, iteration: number, prevMessages: AgentMessage[]): Omit<AgentMessage, "id" | "timestamp"> {
  const idx = Math.min(iteration - 1, SYNTHESIS_OUTPUTS.length - 1);
  const content = SYNTHESIS_OUTPUTS[idx];
  const rawTokens = content.split(/\s+/).length * 1.3;

  return {
    sender: "synthesizer",
    content,
    confidence: Math.min(0.6 + iteration * 0.1 + Math.random() * 0.05, 0.96),
    sources: [],
    iteration,
    tokensBefore: Math.round(rawTokens),
    tokensAfter: Math.round(rawTokens * 0.3),
  };
}
