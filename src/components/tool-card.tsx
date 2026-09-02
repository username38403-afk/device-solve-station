import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function ToolCard({ title, description, category, to, icon: Icon, tone = "lavender" }: { title: string; description: string; category: string; to: string; icon: LucideIcon; tone?: "lavender" | "sky" | "mint" | "sun" | "rose" }) {
  const tones = { lavender: "bg-lavender text-indigo", sky: "bg-sky-soft text-royal", mint: "bg-mint-soft text-mint", sun: "bg-sun-soft text-sun", rose: "bg-rose-soft text-rose" };
  return <Link to={to} className="instrument-card group flex min-h-44 flex-col rounded-3xl p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"><span className={`grid size-10 place-items-center rounded-2xl ${tones[tone]}`}><Icon className="size-5" aria-hidden="true" /></span><span className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-soft">{category}</span><span className="mt-1 flex items-start justify-between gap-3"><span className="font-display text-lg font-bold leading-tight">{title}</span><ArrowUpRight className="mt-1 size-4 shrink-0 text-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span><span className="mt-1 text-xs leading-5 text-soft">{description}</span></Link>;
}