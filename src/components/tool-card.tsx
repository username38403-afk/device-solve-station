import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type ToolDestination =
  | { to: "/diagnostics"; search?: { tab?: "speed" } }
  | { to: "/tools"; search?: { tool?: "image" | "optimize" } }
  | { to: "/security"; search?: { tool?: "url" | "email" | "qr" } }
  | { to: "/device"; search?: { test?: "camera" | "battery" } };

export type ToolCardProps = ToolDestination & { title: string; description: string; category: string; icon: LucideIcon; tone?: "lavender" | "sky" | "mint" | "sun" | "rose" };

export function ToolCard(props: ToolCardProps) {
  const { title, description, category, icon: Icon, tone = "lavender" } = props;
  const tones = { lavender: "bg-lavender text-indigo", sky: "bg-sky-soft text-royal", mint: "bg-mint-soft text-mint", sun: "bg-sun-soft text-sun", rose: "bg-rose-soft text-rose" };
  const content = <><span className={`grid size-10 place-items-center rounded-2xl ${tones[tone]}`}><Icon className="size-5" aria-hidden="true" /></span><span className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-soft">{category}</span><span className="mt-1 flex items-start justify-between gap-3"><span className="font-display text-lg font-bold leading-tight">{title}</span><ArrowUpRight className="mt-1 size-4 shrink-0 text-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span><span className="mt-1 text-xs leading-5 text-soft">{description}</span></>;
  const className = "instrument-card group flex min-h-44 flex-col rounded-3xl p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric";
  if (props.to === "/diagnostics") return <Link to="/diagnostics" search={props.search} className={className}>{content}</Link>;
  if (props.to === "/tools") return <Link to="/tools" search={props.search} className={className}>{content}</Link>;
  if (props.to === "/security") return <Link to="/security" search={props.search} className={className}>{content}</Link>;
  return <Link to="/device" search={props.search} className={className}>{content}</Link>;
}