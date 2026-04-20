"use client";

import { motion } from "framer-motion";

const grades = [
  {
    grade: "A",
    color: "#00DCB4",
    label: "Knock & Spark",
    note: "0 events · no retard",
  },
  {
    grade: "C",
    color: "#FFB400",
    label: "Airflow / MAF",
    note: "1,846 g/s — review",
  },
  {
    grade: "C",
    color: "#FFB400",
    label: "Torque Model",
    note: "VT mismatch",
  },
  {
    grade: "B",
    color: "#00DCFF",
    label: "Transmission",
    note: "6L80 TCC nominal",
  },
  {
    grade: "D",
    color: "#FF5050",
    label: "Log Coverage",
    note: "LTFT · FP · WOT missing",
  },
  {
    grade: "—",
    color: "#3A5068",
    label: "Fuel System",
    note: "not logged",
    italic: true,
  },
];

export default function Proof() {
  return (
    <section className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[11px] tracking-widest text-cyan mb-4">
          // Real Data · CASE_001
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display font-bold text-t1 text-3xl md:text-4xl mb-2"
        >
          This is what your tune looks like.
        </motion.h2>
        <p className="font-mono text-[12px] tracking-widest text-t3 mb-10">
          2018 Silverado · L86 6.2L · 416ci Whipple · E85 · 6L80E
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2px] overflow-hidden"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Cyan top bar */}
          <div className="h-[2px] w-full" style={{ background: "var(--cyan)" }} />

          {/* Report header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span className="font-display font-bold text-t1 text-base tracking-wide">
              <span className="text-t3">Tune</span>View
            </span>
            <span className="font-mono text-[10px] tracking-widest text-t3">
              PRO TIER / 2026-04-14
            </span>
          </div>

          {/* GPA hero */}
          <div
            className="flex items-center gap-6 px-5 py-5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="font-display font-bold text-5xl"
              style={{ color: "#FFB400" }}
            >
              B+
            </span>
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-widest text-t3 mb-2">
                WEIGHTED GPA / 3.38 / 4.0
              </p>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--border2)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "84.5%",
                    background:
                      "linear-gradient(90deg, #00DCB4, #FFB400)",
                  }}
                />
              </div>
              <p className="font-mono text-[7px] tracking-widest text-t3 mt-1">
                84.5%
              </p>
            </div>
          </div>

          {/* Grade grid */}
          <div className="grid grid-cols-2 gap-px p-px" style={{ background: "var(--border)" }}>
            {grades.map((g, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: "var(--panel)" }}
              >
                <span
                  className="font-display font-bold text-2xl w-7 flex-shrink-0"
                  style={{ color: g.color }}
                >
                  {g.grade}
                </span>
                <div>
                  <p className="font-display font-bold text-t1 text-sm leading-none mb-0.5">
                    {g.label}
                  </p>
                  <p
                    className={`font-mono text-[10px] tracking-widest ${g.italic ? "italic" : ""}`}
                    style={{ color: g.color }}
                  >
                    {g.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
