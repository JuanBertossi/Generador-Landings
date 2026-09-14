
import { motion, useScroll } from "framer-motion"
import type { RefObject } from "react"

type ScrollProgressProps = {
  /** Contenedor que realmente scrollea (el panel de preview del editor no
   * scrollea la ventana, scrollea un div interno propio) — sin esto,
   * useScroll() trackea el scroll de la ventana y la barra nunca se mueve
   * dentro del editor. En la página publicada (sin este prop) sigue
   * trackeando la ventana normalmente. */
  containerRef?: RefObject<HTMLElement>
}

export default function ScrollProgress({ containerRef }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(containerRef ? { container: containerRef } : undefined)

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9966FF] via-[var(--v-accent)] to-[#0066FF] origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
