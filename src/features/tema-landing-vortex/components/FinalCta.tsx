import { motion } from "framer-motion";
import { Fragment } from "react";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { VortexConfig } from "../config";

export default function FinalCta({ config }: { config: VortexConfig }) {
  const { finalCta } = config;
  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);
  const lineas = finalCta.titulo.split("\n");

  return (
    <section className="pt-[40px] pb-[100px] px-[16px] sm:px-[40px]" style={{ position: "relative" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", borderRadius: "32px", padding: "1px", background: "linear-gradient(120deg, color-mix(in srgb, var(--v-accent) 60%, transparent), rgba(124,58,237,.6))" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(120deg, #0c0c1c, #10082a, #0a1a16, #10082a, #0c0c1c)",
            backgroundSize: "300% 300%",
            animation: "ctaBgShift 18s ease-in-out infinite",
            borderRadius: "31px",
            padding: "clamp(48px, 6vw, 80px) clamp(24px, 4vw, 40px)",
            textAlign: "center",
          }}
        >
          <div style={{ position: "absolute", top: "-100px", left: "50%", width: "500px", height: "300px", background: "radial-gradient(circle, rgba(124,58,237,.45), transparent 70%)", filter: "blur(55px)", pointerEvents: "none", animation: "ctaAuraA 16s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "-60px", left: "50%", width: "460px", height: "300px", background: "radial-gradient(circle, color-mix(in srgb, var(--v-accent) 32%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none", animation: "ctaAuraB 19s ease-in-out infinite" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ margin: "0 0 22px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.08", color: "var(--v-text)" }}
            >
              {lineas.map((linea, i) => (
                <Fragment key={i}>
                  {textoConEnfasis(linea)}
                  {i < lineas.length - 1 && <br />}
                </Fragment>
              ))}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              style={{ margin: "0 auto 36px", maxWidth: "540px", fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: "1.6", color: "var(--v-text)" }}
            >
              {finalCta.descripcion}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
              <button
                type="button"
                className="gbtn"
                style={{ padding: "17px 38px", borderRadius: "999px", border: "none", cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "17px", fontWeight: 700, whiteSpace: "nowrap" }}
                onClick={() => window.open(waLink, "_blank")}
              >
                {finalCta.ctaLabel}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
