import { ResearchReport, AgentMessage } from "@/types/agent";

const WRITER_OUTPUT = "Generating final research report. Structuring into Executive Summary, Technical Deep-Dive, and Bulleted Insights. Applying editorial standards for clarity, citation integrity, and logical flow. Report confidence reflects weighted consensus of all agents across iterations.";

export function generateWriterMessage(topic: string, iteration: number): Omit<AgentMessage, "id" | "timestamp"> {
  const rawTokens = WRITER_OUTPUT.split(/\s+/).length * 1.3;
  return {
    sender: "writer",
    content: WRITER_OUTPUT,
    confidence: 0.92,
    sources: [],
    iteration,
    tokensBefore: Math.round(rawTokens),
    tokensAfter: Math.round(rawTokens * 0.3),
  };
}

export function generateReport(topic: string, messages: AgentMessage[], weightedConfidence: number, iterations: number): ResearchReport {
  const allSources = messages.flatMap((m) => m.sources);
  const uniqueSources = allSources.filter((s, i, arr) => arr.findIndex((x) => x.url === s.url) === i);

  return {
    topic,
    executiveSummary: `## Executive Summary\n\nThis multi-agent research investigation into **"${topic}"** employed four specialized AI agents operating across ${iterations} deliberation iterations to produce a high-confidence analysis.\n\n**Key Findings:**\n\nAI-powered diagnostic systems demonstrate remarkable accuracy (89–96% depending on modality) in medical imaging, with deployment across 23+ hospital systems showing a 31% reduction in diagnostic errors. Drug discovery pipelines leveraging machine learning reduce candidate identification timelines by approximately 60%, though gains vary by pipeline stage.\n\nCritical challenges remain in three areas: (1) demographic bias in training data leading to performance disparities, (2) regulatory frameworks struggling to keep pace with innovation, and (3) cost-effectiveness data still maturing. The EU AI Act and FDA's adaptive regulation approach represent the leading governance models.\n\nFederated learning emerges as the most promising privacy-preserving approach for multi-institutional collaboration, enabling model training across hospital systems while maintaining HIPAA compliance.\n\n**Weighted Confidence Score: ${(weightedConfidence * 100).toFixed(1)}%** — achieved through ${iterations} rounds of adversarial debate and cross-validation.`,

    technicalDeepDive: `## Technical Deep-Dive\n\n### Diagnostic AI Performance Metrics\n\nPerformance varies significantly by imaging modality:\n- **CT Scans**: 96% accuracy (highest confidence)\n- **MRI**: 92% accuracy\n- **X-ray**: 89% accuracy\n\nA meta-analysis of 23 hospital deployments showed a 31% reduction in diagnostic errors, though with significant heterogeneity (I²=73%), suggesting context-dependent effectiveness.\n\n### Drug Discovery Acceleration\n\nML-driven pipelines show a ~60% reduction in candidate identification time, primarily in:\n- Target identification (70% acceleration)\n- Lead optimization (55% acceleration)\n- Toxicity prediction (48% acceleration)\n\n### Privacy-Preserving AI: Federated Learning\n\nFederated learning enables HIPAA-compliant multi-hospital model training. Key advantages:\n- No raw data transfer between institutions\n- Comparable performance to centralized training (within 2-3% accuracy)\n- Enables demographic bias mitigation through diverse training populations\n\n### Regulatory Landscape\n\n| Framework | Status | Approach |\n|-----------|--------|----------|\n| FDA AI/ML | 882+ cleared devices | Adaptive regulation |\n| EU AI Act | High-risk classification | Conformity assessments |\n| WHO Digital Health | Strategy published | Guidelines-based |\n\n### Cost-Effectiveness\n\nAverage ROI of $2.1M per hospital system over 3 years, primarily from:\n- Reduced diagnostic repeat rates\n- Earlier disease detection\n- Optimized resource allocation`,

    bulletedInsights: [
      "AI diagnostic accuracy ranges 89–96% by modality, exceeding human performance in narrow imaging tasks",
      "31% diagnostic error reduction across 23 hospital systems, but with significant implementation variability",
      "Drug discovery ML acceleration of ~60% is stage-dependent — strongest in target identification",
      "Demographic bias in training data is the #1 unresolved challenge, causing 8-15% performance gaps",
      "Federated learning is the leading privacy-preserving solution for multi-institutional AI collaboration",
      "882+ FDA-cleared AI/ML medical devices as of 2025, with adaptive regulation gaining consensus",
      "Cost-effectiveness data shows $2.1M average ROI per hospital over 3 years",
      "EU AI Act classifies medical AI as high-risk, requiring conformity assessments before deployment",
      "Traditional statistical methods remain competitive for simpler, single-modality diagnostic tasks",
      "Consensus: AI augments rather than replaces clinical judgment — human-in-the-loop models show best outcomes",
    ],
    weightedConfidence,
    iterations,
    sources: uniqueSources,
  };
}
