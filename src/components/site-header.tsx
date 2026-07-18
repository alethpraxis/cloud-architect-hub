import { Link } from "@tanstack/react-router";
import { Cloud, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/architect", label: "Architect" },
  { to: "/vpc", label: "VPC" },
  { to: "/cost", label: "Cost" },
  { to: "/well-architected", label: "WA Review" },
  { to: "/learn", label: "Learn" },
  { to: "/interview", label: "Interview" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent transition-all",
        scrolled
          ? "border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "bg-background/0",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-xl text-white shadow-md"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Cloud className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold tracking-tight sm:text-base">
              AWS Cloud Architect Hub
            </div>
            <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              Learn · Design · Estimate
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground hover:bg-secondary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}