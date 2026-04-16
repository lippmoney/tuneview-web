"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    label: "// EXPORT",
    title: "Export your log from HPTuners Scanner",
    img: "/screenshots/step1_vcm_scanner.png",
    caption: "VCM Scanner with live log — RPM, MAF, LTFT, knock, spark, fuel pressure all captured",
  },
  {
    num: "02",
    label: "// UPLOAD",
    title: "Drop it in. Tell us about your build.",
    img: "/screenshots/step2_upload_form.png",
    caption: "Vehicle profile form — displacement, cam, injectors, forced induction, fuel type",
  },
  {
    num: "03",
    label: "// RESULTS",
    title: "Get exact revision steps in 60 seconds",
    img: "/screenshots/step3_scan_results.png",
    caption: "19 systems scanned — findings prioritized P1 through P3 with table names and correction values",
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
            {["19 systems scanned", "85+ KB entries", "Gen5 LT / LS · 6L80E"].map((m) => (
              <span key={m} className="font-mono text-[8px] tracking-widest text-t3">
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
              className="rounded-[2px] overflow-hidden group transition-colors"
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
                <span className="font-mono text-[9px] tracking-widest text-t3">STEP</span>
                <span className="font-mono text-xs tracking-widest text-cyan">{step.num}</span>
                <span className="font-mono text-[9px] tracking-widest text-t3 ml-1">{step.label}</span>
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
                <p className="font-mono text-[9px] leading-relaxed text-t3">
                  {step.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
