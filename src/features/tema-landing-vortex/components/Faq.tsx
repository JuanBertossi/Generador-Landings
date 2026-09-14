import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { VortexConfig } from "../config";

export default function Faq({ config }: { config: VortexConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { faq } = config;
  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);

  return (
    <section className="pt-[48px] sm:pt-[90px] pb-[90px] px-[40px]" style={{ position: "relative", background: "var(--v-bg)" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--v-accent)" }}>
              {faq.eyebrow}
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}>
            {textoConEnfasis(faq.titulo)}
          </motion.h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`faq-item${isOpen ? " faq-open" : ""}`}
                style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--v-glass) 50%, transparent), color-mix(in srgb, var(--v-bg-sunken) 50%, transparent))", backdropFilter: "blur(6px)", border: "1px solid rgba(153,102,255,.2)", borderRadius: "24px", overflow: "hidden", transition: "border-color .3s ease" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "22px 26px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--v-text)", transition: "color .3s ease" }}
                >
                  {item.pregunta}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 26px 22px", fontSize: "15px", lineHeight: "1.65", color: "color-mix(in srgb, var(--v-text) 62%, transparent)" }}>
                        {item.respuesta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            type="button"
            className="gbtn inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
            style={{ padding: "15px 32px", borderRadius: "999px", border: "none", cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 700 }}
            onClick={() => window.open(waLink, "_blank")}
          >
            <span className="whitespace-nowrap">{faq.ctaPregunta}</span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              {faq.ctaLabel}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, animation: "arrowSlide 1.5s ease-in-out infinite" }}>
                <path d="M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z" />
              </svg>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
