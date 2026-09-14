import { useEffect, useState, type ChangeEvent } from 'react'
import { useForm, useFieldArray, type FieldErrors, type FieldErrorsImpl } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import './styles/CrearInvitacion.css'
import InvitacionPage from './InvitacionPage.jsx'
import { invitacionBlankConfig } from './config.js'
import { invitacionSchema, type InvitacionFormData } from './schemas/invitacion.schema'
import { getPath } from '@/shared/lib/objectPath'
import { slugify } from '@/shared/lib/slugify'
import { PRECIOS, formatoPrecio } from '@/shared/lib/precios'
import { usePaginaPersistida } from '@/shared/hooks/usePaginaPersistida'
import { subirArchivo, eliminarArchivo } from '@/shared/lib/subirArchivo'
import { linkWhatsappSoporte } from '@/shared/lib/contacto'
import { urlPublicada, DOMINIO_BASE } from '@/shared/lib/dominio'
import { MobilePreviewFrame } from '@/shared/components/MobilePreviewFrame'
import { Bookmark, CheckCircle2, Copy, Check, AlertCircle, Globe, Monitor, Smartphone } from 'lucide-react'

const SECCIONES: { key: keyof NonNullable<InvitacionFormData['secciones']>; label: string }[] = [
  { key: 'eventInfo', label: 'Fecha y lugar' },
  { key: 'birthdaySection', label: 'Sección destacada con foto' },
  { key: 'quote', label: 'Frase/cita' },
  { key: 'rsvp', label: 'Confirmación de asistencia' },
]

function Field({
  label,
  path,
  config,
  onChange,
  type = 'text',
  textarea = false,
}: {
  label: string
  path: string
  config: InvitacionFormData
  onChange: (path: string, value: string) => void
  type?: string
  textarea?: boolean
}) {
  const value = (getPath(config, path) as string) ?? ''
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(path, e.target.value)
  return (
    <div className="crear-invitacion__field">
      <label htmlFor={path}>{label}</label>
      {textarea ? (
        <textarea id={path} value={value} onChange={handleChange} />
      ) : (
        <input id={path} type={type} value={value} onChange={handleChange} />
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
  config: InvitacionFormData
  onChange: (path: string, value: string) => void
}) {
  const value = (getPath(config, path) as string) ?? '#000000'
  return (
    <div className="crear-invitacion__field crear-invitacion__field--color">
      <label htmlFor={path}>{label}</label>
      <div className="crear-invitacion__color-row">
        <input id={path} type="color" value={value} onChange={(e) => onChange(path, e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(path, e.target.value)} />
      </div>
    </div>
  )
}

function primerMensajeError(errors: FieldErrors<InvitacionFormData> | FieldErrorsImpl | undefined): string | undefined {
  if (!errors) return undefined
  const conMensaje = errors as { message?: unknown }
  if (typeof conMensaje.message === 'string') return conMensaje.message
  for (const key of Object.keys(errors)) {
    const msg = primerMensajeError((errors as Record<string, FieldErrorsImpl>)[key])
    if (msg) return msg
  }
  return undefined
}

export default function CrearInvitacionPage() {
  const { datosIniciales, cargando, guardando, error, publicar, guardarDebounced } = usePaginaPersistida<InvitacionFormData>(
    'invitacion',
    invitacionBlankConfig as InvitacionFormData,
    '/crear/invitacion',
  )

  if (error) {
    return (
      <div className="crear-invitacion__error-pantalla">
        <AlertCircle size={32} strokeWidth={1.5} />
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    )
  }

  if (cargando || !datosIniciales) {
    return <div className="crear-invitacion__error-pantalla">Cargando tu página…</div>
  }

  return (
    <CrearInvitacionForm
      datosIniciales={datosIniciales}
      guardando={guardando}
      publicar={publicar}
      guardarDebounced={guardarDebounced}
    />
  )
}

function CrearInvitacionForm({
  datosIniciales,
  guardando,
  publicar,
  guardarDebounced,
}: {
  datosIniciales: InvitacionFormData
  guardando: boolean
  publicar: (slug: string, montoPagado: number) => Promise<void>
  guardarDebounced: (data: InvitacionFormData) => void
}) {
  const { watch, setValue, handleSubmit, control } = useForm<InvitacionFormData>({
    defaultValues: datosIniciales,
    resolver: zodResolver(invitacionSchema),
  })
  const config = watch()
  const preciosFieldArray = useFieldArray({ control, name: 'precios' })

  const [resultado, setResultado] = useState<{ slug: string; url: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [errorPublicar, setErrorPublicar] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [vistaMobile, setVistaMobile] = useState(false)
  const linkEdicion = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    const subscription = watch((value) => {
      guardarDebounced(value as InvitacionFormData)
    })
    return () => subscription.unsubscribe()
  }, [watch, guardarDebounced])

  function handleCopiarLink() {
    navigator.clipboard.writeText(linkEdicion).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  async function onGenerarValido(data: InvitacionFormData) {
    setPublicando(true)
    setErrorPublicar(null)
    let slug = slugify(data.anfitrion.nombre)
    try {
      try {
        await publicar(slug, PRECIOS.invitacion)
      } catch {
        slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
        await publicar(slug, PRECIOS.invitacion)
      }
      setResultado({ slug, url: urlPublicada(slug) })
    } catch {
      setErrorPublicar('No pudimos publicar tu invitación. Probá de nuevo en un momento.')
    } finally {
      setPublicando(false)
    }
  }

  function onGenerarInvalido(errors: FieldErrors<InvitacionFormData>) {
    setErrorPublicar(primerMensajeError(errors) ?? 'Revisá los campos del formulario.')
  }

  function handleChange(path: string, value: string) {
    setValue(path as Parameters<typeof setValue>[0], value, { shouldDirty: true })
  }

  function handleSeccionToggle(key: string, value: boolean) {
    setValue(`secciones.${key}` as Parameters<typeof setValue>[0], value as never, { shouldDirty: true })
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
        setErrorPublicar('No pudimos subir la foto. Probá de nuevo.')
      })
  }

  function handlePrecioChange(index: number, campo: 'categoria' | 'precio', value: string) {
    handleChange(`precios.${index}.${campo}`, value)
  }

  function agregarPrecio() {
    preciosFieldArray.append({ categoria: '', precio: '' })
  }

  function quitarPrecio(index: number) {
    preciosFieldArray.remove(index)
  }

  return (
    <div className="crear-invitacion">
      <div className="crear-invitacion__form">
        <div className="crear-invitacion__vista-toggle">
          <button type="button" className={vistaMobile ? '' : 'activo'} onClick={() => setVistaMobile(false)}>
            <Monitor size={15} strokeWidth={2} /> Desktop
          </button>
          <button type="button" className={vistaMobile ? 'activo' : ''} onClick={() => setVistaMobile(true)}>
            <Smartphone size={15} strokeWidth={2} /> Mobile
          </button>
        </div>

        <h1>Armá tu invitación</h1>
        <p>
          Vas viendo el resultado a la derecha, en tiempo real. Hacé clic sobre cualquier texto o foto de la vista previa para editarlo directamente.
          {guardando ? ' Guardando…' : ' Guardado.'}
        </p>
        <p className="crear-invitacion__aviso-link">
          <Bookmark size={15} strokeWidth={2} />
          <span><strong>No hay usuario ni contraseña</strong> — este link ES tu forma de entrar. Guardalo como favorito o mandátelo por WhatsApp a vos mismo, si no lo perdés el acceso a tu invitación.</span>
        </p>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Quién festeja</legend>
          <Field label="Nombre" path="anfitrion.nombre" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Bienvenida</legend>
          <Field label="Frase de bienvenida" path="bienvenida.subtitulo" config={config} onChange={handleChange} textarea />
          <Field label="ID de video de YouTube (opcional)" path="bienvenida.youtubeVideoId" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Evento</legend>
          <div className="crear-invitacion__field">
            <label htmlFor="evento.fechaHoraISO">Fecha y hora</label>
            <input
              id="evento.fechaHoraISO"
              type="datetime-local"
              value={config.evento.fechaHoraISO}
              onChange={(e) => handleChange('evento.fechaHoraISO', e.target.value)}
            />
          </div>
          <Field label="Link de Google Maps" path="evento.lugarMapsLink" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Apariencia</legend>
          <CampoColor label="Color de fondo (secciones claras)" path="apariencia.colorFondo" config={config} onChange={handleChange} />
          <CampoColor label="Color de texto (secciones claras)" path="apariencia.colorTexto" config={config} onChange={handleChange} />
          <CampoColor label="Color de acento (botones, líneas)" path="apariencia.colorAcento" config={config} onChange={handleChange} />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Secciones visibles</legend>
          <p className="crear-invitacion__ayuda">Destildá para ocultar un bloque completo de la invitación — se puede volver a mostrar cuando quieras.</p>
          {SECCIONES.map(({ key, label }) => (
            <label className="crear-invitacion__check" key={key}>
              <input
                type="checkbox"
                checked={config.secciones?.[key] ?? true}
                onChange={(e) => handleSeccionToggle(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Confirmación por WhatsApp</legend>
          <Field label="Tu WhatsApp (con código de país, sin +)" path="rsvp.telefonoWhatsapp" config={config} onChange={handleChange} />
          <Field label="Mensaje pre-cargado (usá {nombre} para el nombre del festejado)" path="rsvp.mensajePlantilla" config={config} onChange={handleChange} textarea />
          <div className="crear-invitacion__field">
            <label htmlFor="rsvp.fechaLimiteISO">Confirmar antes de</label>
            <input
              id="rsvp.fechaLimiteISO"
              type="date"
              value={config.rsvp.fechaLimiteISO}
              onChange={(e) => handleChange('rsvp.fechaLimiteISO', e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Textos que no se ven en la vista previa</legend>
          <Field label="Botón para entrar a la invitación" path="textos.botonIngresar" config={config} onChange={handleChange} />
          <Field label="Título del cuadro de precios" path="textos.tituloValorTarjeta" config={config} onChange={handleChange} />
          <Field label="Nota sobre la forma de pago" path="textos.notaPago" config={config} onChange={handleChange} textarea />
        </fieldset>

        <fieldset className="crear-invitacion__fieldset">
          <legend>Precio de entrada</legend>
          {preciosFieldArray.fields.map((field, i) => (
            <div className="crear-invitacion__precio-row" key={field.id}>
              <input
                placeholder="Categoría"
                value={config.precios?.[i]?.categoria ?? ''}
                onChange={(e) => handlePrecioChange(i, 'categoria', e.target.value)}
              />
              <input
                placeholder="Precio"
                value={config.precios?.[i]?.precio ?? ''}
                onChange={(e) => handlePrecioChange(i, 'precio', e.target.value)}
              />
              <button type="button" className="crear-invitacion__btn-quitar" onClick={() => quitarPrecio(i)} aria-label="Quitar categoría de precio">
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="crear-invitacion__btn-agregar" onClick={agregarPrecio}>
            + Agregar categoría
          </button>
        </fieldset>

        <div className="crear-invitacion__subdominio">
          <Globe size={16} strokeWidth={2} />
          <p>
            Tu invitación va a quedar en{' '}
            <strong>{config.anfitrion.nombre.trim() ? slugify(config.anfitrion.nombre) : 'tu-nombre'}.{DOMINIO_BASE}</strong>.
            {' '}¿Querés tu propio dominio (tuweb.com)?{' '}
            <a href={linkWhatsappSoporte('Hola! Quiero usar mi propio dominio para mi invitación.')} target="_blank" rel="noreferrer">
              Escribinos por WhatsApp
            </a>.
          </p>
        </div>

        <p className="crear-invitacion__precio-final">
          <span className="crear-invitacion__precio-tachado">{formatoPrecio(PRECIOS.invitacion)}</span>
          <strong>Gratis</strong> por tiempo limitado
        </p>
        {errorPublicar && <p className="crear-invitacion__error">{errorPublicar}</p>}
        <button type="button" className="crear-invitacion__btn-generar" onClick={handleSubmit(onGenerarValido, onGenerarInvalido)} disabled={publicando}>
          {publicando ? 'Generando…' : 'Generar invitación'}
        </button>

        {resultado && (
          <div className="crear-invitacion__resultado">
            <p className="crear-invitacion__resultado-titulo">
              <CheckCircle2 size={18} strokeWidth={2} />
              <strong>¡Listo, se guardó todo!</strong>
            </p>
            <p className="crear-invitacion__resultado-label">Tu invitación va a quedar en:</p>
            <p className="crear-invitacion__resultado-url">{resultado.url}</p>
            <p className="crear-invitacion__resultado-nota">
              Ese link se activa apenas conectemos el dominio. Hasta entonces, para volver a editar o generar de nuevo, usá este otro link — es tuyo, <strong>guardalo</strong>:
            </p>
            <div className="crear-invitacion__resultado-editar-row">
              <input type="text" readOnly value={linkEdicion} onFocus={(e) => e.target.select()} />
              <button type="button" onClick={handleCopiarLink}>
                {copiado ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="crear-invitacion__preview">
        {vistaMobile ? (
          <div className="crear-invitacion__preview-mobile-wrap">
            <MobilePreviewFrame>
              <InvitacionPage config={config} saltarBienvenida />
            </MobilePreviewFrame>
          </div>
        ) : (
          <div className="crear-invitacion__preview-frame">
            <InvitacionPage
              config={config}
              saltarBienvenida
              editable
              onFieldChange={handleChange}
              onArchivoChange={handleArchivoGenerico}
            />
          </div>
        )}
      </div>
    </div>
  )
}
