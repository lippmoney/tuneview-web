/**
 * KbTicker — live calibration knowledge base stats banner.
 * Server component: fetches Supabase on every request (revalidated hourly).
 * No auth required — uses public anon key.
 */

const MONO = "'Share Tech Mono', monospace";

interface KbStats {
  total: number;
  categories: number;
  engine_families: number;
}

async function fetchKbStats(): Promise<KbStats | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    const res = await fetch(
      `${url}/rest/v1/calibration_knowledge?select=category,engine_family`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const rows: { category: string; engine_family: string }[] = await res.json();

    return {
      total: rows.length,
      categories: new Set(rows.map((r) => r.category)).size,
      engine_families: new Set(rows.map((r) => r.engine_family).filter(Boolean)).size,
    };
  } catch {
    return null;
  }
}

export default async function KbTicker() {
  const stats = await fetchKbStats();
  if (!stats) return null;

  const segment =
    `// CALIBRATION KNOWLEDGE BASE · ${stats.total} ENTRIES · ` +
    `${stats.categories} CATEGORIES · ${stats.engine_families} ENGINE FAMILIES · UPDATED LIVE · `;

  // Repeat enough times so one "half" is wider than any viewport
  const half = Array(8).fill(segment).join("");

  return (
    <>
      <style>{`
        @keyframes kb-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          background: "#080a0e",
          overflow: "hidden",
          height: 28,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,220,255,0.07)",
          position: "relative",
          zIndex: 50,
        }}
      >
        {/* Left fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 48,
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
            right: 0,
            top: 0,
            bottom: 0,
            width: 48,
            background: "linear-gradient(to left, #080a0e, transparent)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <div
          aria-label={`Calibration knowledge base: ${stats.total} entries across ${stats.categories} categories`}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "kb-ticker 60s linear infinite",
            willChange: "transform",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "rgba(0,220,255,0.4)",
            }}
          >
            {half}
            {half}
          </span>
        </div>
      </div>
    </>
  );
}
