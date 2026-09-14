import { Check } from "lucide-react";
import { Reveal } from "@/features/tema-landing-fleepix/shared/components/Reveal";
import type { LandingFleepixConfig } from "../config";
import { EditableText } from "@/shared/components/EditableText";
import { EditableImagen } from "@/shared/components/EditableImagen";

export function ParaQuien({ config }: { config: LandingFleepixConfig }) {
  const { paraQuien } = config;

  return (
    <section
      className="relative bg-[var(--neutro-200)] py-[120px] max-[900px]:py-20 max-[480px]:py-[60px]"
      id="para-quien"
    >
      <div className="mx-auto max-w-[1360px] px-4 grid grid-cols-[0.82fr_1.18fr] gap-14 items-start max-[900px]:grid-cols-1 max-[900px]:gap-7">
        <Reveal
          as="div"
          className="sticky top-[110px] self-start text-left max-[900px]:static max-[900px]:top-auto"
        >
          <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--verde-600)] tracking-[0.14em] mb-4">
            {paraQuien.eyebrow}
          </span>
          <h2 className="font-['Sora'] font-bold text-[clamp(30px,3.4vw,46px)] leading-[1.05] tracking-[-0.03em] mb-5 text-[var(--navy-500)] text-balance max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)]">
            {paraQuien.titulo}
          </h2>
          <p className="text-[var(--text-soft)] text-base leading-[1.62] max-w-[34ch] max-[768px]:max-w-none">
            {paraQuien.descripcion}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 items-stretch max-[900px]:flex max-[900px]:overflow-x-auto max-[900px]:overflow-y-hidden max-[900px]:snap-x max-[900px]:snap-mandatory max-[900px]:max-w-none max-[900px]:-mx-4 max-[900px]:px-4 max-[900px]:pt-1 max-[900px]:pb-2 max-[900px]:scroll-p-4 max-[900px]:touch-pan-x max-[900px]:[-webkit-overflow-scrolling:touch] max-[900px]:[scrollbar-width:none] max-[900px]:[&::-webkit-scrollbar]:hidden">
          <Reveal
            as="article"
            index={0}
            className="bg-[var(--verde-300)] border border-[var(--verde-400)] rounded-[var(--r-lg)] py-[22px] px-5 flex flex-col overflow-hidden transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--verde-600)] max-[480px]:px-[22px] max-[900px]:aspect-auto max-[900px]:min-h-0 max-[900px]:flex-[0_0_78%] max-[900px]:snap-center"
          >
            <h3 className="font-['Sora'] text-[clamp(18px,1.7vw,22px)] font-semibold mb-2 tracking-[-0.01em] text-[var(--navy-900)]">
              {paraQuien.tarjetaTexto1.titulo}
            </h3>
            <p className="text-[clamp(13px,1.05vw,14px)] leading-[1.5] mb-4 text-[var(--navy-900)]">
              {paraQuien.tarjetaTexto1.descripcion}
            </p>
            <ul className="list-none flex flex-col gap-2 m-0 text-[clamp(12.5px,1vw,13.5px)]">
              {paraQuien.tarjetaTexto1.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-sm text-[var(--navy-900)] font-medium">
                  <span className="w-[23px] h-[23px] flex-none rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--navy-900)_12%,transparent)] flex items-center justify-center">
                    <Check size={13} strokeWidth={3.2} color="var(--navy-900)" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal
            as="div"
            index={1}
            className="relative min-h-[160px] rounded-[var(--r-lg)] overflow-hidden border border-[var(--border)] bg-[var(--navy-500)] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_15px)] flex flex-col items-start justify-between p-[18px] max-[900px]:aspect-auto max-[900px]:min-h-[200px] max-[900px]:flex-[0_0_78%] max-[900px]:snap-center"
          >
            <span className="inline-block font-['Sora'] bg-[var(--navy-500)] text-white border border-[var(--navy-500)] text-[11.5px] font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-[var(--r-sm)] mb-0 relative z-[1] shadow-[0_6px_18px_rgba(0,37,52,0.35)]">
              {paraQuien.tarjetaFoto1.badge}
            </span>
            <img
              src={paraQuien.tarjetaFoto1.foto}
              alt={paraQuien.tarjetaFoto1.badge}
              className="absolute inset-0 w-full h-full object-cover object-[60%_25%]"
              width={1024}
              height={1204}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal
            as="div"
            index={2}
            className="relative min-h-[160px] rounded-[var(--r-lg)] overflow-hidden border border-[var(--border)] bg-[var(--navy-500)] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_15px)] flex flex-col items-start justify-between p-[18px] max-[900px]:aspect-auto max-[900px]:min-h-[200px] max-[900px]:flex-[0_0_78%] max-[900px]:snap-center max-[900px]:order-1"
          >
            <span className="inline-block font-['Sora'] bg-[var(--navy-500)] text-white border border-[var(--navy-500)] text-[11.5px] font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-[var(--r-sm)] mb-0 relative z-[1] shadow-[0_6px_18px_rgba(0,37,52,0.35)]">
              {paraQuien.tarjetaFoto2.badge}
            </span>
            <img
              src={paraQuien.tarjetaFoto2.foto}
              alt={paraQuien.tarjetaFoto2.badge}
              className="absolute inset-0 w-full h-full object-cover object-center"
              width={1024}
              height={1204}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal
            as="article"
            index={3}
            className="bg-[var(--verde-300)] border border-[var(--verde-400)] rounded-[var(--r-lg)] py-[22px] px-5 flex flex-col overflow-hidden transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--verde-600)] max-[480px]:px-[22px] max-[900px]:aspect-auto max-[900px]:min-h-0 max-[900px]:flex-[0_0_78%] max-[900px]:snap-center"
          >
            <h3 className="font-['Sora'] text-[clamp(18px,1.7vw,22px)] font-semibold mb-2 tracking-[-0.01em] text-[var(--navy-900)]">
              {paraQuien.tarjetaTexto2.titulo}
            </h3>
            <p className="text-[clamp(13px,1.05vw,14px)] leading-[1.5] mb-4 text-[var(--navy-900)]">
              {paraQuien.tarjetaTexto2.descripcion}
            </p>
            <ul className="list-none flex flex-col gap-2 m-0 text-[clamp(12.5px,1vw,13.5px)]">
              {paraQuien.tarjetaTexto2.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-sm text-[var(--navy-900)] font-medium">
                  <span className="w-[23px] h-[23px] flex-none rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--navy-900)_12%,transparent)] flex items-center justify-center">
                    <Check size={13} strokeWidth={3.2} color="var(--navy-900)" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
