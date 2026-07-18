import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import * as Icons from "lucide-react";
import { services, categories } from "@/data/services";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "AWS Services Explorer — Cloud Architect Hub" },
      { name: "description", content: "21 core AWS services with descriptions, best practices, pricing, and interview questions." },
      { property: "og:title", content: "AWS Services Explorer" },
      { property: "og:description", content: "Explore core AWS services in depth." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | "All">("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return services.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (!term) return true;
      return (
        s.name.toLowerCase().includes(term) ||
        s.tagline.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    });
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Services Explorer
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">21 core AWS services</h1>
        <p className="mt-3 text-muted-foreground">
          Filter, search, and drill into any service to see use cases, best practices,
          pricing and interview questions.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => {
          const Icon = (Icons as Record<string, Icons.LucideIcon>)[s.icon] ?? Icons.Boxes;
          return (
            <Link
              key={s.id}
              to="/services/$id"
              params={{ id: s.id }}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`grid size-11 place-items-center rounded-xl text-white ${
                    s.color === "orange" ? "bg-accent" : "bg-primary"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <Badge variant="secondary">{s.category}</Badge>
              </div>
              <h3 className="mt-4 font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {s.tagline}
              </p>
            </Link>
          );
        })}
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No services match your filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}