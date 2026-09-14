import { Mail, Phone, MapPin, Code2 } from 'lucide-react'
import { Reveal } from '@/features/tema-landing-fleepix/shared/components/Reveal'
import { FleepixLogo } from '@/features/tema-landing-fleepix/shared/components/icons/FleepixLogo'
import goodAppsLogo from '@/features/tema-landing-fleepix/shared/assets/footer/logo-goodapps.svg'
import { buildWhatsappUrl } from '@/features/tema-landing-fleepix/shared/lib/whatsapp'
import type { LandingFleepixConfig } from '../config'
import { EditableText } from '@/shared/components/EditableText'
import { EditableImagen } from '@/shared/components/EditableImagen'
import { useEditable } from '@/shared/components/EditableContext'

export function Footer({ config }: { config: LandingFleepixConfig }) {
  const { identidad, navLinks, footer } = config
  const { editable } = useEditable()
  const whatsappDesarrolloUrl = buildWhatsappUrl(
    footer.contacto.whatsappNumero,
    footer.mensajeWhatsappDesarrolloAMedida,
  )

  return (
    <footer className="relative bg-[var(--navy-500)] text-[var(--navy-200)] pt-14 px-0 pb-6 mt-0 before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--azul-400)_70%,transparent),transparent)]">
      <div className="mx-auto max-w-[1360px] px-4">
        <div className="grid grid-cols-[1.3fr_0.8fr_1fr_1.3fr] gap-10 items-start max-[900px]:grid-cols-2 max-[900px]:gap-x-10 max-[900px]:gap-y-[34px] max-[480px]:grid-cols-1 max-[480px]:gap-[30px]">
          <Reveal as="div" index={0} className="max-[900px]:col-span-full max-[480px]:col-auto">
            {identidad.logoUrl || editable ? (
              <EditableImagen
                path="identidad.logoUrl"
                src={identidad.logoUrl}
                alt={identidad.nombreEmpresa}
                className="block h-10 w-auto min-w-[70px] mb-[22px] -ml-3.5 origin-left transition-transform duration-[250ms] hover:scale-[1.08]"
              />
            ) : (
              <FleepixLogo
                variant="light"
                className="block h-10 w-auto mb-[22px] -ml-3.5 origin-left transition-transform duration-[250ms] hover:scale-[1.08]"
              />
            )}
            <p className="text-[13.5px] leading-[1.6] text-[var(--navy-200)] max-w-[34ch] m-0">
              <EditableText path="footer.descripcion" value={footer.descripcion} as="span" multiline />
            </p>
          </Reveal>
          <Reveal as="div" index={1}>
            <p className="font-['Sora'] font-bold text-xs tracking-[0.14em] uppercase text-[var(--navy-300)] mb-5">
              Navegación
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-[9px] text-[var(--navy-200)] text-sm font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
                    style={{ color: 'var(--navy-200)' }}
                  >
                    <EditableText path={`navLinks.${i}.label`} value={link.label} as="span" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div" index={2}>
            <p className="font-['Sora'] font-bold text-xs tracking-[0.14em] uppercase text-[var(--navy-300)] mb-5">
              Contacto
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {(footer.contacto.email || editable) && (
                <li className="flex items-center gap-2.5 text-[var(--navy-200)] text-sm">
                  <span className="w-4 h-4 flex-none inline-flex text-[var(--azul-300)]">
                    <Mail size={16} strokeWidth={1.8} />
                  </span>
                  <a
                    href={`mailto:${footer.contacto.email}`}
                    className="inline-flex items-center gap-[9px] font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
                    style={{ color: 'var(--navy-200)' }}
                  >
                    <EditableText
                      path="footer.contacto.email"
                      value={footer.contacto.email}
                      as="span"
                      placeholder="tu@email.com"
                    />
                  </a>
                </li>
              )}
              {(footer.contacto.whatsappNumero || editable) && (
                <li className="flex items-center gap-2.5 text-[var(--navy-200)] text-sm">
                  <span className="w-4 h-4 flex-none inline-flex text-[var(--azul-300)]">
                    <Phone size={16} strokeWidth={1.8} />
                  </span>
                  <a
                    href={`https://wa.me/${footer.contacto.whatsappNumero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-[9px] font-medium transition-colors duration-150 hover:text-[var(--azul-300)]"
                    style={{ color: 'var(--navy-200)' }}
                  >
                    <EditableText
                      path="footer.contacto.whatsappTexto"
                      value={footer.contacto.whatsappTexto}
                      as="span"
                      placeholder="+54 9 11 ..."
                    />
                  </a>
                </li>
              )}
              {(footer.contacto.direccion || editable) && (
                <li className="flex items-center gap-2.5 text-[var(--navy-200)] text-sm">
                  <span className="w-4 h-4 flex-none inline-flex text-[var(--azul-300)]">
                    <MapPin size={16} strokeWidth={1.8} />
                  </span>
                  <EditableText
                    path="footer.contacto.direccion"
                    value={footer.contacto.direccion}
                    as="span"
                    className="text-[var(--navy-200)] text-sm"
                    style={{ color: 'var(--navy-200)' }}
                    placeholder="Tu dirección"
                  />
                </li>
              )}
            </ul>
          </Reveal>
          {footer.mostrarBloqueDesarrolloAMedida && (
            <Reveal as="div" index={3}>
              <p className="font-['Sora'] font-bold text-xs tracking-[0.14em] uppercase text-[var(--navy-300)] mb-5">
                Desarrollos a medida
              </p>
              <div className="flex flex-col items-start gap-2.5 border border-[var(--navy-400)] rounded-[var(--r-lg)] py-4 px-[18px] bg-[color-mix(in_srgb,var(--azul-500)_10%,transparent)] transition-[border-color,background] duration-200 hover:border-[var(--azul-400)] hover:bg-[color-mix(in_srgb,var(--azul-500)_14%,transparent)]">
                <Code2 className="flex-none text-[var(--azul-300)]" size={20} />
                <span className="flex flex-col gap-2 font-['Sora'] text-[13px] font-semibold text-[var(--neutro-100)] leading-[1.35]">
                  <span className="cta-line">¿Tenés un requerimiento especial?</span>
                  <a
                    href={whatsappDesarrolloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--azul-300)] font-bold hover:text-[var(--azul-200)] hover:underline"
                    style={{ color: 'var(--azul-300)' }}
                  >
                    Consultanos por desarrollos a medida
                  </a>
                </span>
              </div>
            </Reveal>
          )}
        </div>
        <div className="flex items-center justify-between gap-5 flex-wrap mt-10 pt-[26px] border-t border-[color-mix(in_srgb,var(--navy-400)_45%,transparent)] max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-3 max-[480px]:items-start max-[480px]:text-left">
          <div className="flex items-center gap-1.5 flex-nowrap max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-2.5">
            <span className="text-[var(--navy-300)] text-xs font-semibold min-w-0 overflow-hidden text-ellipsis whitespace-nowrap max-[480px]:whitespace-normal max-[480px]:overflow-visible max-[480px]:text-clip max-[480px]:text-left">
              <EditableText path="footer.copyrightTexto" value={footer.copyrightTexto} as="span" />
            </span>
            {footer.mostrarSelloGoodApps && (
              <a
                className="mb-0 shrink-0"
                href="https://goodapps.com.ar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GoodApps"
              >
                <img
                  src={goodAppsLogo}
                  alt="GoodApps"
                  width={331}
                  height={116}
                  loading="lazy"
                  decoding="async"
                  className="h-[34px] w-auto opacity-100 [filter:brightness(0)_invert(60%)] transition-[filter] duration-[180ms] hover:[filter:brightness(0)_invert(100%)]"
                />
              </a>
            )}
          </div>
          {(footer.redes.instagram || footer.redes.linkedin || footer.redes.facebook) && (
            <div className="flex items-center gap-3.5 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-3">
              <h4 className="font-['Sora'] text-xs font-semibold tracking-[0.08em] uppercase text-[var(--navy-300)] mb-0">
                Seguinos en redes
              </h4>
              <div className="flex gap-2.5 mb-0">
                {footer.redes.instagram && (
                  <a
                    href={footer.redes.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group inline-flex transition-transform duration-[180ms] hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[38px] w-[38px]">
                      <path
                        d="M0 14C0 6.26802 6.26801 0 14 0H21.9979C29.7299 0 35.9979 6.26801 35.9979 14V21.9979C35.9979 29.7299 29.7299 35.9979 21.9979 35.9979H14C6.26802 35.9979 0 29.7299 0 21.9979V14Z"
                        fill="white"
                        fillOpacity="0.06"
                        className="[transition:fill-opacity_0.18s_ease,fill_0.18s_ease] group-hover:fill-[var(--azul-500)] group-hover:[fill-opacity:0.12]"
                      />
                      <path
                        d="M21.3264 11.3339H14.6615C12.8211 11.3339 11.3291 12.8259 11.3291 14.6664V21.3312C11.3291 23.1717 12.8211 24.6637 14.6615 24.6637H21.3264C23.1669 24.6637 24.6589 23.1717 24.6589 21.3312V14.6664C24.6589 12.8259 23.1669 11.3339 21.3264 11.3339Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                      <path
                        d="M20.66 17.5789C20.7423 18.1336 20.6475 18.7001 20.3892 19.1978C20.131 19.6956 19.7224 20.0992 19.2215 20.3513C18.7206 20.6034 18.153 20.6911 17.5993 20.6021C17.0457 20.513 16.5343 20.2516 16.1378 19.8551C15.7413 19.4586 15.4799 18.9471 15.3908 18.3935C15.3017 17.8399 15.3895 17.2723 15.6416 16.7714C15.8937 16.2705 16.2973 15.8619 16.795 15.6036C17.2928 15.3453 17.8593 15.2506 18.4139 15.3329C18.9797 15.4168 19.5035 15.6804 19.908 16.0849C20.3125 16.4893 20.5761 17.0131 20.66 17.5789Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                      <path
                        d="M21.6597 14.3331H21.6663"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                    </svg>
                  </a>
                )}
                {footer.redes.linkedin && (
                  <a
                    href={footer.redes.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="group inline-flex transition-transform duration-[180ms] hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[38px] w-[38px]">
                      <path
                        d="M0 14C0 6.26802 6.26801 0 14 0H21.9979C29.7299 0 35.9979 6.26801 35.9979 14V21.9979C35.9979 29.7299 29.7299 35.9979 21.9979 35.9979H14C6.26802 35.9979 0 29.7299 0 21.9979V14Z"
                        fill="white"
                        fillOpacity="0.06"
                        className="[transition:fill-opacity_0.18s_ease,fill_0.18s_ease] group-hover:fill-[var(--azul-500)] group-hover:[fill-opacity:0.12]"
                      />
                      <path
                        d="M20.6598 15.3329C21.7204 15.3329 22.7375 15.7542 23.4875 16.5041C24.2374 17.2541 24.6587 18.2712 24.6587 19.3318V23.9972H21.9928V19.3318C21.9928 18.9783 21.8524 18.6392 21.6024 18.3893C21.3524 18.1393 21.0133 17.9988 20.6598 17.9988C20.3063 17.9988 19.9672 18.1393 19.7173 18.3893C19.4673 18.6392 19.3268 18.9783 19.3268 19.3318V23.9972H16.6609V19.3318C16.6609 18.2712 17.0822 17.2541 17.8321 16.5041C18.5821 15.7542 19.5992 15.3329 20.6598 15.3329Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                      <path
                        d="M13.9951 15.9994H11.3291V23.9972H13.9951V15.9994Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                      <path
                        d="M12.6621 13.9999C13.3983 13.9999 13.9951 13.4031 13.9951 12.6669C13.9951 11.9307 13.3983 11.3339 12.6621 11.3339C11.9259 11.3339 11.3291 11.9307 11.3291 12.6669C11.3291 13.4031 11.9259 13.9999 12.6621 13.9999Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                    </svg>
                  </a>
                )}
                {footer.redes.facebook && (
                  <a
                    href={footer.redes.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="group inline-flex transition-transform duration-[180ms] hover:-translate-y-0.5"
                  >
                    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[38px] w-[38px]">
                      <path
                        d="M0 14C0 6.26802 6.26801 0 14 0H21.9979C29.7299 0 35.9979 6.26801 35.9979 14V21.9979C35.9979 29.7299 29.7299 35.9979 21.9979 35.9979H14C6.26802 35.9979 0 29.7299 0 21.9979V14Z"
                        fill="white"
                        fillOpacity="0.06"
                        className="[transition:fill-opacity_0.18s_ease,fill_0.18s_ease] group-hover:fill-[var(--azul-500)] group-hover:[fill-opacity:0.12]"
                      />
                      <path
                        d="M21.993 11.3339H19.9935C19.1097 11.3339 18.2621 11.685 17.6371 12.31C17.0122 12.9349 16.6611 13.7825 16.6611 14.6664V16.6658H14.6616V19.3318H16.6611V24.6637H19.327V19.3318H21.3265L21.993 16.6658H19.327V14.6664C19.327 14.4896 19.3973 14.3201 19.5222 14.1951C19.6472 14.0701 19.8168 13.9999 19.9935 13.9999H21.993V11.3339Z"
                        stroke="white"
                        strokeOpacity="0.5"
                        strokeWidth="1.33298"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="[transition:stroke-opacity_0.18s_ease,stroke_0.18s_ease] group-hover:stroke-[var(--azul-300)] group-hover:[stroke-opacity:1]"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
