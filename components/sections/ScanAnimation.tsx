"use client";

import { useRef, useEffect, useState } from "react";

type Severity = "nominal" | "review" | "fault";

interface System {
  label: string;
  color: string;
  severity: Severity;
  baseH: number;
}

const SYSTEMS: System[] = [
  { label: "KNOCK",   color: "#00DCFF", severity: "nominal", baseH: 0.20 },
  { label: "FUEL P",  color: "#FF5050", severity: "fault",   baseH: 0.08 },
  { label: "MAF",     color: "#FFB400", severity: "review",  baseH: 0.78 },
  { label: "VE",      color: "#FFB400", severity: "review",  baseH: 0.60 },
  { label: "LTFT B1", color: "#FF5050", severity: "fault",   baseH: 0.08 },
  { label: "LTFT B2", color: "#FF5050", severity: "fault",   baseH: 0.08 },
  { label: "STFT",    color: "#00DCFF", severity: "nominal", baseH: 0.30 },
  { label: "IDLE",    color: "#FFB400", severity: "review",  baseH: 0.48 },
  { label: "SPARK",   color: "#00DCFF", severity: "nominal", baseH: 0.28 },
  { label: "O2 B1",   color: "#00DCFF", severity: "nominal", baseH: 0.35 },
  { label: "O2 B2",   color: "#00DCFF", severity: "nominal", baseH: 0.33 },
  { label: "VIRT TQ", color: "#FFB400", severity: "review",  baseH: 0.65 },
  { label: "TCC",     color: "#00DCFF", severity: "nominal", baseH: 0.22 },
  { label: "TRANS",   color: "#00DCFF", severity: "nominal", baseH: 0.28 },
  { label: "WOT",     color: "#FF5050", severity: "fault",   baseH: 0.08 },
  { label: "INJ",     color: "#FFB400", severity: "review",  baseH: 0.42 },
  { label: "CAM VVT", color: "#00DCFF", severity: "nominal", baseH: 0.32 },
  { label: "BOOST",   color: "#00DCFF", severity: "nominal", baseH: 0.18 },
  { label: "CLT",     color: "#00DCFF", severity: "nominal", baseH: 0.24 },
];

const PHASES = SYSTEMS.map(() => Math.random() * Math.PI * 2);

const STATUS_MSGS = [
  "// PARSING HPTuners CSV...",
  "// MAPPING 19 CHANNELS...",
  "// RUNNING DIAGNOSTICS...",
  "// CROSS-REF KB...",
  "// SCAN COMPLETE ✓",
];

export default function ScanAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [showFault, setShowFault] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf: number;
    let frame = 0;
    let activeCount = 0;
    let faultShown = false;

    const TOTAL = SYSTEMS.length;
    const REVEAL_EVERY = 11; // frames per bar reveal
    const TOTAL_REVEAL = TOTAL * REVEAL_EVERY;
    const HOLD = 80;
    const CYCLE = TOTAL_REVEAL + HOLD;

    function drawFrame() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cycle = frame % CYCLE;
      activeCount = Math.min(TOTAL, Math.floor(cycle / REVEAL_EVERY));

      // sync React state (throttled)
      if (frame % 6 === 0) {
        setActive(activeCount);
        const prog = Math.min(100, Math.round((activeCount / TOTAL) * 100));
        setProgress(prog);

        const si = Math.min(
          STATUS_MSGS.length - 1,
          Math.floor((activeCount / TOTAL) * (STATUS_MSGS.length - 0.01))
        );
        setStatusIdx(si);
        setComplete(activeCount === TOTAL);
      }

      if (!faultShown && activeCount >= 2) {
        faultShown = true;
        setShowFault(true);
      }

      const BAR_W = Math.floor((W - 8) / TOTAL) - 1;
      const MAX_H = H - 28; // leave room for label

      for (let i = 0; i < activeCount; i++) {
        const sys = SYSTEMS[i];
        const phase = PHASES[i];

        let barH: number;
        if (sys.severity === "fault") {
          barH = sys.baseH * MAX_H * 0.9;
        } else if (sys.severity === "review") {
          const wave = Math.sin(frame * 0.04 + phase) * 0.11 * sys.baseH;
          barH = (sys.baseH + wave) * MAX_H;
        } else {
          const wave = Math.sin(frame * 0.042 + phase) * 0.07 * sys.baseH;
          barH = (sys.baseH + wave) * MAX_H;
        }

        const x = 4 + i * (BAR_W + 1);
        const y = H - 18 - barH;

        const opacity = sys.severity === "fault" ? 0.4 : 1;

        ctx.save();
        ctx.globalAlpha = opacity;

        // Bar gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, sys.color);
        grad.addColorStop(1, sys.color + "44");
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, BAR_W, barH);

        // Label
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = sys.color;
        ctx.font = "500 6px Share Tech Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(sys.label.slice(0, 4), x + BAR_W / 2, H - 4);

        ctx.restore();
      }

      frame++;
      raf = requestAnimationFrame(drawFrame);
    }

    raf = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="rounded-[2px] p-3 relative overflow-hidden"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border2)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: complete ? "#00DCB4" : "#00DCFF",
              boxShadow: `0 0 6px ${complete ? "#00DCB4" : "#00DCFF"}`,
              animation: "pulse 1.4s ease-in-out infinite",
            }}
          />
          <span className="font-mono text-[7px] tracking-widest text-t3">
            LIVE
          </span>
        </div>
        <span className="font-mono text-[7px] tracking-widest text-t3">
          ACTIVE: {active} / {SYSTEMS.length}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={340}
        height={100}
        className="w-full rounded-[1px]"
        style={{ maxHeight: "100px" }}
      />

      {/* Progress bar */}
      <div
        className="mt-2 h-px w-full rounded-full overflow-hidden"
        style={{ background: "var(--border2)" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: complete ? "var(--green)" : "var(--cyan)",
          }}
        />
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-mono text-[7px] tracking-widest text-t2">
          {STATUS_MSGS[statusIdx]}
        </span>
        {showFault && (
          <span
            className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 rounded-[2px]"
            style={{
              color: "#FF5050",
              background: "rgba(255,80,80,0.12)",
              border: "1px solid rgba(255,80,80,0.3)",
            }}
          >
            FAULT DETECTED
          </span>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
