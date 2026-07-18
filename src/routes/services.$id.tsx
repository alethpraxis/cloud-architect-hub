import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowLeft, CheckCircle2, DollarSign, HelpCircle, Sparkles } from "lucide-react";
import { services, type AwsService } from "@/data/services";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/services/$id")({
  loader: ({ params }) => {
    const svc = services.find((s) => s.id === params.id);
    if (!svc) throw notFound();
    return { svc };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.svc.name} — AWS Cloud Architect Hub` },
          { name: "description", content: loaderData.svc.tagline },
          { property: "og:title", content: loaderData.svc.name },
          { property: "og:description", content: loaderData.svc.tagline },
        ]
      : [{ title: "Service not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Service not found</h1>
      <p className="mt-2 text-muted-foreground">We couldn't find that AWS service.</p>
      <Link to="/services" className="mt-6 inline-block text-primary underline">
        Back to services
      </Link>
    </div>
  ),
});

function ServiceDetail() {
  const { svc } = Route.useLoaderData() as { svc: AwsService };
  const Icon = ((Icons as unknown as Record<string, Icons.LucideIcon>)[svc.icon] ??
    Icons.Boxes) as Icons.LucideIcon;

  const related = svc.related
    .map((id: string) => services.find((s) => s.id === id))
    .filter((s): s is AwsService => !!s);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/services"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All services
      </Link>

      <div
        className="mt-6 overflow-hidden rounded-3xl border border-border p-8 text-white sm:p-10"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-start gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <Icon className="size-7" />
          </div>
          <div className="min-w-0">
            <Badge variant="secondary" className="bg-white/15 text-white">
              {svc.category}
            </Badge>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{svc.name}</h1>
            <p className="mt-2 text-white/85">{svc.tagline}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Overview">
            <p className="text-muted-foreground">{svc.description}</p>
          </Card>
          <Card title="Use cases" icon={<Sparkles className="size-4 text-accent" />}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {svc.useCases.map((u) => (
                <li key={u} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Best practices">
            <ul className="space-y-2">
              {svc.bestPractices.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Architecture example">
            <p className="text-sm text-muted-foreground">{svc.architectureExample}</p>
          </Card>
          <Card
            title="Interview questions"
            icon={<HelpCircle className="size-4 text-accent" />}
          >
            <div className="space-y-4">
              {svc.interviewQuestions.map((qa, i) => (
                <div key={i} className="rounded-xl border border-border bg-secondary/40 p-4">
                  <div className="text-sm font-semibold">Q: {qa.q}</div>
                  <div className="mt-1 text-sm text-muted-foreground">A: {qa.a}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Pricing" icon={<DollarSign className="size-4 text-accent" />}>
            <p className="text-sm text-muted-foreground">{svc.pricing}</p>
          </Card>
          {related.length > 0 ? (
            <Card title="Related services">
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to="/services/$id"
                    params={{ id: r.id }}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Card({
  title, children, icon,
}: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}