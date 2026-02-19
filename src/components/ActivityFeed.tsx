import { AgentMessage, AGENT_META } from "@/types/agent";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldAlert, GitMerge, PenTool, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONS = {
  researcher: Search,
  critic: ShieldAlert,
  synthesizer: GitMerge,
  writer: PenTool,
};

const AGENT_BG: Record<string, string> = {
  researcher: "bg-agent-researcher/10 border-agent-researcher/30",
  critic: "bg-agent-critic/10 border-agent-critic/30",
  synthesizer: "bg-agent-synthesizer/10 border-agent-synthesizer/30",
  writer: "bg-agent-writer/10 border-agent-writer/30",
};

const CONFIDENCE_COLOR = (c: number) =>
  c >= 0.85 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
  c >= 0.7 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
  "bg-red-500/20 text-red-400 border-red-500/30";

interface ActivityFeedProps {
  messages: AgentMessage[];
}

export default function ActivityFeed({ messages }: ActivityFeedProps) {
  const Icon = (role: keyof typeof ICONS) => ICONS[role];

  return (
    <div className="glass rounded-lg h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Agent Activity Feed</h3>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{messages.length} messages</span>
      </div>
      <ScrollArea className="flex-1 p-3 scrollbar-thin">
        <div className="space-y-3">
          {messages.map((msg) => {
            const meta = AGENT_META[msg.sender];
            const AgentIcon = Icon(msg.sender);
            const compressionRatio = msg.tokensBefore > 0
              ? ((1 - msg.tokensAfter / msg.tokensBefore) * 100).toFixed(0)
              : "0";

            return (
              <div
                key={msg.id}
                className={`animate-slide-up rounded-lg border p-3 ${AGENT_BG[msg.sender]}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${AGENT_BG[msg.sender]} border`}>
                    <AgentIcon className={`w-3.5 h-3.5 ${meta.colorClass}`} />
                  </div>
                  <span className={`text-sm font-semibold ${meta.colorClass}`}>{meta.label}</span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${CONFIDENCE_COLOR(msg.confidence)}`}>
                    {(msg.confidence * 100).toFixed(1)}%
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                    iter {msg.iteration}
                  </span>
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed mb-2">{msg.content}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {msg.sources.length > 0 && msg.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {src.title.slice(0, 30)}…
                    </a>
                  ))}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto border-border/50 text-muted-foreground">
                    ↓{compressionRatio}% compressed
                  </Badge>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-12">
              Awaiting research topic…
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
