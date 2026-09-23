"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLASSES } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import Icon from "./ui/Icon";

gsap.registerPlugin(ScrollTrigger);

export default function Classes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      if (barRef.current) {
        gsap.set(barRef.current, { transformOrigin: "left center", scaleX: 0 });
      }

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    const t = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section id="programs" ref={sectionRef} className="relative z-10 h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,transparent,rgba(5,5,8,0.6))]" />

      <div ref={trackRef} className="flex h-full w-max items-center gap-5 px-5 sm:gap-7 sm:px-10">
        {/* Intro panel */}
        <div className="flex h-[70vh] w-[88vw] shrink-0 flex-col justify-center sm:w-[46vw] lg:w-[34vw]">
          <SectionHeading
            eyebrow="Signature Programs"
            title="Train"
            accent="sideways"
            sub="Five engineered disciplines, one brutal standard. Swipe the grid — every class is a blueprint for a stronger version of you."
          />
          <div className="mt-10 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full glass">
              <Icon name="arrowRight" className="h-5 w-5 animate-pulse text-cyber" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-mist">
              Drag · Scroll → horizontal
            </span>
          </div>
        </div>

        {CLASSES.map((c) => (
          <div
            key={c.index}
            className="holo-card group relative h-[70vh] w-[85vw] shrink-0 overflow-hidden rounded-[2rem] sm:w-[46vw] lg:w-[30vw]"
          >
            {/* Ambient tone */}
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tone} opacity-70`} />

            {/* scanlines */}
            <div className="absolute inset-0 grain-dots opacity-30" />

            {/* giant index */}
            <span className="absolute -right-2 top-2 font-display text-[9rem] font-bold leading-none text-outline opacity-60 transition-all duration-700 group-hover:opacity-100 group-hover:rotate-[-8deg] sm:text-[11rem]">
              {c.index}
            </span>

            {/* holo corner ticks */}
            <span className="absolute left-5 top-5 h-8 w-8 border-l border-t border-cyber/60" />
            <span className="absolute bottom-5 right-5 h-8 w-8 border-b border-r border-plasma/60" />

            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ borderColor: `${c.ring}66`, color: c.ring }}
                >
                  {c.tag}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-mist">
                  <Icon name="clock" className="h-3.5 w-3.5" /> {c.time}
                </span>
              </div>
              <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                {c.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{c.desc}</p>
              <button
                onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyber transition-all hover:gap-3.5"
              >
                Book this class <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* progress bar */}
      <div className="absolute bottom-10 left-1/2 z-20 w-56 -translate-x-1/2 sm:w-80">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div ref={barRef} className="h-full w-full bg-gradient-to-r from-cyber via-nebula to-plasma" />
        </div>
      </div>
    </section>
  );
}