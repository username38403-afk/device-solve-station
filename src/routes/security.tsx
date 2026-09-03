import { createFileRoute, Link } from "@tanstack/react-router";
import { FileWarning, Link2, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { z } from "zod";

const securitySearch = z.object({ tool: z.enum(["url", "email", "qr"]).optional() });

export const Route = createFileRoute("/security")({
  validateSearch: (search) => securitySearch.parse(search),
  head: () => ({
    meta: [
      { title: "Security — FixMyTech" },
      { name: "description", content: "Pause before you click with browser-first URL, email, and QR safety checks." },
      { property: "og:title", content: "Security — FixMyTech" },
      { property: "og:description", content: "Pause before you click with browser-first URL, email, and QR safety checks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  const { tool } = Route.useSearch();
  return (
    <ToolWorkspace eyebrow="Safety desk" title="Check before you click." description="Review visible risk signals without opening a suspicious destination.">
      <div className="grid gap-4 md:grid-cols-3">
        <WorkspacePanel title="URL risk checker" description="Inspect a link's visible structure and destination hints."><Button asChild variant={tool === "url" ? "brand" : "quiet"} className="mt-5"><Link to="/security" search={{ tool: "url" }}><Link2 /> {tool === "url" ? "Checker selected" : "Inspect a URL"}</Link></Button></WorkspacePanel>
        <WorkspacePanel title="Phishing checker" description="Look for urgency, mismatched links, and social engineering cues."><Button asChild variant={tool === "email" ? "brand" : "quiet"} className="mt-5"><Link to="/security" search={{ tool: "email" }}><FileWarning /> Review an email</Link></Button></WorkspacePanel>
        <WorkspacePanel title="QR safety scanner" description="Preview QR content with a safety pause before visiting it."><Button asChild variant={tool === "qr" ? "brand" : "quiet"} className="mt-5"><Link to="/security" search={{ tool: "qr" }}><QrCode /> Scan QR content</Link></Button></WorkspacePanel>
      </div>
      <WorkspacePanel title="Safety status" description={tool ? "The selected safety check is ready for review." : "Choose a safety check to begin."}>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mint-soft p-4 text-sm text-mint"><ShieldCheck className="size-5" /> No destination has been opened.</div>
      </WorkspacePanel>
    </ToolWorkspace>
  );
}