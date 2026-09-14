import { useState } from "react";
import { motion } from "framer-motion";
import { buildWhatsappUrl } from "../lib/whatsapp";
import type { VortexConfig } from "../config";

export default function WhatsAppButton({ config }: { config: VortexConfig }) {
  const [isHovered, setIsHovered] = useState(false);

  const openWhatsApp = () => {
    window.open(buildWhatsappUrl(config.whatsappNumero, config.whatsappMensaje), "_blank");
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.8 }}
        animate={isHovered ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 20, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden sm:flex mr-4 px-4 py-2 rounded-full shadow-lg items-center"
        style={{ background: "#fff", border: "1.5px solid #E5E7EB" }}
      >
        <span
          className="text-base font-semibold"
          style={{ color: "#0F3E57", letterSpacing: "0.01em" }}
        >
          {config.whatsappTooltip}
        </span>
      </motion.div>

      <motion.button
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-300 group relative"
        style={{ background: "#fff", border: "1.5px solid #E5E7EB" }}
        whileHover={{
          boxShadow: "0 0 30px #E5E7EB, 0 0 60px #E5E7EB",
          filter: "brightness(1.1)",
          scale: 1.05,
        }}
        onClick={openWhatsApp}
        aria-label="Contactar por WhatsApp"
      >
        <img
          src="/assets/vortex/ui/Chatbot azul.svg"
          alt="Chatbot"
          width={32}
          height={32}
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
      </motion.button>
    </motion.div>
  );
}
