import { useState, useCallback } from "react";
import { ResearchState } from "@/types/agent";
import { runResearchPipeline } from "@/core/orchestrator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ActivityFeed from "@/components/ActivityFeed";
import TrustGraph from "@/components/TrustGraph";
import TokenDashboard from "@/components/TokenDashboard";
import ReportViewer from "@/components/ReportViewer";
import { Search, Atom, Zap } from "lucide-react";

const INITIAL_STATE: ResearchState = {
  status: "idle",
  topic: "",
  messages: [],
  trustHistory: [{ iteration: 0, researcher: 1, critic: 1, synthesizer: 1, writer: 1 }],
  trustScores: { researcher: 1, critic: 1, synthesizer: 1, writer: 1 },
  tokenMetrics: {
    totalRaw: 0,
    totalCompressed: 0,
    byAgent: {
      researcher: { raw: 0, compressed: 0 },
      critic: { raw: 0, compressed: 0 },
      synthesizer: { raw: 0, compressed: 0 },
      writer: { raw: 0, compressed: 0 },
    },
  },
  currentIteration: 0,
  report: null,
};

export default function Dashboard() {
  const [state, setState] = useState<ResearchState>(INITIAL_STATE);
  const [topic, setTopic] = useState("Impact of AI in Healthcare");

  const handleStart = useCallback(async () => {
    if (!topic.trim() || state.status === "running") return;
    setState({ ...INITIAL_STATE, status: "running", topic });
    await runResearchPipeline(topic, setState);
  }, [topic, state.status]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Atom className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Aletheia</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Self-Regulating Research Ecosystem</p>
            </div>
          </div>
          {state.status !== "idle" && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className={`w-3 h-3 ${state.status === "running" ? "text-primary animate-pulse-soft" : "text-agent-critic"}`} />
              <span className="font-mono">
                {state.status === "running"
                  ? `Iteration ${state.currentIteration} · ${state.messages.length} messages`
                  : `Complete · ${state.currentIteration} iterations`
                }
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        {/* Research Input */}
        <div className="glass rounded-lg p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Enter research topic…"
                className="pl-9 bg-muted/50 border-border/50 h-11 text-sm"
                disabled={state.status === "running"}
              />
            </div>
            <Button
              onClick={handleStart}
              disabled={state.status === "running" || !topic.trim()}
              className="h-11 px-6 font-semibold gap-2"
            >
              {state.status === "running" ? (
                <>
                  <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Researching…
                </>
              ) : (
                <>
                  <Atom className="w-4 h-4" />
                  Start Research
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: "calc(100vh - 200px)" }}>
          {/* Left: Activity Feed */}
          <div className="lg:col-span-2 h-[600px] lg:h-auto">
            {state.report ? (
              <ReportViewer report={state.report} />
            ) : (
              <ActivityFeed messages={state.messages} />
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            <TrustGraph trustHistory={state.trustHistory} currentScores={state.trustScores} />
            <TokenDashboard metrics={state.tokenMetrics} />
          </div>
        </div>
      </main>
    </div>
  );
}
