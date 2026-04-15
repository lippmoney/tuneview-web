export const metadata = {
  title: "TuneView — How TuneView Protects Your IP",
  description:
    "AES-256-GCM encryption, row-level security, anonymous aggregation, audit logs, and full data portability.",
};

const sections = [
  {
    num: "01",
    title: "File Encryption",
    body: "AES-256-GCM. Per-user storage paths. We cannot read them.",
  },
  {
    num: "02",
    title: "Data Isolation",
    body: "Row Level Security. Not by policy. By architecture.",
  },
  {
    num: "03",
    title: "Anonymous Aggregation",
    body: null,
    code: `SELECT parameter_name, outcome, COUNT(*)
FROM tune_revisions
WHERE outcome IS NOT NULL
GROUP BY parameter_name, outcome;`,
    codeNote:
      "user_id and shop_profile_id are not in this query. By design.",
  },
  {
    num: "04",
    title: "Audit Log",
    body: "Every access to your data is logged. You can see it.",
  },
  {
    num: "05",
    title: "Data Portability",
    body: "Export everything. Delete everything. One click.",
  },
];

export default function TrustPage() {
  return (
    <div className="min-h-screen pt-[52px] px-5 md:px-10">
      <div className="max-w-2xl mx-auto py-24">
        <p className="font-mono text-[9px] tracking-widest text-cyan mb-6">
          // How TuneView Protects Your IP
        </p>
        <h1 className="font-display font-bold text-t1 text-3xl md:text-4xl mb-16 leading-tight">
          Your data is yours.
          <br />
          We built the architecture to prove it.
        </h1>

        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <div
              key={s.num}
              className="flex gap-6"
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem" }}
            >
              <span className="font-mono text-[9px] tracking-widest text-t3 flex-shrink-0 mt-0.5">
                {s.num}
              </span>
              <div className="flex-1">
                <h2 className="font-display font-bold text-t1 text-xl mb-3">
                  {s.title}
                </h2>
                {s.body && (
                  <p className="font-mono text-[11px] leading-relaxed text-t2">
                    {s.body}
                  </p>
                )}
                {s.code && (
                  <>
                    <pre
                      className="font-mono text-[10px] leading-relaxed p-4 rounded-[2px] overflow-x-auto mb-3"
                      style={{
                        background: "var(--panel)",
                        border: "1px solid var(--border2)",
                        color: "var(--cyan)",
                      }}
                    >
                      {s.code}
                    </pre>
                    <p className="font-mono text-[10px] leading-relaxed text-t3 italic">
                      {s.codeNote}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="font-mono text-[9px] tracking-widest text-t3 mt-12">
          Questions?{" "}
          <a
            href="mailto:ryan@tuneview.io"
            className="text-cyan hover:text-cyan/80"
          >
            ryan@tuneview.io
          </a>
        </p>
      </div>
    </div>
  );
}
