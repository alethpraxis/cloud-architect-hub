import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/cost")({
  head: () => ({
    meta: [
      { title: "AWS Cost Estimator — Cloud Architect Hub" },
      { name: "description", content: "Estimate monthly AWS cost for EC2, S3, RDS, Lambda and data transfer with tuneable sliders." },
      { property: "og:title", content: "AWS Cost Estimator" },
      { property: "og:description", content: "Quick monthly AWS cost estimates." },
    ],
  }),
  component: CostPage,
});

const HOURS = 730;

function CostPage() {
  const [ec2, setEc2] = useState({ count: 3, hourly: 0.0464 }); // t3.medium
  const [s3, setS3] = useState({ gb: 500, requests: 5 }); // requests in millions
  const [rds, setRds] = useState({ hourly: 0.145, storageGb: 100, multiAz: true }); // db.m6g.large
  const [lambda, setLambda] = useState({ requestsMillions: 10, avgMs: 200, memoryMb: 512 });
  const [egressGb, setEgressGb] = useState(200);

  const numbers = useMemo(() => {
    const ec2Cost = ec2.count * ec2.hourly * HOURS;
    const s3Cost = s3.gb * 0.023 + s3.requests * 0.4; // rough put mix
    const rdsCompute = rds.hourly * HOURS * (rds.multiAz ? 2 : 1);
    const rdsStorage = rds.storageGb * 0.115;
    const rdsCost = rdsCompute + rdsStorage;
    const lambdaGbSec = (lambda.requestsMillions * 1_000_000) * (lambda.avgMs / 1000) * (lambda.memoryMb / 1024);
    const lambdaCost = lambda.requestsMillions * 0.2 + lambdaGbSec * 0.0000166667;
    const egressCost = Math.max(0, egressGb - 100) * 0.09;
    const total = ec2Cost + s3Cost + rdsCost + lambdaCost + egressCost;
    return { ec2Cost, s3Cost, rdsCost, lambdaCost, egressCost, total };
  }, [ec2, s3, rds, lambda, egressGb]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Cost Estimator
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          A quick monthly AWS estimate
        </h1>
        <p className="mt-3 text-muted-foreground">
          Rough public-pricing numbers for us-east-1. Real bills depend on Savings
          Plans, tiered pricing, and network patterns — this is a napkin.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Section title="EC2" subtitle={`On-Demand · $${ec2.hourly}/hr per instance`}>
            <SliderRow label={`Instances: ${ec2.count}`}>
              <Slider value={[ec2.count]} min={1} max={20} step={1} onValueChange={(v) => setEc2({ ...ec2, count: v[0] })} />
            </SliderRow>
            <div className="grid gap-2 sm:max-w-xs">
              <Label>Hourly rate ($)</Label>
              <Input
                type="number" step="0.001" value={ec2.hourly}
                onChange={(e) => setEc2({ ...ec2, hourly: Number(e.target.value) })}
              />
            </div>
          </Section>

          <Section title="S3" subtitle="Standard tier · $0.023/GB">
            <SliderRow label={`Storage: ${s3.gb} GB`}>
              <Slider value={[s3.gb]} min={0} max={5000} step={50} onValueChange={(v) => setS3({ ...s3, gb: v[0] })} />
            </SliderRow>
            <SliderRow label={`Requests: ${s3.requests}M`}>
              <Slider value={[s3.requests]} min={0} max={100} step={1} onValueChange={(v) => setS3({ ...s3, requests: v[0] })} />
            </SliderRow>
          </Section>

          <Section title="RDS" subtitle={`${rds.multiAz ? "Multi-AZ" : "Single-AZ"} · gp3 storage`}>
            <SliderRow label={`Storage: ${rds.storageGb} GB`}>
              <Slider value={[rds.storageGb]} min={20} max={2000} step={20} onValueChange={(v) => setRds({ ...rds, storageGb: v[0] })} />
            </SliderRow>
            <div className="flex items-center gap-3">
              <input
                id="multiaz" type="checkbox" checked={rds.multiAz}
                onChange={(e) => setRds({ ...rds, multiAz: e.target.checked })}
                className="size-4 rounded border-border"
              />
              <Label htmlFor="multiaz">Multi-AZ</Label>
            </div>
          </Section>

          <Section title="Lambda" subtitle="$0.20 per million requests + GB-second">
            <SliderRow label={`Requests: ${lambda.requestsMillions}M / month`}>
              <Slider value={[lambda.requestsMillions]} min={0} max={500} step={5} onValueChange={(v) => setLambda({ ...lambda, requestsMillions: v[0] })} />
            </SliderRow>
            <SliderRow label={`Avg duration: ${lambda.avgMs} ms`}>
              <Slider value={[lambda.avgMs]} min={50} max={3000} step={50} onValueChange={(v) => setLambda({ ...lambda, avgMs: v[0] })} />
            </SliderRow>
            <SliderRow label={`Memory: ${lambda.memoryMb} MB`}>
              <Slider value={[lambda.memoryMb]} min={128} max={3008} step={128} onValueChange={(v) => setLambda({ ...lambda, memoryMb: v[0] })} />
            </SliderRow>
          </Section>

          <Section title="Data transfer out" subtitle="First 100GB free · then $0.09/GB">
            <SliderRow label={`${egressGb} GB / month`}>
              <Slider value={[egressGb]} min={0} max={5000} step={50} onValueChange={(v) => setEgressGb(v[0])} />
            </SliderRow>
          </Section>
        </div>

        <aside className="h-max rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div className="text-xs uppercase tracking-widest text-accent">Estimated monthly cost</div>
          <div className="mt-2 flex items-baseline gap-1">
            <DollarSign className="size-6 text-primary" />
            <span className="text-4xl font-black tracking-tight">
              {numbers.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-sm text-muted-foreground">/mo</span>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              ["EC2", numbers.ec2Cost],
              ["S3", numbers.s3Cost],
              ["RDS", numbers.rdsCost],
              ["Lambda", numbers.lambdaCost],
              ["Data transfer", numbers.egressCost],
            ].map(([label, v]) => (
              <li key={label as string} className="flex justify-between text-muted-foreground">
                <span>{label}</span>
                <span className="tabular-nums text-foreground">
                  ${(v as number).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
            Tip: Savings Plans can shave 30–72% off EC2/Lambda when committed 1–3 yr.
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SliderRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm">{label}</div>
      {children}
    </div>
  );
}