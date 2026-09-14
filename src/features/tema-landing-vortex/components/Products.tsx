import type { ReactNode } from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AtencionVentasAnimation from "../animations/AtencionVentas";
import GestionInternaAnimation from "../animations/GestionInterna";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { VortexConfig, VortexProducto } from "../config";

const ARROW_PATH =
  "M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z";

const ArrowIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, animation: "arrowSlide 1.5s ease-in-out infinite" }}>
    <path d={ARROW_PATH} />
  </svg>
);

const ProductButton = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
  <button type="button" className="prod-btn" onClick={onClick}>
    {children}
    <ArrowIcon />
  </button>
);

const Tag = ({ children }: { children: ReactNode }) => (
  <span
    className="flex-1 sm:flex-none justify-center sm:justify-start"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 9px",
      borderRadius: "8px",
      background: "color-mix(in srgb, var(--v-text) 4%, transparent)",
      border: "1px solid color-mix(in srgb, var(--v-text) 8%, transparent)",
      color: "color-mix(in srgb, var(--v-text) 70%, transparent)",
      fontFamily: "'Inter', sans-serif",
      fontSize: "11.5px",
      fontWeight: 500,
    }}
  >
    {children}
  </span>
);

function IconoProducto({ variante }: { variante: "gestion" | "atencion" }) {
  const color = variante === "gestion" ? "#a78bfa" : "var(--v-accent)";
  const bg =
    variante === "gestion"
      ? "linear-gradient(135deg, rgba(124,58,237,.22), color-mix(in srgb, var(--v-accent) 10%, transparent))"
      : "linear-gradient(135deg, color-mix(in srgb, var(--v-accent) 20%, transparent), rgba(124,58,237,.12))";
  const border = variante === "gestion" ? "rgba(124,58,237,.3)" : "color-mix(in srgb, var(--v-accent) 22%, transparent)";
  return (
    <div style={{ width: "54px", height: "54px", borderRadius: "50%", display: "grid", placeItems: "center", background: bg, border: `1px solid ${border}`, color, flexShrink: 0 }}>
      {variante === "gestion" ? (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="8" x="3" y="3" rx="2" />
          <path d="M7 11v4a2 2 0 0 0 2 2h4" />
          <rect width="8" height="8" x="13" y="13" rx="2" />
        </svg>
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="10" x="3" y="11" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" x2="8" y1="16" y2="16" />
          <line x1="16" x2="16" y1="16" y2="16" />
        </svg>
      )}
    </div>
  );
}

function TarjetaProducto({
  producto,
  variante,
  activa,
  onCtaClick,
  gradiente,
}: {
  producto: VortexProducto;
  variante: "gestion" | "atencion";
  activa: boolean;
  onCtaClick: () => void;
  gradiente: string;
}) {
  return (
    <div
      className={`${variante === "gestion" ? "prod-card-1" : "prod-card-2"} ${activa ? "prod-card-active" : "prod-card-inactive"}`}
      style={{ gridRow: "1", gridColumn: "1", position: "relative", borderRadius: "26px", padding: "1px", background: gradiente, cursor: "pointer" }}
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-[1fr_1.18fr] items-start sm:items-center gap-4 sm:gap-8"
        style={{ background: "linear-gradient(135deg, var(--v-card-1), var(--v-card-2))", borderRadius: "25px", padding: "clamp(22px, 3vw, 38px)", height: "100%", boxSizing: "border-box" }}
      >
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <IconoProducto variante={variante} />
          </div>
          <h3 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, lineHeight: "1.15", letterSpacing: "-.01em", color: "var(--v-text)" }}>
            {producto.titulo}
          </h3>
          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "clamp(14px, 1.2vw, 16px)", lineHeight: "1.6", color: "color-mix(in srgb, var(--v-text) 62%, transparent)" }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, color: "var(--v-accent)" }}>
              {producto.destacado}
            </span>{" "}
            {producto.descripcion}
          </p>
          <div className="justify-between sm:justify-start" style={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            {producto.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className="hidden sm:block">
            <ProductButton onClick={onCtaClick}>{producto.ctaLabel}</ProductButton>
          </div>
        </div>
        <div>
          <div style={{ height: "430px" }}>
            {variante === "gestion" ? (
              <GestionInternaAnimation key={activa ? "active" : "idle"} />
            ) : (
              <AtencionVentasAnimation key={activa ? "active" : "idle"} />
            )}
          </div>
          <div className="sm:hidden">
            <ProductButton onClick={onCtaClick}>{producto.ctaLabel}</ProductButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products({ config }: { config: VortexConfig }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(0);
  const { products } = config;
  const openWA = () => window.open(buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje), "_blank");

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(1200px 620px at 50% -12%, rgba(124,58,237,.16), transparent 60%), var(--v-bg)",
        padding: "74px 24px 60px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ position: "absolute", top: "-130px", left: "-110px", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--v-accent) 18%, transparent), transparent 70%)", filter: "blur(60px)", animation: "vortexFloatA 15s ease-in-out infinite", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(color-mix(in srgb, var(--v-text) 5%, transparent) 1px, transparent 1px)", backgroundSize: "34px 34px", WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, #000, transparent 80%)", maskImage: "radial-gradient(ellipse at 50% 20%, #000, transparent 80%)", zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1120px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--v-accent)" }}>
            {products.eyebrow}
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 50px" }}>
          <h2 style={{ margin: "0 0 18px", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: "1.08", color: "var(--v-text)" }}>
            {textoConEnfasis(products.titulo)}
          </h2>
          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: "1.7", color: "var(--v-text)" }}>
            {products.descripcion}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} style={{ margin: "8px 0 32px", textAlign: "center" }}>
          <h3 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 5vw, 30px)", fontWeight: 700, letterSpacing: "-.01em", color: "var(--v-text)" }}>
            {products.subtitulo}
          </h3>
          <p style={{ margin: "10px 0 0", fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "color-mix(in srgb, var(--v-text) 55%, transparent)" }}>
            {products.subdescripcion}
          </p>
        </motion.div>

        <div
          className="mb-0 sm:mb-[84px]"
          style={{ display: "flex", flexDirection: "column", gap: "28px" }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (diff > 50) setActiveSlide(1);
            if (diff < -50) setActiveSlide(0);
          }}
        >
          <div className="grid sm:contents">
            <TarjetaProducto
              producto={products.producto1}
              variante="gestion"
              activa={activeSlide === 0}
              onCtaClick={openWA}
              gradiente="linear-gradient(120deg, rgba(124,58,237,.55), color-mix(in srgb, var(--v-accent) 8%, transparent) 50%, color-mix(in srgb, var(--v-accent) 42%, transparent))"
            />
            <TarjetaProducto
              producto={products.producto2}
              variante="atencion"
              activa={activeSlide === 1}
              onCtaClick={openWA}
              gradiente="linear-gradient(120deg, color-mix(in srgb, var(--v-accent) 50%, transparent), rgba(124,58,237,.08) 50%, rgba(124,58,237,.42))"
            />
          </div>

          <div className="sm:hidden flex justify-center gap-2" style={{ marginBottom: "16px" }}>
            {[0, 1].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                style={{ width: activeSlide === i ? "20px" : "8px", height: "8px", borderRadius: "4px", padding: 0, border: "none", cursor: "pointer", transition: "all .3s ease", background: activeSlide === i ? "var(--v-accent)" : "color-mix(in srgb, var(--v-text) 25%, transparent)" }}
              />
            ))}
          </div>

          <AnimatePresence>
            {activeSlide === 1 && (
              <motion.div className="sm:hidden" style={{ width: "100%", marginTop: "-12px" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                <Conector />
                <div className="overflow-x-auto scrollbar-hide" style={{ width: "100vw", marginLeft: "50%", transform: "translateX(-50%)", paddingLeft: "16px", paddingRight: "16px", marginTop: "14px" }} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: "12px", width: "max-content" }}>
                    {products.agentes.map((agente, i) => (
                      <TarjetaAgente key={i} agente={agente} index={i} mobile />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden sm:flex sm:flex-col sm:items-center" style={{ marginTop: "-12px" }}>
            <Conector />
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3" style={{ width: "100%", boxSizing: "border-box", marginTop: "14px", gap: "16px" }}>
              {products.agentes.map((agente, i) => (
                <TarjetaAgente key={i} agente={agente} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Conector() {
  return (
    <svg width="20" height="46" viewBox="0 0 20 46" fill="none" style={{ display: "block" }}>
      <line x1="10" y1="0" x2="10" y2="33" stroke="var(--v-accent)" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 30l6 6 6-6" stroke="var(--v-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AGENTE_COLORES = ["var(--v-accent)", "#a78bfa", "#38bdf8"];
const AGENTE_ICONOS = [
  <svg key="a" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z" /><path d="M12 8v3" /><path d="M12 14h.01" /></svg>,
  <svg key="b" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 9h8" /><path d="M8 13h4.5" /><path d="M12.5 21l-3 -3h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" /><path d="M19 22v.01" /><path d="M19 19a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .782" /></svg>,
  <svg key="c" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M15 19l2 2l4 -4" /></svg>,
];

function TarjetaAgente({ agente, index, mobile = false }: { agente: { titulo: string; descripcion: string }; index: number; mobile?: boolean }) {
  const idx = index % 3;
  const color = AGENTE_COLORES[idx];
  return (
    <div
      style={{
        width: mobile ? "calc(100vw - 56px)" : undefined,
        flexShrink: mobile ? 0 : undefined,
        background: "var(--v-card-3)",
        border: "1px solid var(--v-card-3-border)",
        borderRadius: "16px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "13px",
      }}
    >
      <div style={{ width: "42px", height: "42px", borderRadius: "50%", display: "grid", placeItems: "center", background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`, color }}>
        {AGENTE_ICONOS[idx]}
      </div>
      <h4 style={{ margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--v-text)", lineHeight: "1.2" }}>
        {agente.titulo}
      </h4>
      <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: "1.55", color: "color-mix(in srgb, var(--v-text) 55%, transparent)" }}>
        {agente.descripcion}
      </p>
    </div>
  );
}
