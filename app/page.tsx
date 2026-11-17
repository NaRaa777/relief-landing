import { Analytics } from "@/components/Analytics";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCta } from "@/components/StickyCta";
import { ConceptReveal } from "@/components/sections/ConceptReveal";
import { Hero } from "@/components/sections/Hero";
import { Join } from "@/components/sections/Join";
import { Statement } from "@/components/sections/Statement";

export default function Home() {
  return (
    <>
      <Analytics />
      <MotionProvider />
      <SiteHeader />
      <main id="main" className="flex-1 overflow-x-clip">
        <Hero />
        <Statement />
        <ConceptReveal />
        <Join />
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
