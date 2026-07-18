import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Router, Server, ShieldCheck, Waypoints } from "lucide-react";

export const Route = createFileRoute("/vpc")({
  head: () => ({
    meta: [
      { title: "VPC Visualizer — AWS Cloud Architect Hub" },
      { name: "description", content: "Interactive AWS VPC visualization: public/private subnets, Internet Gateway, NAT, Security Groups and NACLs." },
      { property: "og:title", content: "VPC Visualizer" },
      { property: "og:description", content: "Understand VPC networking visually." },
    ],
  }),
  component: VpcPage,
});

type NodeKey = "igw" | "public-a" | "public-b" | "private-a" | "private-b" | "data-a" | "data-b" | "nat" | "sg";

const details: Record<NodeKey, { title: string; body: string }> = {
  igw: { title: "Internet Gateway", body: "Horizontally scaled, redundant VPC component that allows communication between the VPC and the internet. Free of charge." },
  "public-a": { title: "Public Subnet — AZ a", body: "Route table has 0.0.0.0/0 → IGW. Holds ALB and NAT Gateway. Never place stateful workloads here." },
  "public-b": { title: "Public Subnet — AZ b", body: "Second AZ mirror of public subnet A. High availability requires ≥2 AZs." },
  "private-a": { title: "Private App Subnet — AZ a", body: "Route table has 0.0.0.0/0 → NAT. Runs EC2/ECS/EKS/Lambda ENIs. Reachable only via ALB in the public subnet." },
  "private-b": { title: "Private App Subnet — AZ b", body: "AZ b mirror. Auto Scaling group spans both AZs for HA." },
  "data-a": { title: "Data Subnet — AZ a", body: "No egress to the internet. RDS/Aurora/ElastiCache live here. Ingress restricted to app SG." },
  "data-b": { title: "Data Subnet — AZ b", body: "AZ b mirror. Multi-AZ RDS standby lives here." },
  nat: { title: "NAT Gateway", body: "Managed egress to internet for private subnets. ~$0.045/hr + $0.045/GB. Deploy one per AZ for resilience." },
  sg: { title: "Security Groups", body: "Stateful, instance-level. ALB-SG allows 443 from 0.0.0.0/0. App-SG allows 8080 from ALB-SG. DB-SG allows 5432 from App-SG." },
};

function VpcPage() {
  const [active, setActive] = useState<NodeKey>("igw");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          VPC Visualizer
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          A production-grade VPC, visualized
        </h1>
        <p className="mt-3 text-muted-foreground">
          Click any component to learn what it does, why it's placed there and how it
          fits into the whole design.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div
          className="relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 p-6"
          style={{ background: "oklch(0.55 0.15 255 / 0.04)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary">VPC</div>
              <div className="text-sm font-semibold">10.0.0.0/16</div>
            </div>
            <button
              onClick={() => setActive("igw")}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all ${
                active === "igw" ? "border-accent bg-accent/10" : "border-border bg-card"
              }`}
            >
              <Globe className="size-4 text-accent" />
              Internet Gateway
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(["a", "b"] as const).map((az) => (
              <div key={az} className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Availability Zone {az}
                </div>
                <SubnetNode
                  label={`Public subnet 10.0.${az === "a" ? 1 : 2}.0/24`}
                  color="orange"
                  icon={<Waypoints className="size-4" />}
                  active={active === (`public-${az}` as NodeKey)}
                  onClick={() => setActive(`public-${az}` as NodeKey)}
                  tags={az === "a" ? ["ALB", "NAT Gateway"] : ["ALB target"]}
                />
                <div className="my-2 mx-auto h-3 w-px bg-border" />
                <SubnetNode
                  label={`Private app 10.0.${az === "a" ? 11 : 12}.0/24`}
                  color="blue"
                  icon={<Server className="size-4" />}
                  active={active === (`private-${az}` as NodeKey)}
                  onClick={() => setActive(`private-${az}` as NodeKey)}
                  tags={["ECS", "EC2"]}
                />
                <div className="my-2 mx-auto h-3 w-px bg-border" />
                <SubnetNode
                  label={`Data 10.0.${az === "a" ? 21 : 22}.0/24`}
                  color="navy"
                  icon={<Router className="size-4" />}
                  active={active === (`data-${az}` as NodeKey)}
                  onClick={() => setActive(`data-${az}` as NodeKey)}
                  tags={["RDS", "ElastiCache"]}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setActive("nat")}
              className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition-all ${
                active === "nat" ? "border-accent bg-accent/10" : "border-border bg-card"
              }`}
            >
              <div className="font-semibold">NAT Gateway ×2</div>
              <div className="text-xs text-muted-foreground">Egress from private subnets</div>
            </button>
            <button
              onClick={() => setActive("sg")}
              className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition-all ${
                active === "sg" ? "border-accent bg-accent/10" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="size-4 text-primary" /> Security Groups
              </div>
              <div className="text-xs text-muted-foreground">Stateful firewall per tier</div>
            </button>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            Component detail
          </div>
          <h3 className="mt-2 text-lg font-semibold">{details[active].title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{details[active].body}</p>

          <div className="mt-6 rounded-xl bg-secondary p-4 text-xs">
            <div className="font-semibold">Traffic path</div>
            <div className="mt-1 text-muted-foreground">
              User → Route 53 → IGW → ALB (public) → App (private) → RDS (data). Egress via NAT.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SubnetNode({
  label, icon, active, onClick, tags, color,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  tags: string[];
  color: "orange" | "blue" | "navy";
}) {
  const styles =
    color === "orange"
      ? "border-accent/40 bg-accent/10"
      : color === "blue"
        ? "border-primary/40 bg-primary/10"
        : "border-aws-navy/40 bg-aws-navy/10";
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border-2 p-3 text-left transition-all ${styles} ${active ? "ring-2 ring-accent" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          <span className="truncate">{label}</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((t) => (
          <span key={t} className="rounded-md bg-background px-2 py-0.5 text-[10px] font-medium">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}