import { Reveal } from "@/features/tema-landing-fleepix/shared/components/Reveal";
import { getIcono } from "../lib/iconos";
import { textoConEnfasis } from "../lib/textoConEnfasis";
import type { LandingFleepixConfig } from "../config";
import { EditableText } from "@/shared/components/EditableText";

export function Beneficios({ config }: { config: LandingFleepixConfig }) {
  const { beneficios } = config;

  return (
    <section className="py-24 max-[900px]:py-18 max-[480px]:py-[54px] pb-[140px]" id="beneficios">
      <div className="mx-auto max-w-[1360px] px-4">
        <Reveal as="div" className="text-left max-w-[640px] max-[900px]:max-w-none mb-[52px]">
          <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--accent)] tracking-[0.14em] mb-[14px]">
            <EditableText path="beneficios.eyebrow" value={beneficios.eyebrow} as="span" />
          </span>
          <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.4vw,44px)] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] tracking-[-0.02em] mb-4 leading-[1.1] text-balance">
            <EditableText path="beneficios.titulo" value={beneficios.titulo} as="span" render={textoConEnfasis} />
          </h2>
          <p className="text-[var(--text-soft)] text-[16.5px] leading-[1.6]">
            <EditableText path="beneficios.descripcion" value={beneficios.descripcion} as="span" multiline />
          </p>
        </Reveal>
        <div className="grid grid-cols-3 gap-6 max-[900px]:flex max-[900px]:overflow-x-auto max-[900px]:overflow-y-hidden max-[900px]:snap-x max-[900px]:snap-mandatory max-[900px]:gap-4 max-[900px]:-mx-[var(--gutter)] max-[900px]:px-[var(--gutter)] max-[900px]:pt-1 max-[900px]:pb-2 max-[900px]:scroll-p-[var(--gutter)] max-[900px]:[-webkit-overflow-scrolling:touch] max-[900px]:touch-pan-x max-[900px]:[scrollbar-width:none] max-[900px]:[&::-webkit-scrollbar]:hidden">
          {beneficios.items.map((b, i) => {
            const Icono = getIcono(b.icono);
            return (
              <Reveal
                as="article"
                index={i}
                key={i}
                className="flex flex-col items-start text-left bg-[var(--neutro-100)] border border-[var(--border)] rounded-[var(--r-lg)] px-7 py-[30px] [transition:transform_0.2s_ease,border-color_0.2s_ease,box-shadow_0.25s_ease] hover:-translate-y-[3px] hover:border-[var(--verde-500)] hover:shadow-[0_14px_36px_rgba(0,37,52,0.08)] max-[900px]:flex-[0_0_72%] max-[900px]:snap-center max-[480px]:flex-[0_0_80%]"
              >
                <div className="w-[52px] h-[52px] flex-none rounded-[var(--r-md)] mb-[22px] flex items-center justify-center bg-[var(--verde-100)] border border-[var(--verde-500)] text-[var(--verde-500)]">
                  <Icono size={26} />
                </div>
                <div className="p-0">
                  <h3 className="font-['Sora'] text-[20px] font-semibold m-0 mb-[11px] tracking-[-0.01em]">
                    <EditableText path={`beneficios.items.${i}.titulo`} value={b.titulo} as="span" />
                  </h3>
                  <p className="text-[var(--text-soft)] text-[14px] leading-[1.65] m-0 [&_strong]:text-[var(--navy-500)] [&_strong]:font-semibold">
                    <EditableText path={`beneficios.items.${i}.cuerpo`} value={b.cuerpo} as="span" multiline render={textoConEnfasis} />
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
