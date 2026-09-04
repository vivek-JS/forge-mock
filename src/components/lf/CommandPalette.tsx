import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";

const ACTIONS: Array<{ label: string; hint: string; target: string }> = [
  { label: "Launch interactive demo", hint: "/demo", target: "/demo" },
  { label: "Try the API console", hint: "#try", target: "#try" },
  { label: "Browse security platforms", hint: "#platforms", target: "#platforms" },
  { label: "Generate an environment with AI", hint: "#ai", target: "#ai" },
  { label: "Open live API activity", hint: "#activity", target: "#activity" },
  { label: "Start a chaos test", hint: "#chaos", target: "#chaos" },
  { label: "Replay an incident scenario", hint: "#scenario", target: "#scenario" },
  { label: "Check production readiness", hint: "#readiness", target: "#readiness" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (target: string) => {
    onOpenChange(false);
    if (target.startsWith("#")) document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    else void navigate({ to: target });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-start justify-center bg-background/70 px-4 pt-[14vh] backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="panel w-full max-w-lg overflow-hidden"
          >
            <div className="border-b border-border px-4 py-3 font-mono text-[0.75rem] text-muted-foreground">
              Jump to…
            </div>
            <ul className="max-h-[52vh] overflow-y-auto p-1.5">
              {ACTIONS.map((a) => (
                <li key={a.label}>
                  <button
                    onClick={() => go(a.target)}
                    className="flex w-full items-center justify-between gap-3 rounded px-3 py-2.5 text-left text-[0.85rem] transition-colors hover:bg-accent/70"
                  >
                    {a.label}
                    <span className="font-mono text-[0.7rem] text-muted-foreground">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
