"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const steps = [
  {
    num: "01",
    label: "// EXPORT",
    title: "Export your log from HPTuners Scanner",
    img: "/screenshots/step1_vcm_scanner.png",
    caption: "A normal drive plus one WOT pull to 5,500+ RPM in 3rd gear unlocks the fullest analysis. Idle-only and startup logs work too — just with narrower coverage. Core channels: RPM, MAF, LTFT, knock, spark, fuel pressure.",
  },
  {
    num: "02",
    label: "// UPLOAD",
    title: "Drop it in. Tell us about your build.",
    img: "/screenshots/step2_upload_form.png",
    caption: "Displacement, cam, injectors, forced induction, fuel type. The analyzer tunes its expectations to your specific combo — no generic guesses.",
  },
  {
    num: "03",
    label: "// RESULTS",
    title: "Priority-ranked revision steps in 60 seconds",
    img: "/screenshots/step3_scan_results.png",
    caption: "P1–P4 revision steps naming the exact HPTuners tables and cells to adjust, with suggested values where the data supports them. Plus 19 module findings — knock safety, airflow model, fuel pressure tracking, torque model, startup behavior, trans shifts, and more.",
  },
];

const TRUST_CHIPS = [
  "Read-only — we never touch your ECU, tune file, or flash",
  "Free for your first upload · 30-day report retention",
  "Gen 5 LT · LS · 6L80E  (more engines coming)",
];

export default function HowItWorks() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const activeStep = active !== null ? steps[active] : null;

  return (
    <section id="how-it-works" className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-cyan mb-4">
              // How It Works
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display font-bold text-t1 text-3xl md:text-4xl"
            >
              Three steps. 60 seconds.
            </motion.h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1.5">
            {TRUST_CHIPS.map((m) => (
              <span key={m} className="font-mono text-[11px] tracking-wide text-t2">
                <span className="text-cyan">✓</span> {m}
              </span>
            ))}
          </div>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(i)}
              className="rounded-[2px] overflow-hidden cursor-pointer"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,220,255,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              {/* Step number bar */}
              <div
                className="flex items-center gap-2 px-4 pt-4 pb-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <span className="font-mono text-[11px] tracking-widest text-t3">STEP</span>
                <span className="font-mono text-xs tracking-widest text-cyan">{step.num}</span>
                <span className="font-mono text-[11px] tracking-widest text-t3 ml-1">{step.label}</span>
              </div>

              {/* Screenshot */}
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                />
              </div>

              {/* Title + caption */}
              <div className="px-4 pt-3 pb-4">
                <h3 className="font-display font-bold text-t1 text-base leading-snug mb-2">
                  {step.title}
                </h3>
                <p className="font-mono text-[11px] leading-relaxed text-t3">
                  {step.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded modal */}
      <AnimatePresence>
        {activeStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-[2px] overflow-hidden w-full max-w-3xl"
              style={{
                background: "var(--panel)",
                border: "1px solid rgba(0,220,255,0.3)",
              }}
            >
              {/* Step number bar */}
              <div
                className="flex items-center justify-between px-5 pt-4 pb-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] tracking-widest text-t3">STEP</span>
                  <span className="font-mono text-xs tracking-widest text-cyan">{activeStep.num}</span>
                  <span className="font-mono text-[11px] tracking-widest text-t3 ml-1">{activeStep.label}</span>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="font-mono text-[11px] tracking-widest text-t3 hover:text-cyan transition-colors"
                >
                  [ ESC ]
                </button>
              </div>

              {/* Screenshot */}
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={activeStep.img}
                  alt={activeStep.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>

              {/* Title + caption */}
              <div className="px-5 pt-3 pb-5">
                <h3 className="font-display font-bold text-t1 text-lg leading-snug mb-2">
                  {activeStep.title}
                </h3>
                <p className="font-mono text-[11px] leading-relaxed text-t3">
                  {activeStep.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
