import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/well-architected")({
  head: () => ({
    meta: [
      { title: "Well-Architected Review — AWS Cloud Architect Hub" },
      { name: "description", content: "Score your workload across all six AWS Well-Architected pillars and get actionable recommendations." },
      { property: "og:title", content: "Well-Architected Review" },
      { property: "og:description", content: "Assess your AWS architecture across six pillars." },
    ],
  }),
  component: WaPage,
});

const pillars = [
  {
    id: "operational",
    name: "Operational Excellence",
    questions: [
      "Do you use infrastructure-as-code (CDK/Terraform/CloudFormation)?",
      "Are deployments automated with rollback?",
      "Do you have runbooks and game days?",
    ],
  },
  {
    id: "security",
    name: "Security",
    questions: [
      "Is MFA enforced everywhere?",
      "Are secrets stored in Secrets Manager/SSM?",
      "Is data encrypted at rest and in transit?",
      "Do you use least-privilege IAM?",
    ],
  },
  {
    id: "reliability",
    name: "Reliability",
    questions: [
      "Deployed across ≥2 AZs?",
      "Automated backups with tested restores?",
      "Health checks and auto-recovery in place?",
    ],
  },
  {
    id: "performance",
    name: "Performance Efficiency",
    questions: [
      "Right-sizing reviewed with Compute Optimizer?",
      "Caching at CDN and application layer?",
      "Serverless considered for spiky workloads?",
    ],
  },
  {
    id: "cost",
    name: "Cost Optimization",
    questions: [
      "Using Savings Plans or Reserved capacity?",
      "S3 lifecycle to IA/Glacier?",
      "Unused EBS/EIPs/NAT gateways cleaned up?",
    ],
  },
  {
    id: "sustainability",
    name: "Sustainability",
    questions: [
      "Using Graviton where possible?",
      "Right-region selection (renewable energy)?",
      "Auto Scaling to match demand, no over-provisioning?",
    ],
  },
] as const;

type Scores = Record<string, number>;

function WaPage() {
  const [scores, setScores] = useState<Scores>(() =>
    Object.fromEntries(pillars.flatMap((p) => p.questions.map((_, i) => [`${p.id}-${i}`, 3]))),
  );

  const perPillar = useMemo(() => {
    return pillars.map((p) => {
      const values = p.questions.map((_, i) => scores[`${p.id}-${i}`] ?? 0);
      const total = values.reduce((a, b) => a + b, 0);
      const pct = Math.round((total / (values.length * 5)) * 100);
      return { pillar: p, pct };
    });
  }, [scores]);

  const overall = Math.round(perPillar.reduce((a, b) => a + b.pct, 0) / perPillar.length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Well-Architected Review
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Score your workload across 6 pillars
        </h1>
        <p className="mt-3 text-muted-foreground">
          Rate each practice 1 (not started) to 5 (fully implemented). We compute a
          pillar score and highlight what to work on next.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {pillars.map((p) => (
            <section key={p.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" />
                <h2 className="font-semibold">{p.name}</h2>
              </div>
              <div className="mt-4 space-y-4">
                {p.questions.map((q, i) => {
                  const key = `${p.id}-${i}`;
                  const v = scores[key] ?? 3;
                  return (
                    <div key={key}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm">{q}</div>
                        <div className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums">{v}</div>
                      </div>
                      <Slider
                        className="mt-2"
                        min={1} max={5} step={1} value={[v]}
                        onValueChange={(val) => setScores((s) => ({ ...s, [key]: val[0] }))}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="sticky top-24 h-max space-y-4 rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div>
            <div className="text-xs uppercase tracking-widest text-accent">Overall score</div>
            <div className="mt-1 text-5xl font-black tabular-nums">{overall}<span className="text-2xl text-muted-foreground">/100</span></div>
          </div>
          <div className="space-y-3">
            {perPillar.map(({ pillar, pct }) => (
              <div key={pillar.id}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{pillar.name}</span>
                  <span className="tabular-nums text-muted-foreground">{pct}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }}
                    className="h-full rounded-full"
                    style={{ background: pct >= 70 ? "var(--gradient-accent)" : "var(--gradient-hero)" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
            <div className="mb-1 flex items-center gap-1 font-semibold text-foreground">
              <CheckCircle2 className="size-3.5" /> Next actions
            </div>
            Focus on the two lowest pillars first; they compound the most risk.
          </div>
        </aside>
      </div>
    </div>
  );
}