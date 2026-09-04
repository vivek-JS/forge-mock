import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Lightweight VS-Code-inspired JSON viewer (no editor bundle required). */
function tokenize(value: unknown, indent = 0): React.ReactNode[] {
  const pad = "  ".repeat(indent);
  const out: React.ReactNode[] = [];

  const render = (v: unknown): React.ReactNode => {
    if (v === null) return <span className="text-info">null</span>;
    if (typeof v === "string") return <span className="text-success">"{v}"</span>;
    if (typeof v === "number") return <span className="text-warning">{v}</span>;
    if (typeof v === "boolean") return <span className="text-info">{String(v)}</span>;
    return null;
  };

  if (Array.isArray(value)) {
    out.push(<span key="o">[</span>);
    value.forEach((v, i) => {
      out.push(
        <div key={i} style={{ paddingLeft: 16 }}>
          {typeof v === "object" && v !== null ? tokenize(v, indent + 1) : render(v)}
          {i < value.length - 1 ? "," : ""}
        </div>,
      );
    });
    out.push(<span key="c">]</span>);
    return out;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    out.push(<span key="o">{"{"}</span>);
    entries.forEach(([k, v], i) => {
      out.push(
        <div key={k} style={{ paddingLeft: 16 }}>
          <span className="text-[color:var(--link)]">"{k}"</span>
          <span className="text-muted-foreground">: </span>
          {typeof v === "object" && v !== null ? tokenize(v, indent + 1) : render(v)}
          {i < entries.length - 1 ? <span className="text-muted-foreground">,</span> : null}
        </div>,
      );
    });
    out.push(<span key="c">{"}"}</span>);
    return out;
  }

  return [<span key="v">{pad}{render(value)}</span>];
}

export function JsonView({ value, className }: { value: unknown; className?: string }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const lines = text.split("\n").length;

  return (
    <div className={cn("group relative overflow-hidden rounded-md border border-border bg-[oklch(0.145_0.006_260)]", className)}>
      <button
        onClick={copy}
        aria-label="Copy JSON"
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded border border-border bg-surface-2/80 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
      >
        {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <div className="flex">
        <div
          aria-hidden
          className="select-none border-r border-border/70 px-2.5 py-3 text-right font-mono text-[0.72rem] leading-[1.55] text-muted-foreground/40"
        >
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="overflow-x-auto px-3 py-3 font-mono text-[0.74rem] leading-[1.55]">
          <code>{tokenize(value)}</code>
        </pre>
      </div>
    </div>
  );
}
