import { createFileRoute, Link } from "@tanstack/react-router";
import { FileImage, FileUp, ImageDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { z } from "zod";

const toolsSearch = z.object({ tool: z.enum(["image", "optimize"]).optional() });

export const Route = createFileRoute("/tools")({
  validateSearch: (search) => toolsSearch.parse(search),
  head: () => ({
    meta: [
      { title: "Tools — FixMyTech" },
      { name: "description", content: "Use private, browser-first tools for images, files, and everyday digital tasks." },
      { property: "og:title", content: "Tools — FixMyTech" },
      { property: "og:description", content: "Use private, browser-first tools for images, files, and everyday digital tasks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const { tool } = Route.useSearch();
  return (
    <ToolWorkspace eyebrow="Utility bench" title="Useful tools. Private by default." description="Handle common file tasks in the browser, with a clear view of what is happening.">
      <div className="grid gap-4 md:grid-cols-2">
        <WorkspacePanel title="Image compressor" description="Shrink PNG or JPEG files with a before-and-after preview.">
          <Button asChild variant={tool === "image" ? "brand" : "quiet"} className="mt-5"><Link to="/tools" search={{ tool: "image" }}><FileImage /> {tool === "image" ? "Compressor selected" : "Open compressor"}</Link></Button>
        </WorkspacePanel>
        <WorkspacePanel title="Make a file uploadable" description="Set a target format and size before sending a file somewhere else.">
          <Button asChild variant={tool === "optimize" ? "brand" : "quiet"} className="mt-5"><Link to="/tools" search={{ tool: "optimize" }}><FileUp /> {tool === "optimize" ? "Optimizer selected" : "Open optimizer"}</Link></Button>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Tool workspace" description={tool === "image" ? "Your image compressor is ready for a local file." : tool === "optimize" ? "Your file optimizer is ready for a local file." : "Choose a tool to begin."}>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-lavender p-4 text-indigo"><ImageDown className="size-5" /><p className="mt-3 text-xs font-semibold">Local processing</p></div><div className="rounded-2xl bg-sun-soft p-4 text-sun"><Zap className="size-5" /><p className="mt-3 text-xs font-semibold">Clear output</p></div></div>
      </WorkspacePanel>
    </ToolWorkspace>
  );
}