import type { IconName } from "@/components/ui/Icon";

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Coaches", href: "#coaches" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const STATS = [
  { value: 12, suffix: "K+", label: "Members Forged" },
  { value: 40, suffix: "+", label: "Elite Coaches" },
  { value: 15, suffix: "", label: "Years of Iron" },
  { value: 98, suffix: "%", label: "Goal Completion" },
];

export const FEATURES: {
  icon: IconName;
  title: string;
  desc: string;
  glow: string;
}[] = [
  {
    icon: "zap",
    title: "Holographic Coaching",
    desc: "AI-driven form analysis projects personalised training feedback in real time — every rep, every angle.",
    glow: "rgba(34,211,238,0.5)",
  },
  {
    icon: "dumbbell",
    title: "Iron-Density Zones",
    desc: "Free-weights floors engineered with Olympic plating, prowler lanes and hybrid rigs for raw power.",
    glow: "rgba(139,92,246,0.5)",
  },
  {
    icon: "pulse",
    title: "Recovery Labs",
    desc: "Cryo, compression and 3D motion scanning suites that rebuild your body between sessions.",
    glow: "rgba(232,121,249,0.5)",
  },
  {
    icon: "shield",
    title: "Elite Safety Net",
    desc: "Certified tech-staff + biometric check-ins keep every session monitored, measured and protected.",
    glow: "rgba(34,211,238,0.5)",
  },
  {
    icon: "users",
    title: "Tribe + Culture",
    desc: "Weekly team meets, transformation tracking and a community that refuses to let you skip leg day.",
    glow: "rgba(139,92,246,0.5)",
  },
  {
    icon: "target",
    title: "Precision Programs",
    desc: "Weekly periodised plans mapped to your exact body type ready to be scaled by your coach.",
    glow: "rgba(245,194,74,0.5)",
  },
];

export const CLASSES = [
  {
    index: "01",
    title: "Powerlifting",
    tag: "Strength",
    time: "45 min",
    desc: "Squat, bench, deadlift — heavy triples engineered around your 1RM with leaderboard feedback.",
    tone: "from-cyan-500/25 to-transparent",
    ring: "#22d3ee",
  },
  {
    index: "02",
    title: "H.I.I.T Inferno",
    tag: "Conditioning",
    time: "30 min",
    desc: "Oxygen debt, sprint ladders and sled pushes. A metabolic furnace that burns for 24 hours.",
    tone: "from-fuchsia-500/25 to-transparent",
    ring: "#e879f9",
  },
  {
    index: "03",
    title: "Mobility & Recovery",
    tag: "Flexibility",
    time: "40 min",
    desc: "Hip openers, breathwork and guided stretching to bulletproof joints and calm the nervous system.",
    tone: "from-violet-500/25 to-transparent",
    ring: "#8b5cf6",
  },
  {
    index: "04",
    title: "Boxing Lab",
    tag: "Combat",
    time: "50 min",
    desc: "Footwork, pads and bag flow with fight-conditioning rounds. Leave your ego at the door.",
    tone: "from-amber-500/25 to-transparent",
    ring: "#f5c24a",
  },
  {
    index: "05",
    title: "Hybrid Engine",
    tag: "Athletic",
    time: "60 min",
    desc: "Strength circuits fused with explosive Olympic lifts — built for real-world power output.",
    tone: "from-cyan-500/20 to-emerald-500/10",
    ring: "#34d399",
  },
];

export const TRAINERS = [
  {
    name: "Kai Ares",
    role: "Head of Strength",
    creds: "International Powerlifting",
    initials: "KA",
    grad: "from-cyan-500 to-violet-500",
  },
  {
    name: "Nora Vasquez",
    role: "HIIT & Conditioning",
    creds: "CrossFit L4 Coach",
    initials: "NV",
    grad: "from-violet-500 to-fuchsia-500",
  },
  {
    name: "Dante Cole",
    role: "Combat Specialist",
    creds: "Pro Boxing, 24-3",
    initials: "DC",
    grad: "from-amber-500 to-rose-500",
  },
  {
    name: "Lena Sato",
    role: "Mobility & Recovery",
    creds: "Physio, 10+ yrs",
    initials: "LS",
    grad: "from-fuchsia-500 to-cyan-500",
  },
];

export const PLANS = [
  {
    name: "Beginner",
    price: 29,
    tagline: "Start your first 30 days of iron.",
    features: [
      "Gym floor access (6am–10pm)",
      "1 onboarding session",
      "Mobile training app",
      "Locker room access",
    ],
    featured: false,
    cta: "Start Forging",
  },
  {
    name: "Pro",
    price: 59,
    tagline: "Daily programming + a dedicated coach.",
    features: [
      "24/7 access to all zones",
      "Weekly program periodisation",
      "1 personal coach session / week",
      "Recovery labs (cryo + compression)",
      "Holographic form feedback",
      "Guest passes monthly",
    ],
    featured: true,
    cta: "Go Pro",
  },
  {
    name: "Elite",
    price: 99,
    tagline: "The full transformation sovereignty.",
    features: [
      "Everything in Pro",
      "Unlimited 1-on-1 coaching",
      "Nutrition + body-comp tracking",
      "Biometric + 3D scan suite",
      "Priority class booking",
      "Quarterly body rebuild plan",
    ],
    featured: false,
    cta: "Claim Elite",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "I walked in at 110kg. A year of Sense of Fitness programming later I set a 3-plate deadlift. This place rewires you.",
    name: "Marcus Okafor",
    role: "Member · 14 months",
    initials: "MO",
  },
  {
    quote:
      "The holographic coaching catches mistakes my old trainer missed in two years. My squat depth is finally legal.",
    name: "Anya Petrova",
    role: "Pro Member",
    initials: "AP",
  },
  {
    quote:
      "Recovery labs + elite coaches = I train 6 days a week and my joints feel like I just started. Unreal facility.",
    name: "Ryan Delgado",
    role: "Elite Member",
    initials: "RD",
  },
  {
    quote:
      "Boxing lab Friday nights are the highlight of my week. The energy, the pads, the sweat — pure adrenaline.",
    name: "Zara Khan",
    role: "Member · 8 months",
    initials: "ZK",
  },
];

export const FAQS = [
  {
    q: "Do I need experience to join Sense of Fitness?",
    a: "Not at all. Every new member gets an onboarding assessment so we can build your program from exactly where you are — complete beginner to regional athlete.",
  },
  {
    q: "How does the holographic coaching work?",
    a: "Camera + sensor rigs track your movement across 27 joints. The system compares each rep against ideal mechanics and beams corrections onto the mirrored surface in real time.",
  },
  {
    q: "What's included in the Recovery Lab?",
    a: "Cryotherapy chambers, compression boots, massage guns, sauna and a 3D motion scanner that measures asymmetry so your coach can fix imbalances before they become injuries.",
  },
  {
    q: "Can I freeze or cancel my membership?",
    a: "Yes. Pause your membership for up to 90 days per year, or cancel anytime from the app — no phone calls, no guilt trips.",
  },
  {
    q: "Is there parking and showering?",
    a: "We have free underground parking, towel service, premium showers and 24/7 keycard security for all members.",
  },
];