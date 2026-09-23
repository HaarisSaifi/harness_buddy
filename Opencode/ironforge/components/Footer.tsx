"use client";

import { motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { scrollToHash } from "@/lib/lenis";
import Icon from "./ui/Icon";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/8 bg-iron/40 pt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#22d3ee,#8b5cf6)]">
                <Icon name="dumbbell" className="h-5 w-5 text-void" strokeWidth={1.9} />
              </span>
              <span className="font-display text-base font-bold uppercase tracking-[0.18em] text-white sm:text-lg">
                Sense of <span className="holo-text">Fitness</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
              A premium strength facility where chrome meets holograms. Est. 2011 — forging humans into
              weapons, one rep at a time.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {(["instagram", "xSocial", "youtube"] as const).map((s) => (
                <a
                  key={s}
                  href="#top"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass text-mist transition-all duration-300 hover:border-cyber/50 hover:text-cyber"
                >
                  <Icon name={s} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* explore */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyber">Explore</h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollToHash(l.href)}
                    className="text-sm text-mist transition-colors hover:text-white"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyber">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-mist">
              <li className="flex items-center gap-2.5">
                <Icon name="mapPin" className="h-4 w-4 text-cyber" /> 44 Iron District, Albion
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="phone" className="h-4 w-4 text-cyber" /> +1 (800) IRON-FIT
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="mail" className="h-4 w-4 text-cyber" /> hello@sof.fit
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="clock" className="h-4 w-4 text-cyber" /> Open 24/7 · 365 days
              </li>
            </ul>
          </div>

          {/* newsletter */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyber">The SOF Weekly</h4>
            <p className="mt-5 text-sm text-mist">
              Development tips, member wins and class drops. No spam, just steel.
            </p>
            <form
              className="mt-5 flex overflow-hidden rounded-full glass p-1"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="w-full bg-transparent px-5 text-sm text-white placeholder:text-mist/60 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-gradient-to-r from-cyber to-plasma px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-void transition-transform hover:scale-105"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-7 sm:flex-row">
          <span className="font-mono text-[11px] uppercase tracking-widest text-mist/70">
            © {new Date().getFullYear()} Sense of Fitness Athletics. All rights reserved.
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-mist/70">
            Forged with <span className="text-gold">intensity</span> · No shortcuts
          </span>
        </div>
      </div>

      {/* ghost watermark */}
      <div className="pointer-events-none relative -mb-7 select-none overflow-hidden px-5 sm:px-8">
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap text-center font-display text-[34vw] font-bold uppercase leading-[0.78] tracking-tight text-outline lg:text-[28vw]"
        >
          S.of.F
        </motion.div>
      </div>
    </footer>
  );
}