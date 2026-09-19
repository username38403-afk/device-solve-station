import { createFileRoute, Link } from "@tanstack/react-router";
import { BatteryCharging, Camera, Mic, MonitorSmartphone, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { z } from "zod";

const deviceSearch = z.object({ test: z.enum(["camera", "battery"]).optional() });

export const Route = createFileRoute("/device")({
  validateSearch: (search) => deviceSearch.parse(search),
  head: () => ({
    meta: [
      { title: "Device Tests — FixMyTech" },
      { name: "description", content: "Check camera, microphone, screen, and battery signals from your browser." },
      { property: "og:title", content: "Device Tests — FixMyTech" },
      { property: "og:description", content: "Check camera, microphone, screen, and battery signals from your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DevicePage,
});

function DevicePage() {
  const { test } = Route.useSearch();
  return (
    <ToolWorkspace eyebrow="Device lab" title="Know what your device can do." description="Run permission-aware checks for the hardware and browser capabilities that matter.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WorkspacePanel title="Camera" description="Verify a live camera stream."><Button asChild variant={test === "camera" ? "brand" : "quiet"} className="mt-5"><Link to="/device" search={{ test: "camera" }}><Camera /> Test camera</Link></Button></WorkspacePanel>
        <WorkspacePanel title="Microphone" description="Confirm microphone access is available."><Button variant="quiet" className="mt-5"><Mic /> Test microphone</Button></WorkspacePanel>
        <WorkspacePanel title="Screen" description="Check display and viewport signals."><Button variant="quiet" className="mt-5"><MonitorSmartphone /> Test screen</Button></WorkspacePanel>
        <WorkspacePanel title="Battery" description="See what the browser can report."><Button asChild variant={test === "battery" ? "brand" : "quiet"} className="mt-5"><Link to="/device" search={{ test: "battery" }}><BatteryCharging /> Battery info</Link></Button></WorkspacePanel>
      </div>
      <WorkspacePanel title="Device status" description={test ? "The selected device test is ready for a permission-safe check." : "Choose a device test to begin."}>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-sky-soft p-4 text-sm text-royal"><Smartphone className="size-5" /> Browser capabilities are available when requested.</div>
      </WorkspacePanel>
    </ToolWorkspace>
  );
}