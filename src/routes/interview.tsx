import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { interviewCategories } from "@/data/learning";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Interview Hub — AWS Cloud Architect Hub" },
      { name: "description", content: "Categorized AWS Solutions Architect interview questions, design scenarios, and behavioral tips." },
      { property: "og:title", content: "AWS Interview Hub" },
      { property: "og:description", content: "Categorized AWS Solutions Architect interview prep." },
    ],
  }),
  component: InterviewPage,
});

const scenarios = [
  { title: "Design a URL shortener for 1B redirects/day", body: "Discuss: DNS, CloudFront caching, DynamoDB write hot-key, base62 vs snowflake IDs, analytics via Kinesis." },
  { title: "Migrate a monolith to AWS", body: "Choose Rehost vs Replatform, Aurora migration via DMS, ALB + ASG, cutover with Route 53 weighted DNS." },
  { title: "Cost-cut a $200k/month bill", body: "Compute Optimizer, Savings Plans, Spot, S3 lifecycle, kill idle NAT gateways, tag-based chargebacks." },
  { title: "Multi-region active/passive", body: "Aurora Global DB or DynamoDB Global Tables, Route 53 health-checked failover, runbook + Step Functions promotion." },
];

const behavioralTips = [
  "Use STAR: Situation, Task, Action, Result — quantify the result.",
  "Lead with customer impact, not technology choices.",
  "Own failures. Explain what you learned and how you prevented recurrence.",
  "For LP-based interviews (Amazon), map each answer to 1-2 leadership principles.",
];

function InterviewPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return interviewCategories;
    return interviewCategories
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) => i.q.toLowerCase().includes(term) || i.a.toLowerCase().includes(term),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [q]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Interview Hub
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Prep for the AWS Solutions Architect interview
        </h1>
        <p className="mt-3 text-muted-foreground">
          Categorized questions with model answers, real design scenarios and
          behavioral tips.
        </p>
      </div>

      <div className="mt-8 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search questions..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {filtered.map((c) => (
            <section key={c.category} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold">{c.category}</h2>
              <div className="mt-4 divide-y divide-border">
                {c.items.map((item, i) => (
                  <QAItem key={i} qa={item} />
                ))}
              </div>
            </section>
          ))}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No questions match your search.
            </div>
          ) : null}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">Whiteboard scenarios</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {scenarios.map((s) => (
                <div key={s.title} className="rounded-xl border border-border bg-secondary/40 p-4">
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.body}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-max rounded-2xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-widest text-accent">Behavioral tips</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {behavioralTips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function QAItem({ qa }: { qa: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-sm font-medium">{qa.q}</span>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="mt-2 text-sm text-muted-foreground">{qa.a}</div>
      ) : null}
    </div>
  );
}