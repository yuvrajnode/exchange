import { Hero } from "@/components/landing/Hero";
import { LiveMarkets } from "@/components/landing/LiveMarkets";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CallToAction } from "@/components/landing/CallToAction";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      <SiteNav />
      <main>
        <Hero />
        <LiveMarkets />
        <HowItWorks />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  );
}
