"use client";

import { motion } from "framer-motion";

const cards = [
  {
    num: "// 01",
    accent: "#FF5050",
    text: (
      <>
        The forum guy swears by his{" "}
        <strong>MAF method</strong>. The thread is 14 pages long.
      </>
    ),
  },
  {
    num: "// 02",
    accent: "#FFB400",
    text: (
      <>
        The YouTube tuner has a{" "}
        <strong>4-part series</strong>. None of it matches your build.
      </>
    ),
  },
  {
    num: "// 03",
    accent: "#00DCFF",
    text: (
      <>
        Your tuner does it{" "}
        <strong>different from everyone else</strong>. Nobody can agree.
      </>
    ),
  },
];

export default function Problem() {
  return (
    <section className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="font-mono text-[11px] tracking-widest text-cyan mb-5">
          // The Problem
        </p>

        {/* Hero statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-t1 text-3xl md:text-5xl mb-12 leading-tight"
        >
          Everyone has a recipe for how to tune.
          <br />
          You just need{" "}
          <span className="text-cyan">the best one.</span>
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-[2px] p-5"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderTop: `3px solid ${card.accent}`,
              }}
            >
              <p
                className="font-mono text-[10px] tracking-widest mb-3"
                style={{ color: card.accent }}
              >
                {card.num}
              </p>
              <p className="font-display text-t2 text-base leading-snug">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Resolution panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 rounded-[2px]"
          style={{
            background: "var(--panel)",
            borderLeft: "3px solid var(--cyan)",
            border: "1px solid var(--border)",
            borderLeftWidth: "3px",
            borderLeftColor: "var(--cyan)",
          }}
        >
          <p className="font-display text-t2 text-lg leading-relaxed">
            TuneView reads your log. Cross-references 85+ calibration entries.
            Gives you{" "}
            <span className="text-cyan">the answer for your build</span> — right
            now.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
