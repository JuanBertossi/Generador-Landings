import { useRef, useState } from 'react'
import './styles/CrearLandingVortex.css'
import VortexPage from './views/VortexPage'
import { vortexBlankConfig, type VortexConfig } from './config'
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

const SECCIONES: { key: keyof NonNullable<VortexConfig['secciones']>; label: string }[] = [
  { key: 'beneficios', label: 'Beneficios' },
  { key: 'soluciones', label: 'Soluciones (productos)' },
  { key: 'servicios', label: 'Servicios' },
  { key: 'comoEmpezar', label: 'Cómo empezar' },
  { key: 'beneficiosExtra', label: 'Beneficios (segundo bloque)' },
  { key: 'casos', label: 'Casos de éxito' },
  { key: 'preguntas', label: 'Preguntas frecuentes' },
  { key: 'ctaFinal', label: 'CTA final' },
]

function Field({
  label,
  path,
  config,
  onChange,
  textarea = false,
}: {
  label: string
  path: string
  config: VortexConfig
  onChange: (path: string, value: string) => void
  textarea?: boolean
}) {
  const value = (getPath(config, path) as string) ?? ''
  return (
    <div className="crear-vortex__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} onChange={(e) => onChange(path, e.target.value)} />
      ) : (
        <input id={path} type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
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
  config: VortexConfig
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? '#000000'
  return (
    <div className="crear-vortex__field">
      <label htmlFor={path}>{label}</label>
      <div className="crear-vortex__color-row">
        <input id={path} type="color" value={value} onChange={(e) => onChange(path, e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      </div>
    </div>
  )
}

export default function CrearLandingVortexPage() {
  const { config, setConfig, cargando, guardando, error, publicar } = usePaginaPersistida(
    'landing-vortex',
    vortexBlankConfig,
    '/crear/landing-vortex',
  )
  const [resultado, setResultado] = useState<{ slug: string; url: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [vistaMobile, setVistaMobile] = useState(false)
  const previewScrollRef = useRef<HTMLDivElement>(null)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  function handleCopiarLink() {
    navigator.clipboard.writeText(linkEdicion).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  function handleChange(path: string, value: string) {
    setConfig((prev) => setPath(prev, path, value))
  }

  function handleSeccionToggle(key: string, value: boolean) {
    setConfig((prev) => setPath(prev, `secciones.${key}`, value))
  }

  function handleArchivoChange(path: string, file: File) {
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

  async function handleGenerar() {
    if (!config.identidad.nombreEmpresa.trim()) {
      setErrorPublicar('Falta el nombre de tu empresa.')
      return
    }
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(config.identidad.nombreEmpresa)
    try {
      try {
        await publicar(slug, PRECIOS['landing-vortex'])
      } catch {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
        await publicar(slug, PRECIOS['landing-vortex'])
      }
      setResultado({ slug, url: urlPublicada(slug) })
    } catch {
      setErrorPublicar('No pudimos publicar tu landing. Probá de nuevo en un momento.')
    } finally {
      setPublicando(false)
    }
  }

  // --- Beneficios (problem, 3 items fijos) — solo el ícono queda en el panel, el resto se edita inline ---
  function handleProblemIcono(i: number, value: string) {
    setConfig((prev) => {
      const items = [...prev.problem.items]
      items[i] = { ...items[i], icono: value }
      return { ...prev, problem: { ...prev.problem, items } }
    })
  }

  // --- Proceso (4 fijos) — solo el ícono queda en el panel ---
  function handleProcesoIcono(i: number, value: string) {
    setConfig((prev) => {
      const items = [...prev.process.items]
      items[i] = { ...items[i], icono: value }
      return { ...prev, process: { ...prev.process, items } }
    })
  }

  // --- Casos (dinámico, máximo 4 — el mismo tope que usa el tile "+" del preview) — agregar/quitar queda en el panel, el texto de cada caso se edita inline ---
  const MAX_CASOS = 4
  function agregarCaso() {
    setConfig((prev) => {
      if (prev.testimonials.items.length >= MAX_CASOS) return prev
      return { ...prev, testimonials: { ...prev.testimonials, items: [...prev.testimonials.items, { tag: '', titulo: '', descripcion: '', logoUrl: '' }] } }
    })
  }
  function quitarCaso(i: number) {
    setConfig((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: prev.testimonials.items.filter((_, idx) => idx !== i) } }))
  }

  // --- FAQ (dinámico) — agregar/quitar queda en el panel, el texto de cada pregunta se edita inline ---
  function agregarFaq() {
    setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: [...prev.faq.items, { pregunta: '', respuesta: '' }] } }))
  }
  function quitarFaq(i: number) {
    setConfig((prev) => ({ ...prev, faq: { ...prev.faq, items: prev.faq.items.filter((_, idx) => idx !== i) } }))
  }

  if (error) {
    return (
      <div className="crear-vortex__error-pantalla">
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  return (
    <div className="crear-vortex">
      <div className="crear-vortex__form">
        <div className="crear-vortex__vista-toggle">
          <button type="button" className={vistaMobile ? '' : 'activo'} onClick={() => setVistaMobile(false)}>
            <Monitor size={15} strokeWidth={2} /> Desktop
          </button>
          <button type="button" className={vistaMobile ? 'activo' : ''} onClick={() => setVistaMobile(true)}>
            <Smartphone size={15} strokeWidth={2} /> Mobile
          </button>
        </div>

        <h1>Armá tu landing</h1>
        <p>
          Vas viendo el resultado a la derecha, en tiempo real. Hacé clic sobre cualquier texto o foto de la vista previa para editarlo directamente.
          {cargando ? ' Cargando tu página…' : guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        {!cargando && (
          <p className="crear-vortex__aviso-link">
            <Bookmark size={15} strokeWidth={2} />
            <span>Guardá esta URL (o marcala como favorita) — es tu único acceso para seguir editando más tarde.</span>
          </p>
        )}

        <details className="crear-vortex__seccion" open>
          <summary>Identidad</summary>
          <Field label="Nombre de tu empresa" path="identidad.nombreEmpresa" config={config} onChange={handleChange} />
          <Field label="WhatsApp (con código de país, sin +)" path="whatsappNumero" config={config} onChange={handleChange} />
          <Field label="Mensaje predefinido de WhatsApp" path="whatsappMensaje" config={config} onChange={handleChange} />
        </details>

        <details className="crear-vortex__seccion" open>
          <summary>Apariencia</summary>
          <CampoColor label="Color de fondo" path="apariencia.colorFondo" config={config} onChange={handleChange} />
          <CampoColor label="Color de texto" path="apariencia.colorTexto" config={config} onChange={handleChange} />
          <CampoColor label="Color de acento principal (el violeta secundario queda fijo)" path="apariencia.colorAcento" config={config} onChange={handleChange} />
        </details>

        <details className="crear-vortex__seccion" open>
          <summary>Secciones visibles</summary>
          <p className="crear-vortex__ayuda">Destildá para ocultar un bloque completo de la landing — se puede volver a mostrar cuando quieras.</p>
          {SECCIONES.map(({ key, label }) => (
            <label className="crear-vortex__check" key={key}>
              <input
                type="checkbox"
                checked={config.secciones?.[key] ?? true}
                onChange={(e) => handleSeccionToggle(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </details>

        <details className="crear-vortex__seccion" open>
          <summary>Portada (Hero)</summary>
          <div className="crear-vortex__field">
            <label>Tipo de fondo</label>
            <select value={config.hero.fondoTipo} onChange={(e) => handleChange('hero.fondoTipo', e.target.value)}>
              <option value="tunel">Túnel 3D (animado)</option>
              <option value="imagen">Imagen</option>
            </select>
          </div>
        </details>

        <details className="crear-vortex__seccion">
          <summary>Beneficios</summary>
          {config.problem.items.map((item, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Beneficio {i + 1}</p>
              <div className="crear-vortex__field">
                <label>Ícono</label>
                <select value={item.icono} onChange={(e) => handleProblemIcono(i, e.target.value)}>
                  {OPCIONES_ICONO.map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Cómo empezar</summary>
          {config.process.items.map((paso, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Paso {paso.numero}</p>
              <div className="crear-vortex__field">
                <label>Ícono</label>
                <select value={paso.icono} onChange={(e) => handleProcesoIcono(i, e.target.value)}>
                  {OPCIONES_ICONO.map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </div>
            </div>
          ))}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Casos de éxito</summary>
          <p className="crear-vortex__ayuda">El texto y el logo de cada caso se editan haciendo clic directo en la vista previa. Acá solo agregás o quitás casos.</p>
          {config.testimonials.items.map((_, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Caso {i + 1}</p>
              <button type="button" className="crear-vortex__btn-quitar" onClick={() => quitarCaso(i)}>Quitar caso</button>
            </div>
          ))}
          {config.testimonials.items.length < MAX_CASOS && (
            <button type="button" className="crear-vortex__btn-agregar" onClick={agregarCaso}>+ Agregar caso</button>
          )}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Preguntas frecuentes</summary>
          <p className="crear-vortex__ayuda">La pregunta y la respuesta se editan haciendo clic directo en la vista previa. Acá solo agregás o quitás preguntas.</p>
          {config.faq.items.map((_, i) => (
            <div className="crear-vortex__tarjeta" key={i}>
              <p className="crear-vortex__tarjeta-titulo">Pregunta {i + 1}</p>
              <button type="button" className="crear-vortex__btn-quitar" onClick={() => quitarFaq(i)}>Quitar pregunta</button>
            </div>
          ))}
          <button type="button" className="crear-vortex__btn-agregar" onClick={agregarFaq}>+ Agregar pregunta</button>
        </details>

        <details className="crear-vortex__seccion">
          <summary>Pie de página</summary>
          <Field label="WhatsApp (con código de país, sin +) — el que se abre al hacer clic" path="footer.contacto.whatsappNumero" config={config} onChange={handleChange} />
        </details>

        <div className="crear-vortex__subdominio">
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

        <p className="crear-vortex__precio-final">
          <span className="crear-vortex__precio-tachado">{formatoPrecio(PRECIOS['landing-vortex'])}</span>
          <strong>Gratis</strong> por tiempo limitado
        </p>
        {errorPublicar && <p className="crear-vortex__error">{errorPublicar}</p>}
        <button type="button" className="crear-vortex__btn-generar" onClick={handleGenerar} disabled={publicando}>
          {publicando ? 'Generando…' : 'Generar landing'}
        </button>

        {resultado && (
          <div className="crear-vortex__resultado">
            <p className="crear-vortex__resultado-titulo">
              <CheckCircle2 size={18} strokeWidth={2} />
              <strong>¡Listo, se guardó todo!</strong>
            </p>
            <p className="crear-vortex__resultado-label">Tu landing va a quedar en:</p>
            <p className="crear-vortex__resultado-url">{resultado.url}</p>
            <p className="crear-vortex__resultado-nota">
              Ese link se activa apenas conectemos el dominio. Hasta entonces, para volver a editar o generar de nuevo, usá este otro link — es tuyo, <strong>guardalo</strong>:
            </p>
            <div className="crear-vortex__resultado-editar-row">
              <p className="crear-vortex__resultado-url crear-vortex__resultado-url--editar">{linkEdicion}</p>
              <button type="button" onClick={handleCopiarLink}>
                {copiado ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="crear-vortex__preview">
        {vistaMobile ? (
          <div className="crear-vortex__preview-mobile-wrap">
            <MobilePreviewFrame>
              <VortexPage config={config} />
            </MobilePreviewFrame>
          </div>
        ) : (
          <div className="crear-vortex__preview-scroll" ref={previewScrollRef}>
            <VortexPage
              config={config}
              editable
              onFieldChange={handleChange}
              onArchivoChange={handleArchivoChange}
              onAgregarCaso={agregarCaso}
              onQuitarCaso={quitarCaso}
              onAgregarFaq={agregarFaq}
              onQuitarFaq={quitarFaq}
              scrollContainerRef={previewScrollRef}
            />
          </div>
        )}
      </div>
    </div>
  )
}
