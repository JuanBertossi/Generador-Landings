import { motion } from "framer-motion";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import { getIcono } from "../lib/iconos";
import type { VortexConfig } from "../config";
import { useEditable } from "@/shared/components/EditableContext";
import { EditableText } from "@/shared/components/EditableText";

export default function Process({ config }: { config: VortexConfig }) {
  const { process } = config;
  const { editable } = useEditable();
  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);

  return (
    <section style={{ position: "relative", padding: "96px 40px", background: "var(--v-bg)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 500px at 50% 0%, rgba(124,58,237,.1), transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1180px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--v-accent)" }}>
              <EditableText
                path="process.eyebrow"
                value={process.eyebrow}
                as="span"
                style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--v-accent)" }}
              />
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} style={{ margin: "0 0 14px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}>
            <EditableText
              path="process.titulo"
              value={process.titulo}
              as="h2"
              multiline
              render={textoConEnfasis}
              style={{ margin: "0 0 14px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.1", color: "var(--v-text)" }}
            />
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} style={{ margin: "0 auto", maxWidth: "720px", fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: "1.7", color: "var(--v-text)" }}>
            <EditableText
              path="process.descripcion"
              value={process.descripcion}
              as="p"
              multiline
              style={{ margin: "0 auto", maxWidth: "720px", fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: "1.7", color: "var(--v-text)" }}
            />
          </motion.p>
        </div>

        <div className="hidden sm:grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "22px", marginBottom: "48px" }}>
          {process.items.map((step, index) => {
            const Icono = getIcono(step.icono);
            const color = index % 2 === 0 ? "var(--v-accent)" : "#a78bfa";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bcard"
                style={{ ["--ic" as string]: color, position: "relative", borderRadius: "20px", padding: "1px", background: `linear-gradient(160deg, ${color}59, rgba(124,58,237,.2))`, cursor: "pointer" }}
              >
                <div style={{ background: "linear-gradient(180deg, var(--v-card-1), var(--v-card-2))", borderRadius: "19px", padding: "30px", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div className="bicon" style={{ width: "50px", height: "50px", borderRadius: "50%", display: "grid", placeItems: "center", background: `${color}22`, border: `1px solid ${color}55`, color }}>
                      <Icono size={24} />
                    </div>
                    <span className="bnum" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "34px", fontWeight: 700, color: "color-mix(in srgb, var(--v-text) 12%, transparent)", transition: "color .4s ease" }}>
                      {step.numero}
                    </span>
                  </div>
                  <EditableText
                    path={`process.items.${index}.titulo`}
                    value={step.titulo}
                    as="h3"
                    style={{ margin: "0 0 10px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "19px", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}
                  />
                  <EditableText
                    path={`process.items.${index}.descripcion`}
                    value={step.descripcion}
                    as="p"
                    multiline
                    style={{ margin: 0, fontSize: "14.5px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="sm:hidden flex flex-col gap-4 mb-12">
          {process.items.map((step, index) => {
            const Icono = getIcono(step.icono);
            const color = index % 2 === 0 ? "var(--v-accent)" : "#a78bfa";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ position: "relative", borderRadius: "20px", padding: "1px", background: `linear-gradient(160deg, ${color}59, rgba(124,58,237,.2))`, cursor: "pointer" }}
              >
                <div style={{ background: "linear-gradient(180deg, var(--v-card-1), var(--v-card-2))", borderRadius: "19px", padding: "30px", height: "100%", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "14px", display: "grid", placeItems: "center", background: `${color}22`, border: `1px solid ${color}55`, color }}>
                      <Icono size={24} />
                    </div>
                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "34px", fontWeight: 700, color: "color-mix(in srgb, var(--v-text) 12%, transparent)" }}>
                      {step.numero}
                    </span>
                  </div>
                  <EditableText
                    path={`process.items.${index}.titulo`}
                    value={step.titulo}
                    as="h3"
                    style={{ margin: "0 0 10px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "19px", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}
                  />
                  <EditableText
                    path={`process.items.${index}.descripcion`}
                    value={step.descripcion}
                    as="p"
                    multiline
                    style={{ margin: 0, fontSize: "14.5px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} style={{ textAlign: "center" }}>
          <button
            type="button"
            className="gbtn"
            style={{ padding: "15px 32px", borderRadius: "999px", border: "none", cursor: "pointer", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "16px", fontWeight: 700 }}
            onClick={() => window.open(waLink, "_blank")}
          >
            <span onClick={(e) => editable && e.stopPropagation()}>
              <EditableText path="process.ctaLabel" value={process.ctaLabel} as="span" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
