"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { scrollToHash } from "@/lib/lenis";
import Icon from "./ui/Icon";
import MagneticButton from "./ui/MagneticButton";

function Logo() {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        scrollToHash("#top");
      }}
      className="group flex items-center gap-2.5"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)] shadow-[0_0_22px_-4px_rgba(139,92,246,0.8)]">
        <Icon name="dumbbell" className="h-5 w-5 text-void" strokeWidth={1.9} />
      </span>
      <span className="font-display text-base font-bold uppercase tracking-[0.18em] text-white sm:text-lg">
        Sense of <span className="holo-text">Fitness</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToHash(href), 80);
  };

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left bg-gradient-to-r from-cyber via-nebula to-plasma"
      />

      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          scrolled ? "glass border-b border-white/5 py-3" : "border-b border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative font-mono text-[11px] uppercase tracking-[0.28em] text-mist transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-cyber to-plasma transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <MagneticButton onClick={() => go("#pricing")} className="!py-2.5 !px-6">
              Join Now
              <Icon name="arrowUpRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full glass lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5 text-white" />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col justify-center bg-void/95 px-8 backdrop-blur-xl lg:hidden"
          >
            <div className="grid-lines absolute inset-0 opacity-40" />
            <div className="holo-orb h-72 w-72 rounded-full bg-nebula/25" style={{ top: "15%", right: "5%" }} />
            <nav className="relative flex flex-col gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(l.href)}
                  className="flex items-baseline justify-between border-b border-white/8 py-5 text-left"
                >
                  <span className="font-display text-4xl font-bold uppercase tracking-tight text-white">
                    {l.label}
                  </span>
                  <span className="font-mono text-xs text-cyber">0{i + 1}</span>
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <MagneticButton onClick={() => go("#pricing")} className="w-full justify-center">
                  Join Now
                </MagneticButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}