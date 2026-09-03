import { createFileRoute } from "@tanstack/react-router";
import { Browser, FileKey, ShieldCheck } from "lucide-react";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Center — FixMyTech" },
      { name: "description", content: "Understand how FixMyTech keeps core troubleshooting work private in your browser." },
      { property: "og:title", content: "Privacy Center — FixMyTech" },
      { property: "og:description", content: "Understand how FixMyTech keeps core troubleshooting work private in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <ToolWorkspace eyebrow="Privacy center" title="Your files are yours." description="A clear view of what stays in your browser and when permissions are requested.">
      <div className="grid gap-4 md:grid-cols-3">
        <WorkspacePanel title="Local by default" description="Core file tools process on this device whenever the browser can support it."><Browser className="mt-5 size-6 text-indigo" /></WorkspacePanel>
        <WorkspacePanel title="Permission-aware" description="Camera, microphone, and device access are requested only by the test that needs them."><ShieldCheck className="mt-5 size-6 text-mint" /></WorkspacePanel>
        <WorkspacePanel title="No hidden uploads" description="There is no automatic upload for the core file utilities."><FileKey className="mt-5 size-6 text-royal" /></WorkspacePanel>
      </div>
    </ToolWorkspace>
  );
}