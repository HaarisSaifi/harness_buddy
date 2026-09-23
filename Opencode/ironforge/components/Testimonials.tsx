"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const len = TESTIMONIALS.length;

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % len), 5200);
    return () => clearInterval(id);
  }, [len]);

  const t = TESTIMONIALS[index];

  return (
    <section className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading align="center" eyebrow="Transformation Stories" title="Forged in" accent="the arena" />

        <div className="mt-14">
          <div className="glass holo-card relative overflow-hidden rounded-[2rem] p-8 sm:p-12">
            <div className="absolute left-6 top-6 opacity-30 sm:left-10 sm:top-10">
              <Icon name="quote" className="h-16 w-16 text-cyber" />
            </div>

            <div className="relative min-h-[15rem] sm:min-h-[12rem]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -34 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col items-center pt-8 text-center"
                >
                  <div className="mb-6 flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="star" className="h-5 w-5" useCurrentColor />
                    ))}
                  </div>
                  <blockquote className="max-w-3xl font-display text-xl font-medium leading-relaxed text-fog sm:text-2xl">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-7">
                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyber to-plasma font-display text-base font-bold text-void">
                      {t.initials}
                    </span>
                    <span className="block font-display font-bold uppercase tracking-wide text-white">{t.name}</span>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.3em] text-mist">{t.role}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          {/* dots */}
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
                className="group relative flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === index ? "h-2.5 w-2.5 bg-cyber" : "h-1.5 w-1.5 bg-white/20 group-hover:bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}