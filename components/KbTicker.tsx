"use client";

/**
 * KbTicker — live calibration knowledge base stats banner.
 * Client component: renders immediately with hardcoded stats,
 * then upgrades to live Supabase data on mount.
 * Never returns null — always visible regardless of fetch outcome.
 * @keyframes kb-ticker defined in globals.css
 */

import { useEffect, useState } from "react";

const MONO = "'Share Tech Mono', monospace";
const REPEAT = 16; // 8 × 2 for the seamless -50% loop

type Stats = { total: number; cats: number; families: number };

// First-paint fallback used only until the Supabase fetch completes.
// Values refreshed 2026-04-19 to match live DB state; bump these
// periodically so a fetch-failure pass doesn't look stale.
const HARDCODED: Stats = { total: 430, cats: 35, families: 14 };

function TickerContent({ stats }: { stats: Stats }) {
  const prefix =
    `// CALIBRATION KNOWLEDGE BASE · ${stats.total} ENTRIES · ` +
    `${stats.cats} CATEGORIES · ${stats.families} ENGINE FAMILIES · `;

  return (
    <>
      {Array.from({ length: REPEAT }, (_, i) => (
        <span key={i}>
          {prefix}
          <span style={{ color: "#FFD700" }}>UPDATED LIVE</span>
          {" · "}
        </span>
      ))}
    </>
  );
}

export default function KbTicker() {
  const [stats, setStats] = useState<Stats>(HARDCODED);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    fetch(`${url}/rest/v1/calibration_knowledge?select=category,engine_family`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const total    = rows.length;
        const cats     = new Set(rows.map((r: any) => r.category)).size;
        const families = new Set(rows.map((r: any) => r.engine_family).filter(Boolean)).size;
        setStats({ total, cats, families });
      })
      .catch(() => {/* keep hardcoded */});
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: "#080a0e",
        overflow: "hidden",
        height: 28,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(0,220,255,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
      }}
    >
      {/* Left fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0, width: 48,
          background: "linear-gradient(to right, #080a0e, transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Right fade */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0, top: 0, bottom: 0, width: 48,
          background: "linear-gradient(to left, #080a0e, transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: "kb-ticker 90s linear infinite",
          willChange: "transform",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "rgba(0,220,255,0.65)",
          }}
        >
          <TickerContent stats={stats} />
        </span>
      </div>
    </div>
  );
}
