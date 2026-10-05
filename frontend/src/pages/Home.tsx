import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Stats />
        <Work />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
