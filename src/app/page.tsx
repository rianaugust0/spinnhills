import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Story } from "@/components/sections/story";
import { Guide } from "@/components/sections/guide";
import { Reality } from "@/components/sections/reality";
import { Testimonials } from "@/components/sections/testimonials";
import { TargetAudience } from "@/components/sections/target-audience";
import { Bonuses } from "@/components/sections/bonuses";
import { Offer } from "@/components/sections/offer";
import { FinalCta } from "@/components/sections/final-cta";
import { ScarcityBanner } from "@/components/scarcity-banner";
import { LastCall } from "@/components/sections/last-call";
import { AiCorrector } from "@/components/sections/ai-corrector";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <ScarcityBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Story />
        <Guide />
        <AiCorrector />
        <Reality />
        <Testimonials />
        <TargetAudience />
        <Bonuses />
        <Offer />
        <FinalCta />
        <LastCall />
      </main>
      <Footer />
    </div>
  );
}
