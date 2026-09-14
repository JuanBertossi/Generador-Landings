import { ArrowRight } from "lucide-react";
import "@/features/tema-landing-fleepix/styles/funcionalidades/funcionalidades.css";
import { useFuncionalidadesStack } from "../hooks/useFuncionalidadesStack";
import { getIcono } from "../lib/iconos";
import type { LandingFleepixConfig } from "../config";
import { EditableText } from "@/shared/components/EditableText";
import { EditableImagen } from "@/shared/components/EditableImagen";

const FK_CARD_CLASS =
  "sticky top-[110px] mb-9 scroll-mt-[110px] bg-[var(--bg-elev)] border border-[var(--border)] rounded-[var(--r-block)] p-[18px] shadow-[0_18px_50px_rgba(0,37,52,0.1)] origin-top transition-[transform,opacity] duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform last:mb-0 max-[900px]:mb-5 max-[480px]:flex-[0_0_91%]";

const FK_SHOT_CLASS =
  "relative h-[230px] max-[900px]:h-[190px] rounded-[var(--r-md)] overflow-hidden border border-[var(--border)] bg-[var(--navy-500)] flex items-end p-4 mb-5";

const FK_CHIP_CLASS =
  "inline-flex items-center gap-1.5 font-['Sora'] text-[11.5px] font-semibold tracking-[0.05em] uppercase text-[var(--verde-600)] bg-[var(--verde-100)] border border-[color-mix(in_srgb,var(--verde-600)_30%,transparent)] px-3 py-1.5 rounded-[var(--r-sm)] mx-1 mb-[14px]";

const FK_H3_CLASS =
  "font-['Sora'] font-semibold text-[clamp(21px,2vw,28px)] tracking-[-0.02em] mb-3 px-1 leading-[1.15]";

const FK_P_CLASS =
  "text-[var(--text-soft)] text-[15px] leading-[1.62] px-1 pb-1.5 max-w-[52ch]";

export function Funcionalidades({ config }: { config: LandingFleepixConfig }) {
  const { funcionalidades } = config;
  const { rightRef, cardRefs, active, scrollToCard } = useFuncionalidadesStack(
    funcionalidades.items.length,
  );

  return (
    <section
      className="py-24 max-[900px]:py-18 max-[480px]:py-[54px] bg-[var(--navy-500)] relative"
      id="funcionalidades"
    >
      <div className="mx-auto max-w-[1360px] px-4 grid grid-cols-[0.82fr_1.18fr] gap-14 items-start max-[900px]:grid-cols-1 max-[900px]:gap-[22px]">
        <div className="sticky top-[110px] self-start max-[900px]:static max-[900px]:top-auto">
          <div>
            <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--azul-300)] tracking-[0.14em] mb-[14px]">
              <EditableText path="funcionalidades.eyebrow" value={funcionalidades.eyebrow} as="span" />
            </span>
            <h2 className="font-['Sora'] font-bold text-[clamp(28px,3.4vw,44px)] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] tracking-[-0.02em] mb-[14px] leading-[1.1] text-balance text-[var(--neutro-100)]">
              <EditableText path="funcionalidades.titulo" value={funcionalidades.titulo} as="span" />
            </h2>
            <p className="text-[var(--navy-200)] text-[15.5px] leading-[1.6] mb-[26px] max-w-[38ch] max-[768px]:max-w-none">
              <EditableText path="funcionalidades.descripcion" value={funcionalidades.descripcion} as="span" multiline />
            </p>
          </div>
          <div className="flex flex-col gap-0.5 max-[900px]:hidden">
            {funcionalidades.items.map((item, i) => (
              <button
                key={i}
                className={`flex items-center w-full text-left cursor-pointer border rounded-lg px-[14px] py-[11px] font-['Sora'] font-medium text-[15.5px] transition-[color,background,border-color,box-shadow] duration-200 ${
                  active === i
                    ? "bg-[var(--bg-elev)] border-[var(--border)] text-[var(--text)] font-semibold shadow-[0_8px_24px_rgba(0,37,52,0.08)] hover:text-[var(--navy-500)]"
                    : "bg-transparent border-transparent text-[var(--azul-300)] hover:text-[var(--neutro-100)]"
                }`}
                onClick={() => scrollToCard(i)}
              >
                <span
                  className={`w-0 overflow-hidden opacity-0 flex-none inline-flex items-center text-[var(--verde-600)] transition-[width,opacity,margin] duration-200 ${
                    active === i ? "w-[26px] opacity-100 mr-1.5" : ""
                  }`}
                >
                  <ArrowRight size={18} strokeWidth={2.2} />
                </span>
                <EditableText path={`funcionalidades.items.${i}.navLabel`} value={item.navLabel} as="span" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative pb-[10vh] max-[900px]:pb-[6vh]" ref={rightRef}>
          {funcionalidades.items.map((item, i) => {
            const ChipIcono = getIcono(item.chipIcono);
            return (
              <article
                key={i}
                className={FK_CARD_CLASS}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <div className={FK_SHOT_CLASS}>
                  <EditableImagen
                    path={`funcionalidades.items.${i}.foto`}
                    src={item.foto}
                    alt={item.titulo}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    width={2164}
                    height={1212}
                  />
                </div>
                <span className={FK_CHIP_CLASS}>
                  <ChipIcono size={16} />
                  <EditableText path={`funcionalidades.items.${i}.chipLabel`} value={item.chipLabel} as="span" />
                </span>
                <h3 className={FK_H3_CLASS}>
                  <EditableText path={`funcionalidades.items.${i}.titulo`} value={item.titulo} as="span" />
                </h3>
                <p className={FK_P_CLASS}>
                  <EditableText path={`funcionalidades.items.${i}.descripcion`} value={item.descripcion} as="span" multiline />
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
