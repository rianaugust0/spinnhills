import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Guarantee } from "@/components/sections/guarantee";
import { Story } from "@/components/sections/story";
import { Guide } from "@/components/sections/guide";
import { InsideGuide } from "@/components/sections/inside-guide";
import { Reality } from "@/components/sections/reality";
import { Testimonials } from "@/components/sections/testimonials";
import { TargetAudience } from "@/components/sections/target-audience";
import { Bonuses } from "@/components/sections/bonuses";
import { Offer } from "@/components/sections/offer";
import { FinalCta } from "@/components/sections/final-cta";
import { ScarcityBanner } from "@/components/scarcity-banner";
import { LastCall } from "@/components/sections/last-call";
import { Faq } from "@/components/sections/faq";
import { Approvals } from "@/components/sections/approvals";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background pt-[70px] sm:pt-[41px]">
      <ScarcityBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Guarantee />
        <Story />
        <Guide />
        <InsideGuide />
        <Reality />
        <Testimonials />
        <Approvals />
        <TargetAudience />
        <Bonuses />
        <Offer />
        <FinalCta />
        <LastCall />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
