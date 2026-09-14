import "../styles/vortex-globals.css";
import Header from "../components/Header";
import ScrollProgress from "../components/ScrollProgress";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Products from "../components/Products";
import Services from "../components/Services";
import Process from "../components/Process";
import BenefitsExtra from "../components/BenefitsExtra";
import Testimonials from "../components/Testimonials";
import Faq from "../components/Faq";
import FinalCta from "../components/FinalCta";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { useProteccionBasica } from "@/shared/hooks/useProteccionBasica";
import { vortexDefaultConfig, type VortexConfig } from "../config";
import { derivarPaletaVortex } from "../lib/paletaDerivada";

export default function VortexPage({ config = vortexDefaultConfig }: { config?: VortexConfig }) {
  const proteccionRef = useProteccionBasica();

  const coloresPersonalizados = derivarPaletaVortex(config.apariencia)

  return (
    <main className="relative bg-[var(--v-bg)]" ref={proteccionRef} style={coloresPersonalizados}>
      <Header config={config} />
      <ScrollProgress />
      <section id="hero" className="scroll-mt-24">
        <Hero config={config} />
      </section>
      <section id="beneficios" className="scroll-mt-24">
        <Problem config={config} />
      </section>
      <section id="soluciones" className="scroll-mt-24">
        <Products config={config} />
        <Services config={config} />
      </section>
      <section id="cómo-empezar" className="scroll-mt-24">
        <Process config={config} />
      </section>
      <section id="beneficios-extra" className="scroll-mt-24">
        <BenefitsExtra config={config} />
      </section>
      <section id="casos" className="scroll-mt-24">
        <Testimonials config={config} />
      </section>
      <section id="preguntas-frecuentes" className="scroll-mt-24">
        <Faq config={config} />
      </section>
      <section id="final-cta" className="scroll-mt-24">
        <FinalCta config={config} />
      </section>
      <Footer config={config} />
      <WhatsAppButton config={config} />
    </main>
  );
}
