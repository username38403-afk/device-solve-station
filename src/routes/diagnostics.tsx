import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Gauge, Radio, Timer, RotateCcw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { z } from "zod";
import { useState } from "react";

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
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; value: string; detail: string; tone: "good" | "warn" | "error" } | null>(null);

  const runMeasurement = async (kind: "connection" | "latency" | "speed") => {
    setRunning(kind);
    setResult(null);
    const started = performance.now();
    try {
      if (!navigator.onLine) throw new Error("offline");
      const response = await fetch(`${window.location.origin}/diagnostic-test.txt?diagnostic=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const elapsed = Math.max(1, performance.now() - started);
      if (kind === "connection") setResult({ label: "Connection healthy", value: "Reachable", detail: `A browser request completed in ${Math.round(elapsed)} ms.`, tone: "good" });
      else if (kind === "latency") setResult({ label: "Round trip time", value: `${Math.round(elapsed)} ms`, detail: "Measured from this browser to the current app origin.", tone: elapsed < 300 ? "good" : "warn" });
      else {
        const body = await response.blob();
        const kbps = body.size / elapsed;
        setResult({ label: "Transfer baseline", value: `${kbps.toFixed(1)} KB/s`, detail: `Measured across ${(body.size / 1024).toFixed(1)} KB. This is a small browser-safe baseline, not an ISP-grade speed test.`, tone: "good" });
      }
    } catch (error) {
      console.error("Diagnostic failed", error);
      setResult({ label: "Check unavailable", value: "Try again", detail: "Unable to load the result. Check your connection and try again.", tone: "error" });
    } finally {
      setRunning(null);
    }
  };

  return (
    <ToolWorkspace eyebrow="Signal lab" title="Diagnostics without the guesswork." description="Measure the basics first, then decide what deserves a deeper fix.">
      <div className="grid gap-4 md:grid-cols-3">
        <WorkspacePanel title="Connection health" description="Check reachability and browser-visible network status.">
          <Button type="button" variant="brand" className="mt-5" onClick={() => runMeasurement("connection")} disabled={running !== null}><Activity /> {running === "connection" ? "Checking…" : "Run check"}</Button>
        </WorkspacePanel>
        <WorkspacePanel title="Latency check" description="See how quickly a lightweight request responds.">
          <Button type="button" variant="quiet" className="mt-5" onClick={() => runMeasurement("latency")} disabled={running !== null}><Timer /> {running === "latency" ? "Measuring…" : "Measure latency"}</Button>
        </WorkspacePanel>
        <WorkspacePanel title="Internet speed" description="Create a simple baseline for your current connection.">
          <Button type="button" variant={tab === "speed" ? "brand" : "quiet"} className="mt-5" onClick={() => runMeasurement("speed")} disabled={running !== null}><Gauge /> {running === "speed" ? "Measuring…" : "Run baseline"}</Button>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Live result" description={tab === "speed" ? "The speed baseline uses a small same-origin transfer." : "Run a check to populate a result."}>
        {result ? <div className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm ${result.tone === "good" ? "bg-mint-soft text-mint" : result.tone === "warn" ? "bg-sun-soft text-sun" : "bg-rose-soft text-rose"}`}><Wifi className="mt-0.5 size-5 shrink-0" /><span><strong className="block font-display text-lg">{result.value}</strong><span className="block font-semibold">{result.label}</span><span className="mt-1 block text-xs opacity-80">{result.detail}</span></span></div> : <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mist p-4 text-sm text-soft"><Radio className="size-5 text-indigo" /> Waiting for a browser-safe signal.</div>}
        {result && <Button type="button" variant="ghost" className="mt-3" onClick={() => setResult(null)}><RotateCcw /> Clear result</Button>}
      </WorkspacePanel>
    </ToolWorkspace>
  );
}
