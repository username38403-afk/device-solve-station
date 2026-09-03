import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Gauge, Radio, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { z } from "zod";

const diagnosticsSearch = z.object({ tab: z.enum(["speed"]).optional() });

export const Route = createFileRoute("/diagnostics")({
  validateSearch: (search) => diagnosticsSearch.parse(search),
  head: () => ({
    meta: [
      { title: "Diagnostics — FixMyTech" },
      { name: "description", content: "Run browser-safe connection and performance checks with clear signals." },
      { property: "og:title", content: "Diagnostics — FixMyTech" },
      { property: "og:description", content: "Run browser-safe connection and performance checks with clear signals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const { tab } = Route.useSearch();
  return (
    <ToolWorkspace eyebrow="Signal lab" title="Diagnostics without the guesswork." description="Measure the basics first, then decide what deserves a deeper fix.">
      <div className="grid gap-4 md:grid-cols-3">
        <WorkspacePanel title="Connection health" description="Check reachability and browser-visible network status.">
          <Button variant="brand" className="mt-5"><Activity /> Run check</Button>
        </WorkspacePanel>
        <WorkspacePanel title="Latency check" description="See how quickly a lightweight request responds.">
          <Button variant="quiet" className="mt-5"><Timer /> Measure latency</Button>
        </WorkspacePanel>
        <WorkspacePanel title="Internet speed" description="Create a simple baseline for your current connection.">
          <Button asChild variant={tab === "speed" ? "brand" : "quiet"} className="mt-5"><Link to="/diagnostics" search={{ tab: "speed" }}><Gauge /> {tab === "speed" ? "Speed test selected" : "Open speed test"}</Link></Button>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Live result" description={tab === "speed" ? "The speed test workspace is ready for a measurement." : "Run a check to populate a result."}>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mist p-4 text-sm text-soft"><Radio className="size-5 text-indigo" /> Waiting for a browser-safe signal.</div>
      </WorkspacePanel>
    </ToolWorkspace>
  );
}