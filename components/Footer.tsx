import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-3"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span className="font-mono text-[11px] text-t3 tracking-widest">
        LWX // TUNEVIEW-v1 · tuneview.io · ryan@tuneview.io
      </span>
      <nav className="flex items-center gap-5">
        {[
          { label: "// TRUST", href: "/trust" },
          { label: "// FOR SHOPS", href: "/for-shops" },
          { label: "// CHANGELOG", href: "/changelog" },
          { label: "// PRIVACY", href: "/privacy" },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="font-mono text-[10px] tracking-widest text-t3 hover:text-t2 transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
