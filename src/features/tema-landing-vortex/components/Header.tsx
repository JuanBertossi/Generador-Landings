import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { buildWhatsappUrl } from "../lib/whatsapp";
import type { VortexConfig } from "../config";

function AnimatedBanner({ texto }: { texto: string }) {
  if (!texto) return null;
  return (
    <div className="overflow-hidden whitespace-nowrap py-[7px] relative z-[60] bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#7c3aed]">
      <div className="inline-flex items-center gap-0 animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-[14px] pr-[14px] text-[13px] font-semibold text-white"
          >
            {texto}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Header({ config }: { config: VortexConfig }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const handleMobileNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setTimeout(() => scrollToSection(id), 320);
  };

  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);

  return (
    <>
      <AnimatedBanner texto={config.bannerTexto} />

      <div className="sticky top-0 z-50">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-[18px] sm:px-[48px] py-[18px] border-b border-[rgba(153,102,255,.2)]"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--v-glass) 82%, transparent), color-mix(in srgb, var(--v-bg-sunken) 82%, transparent))",
            backdropFilter: "blur(14px)",
          }}
        >
          <motion.a
            href="#hero"
            onClick={(e) => handleNavClick(e, "hero")}
            aria-label="Ir al inicio"
            className="flex items-center no-underline focus:outline-none cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {config.identidad.logoUrl ? (
              <img
                src={config.identidad.logoUrl}
                alt={config.identidad.nombreEmpresa}
                className="h-[44px] w-auto block"
              />
            ) : (
              <img
                src="/assets/vortex/brand/isotipo-blanco.svg"
                alt={config.identidad.nombreEmpresa || "Vortex"}
                width={41}
                height={48}
                className="h-[38px] w-auto block"
              />
            )}
          </motion.a>

          <div className="hidden md:flex items-center gap-[34px]">
            {config.navLinks.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="nav-link text-[color-mix(in srgb, var(--v-text) 78%, transparent)] text-sm font-medium no-underline cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--v-accent)";
                  e.currentTarget.style.textShadow =
                    "0 0 14px color-mix(in srgb, var(--v-accent) 75%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "color-mix(in srgb, var(--v-text) 78%, transparent)";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="gbtn hidden sm:block px-[22px] py-[9px] rounded-full border-none cursor-pointer font-bricolage text-[14px] font-bold"
            onClick={() => window.open(waLink, "_blank")}
          >
            {config.navCtaLabel}
          </button>

          <button
            type="button"
            className="md:hidden flex items-center justify-center w-[44px] h-[44px] rounded-[12px] bg-transparent cursor-pointer text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </motion.nav>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-b border-[rgba(153,102,255,.2)] shadow-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--v-glass) 97%, transparent), color-mix(in srgb, var(--v-bg-sunken) 97%, transparent))",
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="flex flex-col gap-1 px-6 py-4 pb-6">
                {config.navLinks.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={`#${item.href}`}
                    onClick={(e) => handleMobileNavClick(e, item.href)}
                    className="text-[color-mix(in srgb, var(--v-text) 82%, transparent)] py-[13px] px-[6px] border-b border-[color-mix(in srgb, var(--v-text) 6%, transparent)] last:border-b-0 text-[16px] font-medium no-underline cursor-pointer transition-colors duration-200 hover:text-[var(--v-accent)]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.25 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.button
                  type="button"
                  className="gbtn mt-[14px] w-full py-[14px] rounded-full border-none cursor-pointer font-bricolage text-[15px] font-bold"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.open(waLink, "_blank");
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.25 }}
                >
                  {config.navCtaLabel}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
