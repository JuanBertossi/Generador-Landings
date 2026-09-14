import { useState } from 'react'
import { FleepixLogo } from '@/features/tema-landing-fleepix/shared/components/icons/FleepixLogo'
import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
import type { LandingFleepixConfig } from '../config'
import { EditableText } from '@/shared/components/EditableText'
import { EditableImagen } from '@/shared/components/EditableImagen'

export function Navbar({ config }: { config: LandingFleepixConfig }) {
  const [open, setOpen] = useState(false)
  const ctaUrl = buildWhatsappUrl(config.whatsappNumero, config.whatsappMensajeDemo)

  return (
    <nav className="fixed top-[14px] inset-x-0 z-[100] px-4 max-[480px]:px-3">
      <div className="max-w-[var(--maxw)] mx-auto pl-[22px] pr-4 h-16 flex items-center justify-between gap-6 bg-[var(--navy-500)] border border-[var(--navy-600)] rounded-[14px] shadow-[0_10px_28px_rgba(0,17,23,0.2),0_2px_8px_rgba(0,17,23,0.14)]">
        <a className="flex items-center" href="#inicio" aria-label={config.identidad.nombreEmpresa}>
          {config.identidad.logoUrl ? (
            <EditableImagen
              path="identidad.logoUrl"
              src={config.identidad.logoUrl}
              alt={config.identidad.nombreEmpresa}
              className="h-6 w-auto block"
            />
          ) : (
            <FleepixLogo variant="light" className="h-6 w-auto block" />
          )}
        </a>
        <div className="flex items-center gap-[30px] max-[900px]:hidden">
          {config.navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[var(--navy-200)] text-sm font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
            >
              <EditableText path={`navLinks.${i}.label`} value={link.label} as="span" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            className="inline-flex items-center justify-center gap-[9px] font-['Inter'] font-semibold text-[14.5px] cursor-pointer rounded-xl px-[22px] py-[10px] border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)] max-[480px]:hidden"
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EditableText path="navCtaLabel" value={config.navCtaLabel} as="span" />
          </a>
          <button
            className="group hidden max-[900px]:flex flex-col justify-center gap-[5px] w-[42px] h-[42px] border border-[var(--navy-400)] rounded-[10px] bg-transparent cursor-pointer px-[11px]"
            id="navToggle"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="navMobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-[2px] w-full bg-[var(--neutro-100)] rounded-[2px] [transition:transform_0.25s_ease,opacity_0.2s_ease] group-aria-expanded:translate-y-[7px] group-aria-expanded:rotate-45"></span>
            <span className="block h-[2px] w-full bg-[var(--neutro-100)] rounded-[2px] [transition:transform_0.25s_ease,opacity_0.2s_ease] group-aria-expanded:opacity-0"></span>
            <span className="block h-[2px] w-full bg-[var(--neutro-100)] rounded-[2px] [transition:transform_0.25s_ease,opacity_0.2s_ease] group-aria-expanded:-translate-y-[7px] group-aria-expanded:-rotate-45"></span>
          </button>
        </div>
      </div>
      <div
        className={`max-w-[var(--maxw)] mt-[10px] mx-auto p-3 flex-col gap-1 bg-[var(--navy-500)] border border-[var(--navy-600)] rounded-[14px] shadow-[0_18px_44px_rgba(0,17,23,0.4)] ${open ? 'flex' : 'hidden'}`}
        id="navMobile"
      >
        {config.navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-[var(--neutro-100)] font-['Sora'] text-[15px] font-medium px-[14px] py-3 rounded-lg transition-colors duration-150 hover:bg-[var(--navy-600)] hover:text-[var(--azul-300)]"
          >
            <EditableText path={`navLinks.${i}.label`} value={link.label} as="span" />
          </a>
        ))}
        <a
          className="inline-flex items-center justify-center gap-[9px] font-['Sora'] font-medium text-[15px] cursor-pointer rounded-lg px-[14px] py-3 border border-transparent transition-[transform,background,border-color,box-shadow] duration-150 whitespace-nowrap bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_6px_22px_color-mix(in_srgb,var(--accent)_28%,transparent)] hover:-translate-y-px hover:bg-[var(--azul-400)] hover:shadow-[0_8px_26px_color-mix(in_srgb,var(--accent)_38%,transparent)] mt-[6px]"
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <EditableText path="navCtaLabel" value={config.navCtaLabel} as="span" />
        </a>
      </div>
    </nav>
  )
}
