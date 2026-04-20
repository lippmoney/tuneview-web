"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 400) {
          setErrMsg(data.error || "Already on the list.");
        } else {
          setErrMsg("Something went wrong. Try again.");
        }
        setStatus("error");
      }
    } catch {
      setErrMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  return (
    <section
      id="early-access"
      className="relative z-10 px-5 md:px-10 py-24 flex justify-center"
    >
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(0,220,255,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-xl w-full text-center">
        <p className="font-mono text-[11px] tracking-widest text-cyan mb-4">
          // Early Access · Limited Spots
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display font-bold text-t1 text-3xl md:text-4xl mb-3"
        >
          Be first in line.
        </motion.h2>
        <p className="font-mono text-[12px] leading-relaxed text-t2 mb-8 max-w-md mx-auto">
          TuneView is in early access. Enter your email and we&apos;ll notify
          you when your tier opens.
        </p>

        {status === "done" ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[13px] tracking-widest text-cyan py-4"
          >
            // you&apos;re on the list ✓
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 font-mono text-[13px] px-4 py-3 rounded-[2px] text-t1 placeholder:text-t3 outline-none transition-colors"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border2)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(0,220,255,0.4)")
              }
              onBlur={(e) => (e.target.style.borderColor = "var(--border2)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="font-mono text-[11px] tracking-widest text-bg bg-cyan hover:bg-cyan/90 disabled:opacity-50 px-6 py-3 rounded-[2px] transition-colors flex-shrink-0"
            >
              {status === "loading" ? "..." : "NOTIFY ME"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="font-mono text-[11px] tracking-widest text-red-400 mt-2">
            {errMsg}
          </p>
        )}

        <p className="font-mono text-[10px] tracking-widest text-t3 mt-5">
          No spam. No credit card. Just a heads up when you&apos;re in.
        </p>
      </div>
    </section>
  );
}
