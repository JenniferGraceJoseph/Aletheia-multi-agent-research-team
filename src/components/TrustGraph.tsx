import { TrustSnapshot, AgentRole, AGENT_META } from "@/types/agent";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Progress } from "@/components/ui/progress";

interface TrustGraphProps {
  trustHistory: TrustSnapshot[];
  currentScores: Record<AgentRole, number>;
}

const chartConfig = {
  researcher: { label: "Researcher", color: "hsl(187 72% 55%)" },
  critic: { label: "Critic", color: "hsl(160 60% 45%)" },
  synthesizer: { label: "Synthesizer", color: "hsl(38 92% 50%)" },
  writer: { label: "Writer", color: "hsl(262 60% 58%)" },
};

const ROLES: AgentRole[] = ["researcher", "critic", "synthesizer", "writer"];

export default function TrustGraph({ trustHistory, currentScores }: TrustGraphProps) {
  return (
    <div className="glass rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
        Trust Matrix Evolution
      </h3>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <LineChart data={trustHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
          <XAxis
            dataKey="iteration"
            tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }}
            label={{ value: "Iteration", position: "insideBottom", offset: -2, fontSize: 10, fill: "hsl(215 20% 55%)" }}
          />
          <YAxis
            domain={[0, 1.1]}
            tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {ROLES.map((role) => (
            <Line
              key={role}
              type="monotone"
              dataKey={role}
              stroke={chartConfig[role].color}
              strokeWidth={2}
              dot={{ r: 3, fill: chartConfig[role].color }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ChartContainer>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Current Voting Weights
        </h4>
        {ROLES.map((role) => (
          <div key={role} className="flex items-center gap-2">
            <span className={`text-xs w-24 ${AGENT_META[role].colorClass}`}>{AGENT_META[role].label}</span>
            <Progress
              value={currentScores[role] * 100}
              className="h-2 flex-1"
              style={{
                ["--progress-color" as string]: chartConfig[role].color,
              }}
            />
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">
              {currentScores[role].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
