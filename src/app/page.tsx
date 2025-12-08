import { Header } from '@/components/header';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Experience } from '@/components/sections/experience';
import { Services } from '@/components/sections/services';
import { Barbers } from '@/components/sections/barbers';
import { Gallery } from '@/components/sections/gallery';
import { Testimonials } from '@/components/sections/testimonials';
import { HowToSchedule } from '@/components/sections/how-to-schedule';
import { Promotions } from '@/components/sections/promotions';
import { Faq } from '@/components/sections/faq';
import { Location } from '@/components/sections/location';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Services />
        <Barbers />
        <Gallery />
        <Testimonials />
        <HowToSchedule />
        <Promotions />
        <Faq />
        <Location />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
