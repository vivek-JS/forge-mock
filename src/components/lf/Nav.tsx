import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonBase } from "./primitives";

const ITEMS = [
  { label: "Product", href: "#try" },
  { label: "Platforms", href: "#platforms" },
  { label: "Developers", href: "#activity" },
  { label: "Documentation", href: "#chaos" },
  { label: "Resources", href: "#scenario" },
  { label: "Pricing", href: "#readiness" },
];

export function Nav({ onCommand }: { onCommand?: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/80 bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center gap-6 px-5 transition-all duration-300",
          scrolled ? "h-13 py-2" : "h-17 py-3",
        )}
      >
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Log Forge home">
          <span className="relative grid size-7 place-items-center rounded-[6px] border border-primary/40 bg-primary/10">
            <span className="size-2 rotate-45 bg-primary transition-transform duration-300 group-hover:rotate-[135deg]" />
          </span>
          <span className="font-mono text-[0.9rem] font-semibold tracking-tight">
            log<span className="text-primary">forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {ITEMS.map((i) => (
            <a
              key={i.label}
              href={i.href}
              className="rule-link text-[0.83rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {i.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onCommand}
            className="hidden items-center gap-2 rounded-md border border-border bg-surface/70 px-2.5 py-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:inline-flex"
          >
            <span>Search</span>
            <kbd className="rounded border border-border bg-surface-2 px-1 py-px text-[0.62rem]">⌘K</kbd>
          </button>
          <a href="#final" className="rule-link hidden text-[0.83rem] text-muted-foreground hover:text-foreground sm:block">
            Sign In
          </a>
          <Link to="/demo">
            <ButtonBase variant="primary">Launch Demo</ButtonBase>
          </Link>
        </div>
      </div>
    </header>
  );
}
