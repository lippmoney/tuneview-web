export const metadata = {
  title: "TuneView — Privacy Policy",
  description: "How TuneView collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-[52px] px-5 md:px-10">
      <div className="max-w-2xl mx-auto py-24">
        <p className="font-mono text-[9px] tracking-widest text-cyan mb-6">
          // Privacy Policy
        </p>
        <h1 className="font-display font-bold text-t1 text-3xl md:text-4xl mb-4">
          Privacy Policy
        </h1>
        <p className="font-mono text-[9px] tracking-widest text-t3 mb-16">
          Last updated: 2026-04-14 · Placeholder
        </p>

        <div className="flex flex-col gap-10 font-mono text-[11px] leading-relaxed text-t2">
          {[
            {
              title: "What we collect",
              body: "We collect your email address when you sign up for the waitlist or create an account. When you upload a datalog, we process it to generate your report. We do not sell your data.",
            },
            {
              title: "How we use it",
              body: "Your email is used to notify you of account updates and product news. Your datalogs are processed to produce diagnostic reports. Aggregated, anonymized data may be used to improve KB matching accuracy.",
            },
            {
              title: "Data storage",
              body: "Files are stored encrypted (AES-256-GCM) with per-user paths. Row-level security ensures no user can access another user's data. See /trust for architecture details.",
            },
            {
              title: "Third parties",
              body: "We use Supabase for database and storage. We do not share your personally identifiable information with any third party for advertising purposes.",
            },
            {
              title: "Your rights",
              body: "You can request export or deletion of all your data at any time. Contact ryan@tuneview.io to exercise these rights.",
            },
            {
              title: "Contact",
              body: null,
            },
          ].map((s) => (
            <div
              key={s.title}
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}
            >
              <h2 className="font-display font-bold text-t1 text-lg mb-2">
                {s.title}
              </h2>
              {s.body ? (
                <p>{s.body}</p>
              ) : (
                <p>
                  Questions about this policy? Email{" "}
                  <a
                    href="mailto:ryan@tuneview.io"
                    className="text-cyan hover:text-cyan/80"
                  >
                    ryan@tuneview.io
                  </a>
                  .
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
