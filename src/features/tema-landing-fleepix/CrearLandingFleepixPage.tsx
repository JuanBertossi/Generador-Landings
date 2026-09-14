import { useState } from 'react'
import './styles/CrearLandingFleepix.css'
import LandingPage from './views/LandingPage'
import { fleepixBlankConfig, type LandingFleepixConfig } from './config'
import { ICONOS } from './lib/iconos'
import { setPath, getPath } from '@/shared/lib/objectPath'
import { slugify } from '@/shared/lib/slugify'
import { PRECIOS, formatoPrecio } from '@/shared/lib/precios'
import { usePaginaPersistida } from '@/shared/hooks/usePaginaPersistida'
import { subirArchivo, eliminarArchivo } from '@/shared/lib/subirArchivo'
import { urlPublicada, DOMINIO_BASE } from '@/shared/lib/dominio'
import { linkWhatsappSoporte } from '@/shared/lib/contacto'
import { MobilePreviewFrame } from '@/shared/components/MobilePreviewFrame'
import { Bookmark, CheckCircle2, Copy, Check, AlertCircle, Globe, Monitor, Smartphone } from 'lucide-react'

const OPCIONES_ICONO = Object.keys(ICONOS)

// El config en blanco arranca con fotos de stock precargadas (mismo look
// que el ejemplo) — si alguien publica sin tocar ninguna, su landing es un
// calco del template. Antes de publicar, exigimos que TODAS hayan sido
// reemplazadas por una foto propia.
const FOTOS_A_VALIDAR: { path: string; label: string }[] = [
  { path: 'hero.fotoPrincipal', label: 'Foto principal del hero' },
  { path: 'hero.fotoSecundaria', label: 'Foto secundaria del hero' },
  { path: 'paraQuien.tarjetaFoto1.foto', label: 'Foto de "¿Para quién?" (tarjeta 1)' },
  { path: 'paraQuien.tarjetaFoto2.foto', label: 'Foto de "¿Para quién?" (tarjeta 2)' },
  { path: 'funcionalidades.items.0.foto', label: 'Foto de Funcionalidad 1' },
  { path: 'funcionalidades.items.1.foto', label: 'Foto de Funcionalidad 2' },
  { path: 'funcionalidades.items.2.foto', label: 'Foto de Funcionalidad 3' },
  { path: 'funcionalidades.items.3.foto', label: 'Foto de Funcionalidad 4' },
  { path: 'funcionalidades.items.4.foto', label: 'Foto de Funcionalidad 5' },
  { path: 'funcionalidades.items.5.foto', label: 'Foto de Funcionalidad 6' },
]

function fotosSinCambiar(config: LandingFleepixConfig): string[] {
  return FOTOS_A_VALIDAR.filter(({ path }) => getPath(config, path) === getPath(fleepixBlankConfig, path)).map(
    ({ label }) => label,
  )
}

function Field({
  label,
  path,
  config,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string
  path: string
  config: LandingFleepixConfig
  onChange: (path: string, value: string) => void
  textarea?: boolean
  placeholder?: string
}) {
  const value = (getPath(config, path) as string) ?? ''
  return (
    <div className="crear-landing__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} placeholder={placeholder} onChange={(e) => onChange(path, e.target.value)} />
      ) : (
        <input id={path} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(path, e.target.value)} />
      )}
    </div>
  )
}

function CampoColor({
  label,
  path,
  config,
  onChange,
}: {
  label: string
  path: string
  config: LandingFleepixConfig
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? '#000000'
  return (
    <div className="crear-landing__field crear-landing__field--color">
      <label htmlFor={path}>{label}</label>
      <div className="crear-landing__color-row">
        <input id={path} type="color" value={value} onChange={(e) => onChange(path, e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      </div>
    </div>
  )
}

export default function CrearLandingFleepixPage() {
  const { config, setConfig, cargando, guardando, error, publicar } = usePaginaPersistida(
    'landing-fleepix',
    fleepixBlankConfig,
    '/crear/landing-fleepix',
  )
  const [resultado, setResultado] = useState<{ slug: string; url: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [vistaMobile, setVistaMobile] = useState(false)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  function handleCopiarLink() {
    navigator.clipboard.writeText(linkEdicion).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  async function handleGenerar() {
    if (!config.identidad.nombreEmpresa.trim()) {
      setErrorPublicar('Falta el nombre de tu empresa.')
      return
    }
    const faltantes = fotosSinCambiar(config)
    if (faltantes.length > 0) {
      setErrorPublicar(`Todavía tenés fotos de ejemplo sin cambiar: ${faltantes.join(', ')}. Subí las tuyas antes de publicar.`)
      return
    }
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(config.identidad.nombreEmpresa)
    try {
      try {
        await publicar(slug, PRECIOS['landing-fleepix'])
      } catch {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
        await publicar(slug, PRECIOS['landing-fleepix'])
      }
      setResultado({ slug, url: urlPublicada(slug) })
    } catch {
      setErrorPublicar('No pudimos publicar tu landing. Probá de nuevo en un momento.')
    } finally {
      setPublicando(false)
    }
  }

  function handleChange(path: string, value: string) {
    setConfig((prev) => setPath(prev, path, value))
  }

  function handleArchivoGenerico(path: string, file: File) {
    const anterior = getPath(config, path) as string | undefined
    setConfig((prev) => setPath(prev, path, URL.createObjectURL(file)))
    subirArchivo(file)
      .then((url) => {
        setConfig((prev) => setPath(prev, path, url))
        eliminarArchivo(anterior)
      })
      .catch(() => {
        setConfig((prev) => setPath(prev, path, anterior ?? ''))
        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
      })
  }

  function handleCheck(path: string, value: boolean) {
    setConfig((prev) => setPath(prev, path, value))
  }

  function handleBeneficioIcono(i: number, value: string) {
    setConfig((prev) => {
      const items = [...prev.beneficios.items]
      items[i] = { ...items[i], icono: value }
      return { ...prev, beneficios: { ...prev.beneficios, items } }
    })
  }

  function handleFuncionalidadChipIcono(i: number, value: string) {
    setConfig((prev) => {
      const items = [...prev.funcionalidades.items]
      items[i] = { ...items[i], chipIcono: value }
      return { ...prev, funcionalidades: { ...prev.funcionalidades, items } }
    })
  }

  // --- FAQ (array dinámico) — solo agregar/quitar; el texto de cada
  // pregunta/respuesta ahora se edita inline en el preview (EditableText). ---
  function agregarFaq() {
    setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: [...prev.faq.items, { pregunta: '', respuesta: '' }] } }))
  }
  function quitarFaq(i: number) {
    setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: prev.faq.items.filter((_, idx) => idx !== i) } }))
  }

  // --- Bullets de la sección de contacto (array dinámico) — solo
  // agregar/quitar; el texto de cada bullet se edita inline. ---
  function agregarContactoBullet() {
    setConfig((prev) => ({ ...prev, contactoSeccion: { ...prev.contactoSeccion, bullets: [...prev.contactoSeccion.bullets, ''] } }))
  }
  function quitarContactoBullet(i: number) {
    setConfig((prev) => ({
      ...prev,
      contactoSeccion: { ...prev.contactoSeccion, bullets: prev.contactoSeccion.bullets.filter((_, idx) => idx !== i) },
    }))
  }

  if (error) {
    return (
      <div className="crear-landing__error-pantalla">
        <AlertCircle size={32} strokeWidth={1.5} />
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <div className="crear-landing">
      <div className="crear-landing__form">
        <div className="crear-landing__vista-toggle">
          <button type="button" className={vistaMobile ? '' : 'activo'} onClick={() => setVistaMobile(false)}>
            <Monitor size={15} strokeWidth={2} /> Desktop
          </button>
          <button type="button" className={vistaMobile ? 'activo' : ''} onClick={() => setVistaMobile(true)}>
            <Smartphone size={15} strokeWidth={2} /> Mobile
          </button>
        </div>

        <h1>Armá tu landing</h1>
        <p>
          Vas viendo el resultado a la derecha, en tiempo real.
          {cargando ? ' Cargando tu página…' : guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        {!cargando && (
          <p className="crear-landing__aviso-link">
            <Bookmark size={15} strokeWidth={2} />
            <span>Guardá esta URL (o marcala como favorita) — es tu único acceso para seguir editando más tarde.</span>
          </p>
        )}

        <details className="crear-landing__seccion" open>
          <summary>Identidad</summary>
          <Field label="Nombre de tu empresa" path="identidad.nombreEmpresa" config={config} onChange={handleChange} />
          <Field label="WhatsApp (con código de país, sin +)" path="whatsappNumero" config={config} onChange={handleChange} />
          <Field label="Mensaje predefinido del botón de WhatsApp" path="whatsappMensajeDemo" config={config} onChange={handleChange} />
        </details>

        <details className="crear-landing__seccion" open>
          <summary>Apariencia</summary>
          <CampoColor label="Color de fondo" path="apariencia.colorFondo" config={config} onChange={handleChange} />
          <CampoColor label="Color de texto" path="apariencia.colorTexto" config={config} onChange={handleChange} />
          <CampoColor label="Color de acento (botones, links, destacados)" path="apariencia.colorAcento" config={config} onChange={handleChange} />
        </details>

        <details className="crear-landing__seccion">
          <summary>Beneficios</summary>
          {config.beneficios.items.map((item, i) => (
            <div className="crear-landing__tarjeta" key={i}>
              <p className="crear-landing__tarjeta-titulo">Beneficio {i + 1}</p>
              <div className="crear-landing__field">
                <label>Ícono</label>
                <select value={item.icono} onChange={(e) => handleBeneficioIcono(i, e.target.value)}>
                  {OPCIONES_ICONO.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </details>

        <details className="crear-landing__seccion">
          <summary>Funcionalidades</summary>
          {config.funcionalidades.items.map((item, i) => (
            <div className="crear-landing__tarjeta" key={i}>
              <p className="crear-landing__tarjeta-titulo">Funcionalidad {i + 1}</p>
              <div className="crear-landing__field">
                <label>Ícono de la etiqueta</label>
                <select value={item.chipIcono} onChange={(e) => handleFuncionalidadChipIcono(i, e.target.value)}>
                  {OPCIONES_ICONO.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </details>

        <details className="crear-landing__seccion">
          <summary>Pie de página</summary>
          <Field label="WhatsApp (con código de país, sin +)" path="footer.contacto.whatsappNumero" config={config} onChange={handleChange} />
          <Field label="Instagram (URL, opcional)" path="footer.redes.instagram" config={config} onChange={handleChange} />
          <Field label="LinkedIn (URL, opcional)" path="footer.redes.linkedin" config={config} onChange={handleChange} />
          <Field label="Facebook (URL, opcional)" path="footer.redes.facebook" config={config} onChange={handleChange} />

          <label className="crear-landing__check">
            <input
              type="checkbox"
              checked={config.footer.mostrarBloqueDesarrolloAMedida}
              onChange={(e) => handleCheck('footer.mostrarBloqueDesarrolloAMedida', e.target.checked)}
            />
            Mostrar bloque "¿Tenés un requerimiento especial?"
          </label>
          {config.footer.mostrarBloqueDesarrolloAMedida && (
            <Field
              label="Mensaje de WhatsApp de ese botón"
              path="footer.mensajeWhatsappDesarrolloAMedida"
              config={config}
              onChange={handleChange}
            />
          )}
        </details>

        <div className="crear-landing__subdominio">
          <Globe size={16} strokeWidth={2} />
          <p>
            Tu landing va a quedar en{' '}
            <strong>{config.identidad.nombreEmpresa.trim() ? slugify(config.identidad.nombreEmpresa) : 'tu-empresa'}.{DOMINIO_BASE}</strong>.
            {' '}¿Querés tu propio dominio (tuweb.com)?{' '}
            <a href={linkWhatsappSoporte('Hola! Quiero usar mi propio dominio para mi landing.')} target="_blank" rel="noreferrer">
              Escribinos por WhatsApp
            </a>.
          </p>
        </div>

        <p className="crear-landing__precio-final">
          <span className="crear-landing__precio-tachado">{formatoPrecio(PRECIOS['landing-fleepix'])}</span>
          <strong>Gratis</strong> por tiempo limitado
        </p>
        {errorPublicar && <p className="crear-landing__error">{errorPublicar}</p>}
        <button type="button" className="crear-landing__btn-generar" onClick={handleGenerar} disabled={publicando}>
          {publicando ? 'Generando…' : 'Generar landing'}
        </button>

        {resultado && (
          <div className="crear-landing__resultado">
            <p className="crear-landing__resultado-titulo">
              <CheckCircle2 size={18} strokeWidth={2} />
              <strong>¡Listo, se guardó todo!</strong>
            </p>
            <p className="crear-landing__resultado-label">Tu landing va a quedar en:</p>
            <p className="crear-landing__resultado-url">{resultado.url}</p>
            <p className="crear-landing__resultado-nota">
              Ese link se activa apenas conectemos el dominio. Hasta entonces, para volver a editar o generar de nuevo, usá este otro link — es tuyo, <strong>guardalo</strong>:
            </p>
            <div className="crear-landing__resultado-editar-row">
              <input type="text" readOnly value={linkEdicion} onFocus={(e) => e.target.select()} />
              <button type="button" onClick={handleCopiarLink}>
                {copiado ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="crear-landing__preview">
        {vistaMobile ? (
          <div className="crear-landing__preview-mobile-wrap">
            <MobilePreviewFrame>
              <LandingPage config={config} />
            </MobilePreviewFrame>
          </div>
        ) : (
          <div className="crear-landing__preview-scroll">
            <LandingPage
              config={config}
              editable
              onFieldChange={handleChange}
              onArchivoChange={handleArchivoGenerico}
              onAgregarFaq={agregarFaq}
              onQuitarFaq={quitarFaq}
              onAgregarContactoBullet={agregarContactoBullet}
              onQuitarContactoBullet={quitarContactoBullet}
            />
          </div>
        )}
      </div>
    </div>
  )
}
