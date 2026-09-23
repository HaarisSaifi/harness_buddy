"use client";

export default function Marquee() {
  const items = ["Push Beyond Limits", "No Shortcuts", "Iron Discipline", "Elite Coaches", "Recovery Labs"];
  const row = [...items, ...items];

  return (
    <section className="relative z-20 -my-10 rotate-[-1.6deg] py-6">
      <div className="border-y border-white/8 bg-void/90 py-5 backdrop-blur-sm">
        <div className="flex w-max animate-marquee gap-0 whitespace-nowrap">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {row.map((item, i) => (
                <span key={i} className="flex items-center gap-8 pr-8">
                  <span className="font-display text-4xl font-bold uppercase tracking-tight text-outline-strong sm:text-6xl">
                    {item}
                  </span>
                  <IconSpark />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-transparent to-void" />
    </section>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-cyber">
      <path
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
        fill="currentColor"
      />
    </svg>
  );
}