import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Download, FileImage, FileUp, ImageDown, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { Button } from "@/components/ui/button";

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
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [quality, setQuality] = useState("0.78");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  const reset = () => {
    setFile(null);
    setOutputUrl(null);
    setOutputSize(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const processFile = async () => {
    if (!file) { setError("Choose an image file first."); return; }
    setBusy(true); setError(null); setOutputUrl(null);
    try {
      if (!file.type.startsWith("image/")) throw new Error("not-image");
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const maxEdge = tool === "optimize" ? 1800 : 1400;
      const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("canvas");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", Number(quality)));
      if (!blob) throw new Error("encode");
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
    } catch (processingError) {
      console.error("File processing failed", processingError);
      setError("This file could not be processed. Try a PNG, JPEG, or WebP image.");
    } finally { setBusy(false); }
  };

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
      <WorkspacePanel title="Tool workspace" description={tool ? "Choose a local file, process it in your browser, and download the result." : "Choose a tool to begin."}>
        {tool ? (
          <div className="mt-5 space-y-4">
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="block w-full rounded-2xl border border-line bg-mist p-3 text-sm" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setOutputUrl(null); setError(null); }} />
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="quality" className="text-xs font-semibold text-soft">Quality {Math.round(Number(quality) * 100)}%</label>
              <input id="quality" type="range" min="0.35" max="1" step="0.01" value={quality} onChange={(event) => setQuality(event.target.value)} className="w-40 accent-[var(--royal)]" />
              <Button type="button" variant="brand" onClick={processFile} disabled={busy || !file}><ImageDown /> {busy ? "Processing…" : "Process locally"}</Button>
              <Button type="button" variant="ghost" onClick={reset}><RotateCcw /> Reset</Button>
            </div>
            {error && <p className="flex items-center gap-2 rounded-2xl bg-rose-soft p-3 text-sm text-rose"><AlertCircle className="size-4" />{error}</p>}
            {outputUrl && <div className="rounded-2xl bg-mint-soft p-4 text-sm text-mint"><p className="font-semibold">Ready to download</p><p className="mt-1 text-xs">Original: {((file?.size ?? 0) / 1024).toFixed(1)} KB · Output: {((outputSize ?? 0) / 1024).toFixed(1)} KB</p><a href={outputUrl} download={`fixmytech-${file?.name ?? "image"}.jpg`} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-mint px-4 py-2 text-sm font-semibold text-ink"><Download className="size-4" /> Download result</a></div>}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-lavender p-4 text-indigo"><ImageDown className="size-5" /><p className="mt-3 text-xs font-semibold">Local processing</p></div><div className="rounded-2xl bg-sun-soft p-4 text-sun"><Zap className="size-5" /><p className="mt-3 text-xs font-semibold">Clear output</p></div></div>
        )}
      </WorkspacePanel>
    </ToolWorkspace>
  );
}