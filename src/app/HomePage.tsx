import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LivePreviewFrame } from "@/shared/components/LivePreviewFrame";
import { PRECIOS, formatoPrecio } from "@/shared/lib/precios";

type Tema = {
  eyebrow: string;
  nombre: string;
  descripcion: string;
  stack: string;
  href: string | null;
  /** src del iframe de vista previa — puede diferir de href (ej: saltar la pantalla de bienvenida) */
  previewSrc?: string;
  crearHref: string | null;
  /** color sólido único del tema — nada de degradés random, una identidad por plantilla */
  color: string;
  precio: number;
};

const TEMAS: Tema[] = [
  {
    eyebrow: "Para eventos",
    nombre: "Invitación digital",
    descripcion:
      "Welcome screen, cuenta regresiva, RSVP por WhatsApp y precio de entrada. Para 15 años, cumpleaños y casamientos.",
    stack: "React + Vite",
    href: "/ejemplos/invitacion",
    previewSrc: "/ejemplos/invitacion?vista=directa",
    crearHref: "/crear/invitacion",
    color: "#e1497a",
    precio: PRECIOS.invitacion,
  },
  {
    eyebrow: "Para negocios",
    nombre: "Landing de producto",
    descripcion:
      "Hero, para quién es, beneficios, funcionalidades, FAQ y formulario de contacto. Para presentar un producto o servicio B2B.",
    stack: "React + Vite",
    href: "/ejemplos/landing-fleepix",
    crearHref: "/crear/landing-fleepix",
    color: "#1e88b8",
    precio: PRECIOS["landing-fleepix"],
  },
  {
    eyebrow: "Para marcas",
    nombre: "Landing premium",
    descripcion:
      "Hero con animaciones, soluciones, servicios, proceso, casos y FAQ. Para marcas que quieren impactar.",
    stack: "React + Vite + Three.js",
    href: "/ejemplos/landing-vortex",
    crearHref: "/crear/landing-vortex",
    color: "#1f9e6e",
    precio: PRECIOS["landing-vortex"],
  },
];

const PASOS = [
  { n: "01", titulo: "Elegí un estilo", texto: "Mirá el ejemplo real de cada plantilla — lo que ves abajo es exactamente lo que te llevás." },
  { n: "02", titulo: "Completá tus datos", texto: "Cada texto, foto e ícono es tuyo. Vas viendo el resultado actualizarse mientras escribís." },
  { n: "03", titulo: "Generá tu página", texto: "Un solo pago, sin crear cuenta. Te queda lista para compartir hoy mismo." },
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-[#0b0b0f] dark:text-[#f5f5f7]">
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <div className="flex items-center justify-between border-b border-black/10 pb-5 dark:border-white/10">
          <span className="text-[15px] font-semibold tracking-tight">Generador</span>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl pb-14 pt-16">
          <h1 className="text-[2.6rem] font-bold leading-[1.08] tracking-tight sm:text-[3.4rem]">
            Tu página, hecha por vos,{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">sin pagarle a nadie</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1.5 -z-0 h-[0.4em] -rotate-1 bg-amber-300/70 dark:bg-amber-400/40"
              />
            </span>
            .
          </h1>
          <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-neutral-500 dark:text-white/55">
            Elegís una plantilla, completás tus datos y vas viendo el resultado en vivo. Las tres
            de abajo no son maquetas: son las páginas reales, funcionando ahora mismo.
          </p>
          <p className="mt-5 text-[13px] text-neutral-400 dark:text-white/35">
            Sin crear cuenta &nbsp;·&nbsp; 100% editable &nbsp;·&nbsp; gratis mientras arrancamos
          </p>
        </div>
      </div>

      {/* Vitrina: preview en vivo de cada plantilla */}
      <div className="mx-auto max-w-5xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {TEMAS.map((tema) => (
            <article key={tema.nombre} className="flex flex-col">
              <div
                className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
                style={{ borderTopColor: tema.color, borderTopWidth: 3 }}
              >
                <div className="flex items-center gap-1.5 border-b border-black/10 px-3.5 py-2.5 dark:border-white/10">
                  <span className="h-2 w-2 rounded-full bg-black/15 dark:bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-black/15 dark:bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-black/15 dark:bg-white/20" />
                </div>
                {tema.href ? (
                  <LivePreviewFrame src={tema.previewSrc ?? tema.href} titulo={tema.nombre} />
                ) : (
                  <div className="flex aspect-[1600/1067] w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400 dark:bg-black dark:text-white/30">
                    Próximamente
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col pt-4">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: tema.color }}
                >
                  {tema.eyebrow}
                </span>
                <h2 className="mt-1.5 text-[17px] font-semibold">{tema.nombre}</h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-neutral-500 dark:text-white/55">
                  {tema.descripcion}
                </p>
                <p className="mt-3 text-[11.5px] text-neutral-400 dark:text-white/35">{tema.stack}</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-[13px] text-neutral-400 line-through dark:text-white/30">
                    {formatoPrecio(tema.precio)}
                  </span>
                  <span className="text-[15px] font-bold" style={{ color: tema.color }}>
                    Gratis
                  </span>
                  <span className="text-[11px] text-neutral-400 dark:text-white/35">por tiempo limitado</span>
                </div>

                <div className="mt-3 flex gap-2">
                  {tema.href ? (
                    <Link
                      to={tema.href}
                      style={{ backgroundColor: tema.color }}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Ver ejemplo
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="inline-flex flex-1 items-center justify-center rounded-md border border-black/10 px-4 py-2.5 text-[13px] text-neutral-400 dark:border-white/10 dark:text-white/40">
                      Próximamente
                    </span>
                  )}
                  {tema.crearHref && (
                    <Link
                      to={tema.crearHref}
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-black/15 px-4 py-2.5 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-black/5 dark:border-white/15 dark:text-white/85 dark:hover:bg-white/10"
                    >
                      Crear la mía
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-14">
        <div className="grid grid-cols-1 gap-10 border-t border-black/10 pt-10 sm:grid-cols-3 dark:border-white/10">
          {PASOS.map((paso) => (
            <div key={paso.n}>
              <span className="font-mono text-[13px] text-neutral-300 dark:text-white/25">{paso.n}</span>
              <h3 className="mt-1 text-[15px] font-semibold">{paso.titulo}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-500 dark:text-white/50">{paso.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-black/5 px-6 py-8 text-center text-xs text-neutral-400 dark:border-white/5 dark:text-white/30">
        Cada plantilla es 100% tuya para editar — texto, fotos e íconos.
      </footer>
    </main>
  );
}
