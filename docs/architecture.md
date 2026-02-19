# System Architecture

Aletheia is a self-regulating multi-agent research system built on LangGraph orchestration.

## Core Components

1. Orchestrator (LangGraph StateGraph)
2. Researcher Agent
3. Critic Agent
4. Synthesizer Agent
5. Writer Agent
6. ScaleDown Compression Engine
7. Trust & Governance Engine

## Flow

Research Topic
→ Researcher gathers data
→ ScaleDown compresses context
→ Critic evaluates output
→ Trust Scores updated
→ If consensus < 0.75 → Loop
→ If consensus ≥ 0.75 → Synthesis
→ Final Report Generation
