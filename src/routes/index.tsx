import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Boxes, Calculator, Cloud, Compass, Layers, LineChart,
  Network, Rocket, ShieldCheck, Sparkles, Zap,
} from "lucide-react";
import { services } from "@/data/services";
import { roadmap } from "@/data/learning";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  { to: "/services", icon: Layers, title: "Services Explorer", desc: "Deep-dive 21 core AWS services with best practices and interview questions." },
  { to: "/architect", icon: Compass, title: "Architecture Generator", desc: "Pick a workload type and get a recommended AWS blueprint." },
  { to: "/vpc", icon: Network, title: "VPC Visualizer", desc: "Interactive VPC with public/private subnets, IGW, NAT and SGs." },
  { to: "/cost", icon: Calculator, title: "Cost Estimator", desc: "Quick monthly estimates for EC2, S3, RDS, Lambda and transfer." },
  { to: "/well-architected", icon: ShieldCheck, title: "Well-Architected Review", desc: "Score your workload across all 6 pillars with actionable tips." },
  { to: "/learn", icon: Rocket, title: "Learning Center", desc: "Roadmap, flashcards, quizzes, scenarios and lab ideas." },
] as const;

const stats = [
  { value: "21", label: "Core services" },
  { value: "6", label: "WA pillars" },
  { value: "50+", label: "Interview questions" },
  { value: "5", label: "Reference architectures" },
];

function Index() {
  const featured = ["ec2", "s3", "lambda", "dynamodb", "vpc", "cloudfront"]
    .map((id) => services.find((s) => s.id === id)!)
    .filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(600px 300px at 20% 10%, oklch(0.72 0.17 55 / 0.25), transparent 60%), radial-gradient(500px 300px at 80% 30%, oklch(0.55 0.15 255 / 0.25), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5 text-accent" />
              A Solutions Architect's toolbox
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              Design, learn, and estimate{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-accent)" }}
              >
                on AWS
              </span>
              .
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              An interactive platform to explore core AWS services, generate reference
              architectures, visualize VPCs, estimate cost, and prep for the Solutions
              Architect interview — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/services">
                  Explore services <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/architect">Generate an architecture</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div className="text-3xl font-black tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader
          eyebrow="What you can do"
          title="Everything a cloud architect needs"
          subtitle="Seven focused tools that stitch together into a portfolio-grade AWS workflow."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={f.to}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/50"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className="grid size-11 place-items-center rounded-xl text-white"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Open <ArrowRight className="size-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeader
            eyebrow="Featured services"
            title="Start with the essentials"
            subtitle="The services that anchor almost every AWS architecture."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s.id}
                to="/services/$id"
                params={{ id: s.id }}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-10 place-items-center rounded-lg text-white ${
                      s.color === "orange" ? "bg-accent" : "bg-primary"
                    }`}
                  >
                    <Boxes className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.category}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {s.tagline}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/services">See all 21 services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Learning roadmap"
          title="From cloud-curious to Solutions Architect"
          subtitle="A pragmatic 16-week path that mirrors real-world architect responsibilities."
        />
        <ol className="relative mt-10 border-l border-border pl-6">
          {roadmap.map((r, i) => (
            <li key={r.stage} className="mb-8 last:mb-0">
              <div
                className="absolute -left-[9px] grid size-4 place-items-center rounded-full border-2 border-background"
                style={{ background: "var(--gradient-hero)" }}
              />
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {r.weeks}
                </div>
                <h3 className="text-lg font-semibold">{r.stage}</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {r.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div
          className="relative overflow-hidden rounded-3xl p-10 text-white sm:p-14"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
              <Zap className="size-3.5" /> Ready when you are
            </div>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Ship your first reference architecture today.
            </h2>
            <p className="mt-3 text-white/80">
              Pick a workload, get a diagram, drill into every service, then defend
              your design in the interview hub.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/architect">
                  <Compass className="size-4" /> Open Architect
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link to="/interview">
                  <LineChart className="size-4" /> Interview prep
                </Link>
              </Button>
            </div>
          </div>
          <Cloud
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-72 opacity-10"
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow, title, subtitle,
}: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-semibold uppercase tracking-widest text-accent">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
