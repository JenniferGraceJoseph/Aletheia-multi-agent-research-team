import { AgentMessage } from "@/types/agent";

const MOCK_SOURCES = [
  [
    { title: "Nature Medicine — AI Diagnostics Review 2025", url: "https://nature.com/articles/ai-diagnostics-2025" },
    { title: "WHO Digital Health Strategy", url: "https://who.int/digital-health/strategy" },
    { title: "Stanford HAI Report", url: "https://hai.stanford.edu/research/healthcare-ai" },
  ],
  [
    { title: "The Lancet Digital Health — ML in Radiology", url: "https://thelancet.com/digital-health/ml-radiology" },
    { title: "NIH AI/ML Research Program", url: "https://nih.gov/ai-ml-research" },
    { title: "JAMA Network — Clinical Decision Support", url: "https://jamanetwork.com/clinical-ai-support" },
  ],
  [
    { title: "FDA AI/ML Authorized Medical Devices", url: "https://fda.gov/ai-ml-enabled-devices" },
    { title: "MIT Technology Review — Hospital AI", url: "https://technologyreview.com/hospital-ai-2025" },
  ],
];

const RESEARCH_OUTPUTS = [
  "Conducted comprehensive literature search. Key findings: AI-powered diagnostic systems show 94.5% accuracy in medical imaging analysis, outperforming human radiologists in specific narrow tasks. Drug discovery pipelines using ML reduce candidate identification time by 60%. However, deployment in clinical settings remains limited due to regulatory hurdles and explainability concerns.",
  "Expanded search to include recent clinical trial data. Found: Federated learning approaches enable multi-hospital model training while preserving patient privacy (HIPAA-compliant). Real-world evidence from 23 hospital systems shows 31% reduction in diagnostic errors when AI assists clinicians. Bias in training data remains a critical unresolved challenge — models trained predominantly on data from Western populations show degraded performance on underrepresented groups.",
  "Deep-dive into regulatory and ethical landscape. Findings: EU AI Act classifies medical AI as high-risk, requiring conformity assessments. The FDA has cleared 882+ AI/ML-enabled medical devices as of 2025. Key tension: speed of AI innovation vs. pace of regulatory frameworks. Emerging consensus favors 'adaptive regulation' models that allow iterative updates.",
];

export function generateResearcherMessage(topic: string, iteration: number, prevMessages: AgentMessage[]): Omit<AgentMessage, "id" | "timestamp"> {
  const idx = Math.min(iteration - 1, RESEARCH_OUTPUTS.length - 1);
  const content = iteration === 1
    ? RESEARCH_OUTPUTS[idx]
    : `[Iteration ${iteration}] Addressing critic feedback. ${RESEARCH_OUTPUTS[idx]} Additional cross-referencing confirms prior claims with ${85 + Math.random() * 10}% agreement across sources.`;

  const rawTokens = content.split(/\s+/).length * 1.3;

  return {
    sender: "researcher",
    content,
    confidence: Math.min(0.65 + iteration * 0.08 + Math.random() * 0.05, 0.97),
    sources: MOCK_SOURCES[idx % MOCK_SOURCES.length],
    iteration,
    tokensBefore: Math.round(rawTokens),
    tokensAfter: Math.round(rawTokens * 0.3),
  };
}
