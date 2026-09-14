import { motion } from "framer-motion";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import { getIcono } from "../lib/iconos";
import type { VortexConfig } from "../config";
import { useEditable } from "@/shared/components/EditableContext";
import { EditableText } from "@/shared/components/EditableText";

export default function Problem({ config }: { config: VortexConfig }) {
  const { problem } = config;
  const { editable } = useEditable();
  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);

  return (
    <section style={{ position: "relative", padding: "96px 40px", background: "var(--v-bg)" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "16px" }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#c9b6ff" }}>
              <EditableText
                path="problem.eyebrow"
                value={problem.eyebrow}
                as="span"
                style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#c9b6ff" }}
              />
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              margin: "0 0 14px",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-.02em",
              lineHeight: "1.1",
              color: "var(--v-text)",
            }}
          >
            <EditableText
              path="problem.titulo"
              value={problem.titulo}
              as="h2"
              multiline
              render={textoConEnfasis}
              style={{
                margin: "0 0 14px",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(32px, 5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-.02em",
                lineHeight: "1.1",
                color: "var(--v-text)",
              }}
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              margin: "0 auto",
              maxWidth: "720px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(15px, 1.2vw, 17px)",
              lineHeight: "1.7",
              color: "var(--v-text)",
            }}
          >
            <EditableText
              path="problem.descripcion"
              value={problem.descripcion}
              as="p"
              multiline
              style={{
                margin: "0 auto",
                maxWidth: "720px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: "1.7",
                color: "var(--v-text)",
              }}
            />
          </motion.p>
        </div>

        <div
          className="hidden sm:grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}
        >
          {problem.items.map((feature, index) => {
            const Icono = getIcono(feature.icono);
            const color = index % 2 === 0 ? "var(--v-accent)" : "#a78bfa";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bcard"
                style={{
                  ["--ic" as string]: color,
                  borderRadius: "22px",
                  padding: "1px",
                  background: `linear-gradient(160deg, ${color}66, rgba(124,58,237,.2))`,
                  cursor: "pointer",
                }}
              >
                <div style={{ background: "linear-gradient(180deg, var(--v-card-1), var(--v-card-2))", borderRadius: "21px", padding: "34px", height: "100%", boxSizing: "border-box" }}>
                  <div
                    className="bicon"
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background: `${color}22`,
                      border: `1px solid ${color}55`,
                      color,
                      marginBottom: "22px",
                    }}
                  >
                    <Icono size={26} />
                  </div>
                  <EditableText
                    path={`problem.items.${index}.titulo`}
                    value={feature.titulo}
                    as="h3"
                    style={{ margin: "0 0 12px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}
                  />
                  <EditableText
                    path={`problem.items.${index}.descripcion`}
                    value={feature.descripcion}
                    as="p"
                    multiline
                    style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="sm:hidden overflow-x-auto scrollbar-hide mb-12" style={{ marginLeft: "-40px", marginRight: "-40px", paddingLeft: "24px" }}>
          <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
            {problem.items.map((feature, index) => {
              const Icono = getIcono(feature.icono);
              const color = index % 2 === 0 ? "var(--v-accent)" : "#a78bfa";
              return (
                <div
                  key={index}
                  style={{
                    width: "calc(100vw - 60px)",
                    flexShrink: 0,
                    borderRadius: "22px",
                    padding: "1px",
                    background: `linear-gradient(160deg, ${color}66, rgba(124,58,237,.2))`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ background: "linear-gradient(180deg, var(--v-card-1), var(--v-card-2))", borderRadius: "21px", padding: "34px", height: "100%", boxSizing: "border-box" }}>
                    <div style={{ width: "54px", height: "54px", borderRadius: "15px", display: "grid", placeItems: "center", background: `${color}22`, border: `1px solid ${color}55`, color, marginBottom: "22px" }}>
                      <Icono size={26} />
                    </div>
                    <h3 style={{ margin: "0 0 12px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}>
                      <EditableText
                        path={`problem.items.${index}.titulo`}
                        value={feature.titulo}
                        as="h3"
                        style={{ margin: "0 0 12px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}
                      />
                    </h3>
                    <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}>
                      <EditableText
                        path={`problem.items.${index}.descripcion`}
                        value={feature.descripcion}
                        as="p"
                        multiline
                        style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 60%, transparent)" }}
                      />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
            style={{
              padding: "clamp(14px, 1.2vw, 16px) clamp(28px, 2.5vw, 34px)",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(15px, 1.1vw, 17px)",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
            onClick={() => window.open(waLink, "_blank")}
          >
            <span onClick={(e) => editable && e.stopPropagation()}>
              <EditableText path="problem.ctaLabel" value={problem.ctaLabel} as="span" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
