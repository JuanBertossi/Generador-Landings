import { motion } from "framer-motion";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { VortexConfig } from "../config";
import { EditableText } from "@/shared/components/EditableText";

const SPIN_DURATIONS = ["16s", "18s", "17s", "19s", "15s", "20s"];
const COLOR_A = "var(--v-accent)";
const COLOR_B = "#a78bfa";

export default function BenefitsExtra({ config }: { config: VortexConfig }) {
  const { benefitsExtra } = config;

  return (
    <section
      style={{ position: "relative", background: "var(--v-bg)" }}
      className="pt-[24px] sm:pt-[96px] pb-[32px] sm:pb-[96px] px-[40px]"
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "58px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ margin: "0 0 8px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}
          >
            <EditableText
              path="benefitsExtra.tituloLinea1"
              value={benefitsExtra.tituloLinea1}
              as="h2"
              style={{ margin: "0 0 8px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}
            />
          </motion.h2>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}
          >
            <EditableText
              path="benefitsExtra.tituloLinea2"
              value={benefitsExtra.tituloLinea2}
              as="h2"
              multiline
              render={textoConEnfasis}
              style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}
            />
          </motion.h2>
        </div>

        <div className="hidden sm:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {benefitsExtra.items.map((benefit, index) => {
            const color = index % 2 === 0 ? COLOR_A : COLOR_B;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--v-glass) 50%, transparent), color-mix(in srgb, var(--v-bg-sunken) 50%, transparent))", backdropFilter: "blur(6px)", border: "1px solid rgba(153,102,255,.2)", borderRadius: "24px", padding: "34px", transition: "transform .35s ease, border-color .35s ease, box-shadow .35s ease", cursor: "pointer" }}
                whileHover={{ borderColor: "color-mix(in srgb, var(--v-accent) 40%, transparent)", boxShadow: "0 28px 60px -26px color-mix(in srgb, var(--v-accent) 35%, transparent)", transition: { duration: 0.35, ease: "easeOut" } }}
              >
                <div style={{ position: "relative", width: "104px", height: "104px", marginBottom: "22px", display: "grid", placeItems: "center" }}>
                  <svg width="104" height="104" viewBox="0 0 104 104" style={{ position: "absolute", inset: 0, animation: `vSpin ${SPIN_DURATIONS[index % SPIN_DURATIONS.length]} linear infinite` }}>
                    <circle cx="52" cy="52" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="72 230" strokeLinecap="round" opacity="0.7" />
                  </svg>
                  <EditableText
                    path={`benefitsExtra.items.${index}.valor`}
                    value={benefit.valor}
                    as="span"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "28px", fontWeight: 700, color, position: "relative" }}
                  />
                </div>
                <EditableText
                  path={`benefitsExtra.items.${index}.titulo`}
                  value={benefit.titulo}
                  as="h3"
                  style={{ margin: "0 0 8px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "19px", fontWeight: 700, color: "var(--v-text)" }}
                />
                <EditableText
                  path={`benefitsExtra.items.${index}.subtitulo`}
                  value={benefit.subtitulo}
                  as="p"
                  style={{ margin: 0, fontSize: "14.5px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="sm:hidden overflow-x-auto scrollbar-hide" style={{ marginLeft: "-40px", marginRight: "-40px", paddingLeft: "24px" }}>
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {benefitsExtra.items.map((benefit, index) => {
              const color = index % 2 === 0 ? COLOR_A : COLOR_B;
              return (
                <div
                  key={index}
                  style={{ width: "calc(100vw - 60px)", flexShrink: 0, background: "linear-gradient(135deg, color-mix(in srgb, var(--v-glass) 50%, transparent), color-mix(in srgb, var(--v-bg-sunken) 50%, transparent))", backdropFilter: "blur(6px)", border: "1px solid rgba(153,102,255,.2)", borderRadius: "24px", padding: "34px", cursor: "pointer" }}
                >
                  <div style={{ position: "relative", width: "104px", height: "104px", marginBottom: "22px", display: "grid", placeItems: "center" }}>
                    <svg width="104" height="104" viewBox="0 0 104 104" style={{ position: "absolute", inset: 0, animation: `vSpin ${SPIN_DURATIONS[index % SPIN_DURATIONS.length]} linear infinite` }}>
                      <circle cx="52" cy="52" r="48" fill="none" stroke={color} strokeWidth="2" strokeDasharray="72 230" strokeLinecap="round" opacity="0.7" />
                    </svg>
                    <EditableText
                      path={`benefitsExtra.items.${index}.valor`}
                      value={benefit.valor}
                      as="span"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "28px", fontWeight: 700, color, position: "relative" }}
                    />
                  </div>
                  <EditableText
                    path={`benefitsExtra.items.${index}.titulo`}
                    value={benefit.titulo}
                    as="h3"
                    style={{ margin: "0 0 8px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--v-text)" }}
                  />
                  <EditableText
                    path={`benefitsExtra.items.${index}.subtitulo`}
                    value={benefit.subtitulo}
                    as="p"
                    style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
