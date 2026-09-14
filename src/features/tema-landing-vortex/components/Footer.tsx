import { motion } from "framer-motion";
import type { VortexConfig } from "../config";
import { useEditable } from "@/shared/components/EditableContext";
import { EditableText } from "@/shared/components/EditableText";
import { EditableImagen } from "@/shared/components/EditableImagen";

export default function Footer({ config }: { config: VortexConfig }) {
  const { identidad, navLinks, footer } = config;
  const { editable } = useEditable();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="pt-[48px] sm:pt-[100px] pb-[36px] px-[24px] sm:px-[clamp(24px,5vw,48px)]"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--v-text) 7%, transparent)", background: "var(--v-bg-sunken)" }}
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-[1.7fr_1fr_1fr] gap-10 mb-11 sm:mb-24"
        style={{ maxWidth: "1180px", marginLeft: "auto", marginRight: "auto" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "24px", marginBottom: "24px" }}>
            {(identidad.logoUrl || editable) ? (
              <EditableImagen
                path="identidad.logoUrl"
                src={identidad.logoUrl}
                alt={identidad.nombreEmpresa}
                style={{ height: "48px", width: "auto", display: "block" }}
              />
            ) : (
              <img
                src="/assets/vortex/brand/isotipo-blanco.svg"
                alt={identidad.nombreEmpresa || "Vortex"}
                style={{ height: "48px", width: "auto", display: "block" }}
              />
            )}
          </div>
          <EditableText
            path="footer.descripcion"
            value={footer.descripcion}
            as="p"
            multiline
            style={{ margin: 0, maxWidth: "380px", fontSize: "15px", lineHeight: "1.7", color: "color-mix(in srgb, var(--v-text) 50%, transparent)" }}
          />
        </div>

        <div>
          <EditableText
            path="footer.tituloNavegacion"
            value={footer.tituloNavegacion}
            as="div"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--v-text)", marginBottom: "22px" }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-[18px]">
            {navLinks.map((item, index) => (
              <motion.a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                style={{ textDecoration: "none", color: "color-mix(in srgb, var(--v-text) 60%, transparent)", fontSize: "15px", transition: "color .2s, text-shadow .2s", cursor: "pointer" }}
                whileHover={{ color: "var(--v-accent)", textShadow: "0 0 14px color-mix(in srgb, var(--v-accent) 75%, transparent)" }}
              >
                <span onClick={(e) => editable && e.stopPropagation()}>
                  <EditableText path={`navLinks.${index}.label`} value={item.label} as="span" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <EditableText
            path="footer.tituloContacto"
            value={footer.tituloContacto}
            as="div"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--v-text)", marginBottom: "22px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {(footer.contacto.email || editable) && (
              <a
                href={`mailto:${footer.contacto.email}`}
                onClick={(e) => { if (editable) e.preventDefault(); }}
                style={{ display: "flex", alignItems: "center", gap: "13px", textDecoration: "none", color: "color-mix(in srgb, var(--v-text) 60%, transparent)", fontSize: "15px", transition: "color .2s, text-shadow .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--v-accent)"; e.currentTarget.style.textShadow = "0 0 14px color-mix(in srgb, var(--v-accent) 75%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "color-mix(in srgb, var(--v-text) 60%, transparent)"; e.currentTarget.style.textShadow = "none"; }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--v-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <EditableText path="footer.contacto.email" value={footer.contacto.email} as="span" />
              </a>
            )}

            {(footer.contacto.whatsappNumero || editable) && (
              <a
                href={`https://wa.me/${footer.contacto.whatsappNumero}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (editable) e.preventDefault(); }}
                style={{ display: "flex", alignItems: "center", gap: "13px", textDecoration: "none", color: "color-mix(in srgb, var(--v-text) 60%, transparent)", fontSize: "15px", transition: "color .2s, text-shadow .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--v-accent)"; e.currentTarget.style.textShadow = "0 0 14px color-mix(in srgb, var(--v-accent) 75%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "color-mix(in srgb, var(--v-text) 60%, transparent)"; e.currentTarget.style.textShadow = "none"; }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--v-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <EditableText path="footer.contacto.whatsappTexto" value={footer.contacto.whatsappTexto} as="span" />
              </a>
            )}

            {(footer.contacto.direccion || editable) && (
              <div style={{ display: "flex", alignItems: "center", gap: "13px", color: "color-mix(in srgb, var(--v-text) 60%, transparent)", fontSize: "15px" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--v-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <EditableText path="footer.contacto.direccion" value={footer.contacto.direccion} as="span" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:mx-[clamp(-24px,-5vw,-48px)] sm:border-t sm:border-white/[.08]">
        <div className="sm:px-[clamp(24px,5vw,48px)]" style={{ maxWidth: "1180px", margin: "0 auto", paddingTop: "26px" }}>
          <EditableText
            path="footer.copyrightTexto"
            value={footer.copyrightTexto}
            as="span"
            style={{ fontSize: "13.5px", color: "color-mix(in srgb, var(--v-text) 40%, transparent)" }}
          />
        </div>
      </div>
    </footer>
  );
}
