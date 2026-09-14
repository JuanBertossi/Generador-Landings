import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useForm, useFieldArray, type FieldErrors, type FieldErrorsImpl } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import './styles/CrearLandingVortex.css'
import VortexPage from './views/VortexPage'
import { vortexBlankConfig } from './config'
import { landingVortexSchema, type LandingVortexFormData } from './schemas/landingVortex.schema'
import { ICONOS } from './lib/iconos'
import { getPath } from '@/shared/lib/objectPath'
import { slugify } from '@/shared/lib/slugify'
import { PRECIOS, formatoPrecio } from '@/shared/lib/precios'
import { usePaginaPersistida } from '@/shared/hooks/usePaginaPersistida'
import { subirArchivo, eliminarArchivo } from '@/shared/lib/subirArchivo'
import { urlPublicada, DOMINIO_BASE } from '@/shared/lib/dominio'
import { linkWhatsappSoporte } from '@/shared/lib/contacto'
import { MobilePreviewFrame } from '@/shared/components/MobilePreviewFrame'
import { Bookmark, CheckCircle2, Copy, Check, AlertCircle, Globe, Monitor, Smartphone } from 'lucide-react'

const OPCIONES_ICONO = Object.keys(ICONOS)

const SECCIONES: { key: keyof NonNullable<LandingVortexFormData['secciones']>; label: string }[] = [
  { key: 'beneficios', label: 'Beneficios' },
  { key: 'soluciones', label: 'Soluciones (productos)' },
  { key: 'servicios', label: 'Servicios' },
  { key: 'comoEmpezar', label: 'Cómo empezar' },
  { key: 'beneficiosExtra', label: 'Beneficios (segundo bloque)' },
  { key: 'casos', label: 'Casos de éxito' },
  { key: 'preguntas', label: 'Preguntas frecuentes' },
  { key: 'ctaFinal', label: 'CTA final' },
]

const MAX_CASOS = 4

function Field({
  label,
  path,
  config,
  onChange,
}: {
  label: string
  path: string
  config: LandingVortexFormData
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? ''
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(path, e.target.value)
  return (
    <div className="crear-vortex__field">
      <label htmlFor={path}>{label}</label>
      <input id={path} type="text" value={value} onChange={handleChange} />
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
  config: LandingVortexFormData
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

function primerMensajeError(errors: FieldErrors<LandingVortexFormData> | FieldErrorsImpl | undefined): string | undefined {
  if (!errors) return undefined
  const conMensaje = errors as { message?: unknown }
  if (typeof conMensaje.message === 'string') return conMensaje.message
  for (const key of Object.keys(errors)) {
    const msg = primerMensajeError((errors as Record<string, FieldErrorsImpl>)[key])
    if (msg) return msg
  }
  return undefined
}

export default function CrearLandingVortexPage() {
  const { datosIniciales, cargando, guardando, error, publicar, guardarDebounced } = usePaginaPersistida<LandingVortexFormData>(
    'landing-vortex',
    vortexBlankConfig as LandingVortexFormData,
    '/crear/landing-vortex',
  )

  if (error) {
    return (
      <div className="crear-vortex__error-pantalla">
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  if (cargando || !datosIniciales) {
    return <div className="crear-vortex__error-pantalla">Cargando tu página…</div>
  }

  return (
    <CrearLandingVortexForm
      datosIniciales={datosIniciales}
      guardando={guardando}
      publicar={publicar}
      guardarDebounced={guardarDebounced}
    />
  )
}

function CrearLandingVortexForm({
  datosIniciales,
  guardando,
  publicar,
  guardarDebounced,
}: {
  datosIniciales: LandingVortexFormData
  guardando: boolean
  publicar: (slug: string, montoPagado: number) => Promise<void>
  guardarDebounced: (data: LandingVortexFormData) => void
}) {
  const { watch, setValue, handleSubmit, control } = useForm<LandingVortexFormData>({
    defaultValues: datosIniciales,
    resolver: zodResolver(landingVortexSchema),
  })
  const config = watch()
  const casosFieldArray = useFieldArray({ control, name: 'testimonials.items' })
  const faqFieldArray = useFieldArray({ control, name: 'faq.items' })

  const [resultado, setResultado] = useState<{ slug: string; url: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [vistaMobile, setVistaMobile] = useState(false)
  const previewScrollRef = useRef<HTMLDivElement>(null)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const subscription = watch((value) => {
      guardarDebounced(value as LandingVortexFormData)
    })
    return () => subscription.unsubscribe()
  }, [watch, guardarDebounced])

  function handleCopiarLink() {
    navigator.clipboard.writeText(linkEdicion).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  function handleChange(path: string, value: string) {
    setValue(path as Parameters<typeof setValue>[0], value, { shouldDirty: true })
  }

  function handleSeccionToggle(key: string, value: boolean) {
    setValue(`secciones.${key}` as Parameters<typeof setValue>[0], value as never, { shouldDirty: true })
  }

  function handleArchivoChange(path: string, file: File) {
    const anterior = getPath(config, path) as string | undefined
    setValue(path as Parameters<typeof setValue>[0], URL.createObjectURL(file), { shouldDirty: true })
    subirArchivo(file)
      .then((url) => {
        setValue(path as Parameters<typeof setValue>[0], url, { shouldDirty: true })
        eliminarArchivo(anterior)
      })
      .catch(() => {
        setValue(path as Parameters<typeof setValue>[0], anterior ?? '', { shouldDirty: true })
        setErrorPublicar('No pudimos subir el archivo. Probá de nuevo.')
      })
  }

  // --- Beneficios (problem, 3 items fijos) — solo el ícono queda en el panel, el resto se edita inline ---
  function handleProblemIcono(i: number, value: string) {
    handleChange(`problem.items.${i}.icono`, value)
  }

  // --- Proceso (4 fijos) — solo el ícono queda en el panel ---
  function handleProcesoIcono(i: number, value: string) {
    handleChange(`process.items.${i}.icono`, value)
  }

  // --- Casos (dinámico, máximo 4 — el mismo tope que usa el tile "+" del preview) — agregar/quitar queda en el panel, el texto de cada caso se edita inline ---
  function agregarCaso() {
    if (casosFieldArray.fields.length >= MAX_CASOS) return
    casosFieldArray.append({ tag: '', titulo: '', descripcion: '', logoUrl: '' })
  }
  function quitarCaso(i: number) {
    casosFieldArray.remove(i)
  }

  // --- FAQ (dinámico) — agregar/quitar queda en el panel, el texto de cada pregunta se edita inline ---
  function agregarFaq() {
    faqFieldArray.append({ pregunta: '', respuesta: '' })
  }
  function quitarFaq(i: number) {
    faqFieldArray.remove(i)
  }

  async function onGenerarValido(data: LandingVortexFormData) {
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(data.identidad.nombreEmpresa)
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

  function onGenerarInvalido(errors: FieldErrors<LandingVortexFormData>) {
    setErrorPublicar(primerMensajeError(errors) ?? 'Revisá los campos del formulario.')
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
          {guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        <p className="crear-vortex__aviso-link">
          <Bookmark size={15} strokeWidth={2} />
          <span>Guardá esta URL (o marcala como favorita) — es tu único acceso para seguir editando más tarde.</span>
        </p>

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
          {casosFieldArray.fields.map((field, i) => (
            <div className="crear-vortex__tarjeta" key={field.id}>
              <p className="crear-vortex__tarjeta-titulo">Caso {i + 1}</p>
              <button type="button" className="crear-vortex__btn-quitar" onClick={() => quitarCaso(i)}>Quitar caso</button>
            </div>
          ))}
          {casosFieldArray.fields.length < MAX_CASOS && (
            <button type="button" className="crear-vortex__btn-agregar" onClick={agregarCaso}>+ Agregar caso</button>
          )}
        </details>

        <details className="crear-vortex__seccion">
          <summary>Preguntas frecuentes</summary>
          <p className="crear-vortex__ayuda">La pregunta y la respuesta se editan haciendo clic directo en la vista previa. Acá solo agregás o quitás preguntas.</p>
          {faqFieldArray.fields.map((field, i) => (
            <div className="crear-vortex__tarjeta" key={field.id}>
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
        <button type="button" className="crear-vortex__btn-generar" onClick={handleSubmit(onGenerarValido, onGenerarInvalido)} disabled={publicando}>
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
              scrollContainerRef={previewScrollRef as React.RefObject<HTMLElement>}
            />
          </div>
        )}
      </div>
    </div>
  )
}
