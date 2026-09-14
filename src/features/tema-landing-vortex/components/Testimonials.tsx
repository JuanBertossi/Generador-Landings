import { motion } from "framer-motion";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { VortexConfig } from "../config";

const CARD_GRADIENT = "linear-gradient(160deg, rgba(167,139,250,.4), rgba(167,139,250,.18))";

export default function Testimonials({ config }: { config: VortexConfig }) {
  const { testimonials } = config;
  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);

  return (
    <section style={{ position: "relative", padding: "90px 40px", background: "var(--v-bg)" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "54px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--v-accent)" }}>
              {testimonials.eyebrow}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{ margin: "0 0 14px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}
          >
            {textoConEnfasis(testimonials.titulo)}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ margin: "0 auto", maxWidth: "720px", fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: "1.7", color: "color-mix(in srgb, var(--v-text) 70%, transparent)" }}
          >
            {testimonials.descripcion}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "24px", marginBottom: "48px" }}>
          {testimonials.items.map((c, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bcard"
              style={{ ["--ic" as string]: "#a78bfa", borderRadius: "22px", padding: "1px", background: CARD_GRADIENT, cursor: "pointer" }}
            >
              <div
                style={{ background: "linear-gradient(180deg, var(--v-card-1), var(--v-card-2))", borderRadius: "21px", padding: "30px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", gap: "18px" }}
              >
                {c.logoUrl ? (
                  <img
                    src={c.logoUrl}
                    alt=""
                    style={{ height: "28px", maxWidth: "140px", objectFit: "contain" }}
                  />
                ) : (
                  <div
                    style={{
                      height: "28px",
                      minWidth: "90px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 10px",
                      fontSize: "10px",
                      letterSpacing: ".04em",
                      color: "color-mix(in srgb, var(--v-text) 40%, transparent)",
                      border: "1px dashed color-mix(in srgb, var(--v-text) 25%, transparent)",
                      borderRadius: "6px",
                    }}
                  >
                    Tu logo acá
                  </div>
                )}

                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#a78bfa",
                    background: "rgba(167,139,250,.12)",
                    border: "1px solid rgba(167,139,250,.28)",
                    borderRadius: "999px",
                    padding: "5px 12px",
                  }}
                >
                  {c.tag}
                </span>

                <div style={{ width: "100%", height: "1px", background: "color-mix(in srgb, var(--v-text) 9%, transparent)" }} />

                <h3 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--v-text)", lineHeight: "1.25" }}>
                  {c.titulo}
                </h3>

                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 55%, transparent)" }}>
                  {c.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          <button
            type="button"
            className="gbtn"
            style={{ padding: "15px 32px", borderRadius: "999px", border: "none", cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 700 }}
            onClick={() => window.open(waLink, "_blank")}
          >
            {testimonials.ctaLabel}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
