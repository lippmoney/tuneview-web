"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const tiers = [
  {
    name: "DIY",
    price: "$19",
    unit: "/case",
    desc: "You know how to tune. You just need to know what's wrong. Pay per scan.",
    features: [
      "19-system scan",
      "Full report card",
      "P1–P4 revision steps",
      "Shareable result",
      "Dragy linking",
    ],
    cta: "Get Early Access",
    ctaHref: "/#early-access",
    ctaStyle: "outline",
    featured: false,
    accent: null,
  },
  {
    name: "PRO",
    price: "$79",
    unit: "/mo",
    desc: "You tune a lot of cars. You need to move faster. Unlimited scans.",
    features: [
      "Everything in DIY",
      "Unlimited scans",
      "Custom GPA weights",
      "Revision history",
      "Trend analysis",
      "Priority KB matching",
    ],
    cta: "Get Early Access",
    ctaHref: "/#early-access",
    ctaStyle: "filled",
    featured: true,
    accent: "#00DCFF",
  },
  {
    name: "RED",
    price: "$299",
    unit: "/mo",
    desc: "Every revision tracked. Every outcome recorded. Your knowledge base. Your liability protection.",
    features: [
      "Everything in PRO",
      "Complete revision tracking + audit trail",
      "Shop baseline library",
      "Dyno session hosting",
      "Injectable tips between revisions",
      "Anonymous platform benchmarking",
      "Encrypted file storage",
    ],
    cta: "Learn More →",
    ctaHref: "/for-shops",
    ctaStyle: "red",
    featured: false,
    accent: "#FF5050",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-10 px-5 md:px-10 py-24">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[9px] tracking-widest text-cyan mb-4">
          // Pricing
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display font-bold text-t1 text-3xl md:text-4xl mb-2"
        >
          Start free. Scale when you&apos;re ready.
        </motion.h2>
        <p className="font-mono text-[10px] tracking-widest text-t3 mb-12">
          All tiers include full report card · shareable results · Dragy
          integration
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-[2px] flex flex-col"
              style={{
                background: "var(--panel)",
                border: `1px solid ${tier.featured ? "rgba(0,220,255,0.3)" : "var(--border)"}`,
                borderTop: tier.accent
                  ? `2px solid ${tier.accent}`
                  : "1px solid var(--border)",
              }}
            >
              <div className="p-5 flex-1">
                <p className="font-mono text-[8px] tracking-widest text-t3 mb-3">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-display font-bold text-t1 text-3xl">
                    {tier.price}
                  </span>
                  <span className="font-mono text-[9px] text-t3">
                    {tier.unit}
                  </span>
                </div>
                <p className="font-mono text-[10px] leading-relaxed text-t2 mb-5">
                  {tier.desc}
                </p>
                <ul className="flex flex-col gap-2">
                  {tier.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2 font-mono text-[9px] tracking-wide text-t2"
                    >
                      <span
                        className="mt-0.5 flex-shrink-0"
                        style={{
                          color: tier.accent || "var(--cyan)",
                        }}
                      >
                        ·
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={tier.ctaHref}
                  className={`block text-center font-mono text-[9px] tracking-widest px-4 py-3 rounded-[2px] transition-colors ${
                    tier.ctaStyle === "filled"
                      ? "bg-cyan text-bg hover:bg-cyan/90"
                      : tier.ctaStyle === "red"
                      ? "border border-red/40 text-red bg-red/5 hover:bg-red/10"
                      : "border border-cyan/30 text-cyan bg-cyan/5 hover:bg-cyan/10"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
