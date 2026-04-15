"use client";

import { motion } from "framer-motion";
import ScanAnimation from "./ScanAnimation";

const UploadDecor = () => (
  <div className="flex items-end gap-1 mb-4 h-10">
    {[0.4, 0.7, 1.0, 0.6, 0.85].map((h, i) => (
      <div
        key={i}
        className="flex-1 rounded-[1px]"
        style={{
          height: `${h * 40}px`,
          background: `rgba(0,220,255,${0.25 + h * 0.4})`,
        }}
      />
    ))}
  </div>
);

const ResultsDecor = () => (
  <div className="mb-4 flex items-center gap-2">
    <span
      className="w-2.5 h-2.5 rounded-full"
      style={{ background: "#FF5050", boxShadow: "0 0 6px #FF5050" }}
    />
    <span className="font-mono text-[8px] tracking-widest text-red-400">
      P1 · CRITICAL
    </span>
  </div>
);

const steps = [
  {
    num: "01",
    label: "// UPLOAD",
    title: "Drop your HPTuners CSV",
    body: "Export your datalog. Drop it in. Knock · LTFT · MAF · VE · Fuel Pressure · Spark.",
    Decor: UploadDecor,
    animate: null,
  },
  {
    num: "02",
    label: "// ANALYZE",
    title: "19 systems scanned in real time",
    body: null,
    Decor: null,
    animate: true,
  },
  {
    num: "03",
    label: "// RESULTS",
    title: "Exact revision steps",
    body: "P1 through P4 — prioritized, specific, actionable. Table name. Navigation path. Magnitude of change.",
    Decor: ResultsDecor,
    animate: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-mono text-[9px] tracking-widest text-cyan mb-4">
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
          <div className="flex flex-col items-start md:items-end gap-1">
            {[
              "19 systems scanned",
              "85+ KB entries",
              "Gen5 LT / LS · 6L80E",
            ].map((m) => (
              <span
                key={m}
                className="font-mono text-[8px] tracking-widest text-t3"
              >
                {m}
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
              className="rounded-[2px] p-5"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[9px] tracking-widest text-t3">
                  STEP
                </span>
                <span
                  className="font-mono text-xs tracking-widest text-cyan"
                >
                  {step.num}
                </span>
              </div>

              {step.Decor && <step.Decor />}
              {step.animate && <ScanAnimation />}

              <p className="font-mono text-[8px] tracking-widest text-cyan mt-4 mb-2">
                {step.label}
              </p>
              <h3 className="font-display font-bold text-t1 text-lg mb-2 leading-snug">
                {step.title}
              </h3>
              {step.body && (
                <p className="font-mono text-[10px] leading-relaxed text-t2">
                  {step.body}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
