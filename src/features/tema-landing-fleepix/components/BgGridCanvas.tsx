import { useEffect, useRef } from "react";

const SIZE = 12;
const GAP = 2;
const STEP = SIZE + GAP;
const PIXEL = "rgba(217,217,217,0.28)";
const RADIUS_INFLUENCE = 90;
const FORCE = 46;
const CHAOS = 0.55;
const STIFFNESS = 0.09;
const DAMPING = 0.78;
const SETTLE = 0.35;

interface Pixel {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
}

/**
 * Grilla de píxeles con repulsión al cursor, portada 1:1 del canvas del landing original.
 * Es animación de canvas (no fetch de datos), por eso el useEffect es apropiado acá.
 * La sección #demo está al final de la página: el setup (build de la grilla + rAF loop)
 * se difiere hasta que el canvas esté por entrar en viewport, para no competir por main
 * thread con el paint inicial (Hero/LCP).
 */
export function BgGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          cleanup = setupGrid(canvas);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full pointer-events-none [contain:strict] will-change-transform [transform:translateZ(0)]"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
      }}
    />
  );
}
function setupGrid(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;
  // El canvas tiene pointer-events:none (deja pasar clicks al contenido de encima),
  // así que el hover se trackea en el contenedor de la sección, no en el canvas.
  const container = canvas.parentElement;
  if (!container) return undefined;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let pixels: Pixel[] = [];
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  const mouse = { x: -9999, y: -9999, active: false };

  function build() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.ceil(w / STEP) + 1;
    const rows = Math.ceil(h / STEP) + 1;
    pixels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * STEP;
        const oy = r * STEP;
        pixels.push({
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          seed: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx!.clearRect(0, 0, w, h);
    ctx!.fillStyle = PIXEL;
    // fillRect en vez de un path con arcTo por píxel: a RADIUS=1 sobre 12px el
    // redondeo es imperceptible, pero un solo fillRect es ~7x más barato que
    // beginPath+moveTo+4×arcTo+closePath+fill por cada uno de los miles de píxeles.
    for (const p of pixels) {
      ctx!.fillRect(p.x, p.y, SIZE, SIZE);
    }
  }

  let rafId = 0;
  function tick() {
    let anyMoving = false;
    for (const p of pixels) {
      if (mouse.active) {
        const dx = p.x + SIZE / 2 - mouse.x;
        const dy = p.y + SIZE / 2 - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS_INFLUENCE && dist > 0.01) {
          const factor = 1 - dist / RADIUS_INFLUENCE;
          const push = FORCE * factor * factor;
          const angle =
            Math.atan2(dy, dx) +
            (Math.random() - 0.5) * CHAOS +
            Math.sin(p.seed) * CHAOS * 0.5;
          const jitter = 1 + (Math.random() - 0.5) * CHAOS;
          p.vx += Math.cos(angle) * push * jitter;
          p.vy += Math.sin(angle) * push * jitter;
        }
      }
      p.vx += (p.ox - p.x) * STIFFNESS;
      p.vy += (p.oy - p.y) * STIFFNESS;
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;
      if (
        !mouse.active ||
        Math.hypot(p.x - mouse.x, p.y - mouse.y) > RADIUS_INFLUENCE
      ) {
        if (
          Math.abs(p.x - p.ox) < SETTLE &&
          Math.abs(p.y - p.oy) < SETTLE &&
          Math.abs(p.vx) < SETTLE &&
          Math.abs(p.vy) < SETTLE
        ) {
          p.x = p.ox;
          p.y = p.oy;
          p.vx = 0;
          p.vy = 0;
        } else {
          anyMoving = true;
        }
      } else {
        anyMoving = true;
      }
    }
    draw();
    // Pausa el loop cuando la grilla está en reposo y no hay puntero activo, en vez
    // de animar a 60fps para siempre. Se retoma en el próximo mousemove/touchmove.
    rafId = mouse.active || anyMoving ? requestAnimationFrame(tick) : 0;
  }

  // mouse.active se auto-expira si no llega un mousemove/touchmove nuevo dentro de
  // este plazo, en vez de depender solo de mouseleave (poco confiable durante scroll).
  const HOVER_TIMEOUT = 150;
  let hoverTO: ReturnType<typeof setTimeout>;
  const armHover = () => {
    mouse.active = true;
    if (!rafId && !reduceMotion) rafId = requestAnimationFrame(tick);
    clearTimeout(hoverTO);
    hoverTO = setTimeout(() => {
      mouse.active = false;
    }, HOVER_TIMEOUT);
  };

  const onMouseMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    armHover();
  };
  const onMouseLeave = () => {
    clearTimeout(hoverTO);
    mouse.active = false;
  };
  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) {
      const r = canvas.getBoundingClientRect();
      mouse.x = t.clientX - r.left;
      mouse.y = t.clientY - r.top;
      armHover();
    }
  };
  const onTouchEnd = () => {
    clearTimeout(hoverTO);
    mouse.active = false;
  };

  let resizeTO: ReturnType<typeof setTimeout>;
  const doResize = () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      build();
      draw();
    }, 120);
  };

  container.addEventListener("mousemove", onMouseMove as EventListener);
  container.addEventListener("mouseleave", onMouseLeave);
  container.addEventListener("touchmove", onTouchMove as EventListener, {
    passive: true,
  });
  container.addEventListener("touchend", onTouchEnd);
  window.addEventListener("resize", doResize);

  let ro: ResizeObserver | undefined;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(doResize);
    ro.observe(canvas);
  }

  build();
  if (reduceMotion) {
    draw();
  } else {
    rafId = requestAnimationFrame(tick);
  }

  return () => {
    cancelAnimationFrame(rafId);
    clearTimeout(resizeTO);
    clearTimeout(hoverTO);
    container.removeEventListener("mousemove", onMouseMove as EventListener);
    container.removeEventListener("mouseleave", onMouseLeave);
    container.removeEventListener("touchmove", onTouchMove as EventListener);
    container.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("resize", doResize);
    ro?.disconnect();
  };
}
