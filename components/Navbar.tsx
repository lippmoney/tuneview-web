"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "// PRODUCT", href: "/#how-it-works" },
  { label: "// PRICING", href: "/#pricing" },
  { label: "// FOR SHOPS", href: "/for-shops" },
  { label: "// TRUST", href: "/trust" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center px-6"
        style={{
          background: "rgba(6,8,16,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(26,34,53,0.5)",
        }}
      >
        {/* Wordmark */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <span
            className="font-display font-bold text-xl tracking-wide"
            style={{ lineHeight: 1 }}
          >
            <span className="text-t3">Tune</span>
            <span className="text-t1">View</span>
          </span>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-mono text-[9px] tracking-widest text-t3 hover:text-cyan transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/#early-access"
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-cyan px-4 py-2 rounded-[2px] border border-cyan/30 bg-cyan/5 hover:bg-cyan/10 transition-colors"
          >
            // EARLY ACCESS <span className="text-[10px]">→</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-px bg-t2 transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-t2 transition-all ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-px bg-t2 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-[52px] left-0 right-0 py-6 px-6 flex flex-col gap-5"
            style={{
              background: "rgba(6,8,16,0.97)",
              borderBottom: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-[11px] tracking-widest text-t2 hover:text-cyan transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#early-access"
              onClick={() => setOpen(false)}
              className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] tracking-widest text-cyan px-4 py-2 rounded-[2px] border border-cyan/30 bg-cyan/5 hover:bg-cyan/10 transition-colors mt-2"
            >
              // EARLY ACCESS →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
