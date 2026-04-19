import type { Metadata } from "next";
import { CHANGELOG, type ChangelogItem, type ChangelogTag } from "./data";

export const metadata: Metadata = {
  title: "TuneView — Changelog",
  description: "What shipped, what broke, what got fixed.",
};

const TAG_STYLE: Record<ChangelogTag, { fg: string; bg: string; border: string }> = {
  Security:       { fg: "#ffb08a", bg: "rgba(255,123,53,0.10)",  border: "rgba(255,123,53,0.35)" },
  Infrastructure: { fg: "#b8c8d4", bg: "rgba(106,128,152,0.10)", border: "rgba(106,128,152,0.35)" },
  Product:        { fg: "#80e8ff", bg: "rgba(0,220,255,0.08)",   border: "rgba(0,220,255,0.30)" },
  AI:             { fg: "#c9b8ff", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.35)" },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

function TagPill({ tag }: { tag: ChangelogTag }) {
  const s = TAG_STYLE[tag];
  return (
    <span
      className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-[2px]"
      style={{ color: s.fg, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {tag}
    </span>
  );
}

function ItemCard({ item, dim }: { item: ChangelogItem; dim?: boolean }) {
  return (
    <div
      className="rounded-[3px] mb-2.5 px-5 py-4"
      style={{
        border: dim
          ? "1px solid rgba(200,240,255,0.05)"
          : "1px solid rgba(0,220,255,0.12)",
        background: dim ? "rgba(200,240,255,0.012)" : "rgba(0,220,255,0.02)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
        <h3
          className="font-display font-semibold text-[17px] leading-snug m-0"
          style={{ color: dim ? "rgba(216,244,255,0.72)" : "var(--t1)" }}
        >
          {item.title}
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {item.tags.map((t) => <TagPill key={t} tag={t} />)}
        </div>
      </div>
      <p
        className="font-display text-[14px] leading-[1.65] m-0"
        style={{ color: dim ? "rgba(200,240,255,0.42)" : "rgba(200,240,255,0.60)" }}
      >
        {item.description}
      </p>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3.5 mt-1">
      <span
        className="font-mono text-[9px] tracking-widest uppercase whitespace-nowrap"
        style={{ color: "rgba(0,220,255,0.35)" }}
      >
        {label}
      </span>
      <span
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg,rgba(0,220,255,0.18),transparent)" }}
      />
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen pt-[80px] px-5 md:px-10">
      <div className="max-w-2xl mx-auto py-20">
        <p className="font-mono text-[9px] tracking-widest text-cyan mb-5">
          // Release Log
        </p>
        <h1 className="font-display font-bold text-t1 text-3xl md:text-5xl mb-5 leading-tight uppercase tracking-wider">
          Changelog
        </h1>
        <p className="font-display text-[15px] text-t2 mb-14 leading-relaxed max-w-[640px]">
          What shipped, what broke, what got fixed. Written for the person
          looking at their log, not the press release.
        </p>

        {CHANGELOG.map((entry, idx) => (
          <article
            key={entry.version}
            className={idx === CHANGELOG.length - 1 ? "" : "mb-14 pb-14"}
            style={
              idx === CHANGELOG.length - 1
                ? {}
                : { borderBottom: "1px solid rgba(0,220,255,0.06)" }
            }
          >
            <header className="mb-6">
              <div className="flex items-baseline gap-3.5 flex-wrap mb-2.5">
                <span className="font-display font-bold text-t1 text-3xl tracking-wider">
                  v{entry.version}
                </span>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "rgba(0,220,255,0.4)" }}
                >
                  {formatDate(entry.date)}
                </span>
              </div>
              {entry.summary && (
                <p
                  className="font-display text-[16px] leading-relaxed m-0"
                  style={{ color: "rgba(200,240,255,0.7)" }}
                >
                  {entry.summary}
                </p>
              )}
            </header>

            {entry.userFacing.length > 0 && (
              <section
                className={entry.behindTheScenes.length > 0 ? "mb-7" : ""}
              >
                <SectionLabel label="What you'll notice" />
                {entry.userFacing.map((item) => (
                  <ItemCard key={item.title} item={item} />
                ))}
              </section>
            )}

            {entry.behindTheScenes.length > 0 && (
              <section>
                <SectionLabel label="Behind the scenes" />
                {entry.behindTheScenes.map((item) => (
                  <ItemCard key={item.title} item={item} dim />
                ))}
              </section>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
