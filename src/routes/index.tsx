import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Nav } from "@/components/lf/Nav";
import { Hero } from "@/components/lf/Hero";
import { Playground } from "@/components/lf/Playground";
import { PlatformExplorer } from "@/components/lf/PlatformExplorer";
import { AiGenerator } from "@/components/lf/AiGenerator";
import { LiveActivity } from "@/components/lf/LiveActivity";
import { ChaosTesting } from "@/components/lf/ChaosTesting";
import { AttackScenario } from "@/components/lf/AttackScenario";
import { Readiness } from "@/components/lf/Readiness";
import { BeforeAfter, Collaboration, FomoStrip } from "@/components/lf/Sections";
import { CommandPalette } from "@/components/lf/CommandPalette";
import { IntegrationGraph } from "@/components/lf/IntegrationGraph";
import { ButtonBase, Section, Underlined } from "@/components/lf/primitives";
import type { Fault } from "@/lib/logforge";

const TITLE = "Log Forge — Simulate security APIs and break your integration safely";
const DESC =
  "Create realistic mock environments for security platforms, inspect API traffic, inject failures and validate production readiness before touching customer infrastructure.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [fault, setFault] = useState<Fault>("none");
  const [chaos, setChaos] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Nav onCommand={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <main>
        <h1 className="sr-only">Log Forge — security API simulation and integration testing</h1>
        <Hero />

        <Section
          id="try"
          eyebrow="03 · Try it now"
          title={
            <>
              Don't watch a demo. <Underlined>Break one.</Underlined>
            </>
          }
          lede="Send a real request against a simulated CrowdStrike environment, then inject the failure your integration has never handled."
        >
          <Playground onFaultChange={setFault} />
        </Section>

        <Section
          id="graph"
          eyebrow="04 · Integration graph"
          title="Every request, visible end to end."
          lede="Your application talks to Log Forge, Log Forge behaves like the vendor. When a fault is injected the graph shows it instantly."
        >
          <div className="panel p-8">
            <IntegrationGraph active fault={fault} />
          </div>
        </Section>

        <Section
          id="platforms"
          eyebrow="05 · Platform explorer"
          title="One workspace. Hundreds of security APIs."
          lede="Search by vendor or capability, inspect endpoint coverage and authentication, then generate an environment."
        >
          <PlatformExplorer />
        </Section>

        <Section
          id="ai"
          eyebrow="06 · Environment generator"
          title={
            <>
              Describe the environment. <Underlined>Log Forge builds it.</Underlined>
            </>
          }
          lede="Natural language compiles into a typed environment spec you can edit before anything is generated."
        >
          <AiGenerator />
        </Section>

        <Section
          id="activity"
          eyebrow="07 · Live api activity"
          title="See exactly what your integration is doing."
          lede="Every call streams in as it happens. Click any row for request, response, headers, timing and schema."
        >
          <LiveActivity chaos={chaos} />
        </Section>

        <Section
          id="chaos"
          eyebrow="08 · Chaos testing"
          title="Your integration works. Until the API doesn't."
          lede="Compose a fault profile, run it against your client and get a resilience score with the exact weaknesses named."
        >
          <ChaosTesting onChaosChange={setChaos} />
        </Section>

        <Section
          id="scenario"
          eyebrow="09 · Attack scenarios"
          title="Replay incidents before customers experience them."
          lede="Play a full detection-to-containment timeline while the correlated API calls stream into the inspector."
        >
          <AttackScenario />
        </Section>

        <Section
          id="readiness"
          eyebrow="10 · Production readiness"
          title={
            <>
              Know when your integration is <Underlined>actually ready.</Underlined>
            </>
          }
          lede="A single score backed by the tests that matter — auth, coverage, error handling, rate limits, performance, schema and resilience."
        >
          <Readiness />
        </Section>

        <Section id="fomo" eyebrow="11 · Untested risk" title="Shipping is not the same as surviving.">
          <FomoStrip />
        </Section>

        <Section id="before" eyebrow="12 · Before / after" title="Same integration. Different week.">
          <BeforeAfter />
        </Section>

        <Section id="team" eyebrow="13 · Collaboration" title="Not only a developer tool.">
          <Collaboration />
        </Section>

        <Section id="final" className="border-b">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.7rem]">
                Stop waiting for the environment. <Underlined>Start building the integration.</Underlined>
              </h2>
              <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-muted-foreground">
                Create the environment, connect your application, break it safely and know what will happen
                before production.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/demo">
                  <ButtonBase variant="primary" className="px-5 py-2.5">
                    <Play className="size-3.5" /> Launch Interactive Demo
                  </ButtonBase>
                </Link>
                <a href="#try">
                  <ButtonBase variant="outline" className="px-5 py-2.5">
                    Explore Log Forge <ArrowRight className="size-3.5" />
                  </ButtonBase>
                </a>
              </div>
              <ul className="mt-6 space-y-1.5 font-mono text-[0.74rem] text-muted-foreground">
                <li>▸ No installation required for demo</li>
                <li>▸ Sample data only</li>
                <li>▸ Takes approximately 2 minutes</li>
              </ul>
            </div>
            <div className="panel p-8">
              <IntegrationGraph active />
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 font-mono text-[0.72rem] text-muted-foreground">
          <span>
            log<span className="text-primary">forge</span> · concept prototype · all data synthetic
          </span>
          <span>
            Press <kbd className="rounded border border-border px-1">⌘K</kbd> for the command palette
          </span>
        </div>
      </footer>
    </div>
  );
}
