"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  as?: "button" | "a";
  href?: string;
};

export default function MagneticButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  as = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.32);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.32);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 cursor-pointer select-none";

  const styles =
    variant === "primary"
      ? "text-void bg-[linear-gradient(100deg,#22d3ee,#8b5cf6,#e879f9)] shadow-[0_0_34px_-6px_rgba(139,92,246,.75)] hover:text-void"
      : "text-fog glass hover:text-cyber";

  const content = (
    <motion.span ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-flex items-center gap-2">
      {children}
    </motion.span>
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`}>
        <span className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      <span className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
      {content}
    </button>
  );
}