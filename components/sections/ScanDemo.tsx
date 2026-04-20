"use client";

import { motion } from "framer-motion";

// ─── CASE_001 demo data ──────────────────────────────────────────────────────
//
// Illustrative scan result for the marketing site. Mirrors the real
// backend's scoring model exactly: every log starts at 100, points come off
// for specific metric thresholds defined in lib/scoring.ts (knock retard,
// safety status, startup peak RPM, MAF spread, fuel trims, WOT lambda
// deviation), remainder is scaled by a confidence factor. One overall
// grade — no per-category letter grades, no user-adjustable weights.
//
// The breakdown below (-5 MAF / -5 LTFT / × 0.90 → 81 → B-) is picked to
// tell a "mostly fine, a few things to dial in" story without being
// punitive or unrealistically clean.

const MODULES = [
  { sev: "warning", system: "Startup & Idle",         finding: "Severe warm idle oscillation detected",      metrics: ["Peak 1,999 RPM", "Settled 7.2s", "440 RPM warm swing"] },
  { sev: "ok",      system: "Knock Safety",            finding: "No retard events — all channels reviewed",    metrics: ["0 knock events", "All channels scanned"] },
  { sev: "info",    system: "High Pressure Fuel",      finding: "Rail present — WOT capacity gated",           metrics: ["Rail max 2,190 psi", "Upload WOT log for eval"] },
  { sev: "warning", system: "Airflow Model",           finding: "Weak throttle-MAF correlation",               metrics: ["MAF spread 36 g/s", "4,944 usable samples", "Corr. -0.07 (WEAK)"] },
  { sev: "gated",   system: "MAF Transfer Function",   finding: "Gated — no WOT pull detected",                metrics: ["Requires 3rd-gear WOT pull"] },
  { sev: "ok",      system: "Fueling Targets",         finding: "Lambda targets nominal — no anomalies",       metrics: ["λ 0.55-1.0", "No commanded anomalies"] },
  { sev: "warning", system: "Spark Control",           finding: "High variability in spark timing",            metrics: ["Range -9° to 59°", "Spread 68°", "HIGH variability"] },
  { sev: "warning", system: "Transmission Shifts",     finding: "NaN gear state detected",                     metrics: ["221 shifts", "P/R/N/1/2/3/4 observed", "NaN gear flag"] },
  { sev: "info",    system: "Torque Converter",        finding: "No TCC channels found",                       metrics: ["TCC analysis gated", "Add TCC slip channel"] },
  { sev: "ok",      system: "Sensor Coverage",         finding: "All primary systems present",                 metrics: ["108 total channels", "All systems logged"] },
  { sev: "warning", system: "Log Quality",             finding: "No WOT pull — confidence factor 0.90",        metrics: ["12 mapped channels", "No WOT pull", "Confidence 0.90"] },
];

const SEV_COLOR: Record<string, string> = {
  warning:  "#FFB400",
  critical: "#FF5050",
  ok:       "#00DCB4",
  info:     "#00DCFF",
  gated:    "#3A5068",
};

const DEMO_SCORE       = 81;
const DEMO_GRADE       = "B-";
const DEMO_GRADE_COLOR = "#00DCFF";

// ─── Component ───────────────────────────────────────────────────────────────

export default function ScanDemo() {
  return (
    <section className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <p className="font-mono text-[13px] tracking-widest text-cyan mb-4">
          // LIVE SCAN DEMO — CASE_001 · Dev Truck · 416ci Whipple 2.9L · Flex Fuel
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display font-bold text-t1 text-3xl md:text-4xl mb-10"
        >
          This is what your tune looks like.
        </motion.h2>

        {/* ── Report Card ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2px] overflow-hidden mb-8"
          style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
        >
          {/* Cyan accent bar */}
          <div className="h-[2px] w-full" style={{ background: "var(--cyan)" }} />

          {/* Header row */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span className="font-display font-bold text-t1 text-base tracking-wide">
              <span className="text-t3">Tune</span>View
            </span>
            <span className="font-mono text-[13px] tracking-widest text-t2">
              CASE_001 · PRO TIER · 2026-04-14
            </span>
          </div>

          {/* Grade hero + penalty breakdown */}
          <div className="px-5 py-6">
            <div className="flex items-baseline gap-5 mb-5 flex-wrap">
              <span
                className="font-display font-bold text-6xl leading-none"
                style={{ color: DEMO_GRADE_COLOR }}
              >
                {DEMO_GRADE}
              </span>
              <div>
                <p className="font-display font-bold text-t1 text-3xl leading-none">
                  {DEMO_SCORE}
                  <span className="text-t3 text-xl font-normal"> / 100</span>
                </p>
                <p className="font-mono text-[12px] tracking-widest text-t3 mt-1">
                  OVERALL SCORE
                </p>
              </div>
            </div>

            <p className="font-mono text-[13px] leading-relaxed text-t2 mb-5 max-w-2xl">
              Every log starts at 100. Points come off for specific metric
              thresholds — knock retard, idle behavior, MAF drift, fuel-trim
              swing, WOT lambda deviation. The remainder is scaled by a
              confidence factor based on log coverage. One grade, one score,
              clear reasons.
            </p>

            {/* Penalty ledger */}
            <div
              className="font-mono text-[13px] leading-relaxed p-4 rounded-[2px]"
              style={{ background: "var(--bg)", border: "1px solid var(--border2)" }}
            >
              <p className="text-cyan tracking-widest mb-3">// THIS LOG</p>

              <div className="flex justify-between">
                <span className="text-t2">Starting score</span>
                <span className="text-t1">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t2">MAF spread 6% · mild drift</span>
                <span style={{ color: "#FFB400" }}>−5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t2">LTFT B1 +6% · mild enrichment</span>
                <span style={{ color: "#FFB400" }}>−5</span>
              </div>

              <div className="my-2" style={{ borderTop: "1px dashed var(--border2)" }} />

              <div className="flex justify-between">
                <span className="text-t2">Subtotal</span>
                <span className="text-t1">90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t2">Confidence factor · good coverage, no WOT</span>
                <span className="text-t1">× 0.90</span>
              </div>

              <div className="my-2" style={{ borderTop: "1px dashed var(--border2)" }} />

              <div className="flex justify-between items-baseline">
                <span className="text-cyan tracking-widest">OVERALL</span>
                <span className="font-bold text-[14px]" style={{ color: DEMO_GRADE_COLOR }}>
                  {DEMO_SCORE} → {DEMO_GRADE}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Module Cards ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="font-mono text-[13px] tracking-widest text-t2 mb-4">
            // SCAN MODULES — 11 SYSTEMS ANALYZED
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {MODULES.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="flex items-start gap-3 px-4 py-3 rounded-[2px]"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${SEV_COLOR[mod.sev]}`,
                }}
              >
                {/* Severity dot */}
                <div
                  className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: SEV_COLOR[mod.sev] }}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[13px] tracking-widest mb-0.5" style={{ color: SEV_COLOR[mod.sev] }}>
                    {mod.system.toUpperCase()}
                  </p>
                  <p className="font-display font-bold text-t1 text-base leading-snug mb-1.5">
                    {mod.finding}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {mod.metrics.map((m, j) => (
                      <span key={j} className="font-mono text-[13px] tracking-wide text-t2">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Tune Step (P1 CRITICAL) ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-[2px] overflow-hidden"
          style={{ background: "var(--panel)", border: "1px solid #FF5050" }}
        >
          <div className="h-[2px] w-full" style={{ background: "#FF5050" }} />
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="font-mono text-[13px] tracking-widest px-2 py-0.5 rounded-[2px]"
                style={{ background: "rgba(255,80,80,0.12)", color: "#FF5050", border: "1px solid rgba(255,80,80,0.25)" }}
              >
                P1 · CRITICAL
              </span>
              <span className="font-mono text-[13px] tracking-widest text-t2">VIRTUAL VE</span>
            </div>
            <p className="font-display font-bold text-t1 text-lg leading-snug mb-2">
              Add STFT channels to your log before applying VVE corrections.
            </p>
            <p className="font-mono text-[14px] leading-relaxed text-t1 mb-3">
              20 cells show airmass error. LTFT is logging at +6% on Bank 1 —
              but STFT is required to separate cold-start enrichment from
              steady-state VE error.
            </p>
            <p className="font-mono text-[14px] leading-relaxed" style={{ color: "#FF5050", opacity: 0.85 }}>
              In HPTuners Scanner, add: Short Term Fuel Trim Bank 1, Short Term
              Fuel Trim Bank 2. Re-log and re-upload.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
