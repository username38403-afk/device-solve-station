import { createFileRoute } from "@tanstack/react-router";
import { Search, Wrench } from "lucide-react";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Tools — FixMyTech" },
      { name: "description", content: "Search FixMyTech tools and find the right browser-first check." },
      { property: "og:title", content: "Search Tools — FixMyTech" },
      { property: "og:description", content: "Search FixMyTech tools and find the right browser-first check." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  return (
    <ToolWorkspace eyebrow="Command search" title="Find the right tool." description="Search is ready for the next troubleshooting task.">
      <WorkspacePanel title="Search workspace" description="Look across diagnostics, utilities, security checks, and device tests.">
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-mist px-4 py-3 text-sm text-soft"><Search className="size-5 text-indigo" /> Search tools, symptoms, and checks</div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-lavender p-4 text-sm text-indigo"><Wrench className="size-5" /> Try “wifi slow” or “compress image”.</div>
      </WorkspacePanel>
    </ToolWorkspace>
  );
}