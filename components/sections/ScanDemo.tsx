"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ─── CASE_001 hardcoded data ──────────────────────────────────────────────────

const CATEGORY_SCORES: Record<string, number | null> = {
  knock:        93,   // A
  airflow:      74,   // C
  torque:       74,   // C
  transmission: 84,   // B
  coverage:     64,   // D
  fuel:         null, // — not logged
};

const GRADE_TILES = [
  { id: "knock",        label: "Knock & Spark",  grade: "A",  color: "#00DCB4" },
  { id: "airflow",      label: "Airflow / MAF",  grade: "C",  color: "#FFB400" },
  { id: "torque",       label: "Torque Model",   grade: "C",  color: "#FFB400" },
  { id: "transmission", label: "Transmission",   grade: "B",  color: "#00DCFF" },
  { id: "coverage",     label: "Log Coverage",   grade: "D",  color: "#FF5050" },
  { id: "fuel",         label: "Fuel System",    grade: "—",  color: "#3A5068", italic: true },
];

const GRADE_DETAILS: Record<string, { score: number | null; metrics: string[]; improve: string }> = {
  knock: {
    score: 93,
    metrics: [
      "0 knock retard events detected",
      "Spark timing range: −9° to 59° (spread 68°)",
      "High spark variability flagged — normal for cammed flex",
      "All commanded knock channels reviewed",
    ],
    improve: "Log a WOT pull to 5,500+ RPM for spark authority data.",
  },
  airflow: {
    score: 74,
    metrics: [
      "MAF spread: 36 g/s (need 1,400+ for full analysis)",
      "Usable samples: 4,944",
      "Throttle-MAF correlation: −0.07 (WEAK — major penalty)",
      "No WOT pull detected — full analysis gated",
    ],
    improve: "Log a 3rd-gear WOT pull to 5,500+ RPM. This unlocks MAF transfer function and Ve analysis.",
  },
  torque: {
    score: 74,
    metrics: [
      "Startup peak RPM: 1,999",
      "Settle time: 7.2 seconds",
      "Warm idle oscillation: SEVERE — 440 RPM swing",
      "VE correction pending fuel trim data",
    ],
    improve: "Add LTFT/STFT channels per P1 step, re-log at warm idle. Idle control tables may need adjustment for cam.",
  },
  transmission: {
    score: 84,
    metrics: [
      "221 gear shifts detected",
      "Gears observed: Park, Reverse, Neutral, 1, 2, 3, 4",
      "NaN gear state flag detected (minor — likely brief transitions)",
      "TCC channels not found — converter data gated",
    ],
    improve: "Add Torque Converter Slip channel to unlock TCC analysis. NaN flags are low priority.",
  },
  coverage: {
    score: 64,
    metrics: [
      "108 total channels logged",
      "12 channels mapped to analysis modules",
      "Missing: LTFT B1/B2, STFT B1/B2, Fuel Pressure, WOT data",
      "Confidence: Moderate — no WOT pull",
    ],
    improve: "Add 6 critical channels per P1 step. A single WOT pull will unlock 4 gated modules.",
  },
  fuel: {
    score: null,
    metrics: [
      "Fuel pressure not logged — system gated",
      "Lambda range observed: 0.55–1.0 (targets appear commanded correctly)",
      "No WOT pull for injector capacity evaluation",
    ],
    improve: "Add Fuel Pressure (Desired) and Fuel Pressure (Actual) channels. Log WOT for capacity eval.",
  },
};

const MODULES = [
  { sev: "warning", system: "Startup & Idle",         finding: "Severe warm idle oscillation detected",         metrics: ["Peak 1,999 RPM", "Settled 7.2s", "440 RPM warm swing"] },
  { sev: "ok",      system: "Knock Safety",            finding: "No retard events — all channels reviewed",       metrics: ["0 knock events", "All channels scanned"] },
  { sev: "info",    system: "High Pressure Fuel",      finding: "Rail present — WOT capacity gated",              metrics: ["Rail max 2,190 psi", "Upload WOT log for eval"] },
  { sev: "warning", system: "Airflow Model",           finding: "Weak throttle-MAF correlation",                  metrics: ["MAF spread 36 g/s", "4,944 usable samples", "Corr. −0.07 (WEAK)"] },
  { sev: "gated",   system: "MAF Transfer Function",   finding: "Gated — no WOT pull detected",                  metrics: ["Requires 3rd-gear WOT pull"] },
  { sev: "ok",      system: "Fueling Targets",         finding: "Lambda targets nominal — no anomalies",          metrics: ["λ 0.55–1.0", "No commanded anomalies"] },
  { sev: "warning", system: "Spark Control",           finding: "High variability in spark timing",               metrics: ["Range −9° to 59°", "Spread 68°", "HIGH variability"] },
  { sev: "warning", system: "Transmission Shifts",     finding: "NaN gear state detected",                        metrics: ["221 shifts", "P/R/N/1/2/3/4 observed", "NaN gear flag"] },
  { sev: "info",    system: "Torque Converter",        finding: "No TCC channels found",                          metrics: ["TCC analysis gated", "Add TCC slip channel"] },
  { sev: "ok",      system: "Sensor Coverage",         finding: "All primary systems present",                    metrics: ["108 total channels", "All systems logged"] },
  { sev: "warning", system: "Log Quality",             finding: "No WOT pull — moderate confidence",              metrics: ["12 mapped channels", "Moderate confidence", "WOT required"] },
];

const SEV_COLOR: Record<string, string> = {
  warning: "#FFB400",
  critical: "#FF5050",
  ok:       "#00DCB4",
  info:     "#00DCFF",
  gated:    "#3A5068",
};

const DEFAULT_WEIGHTS = { knock: 30, idle: 20, airflow: 20, fuel: 15, coverage: 15 };

const PRESETS: Record<string, typeof DEFAULT_WEIGHTS> = {
  Street: { knock: 25, idle: 25, airflow: 20, fuel: 15, coverage: 15 },
  Track:  { knock: 35, idle: 10, airflow: 25, fuel: 20, coverage: 10 },
  Drag:   { knock: 40, idle:  5, airflow: 25, fuel: 20, coverage: 10 },
  Tow:    { knock: 20, idle: 20, airflow: 15, fuel: 20, coverage: 25 },
};

// ─── Score helpers ────────────────────────────────────────────────────────────

function computeOverall(w: typeof DEFAULT_WEIGHTS): number {
  // knock→knock(93), idle→torque(74), airflow→airflow(74), coverage→coverage(64)
  // fuel→null (skip), transmission fixed weight 10 (84)
  const pairs = [
    { weight: w.knock,    score: CATEGORY_SCORES.knock },
    { weight: w.idle,     score: CATEGORY_SCORES.torque },
    { weight: w.airflow,  score: CATEGORY_SCORES.airflow },
    { weight: w.coverage, score: CATEGORY_SCORES.coverage },
    { weight: 10,         score: CATEGORY_SCORES.transmission }, // always included
    // fuel is null — excluded from calc
  ].filter(p => p.score != null) as { weight: number; score: number }[];

  const totalW = pairs.reduce((a, p) => a + p.weight, 0);
  const sum    = pairs.reduce((a, p) => a + p.weight * p.score, 0);
  return totalW > 0 ? Math.round(sum / totalW) : 0;
}

function scoreToGrade(s: number): string {
  if (s >= 97) return "A+";
  if (s >= 93) return "A";
  if (s >= 90) return "A-";
  if (s >= 87) return "B+";
  if (s >= 83) return "B";
  if (s >= 80) return "B-";
  if (s >= 77) return "C+";
  if (s >= 73) return "C";
  if (s >= 70) return "C-";
  if (s >= 67) return "D+";
  if (s >= 63) return "D";
  if (s >= 60) return "D-";
  return "F";
}

function gradeColor(g: string): string {
  if (g.startsWith("A")) return "#00DCB4";
  if (g.startsWith("B")) return "#00DCFF";
  if (g.startsWith("C")) return "#FFB400";
  if (g.startsWith("D")) return "#FF5050";
  return "#FF5050";
}

// ─── Panel types ──────────────────────────────────────────────────────────────

type ActivePanel = { type: "weight" } | { type: "detail"; categoryId: string } | null;

// ─── Component ───────────────────────────────────────────────────────────────

export default function ScanDemo() {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [panel, setPanel]     = useState<ActivePanel>(null);

  const overallScore = computeOverall(weights);
  const overallGrade = scoreToGrade(overallScore);
  const overallColor = gradeColor(overallGrade);

  function setWeight(key: keyof typeof DEFAULT_WEIGHTS, val: number) {
    setWeights(prev => ({ ...prev, [key]: val }));
  }

  function applyPreset(name: string) {
    setWeights(PRESETS[name]);
  }

  const detailId = panel?.type === "detail" ? panel.categoryId : null;
  const detail   = detailId ? GRADE_DETAILS[detailId] : null;
  const detailTile = detailId ? GRADE_TILES.find(t => t.id === detailId) : null;

  return (
    <section className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">

        {/* Section label */}
        <p className="font-mono text-[9px] tracking-widest text-cyan mb-4">
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

        {/* ── A. Report Card ─────────────────────────────────────────────── */}
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
            <span className="font-mono text-[8px] tracking-widest text-t3">
              CASE_001 · PRO TIER · 2026-04-14
            </span>
          </div>

          {/* Overall grade hero */}
          <div
            className="flex items-center gap-6 px-5 py-5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="font-display font-bold text-5xl transition-colors duration-300"
              style={{ color: overallColor }}
            >
              {overallGrade}
            </span>
            <div className="flex-1">
              <p className="font-mono text-[8px] tracking-widest text-t3 mb-2">
                WEIGHTED SCORE / {overallScore} / 100
              </p>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border2)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${overallScore}%`,
                    background: `linear-gradient(90deg, #00DCB4, ${overallColor})`,
                  }}
                />
              </div>
              <p className="font-mono text-[7px] tracking-widest text-t3 mt-1">
                {overallScore}% · Click a grade tile for details · Adjust weights →
              </p>
            </div>
          </div>

          {/* Grade tiles grid — 2 cols */}
          <div className="grid grid-cols-2 gap-px" style={{ background: "var(--border)" }}>
            {GRADE_TILES.map((tile) => (
              <button
                key={tile.id}
                onClick={() =>
                  setPanel(panel?.type === "detail" && detailId === tile.id
                    ? null
                    : { type: "detail", categoryId: tile.id })
                }
                className="flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer"
                style={{
                  background: panel?.type === "detail" && detailId === tile.id
                    ? "rgba(0,220,255,0.04)"
                    : "var(--panel)",
                  borderBottom: "none",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!(panel?.type === "detail" && detailId === tile.id))
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                }}
                onMouseLeave={(e) => {
                  if (!(panel?.type === "detail" && detailId === tile.id))
                    (e.currentTarget as HTMLElement).style.background = "var(--panel)";
                }}
              >
                <span
                  className="font-display font-bold text-2xl w-7 flex-shrink-0"
                  style={{ color: tile.color }}
                >
                  {tile.grade}
                </span>
                <div>
                  <p className="font-display font-bold text-t1 text-sm leading-none mb-0.5">
                    {tile.label}
                  </p>
                  <p
                    className={`font-mono text-[8px] tracking-widest ${tile.italic ? "italic" : ""}`}
                    style={{ color: tile.color }}
                  >
                    tap for details →
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── B. Module Cards ────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="font-mono text-[8px] tracking-widest text-t3 mb-4">
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
                  <p className="font-mono text-[8px] tracking-widest mb-0.5" style={{ color: SEV_COLOR[mod.sev] }}>
                    {mod.system.toUpperCase()}
                  </p>
                  <p className="font-display font-bold text-t1 text-sm leading-snug mb-1.5">
                    {mod.finding}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {mod.metrics.map((m, j) => (
                      <span key={j} className="font-mono text-[8px] tracking-wide text-t3">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── C. Tune Step ───────────────────────────────────────────────── */}
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
                className="font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-[2px]"
                style={{ background: "rgba(255,80,80,0.12)", color: "#FF5050", border: "1px solid rgba(255,80,80,0.25)" }}
              >
                P1 · CRITICAL
              </span>
              <span className="font-mono text-[9px] tracking-widest text-t3">VIRTUAL VE</span>
            </div>
            <p className="font-display font-bold text-t1 text-base leading-snug mb-2">
              Add LTFT and STFT channels to your log before making VVE corrections.
            </p>
            <p className="font-mono text-[9px] leading-relaxed text-t2 mb-3">
              20 cells show airmass error but fuel trim data is required to compute accurate correction values.
            </p>
            <p className="font-mono text-[9px] leading-relaxed" style={{ color: "#FF5050", opacity: 0.7 }}>
              In HPTuners Scanner, add: Long Term Fuel Trim Bank 1, Long Term Fuel Trim Bank 2,
              Short Term Fuel Trim Bank 1, Short Term Fuel Trim Bank 2. Re-log and re-upload.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Floating weight button ──────────────────────────────────────── */}
      <button
        onClick={() => setPanel(panel?.type === "weight" ? null : { type: "weight" })}
        className="fixed bottom-8 right-8 z-40 font-mono text-[9px] tracking-widest px-4 py-2.5 rounded-[2px] transition-colors"
        style={{
          background: panel?.type === "weight" ? "rgba(0,220,255,0.15)" : "rgba(0,220,255,0.06)",
          border: "1px solid rgba(0,220,255,0.3)",
          color: "rgba(0,220,255,0.8)",
        }}
      >
        // WEIGHT MY SCORES →
      </button>

      {/* ── Panel backdrop ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {panel && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(6,8,16,0.6)" }}
            onClick={() => setPanel(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Weight panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {panel?.type === "weight" && (
          <motion.div
            key="weight-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 z-50 overflow-y-auto"
            style={{
              width: "clamp(280px, 35vw, 460px)",
              background: "#0D1520",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <div className="px-6 py-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-[9px] tracking-widest text-cyan">// TUNE WEIGHT PROFILE</p>
                <button
                  onClick={() => setPanel(null)}
                  className="font-mono text-[8px] tracking-widest text-t3 hover:text-t1 transition-colors"
                >
                  // CLOSE ×
                </button>
              </div>
              <p className="font-mono text-[8px] leading-relaxed text-t3 mb-6">
                Adjust scoring weights to match how you use your vehicle
              </p>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(PRESETS).map((name) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className="font-mono text-[8px] tracking-widest px-3 py-1.5 rounded-[2px] transition-colors"
                    style={{
                      background: "rgba(0,220,255,0.04)",
                      border: "1px solid rgba(0,220,255,0.15)",
                      color: "rgba(0,220,255,0.6)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,220,255,0.4)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(0,220,255,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,220,255,0.15)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(0,220,255,0.6)";
                    }}
                  >
                    {name.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              {(
                [
                  { key: "knock",    label: "Knock & Spark Safety" },
                  { key: "idle",     label: "Idle & Startup Quality" },
                  { key: "airflow",  label: "Airflow / MAF Accuracy" },
                  { key: "fuel",     label: "Fuel System Health" },
                  { key: "coverage", label: "Log Coverage Quality" },
                ] as { key: keyof typeof DEFAULT_WEIGHTS; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[8px] tracking-widest text-t2">{label}</span>
                    <span
                      className="font-mono text-[10px] tracking-widest"
                      style={{ color: "rgba(0,220,255,0.7)" }}
                    >
                      {weights[key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={weights[key]}
                    onChange={(e) => setWeight(key, Number(e.target.value))}
                    className="w-full h-0.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(0,220,255,0.6) ${weights[key]}%, rgba(255,255,255,0.08) ${weights[key]}%)`,
                      outline: "none",
                    }}
                  />
                </div>
              ))}

              {/* Live overall preview */}
              <div
                className="mt-6 p-4 rounded-[2px]"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}
              >
                <p className="font-mono text-[7px] tracking-widest text-t3 mb-2">WEIGHTED OVERALL</p>
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-display font-bold text-4xl transition-colors duration-300"
                    style={{ color: overallColor }}
                  >
                    {overallGrade}
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: overallColor, opacity: 0.6 }}>
                    {overallScore}/100
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grade detail panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {panel?.type === "detail" && detail && detailTile && (
          <motion.div
            key="detail-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 z-50 overflow-y-auto"
            style={{
              width: "clamp(280px, 35vw, 460px)",
              background: "#0D1520",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <div className="px-6 py-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[9px] tracking-widest text-cyan">// CATEGORY DETAIL</p>
                <button
                  onClick={() => setPanel(null)}
                  className="font-mono text-[8px] tracking-widest text-t3 hover:text-t1 transition-colors"
                >
                  // CLOSE ×
                </button>
              </div>

              {/* Grade hero */}
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="font-display font-bold text-5xl"
                  style={{ color: detailTile.color }}
                >
                  {detailTile.grade}
                </span>
                <div>
                  <p className="font-display font-bold text-t1 text-lg leading-none mb-1">
                    {detailTile.label}
                  </p>
                  {detail.score != null && (
                    <p className="font-mono text-[9px] tracking-widest" style={{ color: detailTile.color, opacity: 0.7 }}>
                      Score: {detail.score} / 100
                    </p>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <p className="font-mono text-[8px] tracking-widest text-t3 mb-3">FINDINGS</p>
                <div className="flex flex-col gap-2">
                  {detail.metrics.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: detailTile.color, opacity: 0.6 }} />
                      <p className="font-mono text-[9px] leading-relaxed text-t2">{m}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to improve */}
              <div
                className="p-4 rounded-[2px]"
                style={{ background: "rgba(0,220,255,0.03)", border: "1px solid rgba(0,220,255,0.1)" }}
              >
                <p className="font-mono text-[8px] tracking-widest text-cyan mb-2">TO IMPROVE</p>
                <p className="font-mono text-[9px] leading-relaxed text-t2">
                  {detail.improve}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
