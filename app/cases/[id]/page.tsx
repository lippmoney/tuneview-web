import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = "info" | "low" | "medium" | "high" | "critical";
type UICardState = "actionable" | "positive" | "neutral" | "warning" | "error";

interface RevisionStep {
  system: string;
  priority: number;
  action: string;
  detail?: string;
}

interface Finding {
  severity: Severity;
  title: string;
  detail: string;
}

interface ModuleResult {
  module: string;
  supported: boolean;
  confidence: number;
  status: string;
  headline: string;
  summary?: string;
  severity: Severity;
  actionable: boolean;
  primary_candidate: boolean;
  metrics?: Record<string, unknown>;
  findings?: Finding[];
}

interface UICard {
  card_type: string;
  title: string;
  state: UICardState;
  body?: string;
  badge?: string;
}

interface PrimaryIssue {
  system: string;
  headline: string;
  summary: string;
  severity: Severity;
  confidence: number;
  actionable: boolean;
}

interface ReportJson {
  overall_confidence?: number;
  primary_issue?: PrimaryIssue;
  module_results?: ModuleResult[];
  revision_steps?: RevisionStep[];
  ui_cards?: UICard[];
  wot_pull_detection?: { status: string };
}

interface CaseRow {
  case_id: string;
  vehicle_profile: Record<string, string> | null;
  overall_confidence: number | null;
  safety_status: string | null;
  pull_detected: boolean | null;
  report_json: string | null;
}

// ---------------------------------------------------------------------------
// Design helpers
// ---------------------------------------------------------------------------

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#FF5050",
  high: "#FFB400",
  medium: "#FFB400",
  low: "#00DCB4",
  info: "#00DCFF",
};

const CARD_STATE_COLOR: Record<string, string> = {
  actionable: "#FF5050",
  positive: "#00DCB4",
  neutral: "#3A5068",
  warning: "#FFB400",
  error: "#FF5050",
};

const PRIORITY: Record<number, { label: string; color: string }> = {
  1: { label: "P1", color: "#FF5050" },
  2: { label: "P2", color: "#FFB400" },
  3: { label: "P3", color: "#00DCFF" },
};

function pct(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${Math.round(v * 100)}%`;
}

function sevColor(s: string): string {
  return SEVERITY_COLOR[s] ?? "#00DCFF";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: rows, error } = await supabase
    .from("cases")
    .select("case_id, vehicle_profile, overall_confidence, safety_status, pull_detected, report_json")
    .eq("case_id", id)
    .order("created_at", { ascending: false })
    .limit(1);

  const data = rows?.[0] ?? null;
  if (!data) notFound();

  const row = data as CaseRow;
  const report: ReportJson = JSON.parse(row.report_json || "{}");

  const profile = row.vehicle_profile ?? {};
  const vehicleName = [profile.year, profile.make, profile.model]
    .filter(Boolean)
    .join(" ");
  const engineFamily = profile.engine_family ?? "";

  const confidence = row.overall_confidence ?? report.overall_confidence;
  const safetySeverity = row.safety_status ?? report.primary_issue?.severity ?? "info";

  const wotStatus = report.wot_pull_detection?.status;
  const modules = report.module_results ?? [];
  const steps = [...(report.revision_steps ?? [])].sort(
    (a, b) => a.priority - b.priority
  );
  const cards = report.ui_cards ?? [];

  return (
    <div className="min-h-screen px-5 md:px-10 py-16">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <header className="space-y-4">
          <p className="font-mono text-[11px] tracking-widest text-cyan">
            // CASE {row.case_id}
          </p>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-t1 text-3xl md:text-4xl leading-tight">
                {vehicleName || "Scan Report"}
              </h1>
              {engineFamily && (
                <p className="font-mono text-[12px] tracking-widest text-t3 mt-1">
                  {engineFamily}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Confidence badge */}
              <div
                className="rounded-[2px] px-3 py-2"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="font-mono text-[10px] tracking-widest text-t3">
                  CONFIDENCE
                </p>
                <p className="font-mono text-sm text-cyan leading-tight">
                  {pct(confidence)}
                </p>
              </div>

              {/* Safety badge */}
              <div
                className="rounded-[2px] px-3 py-2"
                style={{
                  background: "var(--panel)",
                  border: `1px solid ${sevColor(safetySeverity)}`,
                }}
              >
                <p className="font-mono text-[10px] tracking-widest text-t3">
                  SAFETY
                </p>
                <p
                  className="font-mono text-sm leading-tight uppercase"
                  style={{ color: sevColor(safetySeverity) }}
                >
                  {safetySeverity}
                </p>
              </div>
            </div>
          </div>

          {/* Primary issue */}
          {report.primary_issue && (
            <div
              className="rounded-[2px] p-4"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderLeft: `2px solid ${sevColor(report.primary_issue.severity)}`,
              }}
            >
              <p className="font-mono text-[10px] tracking-widest text-t3 mb-1">
                PRIMARY ISSUE
              </p>
              <p className="font-display font-bold text-t1 text-lg leading-snug">
                {report.primary_issue.headline}
              </p>
              <p className="font-mono text-[12px] leading-relaxed text-t2 mt-1">
                {report.primary_issue.summary}
              </p>
            </div>
          )}
        </header>

        {/* ── WOT PULL WARNING ───────────────────────────────────── */}
        {wotStatus && wotStatus !== "Good" && (
          <div
            className="rounded-[2px] p-3 flex items-start gap-3"
            style={{
              background: "rgba(255,180,0,0.05)",
              border: "1px solid rgba(255,180,0,0.22)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0"
              style={{ background: "#FFB400", boxShadow: "0 0 6px #FFB400" }}
            />
            <p className="font-mono text-[12px] leading-relaxed text-t2">
              <span className="text-t3 mr-1">WOT PULL:</span>
              {wotStatus === "Partial"
                ? "Partial WOT detected — VE/VT revision steps are directional. Confirm with a full wide-open-throttle pull before committing changes."
                : "No WOT pull detected in this log — VE/VT steps are directional only."}
            </p>
          </div>
        )}

        {/* ── SCAN MODULES ───────────────────────────────────────── */}
        {modules.length > 0 && (
          <section>
            <p className="font-mono text-[11px] tracking-widest text-t3 mb-4">
              // SCAN MODULES
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.map((mod) => {
                const color = sevColor(mod.severity);
                return (
                  <div
                    key={mod.module}
                    className="rounded-[2px] p-4"
                    style={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderLeft: `2px solid ${color}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] tracking-widest text-t3 uppercase">
                        {mod.module.replace(/_/g, " ")}
                      </span>
                      <span
                        className="font-mono text-[10px] tracking-widest uppercase"
                        style={{ color }}
                      >
                        {mod.severity}
                      </span>
                    </div>
                    <p className="font-display font-bold text-t1 text-sm leading-snug">
                      {mod.headline}
                    </p>
                    {mod.summary && (
                      <p className="font-mono text-[11px] leading-relaxed text-t2 mt-1.5">
                        {mod.summary}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4">
                      <span className="font-mono text-[10px] text-t3">
                        CONF {pct(mod.confidence)}
                      </span>
                      {mod.primary_candidate && (
                        <span className="font-mono text-[10px] text-amber-400">
                          PRIMARY
                        </span>
                      )}
                      {mod.actionable && !mod.primary_candidate && (
                        <span className="font-mono text-[10px] text-cyan">
                          ACTIONABLE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── REVISION STEPS ─────────────────────────────────────── */}
        {steps.length > 0 && (
          <section>
            <p className="font-mono text-[11px] tracking-widest text-t3 mb-4">
              // TUNE STEPS
            </p>
            <div className="space-y-3">
              {steps.map((step, i) => {
                const badge = PRIORITY[step.priority] ?? {
                  label: `P${step.priority}`,
                  color: "#00DCFF",
                };
                return (
                  <div
                    key={i}
                    className="rounded-[2px] p-4"
                    style={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="font-mono text-[11px] tracking-widest px-2 py-0.5 rounded-[2px]"
                        style={{
                          color: badge.color,
                          border: `1px solid ${badge.color}`,
                          background: `${badge.color}18`,
                        }}
                      >
                        {badge.label}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-t3 uppercase">
                        {step.system.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="font-display font-bold text-t1 text-base leading-snug">
                      {step.action}
                    </p>
                    {step.detail && (
                      <p className="font-mono text-[12px] leading-relaxed text-t2 mt-1.5">
                        {step.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── REPORT CARDS ───────────────────────────────────────── */}
        {cards.length > 0 && (
          <section>
            <p className="font-mono text-[11px] tracking-widest text-t3 mb-4">
              // REPORT CARDS
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cards.map((card, i) => {
                const color = CARD_STATE_COLOR[card.state] ?? "#00DCFF";
                return (
                  <div
                    key={i}
                    className="rounded-[2px] p-4"
                    style={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] tracking-widest text-t3 uppercase">
                        {card.card_type.replace(/_/g, " ")}
                      </span>
                      {card.badge && (
                        <span
                          className="font-mono text-[10px] tracking-widest"
                          style={{ color }}
                        >
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-display font-bold text-t1 text-sm leading-snug">
                      {card.title}
                    </p>
                    {card.body && (
                      <p className="font-mono text-[12px] leading-relaxed text-t2 mt-1.5">
                        {card.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── BACK LINK ──────────────────────────────────────────── */}
        <div
          className="pt-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/"
            className="font-mono text-[12px] tracking-widest text-t3 hover:text-cyan transition-colors"
          >
            ← tuneview.io
          </Link>
        </div>
      </div>
    </div>
  );
}
