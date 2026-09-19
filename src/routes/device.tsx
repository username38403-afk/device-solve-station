import { createFileRoute, Link } from "@tanstack/react-router";
import { BatteryCharging, Camera, CheckCircle2, Mic, MonitorSmartphone, Smartphone, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { Button } from "@/components/ui/button";

const deviceSearch = z.object({ test: z.enum(["camera", "battery"]).optional() });
type DeviceResult = { title: string; detail: string; tone: "good" | "warn" };

export const Route = createFileRoute("/device")({
  validateSearch: (search) => deviceSearch.parse(search),
  head: () => ({ meta: [
    { title: "Device Tests — FixMyTech" },
    { name: "description", content: "Check camera, microphone, screen, and battery signals from your browser." },
    { property: "og:title", content: "Device Tests — FixMyTech" },
    { property: "og:description", content: "Check camera, microphone, screen, and battery signals from your browser." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DevicePage,
});

function DevicePage() {
  const { test } = Route.useSearch();
  const [active, setActive] = useState<string | null>(null);
  const [result, setResult] = useState<DeviceResult | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); }, []);

  const runTest = async (kind: "camera" | "microphone" | "screen" | "battery") => {
    setActive(kind); setResult(null);
    try {
      if (kind === "camera" || kind === "microphone") {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        const stream = await navigator.mediaDevices.getUserMedia({ video: kind === "camera", audio: kind === "microphone" });
        streamRef.current = stream;
        const track = stream.getVideoTracks()[0] ?? stream.getAudioTracks()[0];
        setResult({ title: `${kind === "camera" ? "Camera" : "Microphone"} is available`, detail: `${track?.label || "A media device"} responded to the permission request. The stream will be stopped when you run another test.`, tone: "good" });
      } else if (kind === "screen") {
        setResult({ title: "Screen detected", detail: `${window.screen.width} × ${window.screen.height} CSS pixels · viewport ${window.innerWidth} × ${window.innerHeight}.`, tone: "good" });
      } else {
        const batteryNavigator = navigator as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> };
        if (!batteryNavigator.getBattery) throw new Error("unsupported");
        const battery = await batteryNavigator.getBattery();
        setResult({ title: `${Math.round(battery.level * 100)}% battery`, detail: battery.charging ? "The device reports that it is charging." : "The device reports that it is not charging.", tone: "good" });
      }
    } catch (error) {
      console.error("Device test failed", error);
      setResult({ title: "Test unavailable", detail: kind === "battery" ? "This browser does not expose battery information." : "Permission was denied or this browser does not support the requested device test.", tone: "warn" });
    } finally { setActive(null); }
  };

  return (
    <ToolWorkspace eyebrow="Device lab" title="Know what your device can do." description="Run permission-aware checks for the hardware and browser capabilities that matter.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WorkspacePanel title="Camera" description="Verify a live camera stream."><Button type="button" variant={test === "camera" ? "brand" : "quiet"} className="mt-5" onClick={() => runTest("camera")} disabled={active !== null}><Camera /> {active === "camera" ? "Requesting…" : "Test camera"}</Button></WorkspacePanel>
        <WorkspacePanel title="Microphone" description="Confirm microphone access is available."><Button type="button" variant="quiet" className="mt-5" onClick={() => runTest("microphone")} disabled={active !== null}><Mic /> {active === "microphone" ? "Requesting…" : "Test microphone"}</Button></WorkspacePanel>
        <WorkspacePanel title="Screen" description="Check display and viewport signals."><Button type="button" variant="quiet" className="mt-5" onClick={() => runTest("screen")} disabled={active !== null}><MonitorSmartphone /> Test screen</Button></WorkspacePanel>
        <WorkspacePanel title="Battery" description="See what the browser can report."><Button type="button" variant={test === "battery" ? "brand" : "quiet"} className="mt-5" onClick={() => runTest("battery")} disabled={active !== null}><BatteryCharging /> Battery info</Button></WorkspacePanel>
      </div>
      <WorkspacePanel title="Device status" description={test ? "The selected device test is ready for a permission-safe check." : "Choose a device test to begin."}>
        {result ? <div className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm ${result.tone === "good" ? "bg-mint-soft text-mint" : "bg-sun-soft text-sun"}`}><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><span><strong className="block font-display text-lg">{result.title}</strong><span className="mt-1 block text-xs opacity-85">{result.detail}</span></span></div> : <div className="mt-5 flex items-center gap-3 rounded-2xl bg-sky-soft p-4 text-sm text-royal"><Smartphone className="size-5" /> Browser capabilities are available when requested.</div>}
        {streamRef.current && <Button type="button" variant="ghost" className="mt-3" onClick={() => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; setResult({ title: "Device stream stopped", detail: "Camera or microphone access has been released.", tone: "good" }); }}><Square /> Stop stream</Button>}
      </WorkspacePanel>
    </ToolWorkspace>
  );
}