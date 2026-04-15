"use client";

import { useRef, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

function useWordmarkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let animFrame: number;
    let frame = 0;
    const FONT_SIZE = 148;
    const FONT = `700 ${FONT_SIZE}px Rajdhani, sans-serif`;

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.font = FONT;

      const totalW = ctx.measureText("TuneView").width;
      const tuneW = ctx.measureText("Tune").width;
      const startX = (W - totalW) / 2;
      const viewX = startX + tuneW;
      const baseY = H * 0.72;

      // ── "Tune" — stroke only ──────────────────────────────────────
      ctx.save();
      ctx.font = FONT;
      ctx.strokeStyle = "#00DCFF";
      ctx.lineWidth = 3.5;
      ctx.lineJoin = "round";
      ctx.strokeText("Tune", startX, baseY);
      ctx.restore();

      // ── "View" — depth shadow + face gradient + highlight ─────────
      ctx.save();
      ctx.font = FONT;

      // Depth shadow layers
      const shadowAlphas = [0.18, 0.15, 0.12, 0.10, 0.08, 0.06, 0.04, 0.02];
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = `rgba(0,220,255,${shadowAlphas[i]})`;
        ctx.fillText("View", viewX + i * 1.6, baseY + i * 1.6);
      }

      // Face gradient
      const faceGrad = ctx.createLinearGradient(0, baseY - FONT_SIZE, 0, baseY);
      faceGrad.addColorStop(0.00, "#FFFFFF");
      faceGrad.addColorStop(0.25, "#EEF8FF");
      faceGrad.addColorStop(0.50, "#D8F4FF");
      faceGrad.addColorStop(0.75, "#8AB0C8");
      faceGrad.addColorStop(1.00, "#3A5068");
      ctx.fillStyle = faceGrad;
      ctx.fillText("View", viewX, baseY);

      // Top highlight strip
      ctx.save();
      ctx.rect(viewX, baseY - FONT_SIZE, totalW - tuneW + 20, 2);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText("View", viewX, baseY);
      ctx.restore();

      ctx.restore();

      // ── Baseline gradient line ────────────────────────────────────
      const lineY = baseY + 10;
      const lineGrad = ctx.createLinearGradient(startX, 0, startX + totalW, 0);
      lineGrad.addColorStop(0, "transparent");
      lineGrad.addColorStop(0.15, "rgba(0,220,255,0.5)");
      lineGrad.addColorStop(0.85, "rgba(0,220,255,0.5)");
      lineGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1;
      ctx.moveTo(startX, lineY);
      ctx.lineTo(startX + totalW, lineY);
      ctx.stroke();

      // ── Scan line ────────────────────────────────────────────────
      const SCAN_PERIOD = 130;
      const HOLD = 20;
      const cycle = frame % (SCAN_PERIOD + HOLD);

      if (cycle < SCAN_PERIOD) {
        const progress = cycle / SCAN_PERIOD;
        const scanX = startX + progress * totalW;
        const scanY = lineY + 6;

        // Fade in/out: full during 20–80%, taper edges
        const alpha =
          progress < 0.15
            ? progress / 0.15
            : progress > 0.85
            ? (1 - progress) / 0.15
            : 1;

        // Line trail behind dot
        const trailLen = Math.min(80, progress * totalW);
        const trailGrad = ctx.createLinearGradient(
          scanX - trailLen,
          0,
          scanX,
          0
        );
        trailGrad.addColorStop(0, "transparent");
        trailGrad.addColorStop(1, `rgba(0,220,255,${0.5 * alpha})`);
        ctx.beginPath();
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(Math.max(startX, scanX - trailLen), scanY);
        ctx.lineTo(scanX, scanY);
        ctx.stroke();

        // Leading white dot
        ctx.beginPath();
        ctx.arc(scanX, scanY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        // Radial glow around dot
        const glow = ctx.createRadialGradient(
          scanX,
          scanY,
          0,
          scanX,
          scanY,
          14
        );
        glow.addColorStop(0, `rgba(0,220,255,${0.35 * alpha})`);
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(scanX, scanY, 14, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      frame++;
      animFrame = requestAnimationFrame(draw);
    }

    document.fonts.ready.then(() => {
      animFrame = requestAnimationFrame(draw);
    });

    return () => cancelAnimationFrame(animFrame);
  }, []);

  return canvasRef;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Hero() {
  const canvasRef = useWordmarkCanvas();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen pt-[52px] px-5 text-center z-10">
      {/* Animated wordmark */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full max-w-[900px]"
      >
        <canvas
          ref={canvasRef}
          width={900}
          height={200}
          className="w-full max-w-[900px]"
          style={{ maxHeight: "200px" }}
        />
      </motion.div>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="font-display font-bold text-t1 mt-6"
        style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1.1 }}
      >
        Upload your log. Get the answer.
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="font-mono text-t2 mt-4 text-sm md:text-base max-w-xl"
      >
        19 systems. 60 seconds. Exact revision steps — not forum opinions.
      </motion.p>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row gap-3 mt-8"
      >
        <Link
          href="/#early-access"
          className="font-mono text-[10px] tracking-widest text-bg bg-cyan hover:bg-cyan/90 transition-colors px-6 py-3 rounded-[2px]"
        >
          GET EARLY ACCESS
        </Link>
        <Link
          href="/#how-it-works"
          className="font-mono text-[10px] tracking-widest text-cyan border border-cyan/30 hover:border-cyan/60 bg-cyan/5 hover:bg-cyan/10 transition-colors px-6 py-3 rounded-[2px]"
        >
          SEE HOW IT WORKS
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-cyan/50"
        />
        <span className="font-mono text-[8px] tracking-widest text-t3">
          scroll
        </span>
      </motion.div>
    </section>
  );
}
