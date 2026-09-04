import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Search, Wrench, Activity, ShieldCheck, Boxes, Smartphone, X, Palette, Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { themeOptions, useTheme, type AppTheme } from "@/components/theme-provider";

const navItems = [
  { label: "Fixes", to: "/fixes", icon: Wrench },
  { label: "Diagnostics", to: "/diagnostics", icon: Activity },
  { label: "Tools", to: "/tools", icon: Boxes },
  { label: "Security", to: "/security", icon: ShieldCheck },
  { label: "Device tests", to: "/device", icon: Smartphone },
] as const;

export function FixMyTechShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const chooseTheme = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    setThemeOpen(false);
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface px-5 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-3" aria-label="FixMyTech home">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-ink font-display text-sm font-extrabold text-canvas">FM</span>
          <span className="min-w-0">
            <span className="block font-display text-xl font-extrabold leading-none tracking-tight">FixMyTech</span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-soft">Instrument 03</span>
          </span>
        </Link>
        <div className="mt-12">
          <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-soft">Workspace</p>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.map(({ label, to, icon: Icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link key={to} to={to} className={`flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-colors ${active ? "bg-lavender text-indigo" : "text-soft hover:bg-mist hover:text-ink"}`}>
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <ThemeMenu theme={theme} themeOpen={themeOpen} onToggle={() => setThemeOpen((value) => !value)} onChoose={chooseTheme} />
        <div className="mt-auto rounded-3xl bg-ink p-4 text-canvas">
          <ShieldCheck className="size-5 text-mint" aria-hidden="true" />
          <p className="mt-3 font-display font-bold">Your files are yours.</p>
          <p className="mt-1 text-xs text-canvas/70">Private tools run in your browser by default.</p>
          <Link to="/privacy" className="mt-3 inline-flex text-xs font-semibold text-electric hover:underline">Privacy center →</Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex min-w-0 items-center gap-3 lg:hidden" aria-label="FixMyTech home">
              <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-ink font-display text-sm font-extrabold text-canvas">FM</span>
              <span className="font-display text-lg font-extrabold tracking-tight">FixMyTech</span>
            </Link>
            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 md:flex lg:max-w-xl">
              <Search className="size-4 shrink-0 text-soft" aria-hidden="true" />
              <Link to="/search" className="min-w-0 flex-1 truncate text-sm text-soft">Search “wifi slow”, “compress image”…</Link>
              <span className="rounded-lg bg-lavender px-2 py-0.5 font-mono text-[10px] text-indigo">⌘K</span>
            </div>
            <Link to="/search" className="ml-auto grid size-11 place-items-center rounded-2xl border border-line bg-surface text-soft md:hidden" aria-label="Search tools"><Search className="size-4" /></Link>
            <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex"><Link to="/diagnostics">Run diagnostics</Link></Button>
            <Button variant="quiet" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          {menuOpen && <nav className="border-t border-line bg-surface px-4 py-3 lg:hidden" aria-label="Mobile navigation"><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{navItems.map(({ label, to, icon: Icon }) => <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-2 rounded-2xl bg-mist px-3 text-sm font-semibold text-ink"><Icon className="size-4 text-indigo" aria-hidden="true" />{label}</Link>)}</div><ThemeMenu theme={theme} themeOpen={themeOpen} onToggle={() => setThemeOpen((value) => !value)} onChoose={chooseTheme} mobile /></nav>}
        </header>
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-3 pb-3 pt-2 backdrop-blur-xl lg:hidden" aria-label="Quick navigation">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {navItems.slice(0, 4).map(({ label, to, icon: Icon }) => <Link key={to} to={to} className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-semibold ${location.pathname.startsWith(to) ? "text-indigo" : "text-soft"}`}><Icon className="size-4" aria-hidden="true" />{label}</Link>)}
        </div>
      </nav>
    </div>
  );
}

function ThemeMenu({
  theme,
  themeOpen,
  onToggle,
  onChoose,
  mobile = false,
}: {
  theme: AppTheme;
  themeOpen: boolean;
  onToggle: () => void;
  onChoose: (theme: AppTheme) => void;
  mobile?: boolean;
}) {
  return (
    <div className={mobile ? "mt-3" : "mt-6"}>
      <Button
        type="button"
        variant="quiet"
        className="w-full justify-between"
        onClick={onToggle}
        aria-expanded={themeOpen}
        aria-controls={mobile ? "mobile-theme-options" : "desktop-theme-options"}
      >
        <span className="flex items-center gap-2"><Palette className="size-4 text-indigo" /> Theme</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-soft">{theme}</span>
      </Button>
      {themeOpen && (
        <div id={mobile ? "mobile-theme-options" : "desktop-theme-options"} className="mt-2 grid gap-1 rounded-2xl border border-line bg-surface p-1.5 shadow-card" role="radiogroup" aria-label="Theme">
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={theme === option.value ? "secondary" : "ghost"}
              className="min-h-12 justify-between px-3 text-left"
              onClick={() => onChoose(option.value)}
              role="radio"
              aria-checked={theme === option.value}
            >
              <span className="min-w-0"><span className="block text-sm font-semibold">{option.label}</span><span className="block truncate text-[10px] font-normal text-soft">{option.description}</span></span>
              {theme === option.value && <Check className="size-4 shrink-0 text-indigo" aria-label="Selected" />}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0">{eyebrow && <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-indigo">{eyebrow}</p>}<h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-soft">{description}</p>}</div>{action}</div>;
}

export function StatusPill({ children, tone = "mint" }: { children: ReactNode; tone?: "mint" | "sun" | "rose" | "blue" }) {
  const styles = { mint: "bg-mint-soft text-mint", sun: "bg-sun-soft text-sun", rose: "bg-rose-soft text-rose", blue: "bg-sky-soft text-royal" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${styles[tone]}`}>{children}</span>;
}