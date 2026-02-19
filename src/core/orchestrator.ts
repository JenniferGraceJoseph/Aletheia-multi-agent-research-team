import { AgentMessage, AgentRole, ResearchState } from "@/types/agent";
import { generateResearcherMessage } from "@/agents/researcher";
import { generateCriticMessage } from "@/agents/critic";
import { generateSynthesizerMessage } from "@/agents/synthesizer";
import { generateWriterMessage, generateReport } from "@/agents/writer";
import { initTrustScores, updateTrustScores, createTrustSnapshot, computeWeightedConfidence } from "@/core/trust-engine";
import { computeTokenMetrics } from "@/core/scaledown";

let idCounter = 0;
function makeId() {
  return `msg-${++idCounter}-${Date.now()}`;
}

function toMessage(partial: Omit<AgentMessage, "id" | "timestamp">): AgentMessage {
  return { ...partial, id: makeId(), timestamp: new Date() };
}

type OnUpdate = (state: ResearchState) => void;

export async function runResearchPipeline(topic: string, onUpdate: OnUpdate) {
  const MAX_ITERATIONS = 5;
  const CONFIDENCE_THRESHOLD = 0.75;

  let messages: AgentMessage[] = [];
  let trustScores = initTrustScores();
  let trustHistory = [createTrustSnapshot(trustScores, 0)];
  let iteration = 0;
  let weightedConf = 0;

  const emit = () => {
    onUpdate({
      status: "running",
      topic,
      messages: [...messages],
      trustHistory: [...trustHistory],
      trustScores: { ...trustScores },
      tokenMetrics: computeTokenMetrics(messages),
      currentIteration: iteration,
      report: null,
    });
  };

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  do {
    iteration++;

    // Researcher
    const researchMsg = toMessage(generateResearcherMessage(topic, iteration, messages));
    messages.push(researchMsg);
    emit();
    await delay(1200 + Math.random() * 800);

    // Critic
    const criticMsg = toMessage(generateCriticMessage(topic, iteration, messages));
    messages.push(criticMsg);
    trustScores = updateTrustScores(trustScores, iteration);
    trustHistory.push(createTrustSnapshot(trustScores, iteration));
    emit();
    await delay(1000 + Math.random() * 600);

    // Synthesizer
    const synthMsg = toMessage(generateSynthesizerMessage(topic, iteration, messages));
    messages.push(synthMsg);
    emit();
    await delay(800 + Math.random() * 400);

    // Compute weighted confidence
    const agentConfs: Record<AgentRole, number> = {
      researcher: researchMsg.confidence,
      critic: criticMsg.confidence,
      synthesizer: synthMsg.confidence,
      writer: 0.85,
    };
    weightedConf = computeWeightedConfidence(agentConfs, trustScores);
  } while (weightedConf < CONFIDENCE_THRESHOLD && iteration < MAX_ITERATIONS);

  // Writer
  const writerMsg = toMessage(generateWriterMessage(topic, iteration));
  messages.push(writerMsg);
  emit();
  await delay(1500);

  const report = generateReport(topic, messages, weightedConf, iteration);

  onUpdate({
    status: "complete",
    topic,
    messages,
    trustHistory,
    trustScores,
    tokenMetrics: computeTokenMetrics(messages),
    currentIteration: iteration,
    report,
  });
}
