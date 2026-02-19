import { ResearchReport } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { Download, FileJson } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportViewerProps {
  report: ResearchReport;
}

function MarkdownSection({ content }: { content: string }) {
  // Simple markdown rendering for headers, bold, tables, lists
  const lines = content.split("\n");
  return (
    <div className="prose-sm max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("| ")) {
          const cells = line.split("|").filter(Boolean).map((c) => c.trim());
          if (cells.every((c) => /^[-:]+$/.test(c))) return null; // separator row
          return (
            <div key={i} className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-border/30">
              {cells.map((c, j) => <span key={j} className="text-muted-foreground">{c}</span>)}
            </div>
          );
        }
        if (line.startsWith("- **")) {
          const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
          if (match) return <div key={i} className="flex gap-1 text-xs mb-1"><span className="font-semibold text-foreground">{match[1]}:</span><span className="text-muted-foreground">{match[2]}</span></div>;
        }
        if (line.startsWith("- ")) return <div key={i} className="text-xs text-muted-foreground mb-1 pl-3">• {line.slice(2)}</div>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-sm font-semibold text-foreground my-1">{line.slice(2, -2)}</p>;
        if (line.trim() === "") return <div key={i} className="h-2" />;
        // Handle inline bold
        const parts = line.split(/(\*\*.+?\*\*)/g);
        return (
          <p key={i} className="text-xs text-muted-foreground leading-relaxed">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function ReportViewer({ report }: ReportViewerProps) {
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aletheia-report-${report.topic.slice(0, 30).replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    // Create a printable version
    const printContent = `
      <html><head><title>${report.topic} — Aletheia Report</title>
      <style>body{font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a}
      h1{font-size:24px;border-bottom:2px solid #333;padding-bottom:8px}
      h2{font-size:18px;margin-top:24px}h3{font-size:15px}
      p,li{font-size:13px;line-height:1.6}table{border-collapse:collapse;width:100%}
      td,th{border:1px solid #ddd;padding:6px;font-size:12px}</style></head>
      <body><h1>Aletheia Research Report: ${report.topic}</h1>
      <p><strong>Confidence:</strong> ${(report.weightedConfidence * 100).toFixed(1)}% | <strong>Iterations:</strong> ${report.iterations}</p>
      ${report.executiveSummary.replace(/## /g,"<h2>").replace(/### /g,"<h3>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}
      <hr>
      ${report.technicalDeepDive.replace(/## /g,"<h2>").replace(/### /g,"<h3>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}
      <h2>Key Insights</h2><ul>${report.bulletedInsights.map(b => `<li>${b}</li>`).join("")}</ul>
      <h2>Sources</h2><ul>${report.sources.map(s => `<li><a href="${s.url}">${s.title}</a></li>`).join("")}</ul>
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="glass rounded-lg flex flex-col h-full animate-slide-up">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Final Report</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Confidence: <span className="text-primary font-semibold">{(report.weightedConfidence * 100).toFixed(1)}%</span>
            {" · "}{report.iterations} iterations · {report.sources.length} sources
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownloadPDF} className="text-xs gap-1.5">
            <Download className="w-3 h-3" /> PDF
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadJSON} className="text-xs gap-1.5">
            <FileJson className="w-3 h-3" /> JSON
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 scrollbar-thin">
        <div className="space-y-6">
          <MarkdownSection content={report.executiveSummary} />
          <div className="border-t border-border/30" />
          <MarkdownSection content={report.technicalDeepDive} />
          <div className="border-t border-border/30" />
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Key Insights</h2>
            <ul className="space-y-2">
              {report.bulletedInsights.map((insight, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="text-primary mt-0.5">▸</span>
                  <span className="text-muted-foreground leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border/30" />
          <div>
            <h2 className="text-base font-bold text-foreground mb-2">Sources ({report.sources.length})</h2>
            <div className="space-y-1">
              {report.sources.map((src, i) => (
                <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-primary hover:underline">
                  [{i + 1}] {src.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
