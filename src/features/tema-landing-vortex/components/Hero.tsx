import { motion } from "framer-motion";
import TunnelBackground from "./TunnelBackground";
import { buildWhatsappUrl } from "../lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { VortexConfig } from "../config";

export default function Hero({ config }: { config: VortexConfig }) {
  const waLink = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje);

  return (
    <section
      className="relative overflow-hidden text-center flex items-start sm:items-center justify-center w-full pt-[80px] sm:pt-[130px] pb-[60px] sm:pb-[140px] px-[24px] sm:px-[40px] h-[68vh] sm:h-[100vh]"
      style={{ minHeight: "520px", maxHeight: "1400px" }}
    >
      {config.hero.fondoTipo === "tunel" && (
        <TunnelBackground className="absolute inset-0 w-full h-full z-0" />
      )}
      {config.hero.fondoTipo === "imagen" && config.hero.fondoUrl && (
        <img
          src={config.hero.fondoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {config.hero.fondoTipo === "video" && config.hero.fondoUrl && (
        <video
          src={config.hero.fondoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--v-bg) 78%, transparent), color-mix(in srgb, var(--v-bg) 58%, transparent) 45%, color-mix(in srgb, var(--v-bg) 92%, transparent))",
        }}
      />

      <div className="relative z-2 max-w-[940px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-[9px] px-4 py-[7px] rounded-full border border-[color-mix(in srgb, var(--v-text) 14%, transparent)] mb-7 backdrop-blur-[6px] whitespace-nowrap"
          style={{ background: "color-mix(in srgb, var(--v-text) 6%, transparent)" }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: "var(--v-accent)", boxShadow: "0 0 12px var(--v-accent)" }}
          />
          <span
            className="text-[13px] font-semibold tracking-[.04em]"
            style={{ color: "color-mix(in srgb, var(--v-text) 85%, transparent)" }}
          >
            {config.hero.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-bricolage text-white m-0"
          style={{
            fontSize: "clamp(36px, 5vw, 66px)",
            fontWeight: 700,
            lineHeight: "1.06",
            letterSpacing: "-0.02em",
            marginBottom: "26px",
          }}
        >
          {textoConEnfasis(config.hero.titulo)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-[680px] px-4 sm:px-0"
          style={{
            fontSize: "clamp(16px, 1.2vw, 19px)",
            lineHeight: "1.65",
            color: "var(--v-text)",
            marginBottom: "38px",
          }}
        >
          {config.hero.descripcion}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          type="button"
          className="gbtn inline-flex items-center gap-2 rounded-full border-none cursor-pointer font-bricolage font-bold"
          style={{
            padding: "clamp(14px, 1.2vw, 16px) clamp(28px, 2.5vw, 34px)",
            fontSize: "clamp(15px, 1.1vw, 17px)",
          }}
          onClick={() => window.open(waLink, "_blank")}
        >
          {config.hero.ctaLabel}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ flexShrink: 0, animation: "arrowSlide 1.5s ease-in-out infinite" }}
          >
            <path d="M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z" />
          </svg>
        </motion.button>
      </div>
    </section>
  );
}
