import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { buildWhatsappUrl } from "../lib/whatsapp";
import type { VortexConfig } from "../config";

const ARROW_PATH =
  "M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z";

const GRADIENTES = [
  { normal: "linear-gradient(120deg, color-mix(in srgb, var(--v-accent) 50%, transparent), rgba(124,58,237,.1) 50%, rgba(124,58,237,.42))", hover: "linear-gradient(120deg, color-mix(in srgb, var(--v-accent) 90%, transparent), rgba(124,58,237,.18) 50%, rgba(124,58,237,.85))" },
  { normal: "linear-gradient(120deg, rgba(124,58,237,.55), color-mix(in srgb, var(--v-accent) 10%, transparent) 50%, color-mix(in srgb, var(--v-accent) 42%, transparent))", hover: "linear-gradient(120deg, rgba(124,58,237,.95), color-mix(in srgb, var(--v-accent) 18%, transparent) 50%, color-mix(in srgb, var(--v-accent) 85%, transparent))" },
];
const BADGE_COLORES = ["var(--v-accent)", "#c9b6ff"];

export default function Services({ config }: { config: VortexConfig }) {
  const [slide, setSlide] = useState(0);
  const { services } = config;
  const totalSlides = services.items.length;
  const touchStartX = useRef(0);
  const openWA = () => window.open(buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje), "_blank");

  const nextSlide = () => setSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <section
      style={{ position: "relative", overflow: "hidden", background: "var(--v-bg)", fontFamily: "'Inter', sans-serif" }}
      className="pb-[92px] px-[24px] sm:px-[40px]"
    >
      <div style={{ position: "absolute", top: "-130px", left: "-110px", width: "480px", height: "480px", borderRadius: "50%", background: "var(--v-bg)", filter: "blur(60px)", animation: "vortexFloatA 15s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "0px", right: "-130px", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,.16), transparent 70%)", filter: "blur(60px)", animation: "vortexFloatB 17s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(color-mix(in srgb, var(--v-text) 4%, transparent) 1px, transparent 1px)", backgroundSize: "34px 34px", WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, #000, transparent 80%)", maskImage: "radial-gradient(ellipse at 50% 20%, #000, transparent 80%)", zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1120px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ margin: "0 0 32px", textAlign: "center" }}>
          <h3 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 30px)", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}>
            {services.eyebrow}
          </h3>
          <p style={{ margin: "10px 0 0", fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "color-mix(in srgb, var(--v-text) 55%, transparent)" }}>
            {services.descripcion}
          </p>
        </motion.div>

        <div style={{ position: "relative" }}>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{ display: "flex", transition: "transform .55s cubic-bezier(.2,.7,.2,1)", transform: `translateX(-${slide * 100}%)` }}
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (diff > 50) nextSlide();
                if (diff < -50) prevSlide();
              }}
            >
              {services.items.map((servicio, index) => {
                const gradiente = GRADIENTES[index % GRADIENTES.length];
                const badgeColor = BADGE_COLORES[index % BADGE_COLORES.length];
                return (
                  <div key={index} style={{ flex: "0 0 100%", minWidth: 0, boxSizing: "border-box", padding: "4px" }}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      style={{ position: "relative", borderRadius: "26px", padding: "1px", background: gradiente.normal, transition: "transform .4s cubic-bezier(.2,.7,.2,1), box-shadow .4s", cursor: "pointer" }}
                      whileHover={{ boxShadow: "0 32px 72px -28px color-mix(in srgb, var(--v-accent) 40%, transparent)", background: gradiente.hover, transition: { duration: 0.4 } }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] items-center gap-4 sm:gap-[40px]" style={{ background: "linear-gradient(135deg, var(--v-card-1), var(--v-card-2))", borderRadius: "25px", padding: "clamp(22px, 3vw, 38px)" }}>
                        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: badgeColor }}>
                            Servicio 0{index + 1}
                          </span>
                          <h3 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, lineHeight: "1.15", letterSpacing: "-.01em", color: "var(--v-text)" }}>
                            {servicio.titulo}
                          </h3>
                          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "clamp(14px, 1.2vw, 16px)", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 62%, transparent)" }}>
                            <span style={{ color: "var(--v-accent)", fontWeight: 600 }}>{servicio.subtitulo}</span> {servicio.descripcion}
                          </p>
                          <div className="hidden sm:block">
                            <button type="button" className="prod-btn" onClick={openWA}>
                              {servicio.ctaLabel}
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, animation: "arrowSlide 1.5s ease-in-out infinite" }}>
                                <path d={ARROW_PATH} />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div>
                          <div style={{ position: "relative", height: "clamp(220px, 55vw, 430px)", borderRadius: "18px", overflow: "hidden", border: "1px solid color-mix(in srgb, var(--v-text) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--v-card-1), var(--v-card-2))" }}>
                            <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(.5) contrast(1.05) brightness(.78)" }}>
                              <source src={servicio.video} type="video/webm" />
                            </video>
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, color-mix(in srgb, var(--v-accent) 20%, transparent), transparent 45%, rgba(124,58,237,.3))", mixBlendMode: "overlay" }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--v-bg) 50%, transparent))" }} />
                          </div>
                          <div className="sm:hidden" style={{ marginTop: "12px" }}>
                            <button type="button" className="prod-btn" onClick={openWA}>
                              {servicio.ctaLabel}
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, animation: "arrowSlide 1.5s ease-in-out infinite" }}>
                                <path d={ARROW_PATH} />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="hidden sm:grid"
            style={{ position: "absolute", left: "-56px", top: "50%", transform: "translateY(-50%)", zIndex: 5, width: "48px", height: "48px", borderRadius: "50%", border: "1px solid color-mix(in srgb, var(--v-text) 14%, transparent)", background: "color-mix(in srgb, var(--v-bg) 60%, transparent)", backdropFilter: "blur(8px)", color: "var(--v-text)", cursor: "pointer", placeItems: "center", transition: "all .3s ease" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="hidden sm:grid"
            style={{ position: "absolute", right: "-56px", top: "50%", transform: "translateY(-50%)", zIndex: 5, width: "48px", height: "48px", borderRadius: "50%", border: "1px solid color-mix(in srgb, var(--v-text) 14%, transparent)", background: "color-mix(in srgb, var(--v-bg) 60%, transparent)", backdropFilter: "blur(8px)", color: "var(--v-text)", cursor: "pointer", placeItems: "center", transition: "all .3s ease" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "26px" }}>
          {services.items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSlide(index)}
              style={{ borderRadius: "999px", border: "none", cursor: "pointer", padding: 0, height: "8px", transition: "all .3s ease", width: slide === index ? "28px" : "8px", background: slide === index ? "linear-gradient(90deg, var(--v-accent), #7c3aed)" : "color-mix(in srgb, var(--v-text) 22%, transparent)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
