import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
import type { LandingFleepixConfig } from '../config'

export function Faq({ config }: { config: LandingFleepixConfig }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const { faq } = config
  const ctaUrl = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensajeDemo)

  return (
    <section className="py-24 max-[900px]:py-18 max-[480px]:py-[54px]" id="faq">
      <div className="mx-auto max-w-[1360px] px-4 grid grid-cols-[40%_1fr] gap-14 items-start max-[900px]:grid-cols-1 max-[900px]:gap-[26px]">
        <Reveal
          as="div"
          className="sticky top-[110px] self-start max-[900px]:static max-[900px]:top-auto"
        >
          <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--accent)] tracking-[0.14em] mb-4">
            {faq.eyebrow}
          </span>
          <h2 className="font-['Sora'] font-bold text-[44px] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] leading-[1.05] tracking-[-0.03em] mb-[22px] text-[var(--navy-500)] text-balance">
            {faq.titulo}
          </h2>
          <p className="text-[var(--text-soft)] text-base leading-[1.6] mb-[30px] max-w-[34ch]">
            {faq.descripcion}
          </p>
          <a
            className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[14.5px] cursor-pointer rounded-xl px-[26px] py-[12px] border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)]"
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {faq.ctaLabel} <ArrowRight className="w-[17px] h-[17px] flex-none" strokeWidth={2.4} />
          </a>
        </Reveal>
        <div className="flex flex-col gap-[14px]">
          {faq.items.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <Reveal
                as="div"
                index={i}
                key={item.pregunta}
                className={`bg-[var(--bg-elev)] border rounded-[var(--r-lg)] overflow-hidden [transition:border-color_0.2s_ease,box-shadow_0.25s_ease] ${isOpen ? 'border-[var(--verde-500)] shadow-[0_14px_36px_rgba(0,37,52,0.08)]' : 'border-[var(--border)]'}`}
              >
                <button
                  type="button"
                  className="cursor-pointer w-full bg-transparent border-0 text-left font-['Sora'] text-[16.5px] font-semibold text-[var(--navy-500)] px-6 py-4 flex items-center justify-between gap-5"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                >
                  {item.pregunta}
                  <span
                    className={`w-[30px] h-[30px] flex-none rounded-[var(--r-sm)] text-[var(--verde-500)] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                  >
                    <Plus size={18} strokeWidth={2.6} />
                  </span>
                </button>
                <div className={`overflow-hidden ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                  <div className="px-6 pb-6 text-[var(--text-soft)] text-[14.5px] leading-[1.7] max-w-[62ch]">
                    {item.respuesta}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
