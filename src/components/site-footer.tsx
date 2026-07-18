import { Cloud } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="grid size-8 place-items-center rounded-lg text-white"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Cloud className="size-4" />
            </div>
            <span className="font-semibold">AWS Cloud Architect Hub</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A hands-on toolbox for Solutions Architects. Not affiliated with Amazon Web Services.
          </p>
        </div>
        <FooterCol title="Explore" links={[
          { to: "/services", label: "Services" },
          { to: "/architect", label: "Architecture Generator" },
          { to: "/vpc", label: "VPC Visualizer" },
        ]} />
        <FooterCol title="Practice" links={[
          { to: "/cost", label: "Cost Estimator" },
          { to: "/well-architected", label: "Well-Architected" },
          { to: "/interview", label: "Interview Hub" },
        ]} />
        <FooterCol title="Learn" links={[
          { to: "/learn", label: "Learning Center" },
        ]} />
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AWS Cloud Architect Hub · Built for learning.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-foreground/80 hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}