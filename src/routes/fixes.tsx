import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lightbulb, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";

export const Route = createFileRoute("/fixes")({
  head: () => ({
    meta: [
      { title: "Fixes — FixMyTech" },
      { name: "description", content: "Find practical, browser-first fixes for everyday technology problems." },
      { property: "og:title", content: "Fixes — FixMyTech" },
      { property: "og:description", content: "Find practical, browser-first fixes for everyday technology problems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FixesPage,
});

function FixesPage() {
  return (
    <ToolWorkspace eyebrow="Fix library" title="Start with the symptom." description="Short, practical paths for the technology problems people run into most often.">
      <div className="grid gap-4 md:grid-cols-2">
        <WorkspacePanel title="Slow or unstable internet" description="Check your connection before changing router settings or calling your provider.">
          <Button asChild variant="brand" className="mt-5"><Link to="/diagnostics"><Wifi /> Run internet checks <ArrowRight /></Link></Button>
        </WorkspacePanel>
        <WorkspacePanel title="Not sure where to start?" description="Use a guided signal check to narrow down the right tool without guessing.">
          <Button asChild variant="dark" className="mt-5"><Link to="/diagnostics"><Lightbulb /> Start guided check</Link></Button>
        </WorkspacePanel>
      </div>
    </ToolWorkspace>
  );
}