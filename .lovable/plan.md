# Aletheia: Self-Regulating Research Ecosystem

## Phase 1: Core Research Flow (This Build)

### 1. Research Command Center

- Dark mode, glassmorphism-styled dashboard with a prominent research topic input
- "Start Research" button that triggers the simulated multi-agent pipeline
- Real-time **Agent Activity Feed** — a terminal-inspired, modern message log showing each agent's activity with:
  - Agent avatar & name badge
  - Message content
  - Confidence score badge (color-coded)
  - Clickable source URLs
  - Compression ratio tag
  - Timestamp and iteration number

### 2. Multi-Agent Simulation Engine

- Four simulated agents: Researcher, Critic, Synthesizer, Writer
- Message queue system tracking `{ sender, content, confidence, sources, timestamp, iteration }`
- Realistic staggered timing to simulate agent "thinking"
- **Debate Loop**: If weighted confidence < 0.75, agents loop back (up to 5 iterations) with visible iteration counter
- Mock Tavily-style search results with real-looking URLs and structured data

### 3. Trust & Bias Evolution Engine

- Each agent starts at Trust Score 1.0
- Trust scores fluctuate based on Critic findings during the simulation
- **Trust Matrix Chart** (Recharts multi-line graph): Shows all 4 agents' trust scores evolving over iterations
- Sidebar with current voting weights displayed as animated progress bars

### 4. Token Efficiency Dashboard

- ScaleDown compression simulation showing "Raw vs. Compressed" token counts
- Visual bar/donut chart comparing before/after metrics
- 70% compression ratio visualization

### 5. Final Report Generator

- Markdown-rendered report with three sections: Executive Summary, Technical Deep-Dive, Bulleted Insights
- Professional document viewer with proper typography
- Download as PDF and JSON buttons

## Phase 2: Deferred Features (Future Builds)

- **Comparison Engine**: Side-by-side Single-Agent vs Multi-Agent output scoring
- **Real AI integration**: Connect Tavily API and OpenAI via Lovable Cloud edge functions
- **Persistent research history** via database

## Design & Aesthetics

- Dark mode by default with a "PhD-level" professional look
- Glassmorphism card accents with subtle borders and backdrop blur
- Lucide icons throughout
- Smooth animations on agent activity, trust score changes, and report generation
- Color palette: deep navy/slate backgrounds, cyan/emerald/amber/violet accents for the four agents

## Project Structure

- `/src/agents` — Agent simulation logic (researcher, critic, synthesizer, writer)
- `/src/core` — Orchestrator, ScaleDown compression, trust engine
- `/src/components` — Dashboard, ActivityFeed, TrustGraph, TokenDashboard, ReportViewer

  
Epistemic Confidence Weighting Engine (ECWE)  
Instead of simple averaging:

```
Final Confidence = average(agent_scores)

```

You use:

```
Weighted Confidence = Σ (agent_confidence × trust_score)
```