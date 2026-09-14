import { useEffect, useState, type ChangeEvent } from 'react'
import { useForm, useFieldArray, type FieldErrors, type FieldErrorsImpl } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import './styles/CrearLandingFleepix.css'
import LandingPage from './views/LandingPage'
import { fleepixBlankConfig } from './config'
import { landingFleepixSchema, type LandingFleepixFormData } from './schemas/landingFleepix.schema'
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

const SECCIONES: { key: keyof NonNullable<LandingFleepixFormData['secciones']>; label: string }[] = [
  { key: 'paraQuien', label: '¿Para quién?' },
  { key: 'beneficios', label: 'Beneficios' },
  { key: 'funcionalidades', label: 'Funcionalidades' },
  { key: 'faq', label: 'Preguntas frecuentes' },
  { key: 'contacto', label: 'Contacto' },
]

// El config en blanco arranca con fotos de stock precargadas (mismo look
// que el ejemplo) — si alguien publica sin tocar ninguna, su landing es un
// calco del template. Antes de publicar, exigimos que TODAS hayan sido
// reemplazadas por una foto propia. Esto compara contra fleepixBlankConfig,
// no se puede expresar como regla de schema — sigue siendo un chequeo aparte.
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

function fotosSinCambiar(config: LandingFleepixFormData): string[] {
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
  config: LandingFleepixFormData
  onChange: (path: string, value: string) => void
  textarea?: boolean
  placeholder?: string
}) {
  const value = (getPath(config, path) as string) ?? ''
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(path, e.target.value)
  return (
    <div className="crear-landing__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} placeholder={placeholder} onChange={handleChange} />
      ) : (
        <input id={path} type="text" value={value} placeholder={placeholder} onChange={handleChange} />
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
  config: LandingFleepixFormData
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

function primerMensajeError(errors: FieldErrors<LandingFleepixFormData> | FieldErrorsImpl | undefined): string | undefined {
  if (!errors) return undefined
  const conMensaje = errors as { message?: unknown }
  if (typeof conMensaje.message === 'string') return conMensaje.message
  for (const key of Object.keys(errors)) {
    const msg = primerMensajeError((errors as Record<string, FieldErrorsImpl>)[key])
    if (msg) return msg
  }
  return undefined
}

export default function CrearLandingFleepixPage() {
  const { datosIniciales, cargando, guardando, error, publicar, guardarDebounced } = usePaginaPersistida<LandingFleepixFormData>(
    'landing-fleepix',
    fleepixBlankConfig as LandingFleepixFormData,
    '/crear/landing-fleepix',
  )

  if (error) {
    return (
      <div className="crear-landing__error-pantalla">
        <AlertCircle size={32} strokeWidth={1.5} />
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  if (cargando || !datosIniciales) {
    return <div className="crear-landing__error-pantalla">Cargando tu página…</div>
  }

  return (
    <CrearLandingFleepixForm
      datosIniciales={datosIniciales}
      guardando={guardando}
      publicar={publicar}
      guardarDebounced={guardarDebounced}
    />
  )
}

function CrearLandingFleepixForm({
  datosIniciales,
  guardando,
  publicar,
  guardarDebounced,
}: {
  datosIniciales: LandingFleepixFormData
  guardando: boolean
  publicar: (slug: string, montoPagado: number) => Promise<void>
  guardarDebounced: (data: LandingFleepixFormData) => void
}) {
  const { watch, setValue, handleSubmit, control } = useForm<LandingFleepixFormData>({
    defaultValues: datosIniciales,
    resolver: zodResolver(landingFleepixSchema),
  })
  const config = watch()
  const faqFieldArray = useFieldArray({ control, name: 'faq.items' })

  const [resultado, setResultado] = useState<{ slug: string; url: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [vistaMobile, setVistaMobile] = useState(false)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const subscription = watch((value) => {
      guardarDebounced(value as LandingFleepixFormData)
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

  function handleArchivoGenerico(path: string, file: File) {
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

  function handleCheck(path: string, value: boolean) {
    setValue(path as Parameters<typeof setValue>[0], value as never, { shouldDirty: true })
  }

  function handleSeccionToggle(key: string, value: boolean) {
    setValue(`secciones.${key}` as Parameters<typeof setValue>[0], value as never, { shouldDirty: true })
  }

  function handleBeneficioIcono(i: number, value: string) {
    handleChange(`beneficios.items.${i}.icono`, value)
  }

  function handleFuncionalidadChipIcono(i: number, value: string) {
    handleChange(`funcionalidades.items.${i}.chipIcono`, value)
  }

  // --- FAQ (array dinámico) — solo agregar/quitar; el texto de cada
  // pregunta/respuesta se edita inline en el preview (EditableText). ---
  function agregarFaq() {
    faqFieldArray.append({ pregunta: '', respuesta: '' })
  }
  function quitarFaq(i: number) {
    faqFieldArray.remove(i)
  }

  // --- Bullets de la sección de contacto (array dinámico de strings, no
  // de objetos — useFieldArray no aplica acá) — solo agregar/quitar; el
  // texto de cada bullet se edita inline. Tampoco hay inputs individuales
  // en el sidebar para estos, así que no hace falta una key estable. ---
  function agregarContactoBullet() {
    setValue('contactoSeccion.bullets', [...config.contactoSeccion.bullets, ''], { shouldDirty: true })
  }
  function quitarContactoBullet(i: number) {
    setValue(
      'contactoSeccion.bullets',
      config.contactoSeccion.bullets.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    )
  }

  async function onGenerarValido(data: LandingFleepixFormData) {
    const faltantes = fotosSinCambiar(data)
    if (faltantes.length > 0) {
      setErrorPublicar(`Todavía tenés fotos de ejemplo sin cambiar: ${faltantes.join(', ')}. Subí las tuyas antes de publicar.`)
      return
    }
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(data.identidad.nombreEmpresa)
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

  function onGenerarInvalido(errors: FieldErrors<LandingFleepixFormData>) {
    setErrorPublicar(primerMensajeError(errors) ?? 'Revisá los campos del formulario.')
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
          {guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        <p className="crear-landing__aviso-link">
          <Bookmark size={15} strokeWidth={2} />
          <span>Guardá esta URL (o marcala como favorita) — es tu único acceso para seguir editando más tarde.</span>
        </p>

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

        <details className="crear-landing__seccion" open>
          <summary>Secciones visibles</summary>
          <p className="crear-landing__ayuda">Destildá para ocultar un bloque completo de la landing — se puede volver a mostrar cuando quieras.</p>
          {SECCIONES.map(({ key, label }) => (
            <label className="crear-landing__check" key={key}>
              <input
                type="checkbox"
                checked={config.secciones?.[key] ?? true}
                onChange={(e) => handleSeccionToggle(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
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
        <button type="button" className="crear-landing__btn-generar" onClick={handleSubmit(onGenerarValido, onGenerarInvalido)} disabled={publicando}>
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
