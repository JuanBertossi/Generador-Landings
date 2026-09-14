import type { RefObject } from "react";
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
import { EditableProvider } from "@/shared/components/EditableContext";

type VortexPageProps = {
  config?: VortexConfig
  editable?: boolean
  onFieldChange?: (path: string, value: string) => void
  onArchivoChange?: (path: string, file: File) => void
  onAgregarCaso?: () => void
  onQuitarCaso?: (i: number) => void
  onAgregarFaq?: () => void
  onQuitarFaq?: (i: number) => void
  /** Contenedor real de scroll cuando esto se monta dentro del panel de
   * preview del editor (ver ScrollProgress) — no aplica en la página publicada. */
  scrollContainerRef?: RefObject<HTMLElement>
}

export default function VortexPage({
  config = vortexDefaultConfig,
  editable = false,
  onFieldChange,
  onArchivoChange,
  onAgregarCaso,
  onQuitarCaso,
  onAgregarFaq,
  onQuitarFaq,
  scrollContainerRef,
}: VortexPageProps) {
  const proteccionRef = useProteccionBasica();

  const coloresPersonalizados = derivarPaletaVortex(config.apariencia)
  // Páginas publicadas antes de esta feature no tienen `secciones` guardado
  // todavía — sin el campo, cada bloque se sigue mostrando (default true).
  const secciones = config.secciones
  const mostrar = (clave: keyof NonNullable<VortexConfig['secciones']>) => secciones?.[clave] !== false

  return (
    <EditableProvider
      value={{
        editable,
        onChange: onFieldChange ?? (() => {}),
        onArchivoChange: onArchivoChange ?? (() => {}),
        onAgregarFaq: onAgregarFaq ?? (() => {}),
        onQuitarFaq: onQuitarFaq ?? (() => {}),
        onAgregarContactoBullet: onAgregarCaso ?? (() => {}),
        onQuitarContactoBullet: onQuitarCaso ?? (() => {}),
      }}
    >
      <main className="relative bg-[var(--v-bg)]" ref={proteccionRef} style={coloresPersonalizados}>
        <Header config={config} />
        <ScrollProgress containerRef={scrollContainerRef} />
        <section id="hero" className="scroll-mt-24">
          <Hero config={config} />
        </section>
        {mostrar('beneficios') && (
          <section id="beneficios" className="scroll-mt-24">
            <Problem config={config} />
          </section>
        )}
        {(mostrar('soluciones') || mostrar('servicios')) && (
          <section id="soluciones" className="scroll-mt-24">
            {mostrar('soluciones') && <Products config={config} />}
            {mostrar('servicios') && <Services config={config} />}
          </section>
        )}
        {mostrar('comoEmpezar') && (
          <section id="cómo-empezar" className="scroll-mt-24">
            <Process config={config} />
          </section>
        )}
        {mostrar('beneficiosExtra') && (
          <section id="beneficios-extra" className="scroll-mt-24">
            <BenefitsExtra config={config} />
          </section>
        )}
        {mostrar('casos') && (
          <section id="casos" className="scroll-mt-24">
            <Testimonials config={config} />
          </section>
        )}
        {mostrar('preguntas') && (
          <section id="preguntas-frecuentes" className="scroll-mt-24">
            <Faq config={config} />
          </section>
        )}
        {mostrar('ctaFinal') && (
          <section id="final-cta" className="scroll-mt-24">
            <FinalCta config={config} />
          </section>
        )}
        <Footer config={config} />
        <WhatsAppButton config={config} />
      </main>
    </EditableProvider>
  );
}
