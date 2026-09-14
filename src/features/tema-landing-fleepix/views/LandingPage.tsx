import { useEffect } from 'react'
import '../shared/styles/global.css'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { ParaQuien } from '../components/ParaQuien'
import { Beneficios } from '../components/Beneficios'
import { Funcionalidades } from '../components/Funcionalidades'
import { Faq } from '../components/Faq'
import { ContactForm } from '../components/ContactForm'
import { Footer } from '../components/Footer'
import { fleepixDefaultConfig, type LandingFleepixConfig } from '../config'
import { useProteccionBasica } from '@/shared/hooks/useProteccionBasica'
import { derivarPaleta } from '../lib/paletaDerivada'
import { EditableProvider } from '@/shared/components/EditableContext'

type LandingPageProps = {
  config?: LandingFleepixConfig
  paginaId?: string | null
  editable?: boolean
  onFieldChange?: (path: string, value: string) => void
  onArchivoChange?: (path: string, file: File) => void
  onAgregarFaq?: () => void
  onQuitarFaq?: (i: number) => void
  onAgregarContactoBullet?: () => void
  onQuitarContactoBullet?: (i: number) => void
}

export default function LandingPage({
  config = fleepixDefaultConfig,
  paginaId = null,
  editable = false,
  onFieldChange,
  onArchivoChange,
  onAgregarFaq,
  onQuitarFaq,
  onAgregarContactoBullet,
  onQuitarContactoBullet,
}: LandingPageProps) {
  const proteccionRef = useProteccionBasica()
  useEffect(() => {
    const previo = document.documentElement.getAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', 'light')
    return () => {
      if (previo === null) document.documentElement.removeAttribute('data-theme')
      else document.documentElement.setAttribute('data-theme', previo)
    }
  }, [])

  const coloresPersonalizados = derivarPaleta(config.apariencia)
  // Páginas publicadas antes de esta feature no tienen `secciones` guardado
  // todavía — sin el campo, cada bloque se sigue mostrando (default true).
  const mostrar = (clave: keyof NonNullable<LandingFleepixConfig['secciones']>) => config.secciones?.[clave] !== false

  return (
    <EditableProvider
      value={{
        editable,
        onChange: onFieldChange ?? (() => {}),
        onArchivoChange: onArchivoChange ?? (() => {}),
        onAgregarFaq: onAgregarFaq ?? (() => {}),
        onQuitarFaq: onQuitarFaq ?? (() => {}),
        onAgregarContactoBullet: onAgregarContactoBullet ?? (() => {}),
        onQuitarContactoBullet: onQuitarContactoBullet ?? (() => {}),
      }}
    >
      <div id="site" ref={proteccionRef} style={coloresPersonalizados}>
        <Navbar config={config} />
        <Hero config={config} />
        {mostrar('paraQuien') && <ParaQuien config={config} />}
        {mostrar('beneficios') && <Beneficios config={config} />}
        {mostrar('funcionalidades') && <Funcionalidades config={config} />}
        {mostrar('faq') && <Faq config={config} />}
        {mostrar('contacto') && <ContactForm config={config} paginaId={paginaId} />}
        <Footer config={config} />
      </div>
    </EditableProvider>
  )
}
