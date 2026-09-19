import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileWarning, Link2, QrCode, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ToolWorkspace, WorkspacePanel } from "@/components/tool-workspace";
import { Button } from "@/components/ui/button";

const securitySearch = z.object({ tool: z.enum(["url", "email", "qr"]).optional() });
type SafetyResult = { title: string; detail: string; tone: "good" | "warn" };

export const Route = createFileRoute("/security")({
  validateSearch: (search) => securitySearch.parse(search),
  head: () => ({ meta: [
    { title: "Security — FixMyTech" },
    { name: "description", content: "Pause before you click with browser-first URL, email, and QR safety checks." },
    { property: "og:title", content: "Security — FixMyTech" },
    { property: "og:description", content: "Pause before you click with browser-first URL, email, and QR safety checks." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SecurityPage,
});

function SecurityPage() {
  const { tool } = Route.useSearch();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<SafetyResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runCheck = () => {
    const input = value.trim();
    if (!input) { setResult({ title: "Enter something to check", detail: "Please enter a URL, email text, or QR content.", tone: "warn" }); return; }
    let next: SafetyResult;
    if (tool === "url") {
      try {
        const parsed = new URL(input);
        const risky = parsed.protocol !== "https:" || Boolean(parsed.username || parsed.password) || /(^|\.)xn--|\d{1,3}(?:\.\d{1,3}){3}/i.test(parsed.hostname) || /(login|verify|urgent|secure-update|free-prize)/i.test(`${parsed.hostname}${parsed.pathname}`);
        next = risky
          ? { title: "Review before opening", detail: "This URL contains one or more visible risk signals: insecure protocol, encoded hostname, IP address, credentials, or urgency language.", tone: "warn" }
          : { title: "No obvious visible red flags", detail: `HTTPS is enabled and the destination is ${parsed.hostname}. This check cannot prove a site is trustworthy.`, tone: "good" };
      } catch { next = { title: "Invalid URL", detail: "Please enter a complete address such as https://example.com.", tone: "warn" }; }
    } else if (tool === "email") {
      const signals = [/urgent|immediately|act now/i, /password|payment|gift card|wire transfer/i, /click here|verify your account/i, /from:.*@.*\.(ru|cn|top|zip)\b/i].filter((pattern) => pattern.test(input)).length;
      next = signals ? { title: "Potential phishing signals found", detail: `${signals} common social-engineering signal${signals === 1 ? "" : "s"} detected. Verify the sender through a trusted channel and do not open unexpected links.`, tone: "warn" } : { title: "No common phrase signals found", detail: "This text scan found no common urgency or credential-request phrases. Check the sender and links separately.", tone: "good" };
    } else {
      try {
        const parsed = new URL(input);
        next = parsed.protocol === "https:" ? { title: "QR content looks like an HTTPS link", detail: `Review the destination ${parsed.hostname} before opening it. No link was opened.`, tone: "good" } : { title: "QR content needs review", detail: "The QR content is not an HTTPS link. Treat unexpected downloads, scripts, and payment requests with caution.", tone: "warn" };
      } catch { next = { title: "QR content is not a web URL", detail: "The content was kept as text and was not opened. Review it before copying it into another app.", tone: "warn" }; }
    }
    setResult(next); setCopied(false);
  };

  const copyResult = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(`${result.title}: ${result.detail}`); setCopied(true); } catch (error) { console.error("Copy failed", error); setCopied(false); }
  };

  return (
    <ToolWorkspace eyebrow="Safety desk" title="Check before you click." description="Review visible risk signals without opening a suspicious destination.">
      <div className="grid gap-4 md:grid-cols-3">
        <WorkspacePanel title="URL risk checker" description="Inspect a link's visible structure and destination hints."><Button asChild variant={tool === "url" ? "brand" : "quiet"} className="mt-5"><Link to="/security" search={{ tool: "url" }}><Link2 /> {tool === "url" ? "Checker selected" : "Inspect a URL"}</Link></Button></WorkspacePanel>
        <WorkspacePanel title="Phishing checker" description="Look for urgency, mismatched links, and social engineering cues."><Button asChild variant={tool === "email" ? "brand" : "quiet"} className="mt-5"><Link to="/security" search={{ tool: "email" }}><FileWarning /> Review an email</Link></Button></WorkspacePanel>
        <WorkspacePanel title="QR safety scanner" description="Review pasted QR content with a safety pause before visiting it."><Button asChild variant={tool === "qr" ? "brand" : "quiet"} className="mt-5"><Link to="/security" search={{ tool: "qr" }}><QrCode /> Scan QR content</Link></Button></WorkspacePanel>
      </div>
      <WorkspacePanel title="Safety status" description={tool ? "Paste content below. Nothing is opened automatically." : "Choose a safety check to begin."}>
        {tool ? <div className="mt-5 space-y-4"><label htmlFor="security-input" className="text-sm font-semibold text-ink">{tool === "url" ? "URL to inspect" : tool === "email" ? "Email subject and body" : "QR text or URL"}</label><textarea id="security-input" value={value} onChange={(event) => setValue(event.target.value)} rows={tool === "email" ? 7 : 3} placeholder={tool === "url" ? "https://example.com" : "Paste content here"} className="block w-full resize-y rounded-2xl border border-line bg-mist p-3 text-sm text-ink outline-none focus:ring-2 focus:ring-electric" /><div className="flex flex-wrap gap-3"><Button type="button" variant="brand" onClick={runCheck}><ClipboardCheck /> Run safety check</Button><Button type="button" variant="ghost" onClick={() => { setValue(""); setResult(null); }}><ShieldCheck /> Clear</Button></div>{result && <div className={`flex items-start gap-3 rounded-2xl p-4 text-sm ${result.tone === "good" ? "bg-mint-soft text-mint" : "bg-sun-soft text-sun"}`}>{result.tone === "good" ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <AlertTriangle className="mt-0.5 size-5 shrink-0" />}<span><strong className="block font-display text-lg">{result.title}</strong><span className="mt-1 block text-xs opacity-85">{result.detail}</span><Button type="button" variant="ghost" className="mt-3 px-0" onClick={copyResult}>{copied ? "Copied" : "Copy guidance"}</Button></span></div>}</div> : <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mint-soft p-4 text-sm text-mint"><ShieldCheck className="size-5" /> No destination has been opened.</div>}
      </WorkspacePanel>
    </ToolWorkspace>
  );
}