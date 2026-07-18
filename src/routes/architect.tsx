import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Boxes, Compass, DollarSign, ShieldCheck, TrendingUp } from "lucide-react";
import { patterns } from "@/data/patterns";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/architect")({
  head: () => ({
    meta: [
      { title: "Architecture Generator — AWS Cloud Architect Hub" },
      { name: "description", content: "Pick a workload type and get a recommended AWS reference architecture with security, cost and scalability guidance." },
      { property: "og:title", content: "Architecture Generator" },
      { property: "og:description", content: "Generate an AWS reference architecture in one click." },
    ],
  }),
  component: Architect,
});

function Architect() {
  const [selected, setSelected] = useState(patterns[0].id);
  const p = patterns.find((x) => x.id === selected)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Architecture Generator
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Pick a workload. Get a blueprint.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Choose an application type and we'll generate a recommended AWS reference
          architecture with security, cost and scalability notes.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {patterns.map((x) => (
          <button
            key={x.id}
            onClick={() => setSelected(x.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selected === x.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-secondary"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <motion.div
        key={p.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 grid gap-6 lg:grid-cols-3"
      >
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-accent" />
            <h2 className="font-semibold">{p.name}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>

          <div className="mt-6 space-y-3">
            {p.diagram.map((layer, i) => (
              <div key={layer.layer} className="rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {i + 1}. {layer.layer}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {layer.nodes.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm shadow-sm"
                    >
                      <Boxes className="size-3.5 text-primary" />
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recommended services
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <InfoCard icon={<ShieldCheck className="size-4" />} title="Security">
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {p.security.map((s) => <li key={s}>• {s}</li>)}
            </ul>
          </InfoCard>
          <InfoCard icon={<DollarSign className="size-4" />} title="Cost optimization">
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {p.cost.map((s) => <li key={s}>• {s}</li>)}
            </ul>
          </InfoCard>
          <InfoCard icon={<TrendingUp className="size-4" />} title="Scalability">
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {p.scalability.map((s) => <li key={s}>• {s}</li>)}
            </ul>
          </InfoCard>
          <Button className="w-full" onClick={() => window.print()}>
            Export as PDF
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-accent">
        {icon}
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      {children}
    </section>
  );
}