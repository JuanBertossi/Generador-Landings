import { ArrowRight, PlayCircle } from "lucide-react";
import { buildWhatsappUrl } from "@/features/tema-landing-fleepix/shared/lib/whatsapp";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { LandingFleepixConfig } from "../config";
import { EditableText } from "@/shared/components/EditableText";
import { EditableImagen } from "@/shared/components/EditableImagen";

export function Hero({ config }: { config: LandingFleepixConfig }) {
  const ctaUrl = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensajeDemo);

  return (
    <header
      className="flex items-center min-h-screen px-4 pt-[100px] pb-11 max-[900px]:min-h-0 max-[900px]:px-[14px] max-[900px]:pt-24 max-[900px]:pb-9 max-[480px]:px-3 max-[480px]:pt-22 max-[480px]:pb-7"
      id="inicio"
    >
      <div className="w-full max-w-[var(--maxw)] mx-auto grid grid-cols-[1.12fr_1fr] max-[900px]:grid-cols-1 gap-4 items-stretch">
        <div className="group relative rounded-[var(--r-block)] overflow-hidden min-h-[660px] max-[900px]:min-h-[300px] max-[900px]:order-2 border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between items-start p-[22px]">
          <div className="absolute inset-0 [perspective:1400px] z-0">
            <div className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0.15,0.2,1)] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none">
              <EditableImagen
                path="hero.fotoPrincipal"
                src={config.hero.fotoPrincipal}
                className="absolute inset-0 w-full h-full object-cover object-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[var(--r-block)]"
                width={1024}
                height={1204}
                loading="eager"
              />
              <EditableImagen
                path="hero.fotoSecundaria"
                src={config.hero.fotoSecundaria}
                className="absolute inset-0 w-full h-full object-cover object-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[var(--r-block)] [transform:rotateY(180deg)]"
                width={1024}
                height={1204}
              />
            </div>
          </div>
          <span className="inline-flex items-center gap-[9px] border rounded-[var(--r-sm)] px-[13px] py-[6px] font-['Sora'] font-semibold text-[11px] tracking-[0.14em] uppercase relative z-[1] bg-[color-mix(in_srgb,var(--navy-900)_45%,transparent)] border-[color-mix(in_srgb,var(--neutro-100)_22%,transparent)] text-[var(--navy-100)] backdrop-blur-[4px]">
            <span className="w-[7px] h-[7px] rounded-[var(--r-pixel)] bg-[var(--azul-400)]"></span>
            <EditableText path="hero.eyebrow" value={config.hero.eyebrow} as="span" />
          </span>
        </div>

        <div className="grid grid-rows-[1fr] max-[900px]:grid-rows-[auto] max-[900px]:order-1 gap-4 min-w-0">
          <div className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-[var(--r-block)] pt-14 px-12 pb-12 max-[900px]:px-7 max-[900px]:py-9 max-[480px]:px-5 max-[480px]:py-[26px] max-[480px]:gap-6 flex flex-col justify-between gap-8">
            <h1 className="font-['Sora'] font-bold text-[clamp(34px,4vw,60px)] max-[768px]:text-[clamp(30px,7vw,42px)] max-[480px]:text-[clamp(25px,8vw,32px)] leading-[1.03] max-[768px]:leading-[1.18] tracking-[-0.03em] max-[768px]:tracking-[-0.015em] m-0 text-balance">
              {textoConEnfasis(config.hero.titulo)}
            </h1>
            <div className="flex flex-col gap-[26px]">
              <p className="text-[16.5px] text-[var(--text-soft)] m-0 leading-[1.62] max-w-[50ch]">
                {config.hero.descripcion}
              </p>
              <div className="flex gap-3 flex-wrap max-[480px]:flex-col max-[480px]:items-stretch">
                <a
                  className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[15px] cursor-pointer rounded-xl px-[26px] py-[11px] border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)]"
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.hero.cta1Label}
                  <ArrowRight className="w-[17px] h-[17px] flex-none" strokeWidth={2.4} />
                </a>
                <a
                  className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[15px] cursor-pointer rounded-xl px-[26px] py-[11px] border transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-transparent text-[var(--text)] border-[var(--border-strong)] hover:bg-[var(--bg-elev)] hover:border-[var(--accent)] hover:-translate-y-px"
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayCircle className="w-auto h-auto text-[20px] flex-none" strokeWidth={2} />
                  {config.hero.cta2Label}
                </a>
              </div>
            </div>
