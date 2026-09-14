import { useState } from 'react'
import { ArrowRight, Plus, X } from 'lucide-react'
import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
import type { LandingFleepixConfig } from '../config'
import { EditableText } from '@/shared/components/EditableText'
import { useEditable } from '@/shared/components/EditableContext'

export function Faq({ config }: { config: LandingFleepixConfig }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const { faq } = config
  const { editable, onAgregarFaq, onQuitarFaq } = useEditable()
  const ctaUrl = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensajeDemo)

  return (
    <section className="py-24 max-[900px]:py-18 max-[480px]:py-[54px]" id="faq">
      <div className="mx-auto max-w-[1360px] px-4 grid grid-cols-[40%_1fr] gap-14 items-start max-[900px]:grid-cols-1 max-[900px]:gap-[26px]">
        <Reveal
          as="div"
          className="sticky top-[110px] self-start max-[900px]:static max-[900px]:top-auto"
        >
          <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--accent)] tracking-[0.14em] mb-4">
            <EditableText path="faq.eyebrow" value={faq.eyebrow} as="span" />
          </span>
          <h2 className="font-['Sora'] font-bold text-[44px] max-[768px]:text-[clamp(26px,6vw,36px)] max-[480px]:text-[clamp(23px,7.5vw,30px)] leading-[1.05] tracking-[-0.03em] mb-[22px] text-[var(--navy-500)] text-balance">
            <EditableText path="faq.titulo" value={faq.titulo} as="span" />
          </h2>
          <p className="text-[var(--text-soft)] text-base leading-[1.6] mb-[30px] max-w-[34ch]">
            <EditableText path="faq.descripcion" value={faq.descripcion} as="span" multiline />
          </p>
          <a
            className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[14.5px] cursor-pointer rounded-xl px-[26px] py-[12px] border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)]"
            style={{ color: 'var(--accent-ink)' }}
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EditableText path="faq.ctaLabel" value={faq.ctaLabel} as="span" /> <ArrowRight className="w-[17px] h-[17px] flex-none" strokeWidth={2.4} />
          </a>
        </Reveal>
        <div className="flex flex-col gap-[14px]">
          {faq.items.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <Reveal
                as="div"
                index={i}
                key={i}
                className={`bg-[var(--bg-elev)] border rounded-[var(--r-lg)] overflow-hidden [transition:border-color_0.2s_ease,box-shadow_0.25s_ease] ${isOpen ? 'border-[var(--verde-500)] shadow-[0_14px_36px_rgba(0,37,52,0.08)]' : 'border-[var(--border)]'}`}
              >
                <div className="w-full bg-transparent text-left font-['Sora'] text-[16.5px] font-semibold text-[var(--navy-500)] px-6 py-4 flex items-center justify-between gap-5">
                  <button
                    type="button"
                    className="flex-1 text-left cursor-pointer bg-transparent border-0"
                    onClick={() => !editable && setOpenIdx(isOpen ? null : i)}
                  >
                    <EditableText path={`faq.items.${i}.pregunta`} value={item.pregunta} as="span" />
                  </button>
                  {editable && (
                    <button
                      type="button"
                      aria-label="Quitar pregunta"
                      className="flex-none w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-faint)] hover:text-[#c0392b] hover:bg-[color-mix(in_srgb,#c0392b_10%,transparent)]"
                      onClick={() => onQuitarFaq(i)}
                    >
                      <X size={14} strokeWidth={2.4} />
                    </button>
                  )}
                  <span
                    className={`w-[30px] h-[30px] flex-none rounded-[var(--r-sm)] text-[var(--verde-500)] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Plus size={18} strokeWidth={2.6} />
                  </span>
                </div>
                <div className={`overflow-hidden ${isOpen || editable ? 'max-h-[600px]' : 'max-h-0'}`}>
                  <div className="px-6 pb-6 text-[var(--text-soft)] text-[14.5px] leading-[1.7] max-w-[62ch]">
                    <EditableText path={`faq.items.${i}.respuesta`} value={item.respuesta} as="span" multiline />
                  </div>
                </div>
              </Reveal>
            )
          })}
          {editable && (
            <button
              type="button"
              className="self-start text-[13px] font-['Sora'] font-semibold text-[var(--accent)] px-6 py-3 cursor-pointer bg-transparent border border-dashed border-[var(--border)] rounded-[var(--r-lg)] hover:border-[var(--accent)]"
              onClick={onAgregarFaq}
            >
              + Agregar pregunta
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
