import AppShell from "@/components/AppShell";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Classes from "@/components/Classes";
import Trainers from "@/components/Trainers";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

export default function Page() {
  return (
    <AppShell>
      <CursorGlow />
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Features />
      <Classes />
      <Trainers />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </AppShell>
  );
}