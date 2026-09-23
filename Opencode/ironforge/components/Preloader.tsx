"use client";

import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/useIsMobile";

const WORD = "SOF";
const TAG = "Sense of Fitness";
const cubicOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LettersBlock = memo(function LettersBlock() {
  return (
    <>
      <div className="flex overflow-hidden">
        {WORD.split("").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: 90, opacity: 0, rotate: 12 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.12 * i + 0.15, duration: 0.7, ease: cubicOut }}
            className={`font-display text-6xl font-bold tracking-[0.28em] sm:text-8xl ${i === 0 ? "holo-text" : "text-white"}`}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.9, ease: cubicOut }}
        className="mt-5 h-px w-72 origin-left bg-gradient-to-r from-cyber via-nebula to-plasma sm:w-96"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="mt-3 font-mono text-[11px] uppercase tracking-[0.5em] text-mist"
      >
        {TAG}
      </motion.p>
    </>
  );
});

const FooterBlock = memo(function FooterBlock() {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="font-mono text-[10px] uppercase tracking-[0.4em] text-mist/60"
    >
      Est. 2011 · Premium Strength Facility
    </motion.span>
  );
});

export default function Preloader({ onDone }: { onDone: () => void }) {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const isMobile = useIsMobile();
  const exitProps = isMobile ? { y: "-100%" } : { clipPath: "inset(0 0 100% 0)" };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    const start = performance.now();
    const duration = 1900;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const num = numRef.current;
      if (num) num.textContent = String(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        document.documentElement.style.overflow = "";
        setTimeout(onDone, 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <motion.div
      exit={exitProps}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col bg-void"
    >
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          <LettersBlock />
        </div>
      </div>

      <div className="flex items-end justify-between px-6 pb-6 sm:px-12">
        <FooterBlock />
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: cubicOut }}
          className="overflow-hidden"
        >
          <div className="block font-display text-6xl font-bold tabular-nums text-fog sm:text-8xl">
            <span ref={numRef}>0</span>
            <span className="holo-text">%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}