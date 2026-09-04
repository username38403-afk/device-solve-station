import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Boxes, Search as SearchIcon, ShieldCheck, Smartphone, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { Button } from "@/components/ui/button";

const searchItems = [
  { title: "Connection diagnostics", keywords: "wifi slow internet latency speed connection", description: "Check reachability, latency, and a transfer baseline.", to: "/diagnostics", icon: Activity },
  { title: "Image compressor", keywords: "compress image jpg png file size", description: "Compress an image locally and download the result.", to: "/tools", search: { tool: "image" as const }, icon: Boxes },
  { title: "URL risk checker", keywords: "url link phishing suspicious website", description: "Review visible URL risk signals without opening it.", to: "/security", search: { tool: "url" as const }, icon: ShieldCheck },
  { title: "Device tests", keywords: "camera microphone battery screen hardware", description: "Check browser permissions and device capabilities.", to: "/device", icon: Smartphone },
  { title: "Quick fixes", keywords: "fix help troubleshooting problems", description: "Browse guided fixes for common tech problems.", to: "/fixes", icon: Wrench },
] as const;

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [
    { title: "Search Tools — FixMyTech" },
    { name: "description", content: "Search FixMyTech tools and find the right browser-first check." },
    { property: "og:title", content: "Search Tools — FixMyTech" },
    { property: "og:description", content: "Search FixMyTech tools and find the right browser-first check." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const focusSearch = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); inputRef.current?.focus(); } }; window.addEventListener("keydown", focusSearch); return () => window.removeEventListener("keydown", focusSearch); }, []);
  const results = useMemo(() => { const normalized = query.trim().toLowerCase(); return normalized ? searchItems.filter((item) => `${item.title} ${item.keywords} ${item.description}`.toLowerCase().includes(normalized)) : searchItems; }, [query]);
  return (
    <ToolWorkspace eyebrow="Command search" title="Find the right tool." description="Search diagnostics, utilities, safety checks, and device tests.">
      <WorkspacePanel title="Search workspace" description="Type a symptom or task, then open the closest match.">
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-mist px-4 py-3 focus-within:ring-2 focus-within:ring-electric"><SearchIcon className="size-5 shrink-0 text-indigo" /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “wifi slow” or “compress image”" aria-label="Search tools" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" /><kbd className="hidden rounded-lg bg-lavender px-2 py-0.5 font-mono text-[10px] text-indigo sm:inline">⌘K</kbd></div>
        {results.length ? <div className="mt-5 grid gap-3">{results.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lavender text-indigo"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block font-display text-lg">{item.title}</strong><span className="mt-1 block text-xs text-soft">{item.description}</span></span><Button asChild variant="quiet" className="shrink-0"><Link to={item.to} search={"search" in item ? item.search : undefined}>Open tool</Link></Button></div>; })}</div> : <div className="mt-5 rounded-2xl bg-sun-soft p-4 text-sm text-sun">No matching tools. Try a broader symptom such as “wifi”, “file”, or “camera”.</div>}
      </WorkspacePanel>
    </ToolWorkspace>
  );
}