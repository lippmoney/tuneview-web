"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForShopsClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <div className="min-h-screen pt-[52px] px-5 md:px-10 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center py-24">
        <p className="font-mono text-[9px] tracking-widest text-cyan mb-4">
          // TuneView for Shops
        </p>
        <h1 className="font-display font-bold text-t1 text-4xl md:text-5xl mb-6 leading-tight">
          Give every customer a report card.
        </h1>
        <p className="font-mono text-[11px] leading-relaxed text-t2 mb-4 max-w-lg mx-auto">
          Complete revision tracking. Audit trails. Shop baseline libraries.
          Dyno session hosting. Every revision. Every outcome. Recorded.
        </p>
        <p className="font-mono text-[10px] text-t3 mb-8">
          Full shop page coming soon.
        </p>

        {/* RED tier callout */}
        <div
          className="text-left p-5 rounded-[2px] mb-10 max-w-md mx-auto"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderTop: "2px solid #FF5050",
          }}
        >
          <p className="font-mono text-[8px] tracking-widest text-red-400 mb-2">
            // RED TIER · $299/mo
          </p>
          <ul className="flex flex-col gap-1.5">
            {[
              "Complete revision tracking + audit trail",
              "Shop baseline library",
              "Dyno session hosting",
              "Injectable tips between revisions",
              "Anonymous platform benchmarking",
              "Encrypted file storage",
            ].map((f) => (
              <li
                key={f}
                className="font-mono text-[9px] tracking-wide text-t2 flex gap-2"
              >
                <span className="text-red-400">·</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/#pricing"
            className="inline-block mt-4 font-mono text-[9px] tracking-widest text-red-400 border border-red-400/30 bg-red-400/5 hover:bg-red-400/10 px-4 py-2 rounded-[2px] transition-colors"
          >
            ← See full pricing
          </Link>
        </div>

        {/* Email capture */}
        {status === "done" ? (
          <p className="font-mono text-[11px] tracking-widest text-cyan py-4">
            // you&apos;re on the list ✓
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shop@email.com"
              className="flex-1 font-mono text-[11px] px-4 py-3 rounded-[2px] text-t1 placeholder:text-t3 outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border2)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,220,255,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="font-mono text-[9px] tracking-widest text-bg bg-cyan hover:bg-cyan/90 disabled:opacity-50 px-6 py-3 rounded-[2px] transition-colors"
            >
              {status === "loading" ? "..." : "NOTIFY ME"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="font-mono text-[9px] text-red-400 mt-2">
            Something went wrong or already on the list.
          </p>
        )}
      </div>
    </div>
  );
}
