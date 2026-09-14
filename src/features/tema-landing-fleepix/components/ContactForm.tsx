import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
import { BgGridCanvas } from './BgGridCanvas'
import { useContactForm } from '../hooks/useContactForm'
import type { LandingFleepixConfig } from '../config'

export function ContactForm({ config, paginaId = null }: { config: LandingFleepixConfig; paginaId?: string | null }) {
  const { register, onSubmit, formState: { errors }, sent } = useContactForm(config.whatsappNumero, paginaId)
  const { contactoSeccion } = config

  return (
    <section className="relative overflow-hidden py-24 max-[900px]:py-18 max-[480px]:py-[54px]" id="demo">
      <BgGridCanvas />
      <div className="relative z-[1] mx-auto max-w-[1360px] px-4">
        <div className="grid grid-cols-[0.4fr_0.6fr] gap-6 items-stretch max-w-[var(--maxw)] mx-auto max-[900px]:grid-cols-1 max-[900px]:gap-4">
          <Reveal
            as="div"
            index={0}
            className="bg-[var(--neutro-100)] border border-[var(--border)] rounded-[14px] px-11 py-12 flex flex-col justify-center max-[900px]:px-[26px] max-[900px]:py-8 max-[480px]:px-5 max-[480px]:py-[26px]"
          >
            <span className="inline-block font-['Sora'] font-bold text-[12.5px] text-[var(--verde-600)] tracking-[0.14em] mb-[14px]">{contactoSeccion.eyebrow}</span>
            <h2 className="font-['Sora'] font-bold text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-[var(--navy-500)] mb-[18px] text-balance">{contactoSeccion.titulo}</h2>
            <p className="text-[var(--text-soft)] text-base leading-[1.6] max-w-[38ch]">{contactoSeccion.descripcion}</p>
            <ul className="list-none mt-[30px] p-0 flex flex-col gap-[14px]">
              {contactoSeccion.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-[11px] font-['Sora'] text-[14.5px] font-medium text-[var(--navy-500)]">
                  <span className="w-6 h-6 flex-none rounded-[var(--r-sm)] bg-[color-mix(in_srgb,var(--verde-500)_18%,transparent)] border border-[color-mix(in_srgb,var(--verde-500)_30%,transparent)] flex items-center justify-center text-[var(--verde-600)]">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal
            as="div"
            index={1}
            className="bg-[var(--neutro-100)] border border-[var(--border)] rounded-[14px] p-10 shadow-[0_18px_50px_rgba(0,37,52,0.08)] max-[480px]:px-[18px] max-[480px]:py-6"
          >
            {sent ? (
              <p className="font-['Sora'] text-[17px] font-semibold text-[var(--navy-500)] text-center py-6">{contactoSeccion.mensajeExito}</p>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4 max-[900px]:grid-cols-1">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-nombre" className="font-['Sora'] text-[11px] font-semibold tracking-[0.12em] text-[var(--text-faint)] uppercase">Nombre y apellido</label>
                    <input id="f-nombre" type="text" placeholder="Ej. Juan Pérez" className="bg-[var(--neutro-200)] border border-[var(--border)] rounded-[var(--r-md)] text-[var(--text)] font-['Inter'] text-[15px] px-[15px] py-3 transition-[border-color,box-shadow,background] duration-150 placeholder:text-[var(--text-faint)] focus:outline-none focus:bg-[var(--neutro-100)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]" {...register('nombre')} />
                    {errors.nombre && <span className="font-['Inter'] text-[12.5px] text-[#c0392b]">{errors.nombre.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-tel" className="font-['Sora'] text-[11px] font-semibold tracking-[0.12em] text-[var(--text-faint)] uppercase">Teléfono</label>
                    <input id="f-tel" type="tel" placeholder="Ej. +54 11 1234-5678" className="bg-[var(--neutro-200)] border border-[var(--border)] rounded-[var(--r-md)] text-[var(--text)] font-['Inter'] text-[15px] px-[15px] py-3 transition-[border-color,box-shadow,background] duration-150 placeholder:text-[var(--text-faint)] focus:outline-none focus:bg-[var(--neutro-100)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]" {...register('telefono')} />
                    {errors.telefono && <span className="font-['Inter'] text-[12.5px] text-[#c0392b]">{errors.telefono.message}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                  <label htmlFor="f-mail" className="font-['Sora'] text-[11px] font-semibold tracking-[0.12em] text-[var(--text-faint)] uppercase">Mail corporativo</label>
                  <input id="f-mail" type="email" placeholder="tu@empresa.com" className="bg-[var(--neutro-200)] border border-[var(--border)] rounded-[var(--r-md)] text-[var(--text)] font-['Inter'] text-[15px] px-[15px] py-3 transition-[border-color,box-shadow,background] duration-150 placeholder:text-[var(--text-faint)] focus:outline-none focus:bg-[var(--neutro-100)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]" {...register('email')} />
                  {errors.email && <span className="font-['Inter'] text-[12.5px] text-[#c0392b]">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-2 mb-2">
                  <label htmlFor="f-msg" className="font-['Sora'] text-[11px] font-semibold tracking-[0.12em] text-[var(--text-faint)] uppercase">¿Cómo podemos ayudarte?</label>
                  <textarea
                    id="f-msg"
                    placeholder="Ej. Tengo una flota de 10 camiones y necesito centralizar la gestión de CTG y gastos..."
                    className="bg-[var(--neutro-200)] border border-[var(--border)] rounded-[var(--r-md)] text-[var(--text)] font-['Inter'] text-[15px] px-[15px] py-3 resize-y min-h-[110px] leading-[1.6] transition-[border-color,box-shadow,background] duration-150 placeholder:text-[var(--text-faint)] focus:outline-none focus:bg-[var(--neutro-100)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
                    {...register('mensaje')}
                  />
                  {errors.mensaje && <span className="font-['Inter'] text-[12.5px] text-[#c0392b]">{errors.mensaje.message}</span>}
                </div>
                <button type="submit" className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[15.5px] cursor-pointer rounded-xl p-[13px] border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)] w-full mt-[6px]">
                  {contactoSeccion.botonEnviar}
                  <ArrowRight className="w-[19px] h-[19px] flex-none" strokeWidth={2.4} />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
