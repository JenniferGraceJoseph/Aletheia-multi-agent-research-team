import { TokenMetrics, AgentRole, AGENT_META } from "@/types/agent";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface TokenDashboardProps {
  metrics: TokenMetrics;
}

const chartConfig = {
  raw: { label: "Raw Tokens", color: "hsl(0 60% 50%)" },
  compressed: { label: "Compressed", color: "hsl(187 72% 55%)" },
};

export default function TokenDashboard({ metrics }: TokenDashboardProps) {
  const ratio = metrics.totalRaw > 0
    ? ((1 - metrics.totalCompressed / metrics.totalRaw) * 100).toFixed(1)
    : "0";

  const roles: AgentRole[] = ["researcher", "critic", "synthesizer", "writer"];
  const data = roles.map((r) => ({
    name: AGENT_META[r].label,
    raw: metrics.byAgent[r].raw,
    compressed: metrics.byAgent[r].compressed,
  }));

  return (
    <div className="glass rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          ScaleDown Compression
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">{ratio}%</span>
          <span className="text-xs text-muted-foreground">reduction</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <div className="text-lg font-bold text-destructive">{metrics.totalRaw.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Raw Tokens</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <div className="text-lg font-bold text-primary">{metrics.totalCompressed.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Compressed</div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} />
          <YAxis tick={{ fontSize: 9, fill: "hsl(215 20% 55%)" }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="raw" fill="hsl(0 60% 50%)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="compressed" fill="hsl(187 72% 55%)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
