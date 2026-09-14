import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabaseClient'

type Tema = 'invitacion' | 'landing-fleepix' | 'landing-vortex'

/**
 * Persiste el formulario de creación en Supabase vía edit_token (sin login,
 * ver supabase/schema.sql). Al entrar sin token crea la fila y la mete en la
 * URL; con token, recupera lo que ya se guardó. Autoguarda con debounce
 * mientras la persona completa el formulario.
 */
export function usePaginaPersistida<T>(tema: Tema, configInicial: T, rutaBase: string) {
  const { token } = useParams<{ token?: string }>()
  const navigate = useNavigate()
  const [config, setConfig] = useState<T>(configInicial)
  const [editToken, setEditToken] = useState<string | null>(token ?? null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelado = false

    async function init() {
      if (token) {
        const { data, error: err } = await supabase.rpc('obtener_pagina_por_token', { p_edit_token: token })
        if (cancelado) return
        if (err || !data || data.length === 0) {
          setError('No encontramos esa página. Puede que el link esté vencido o mal copiado.')
          setCargando(false)
          return
        }
        setConfig(data[0].data as T)
        setEditToken(token)
        setCargando(false)
        return
      }

      const { data, error: err } = await supabase.rpc('crear_pagina', { p_tema: tema, p_data: configInicial as object })
      if (cancelado) return
      if (err || !data || data.length === 0) {
        // P0001 = "raise exception" nuestro del lado de la función SQL (ej:
        // límite de páginas por IP) — ese mensaje ya está escrito para que
        // lo lea la persona, se muestra tal cual. Cualquier otro error
        // (conexión, etc.) usa el mensaje genérico de siempre.
        setError(err?.code === 'P0001' && err.message ? err.message : 'No pudimos empezar tu página. Probá de nuevo en un momento.')
        setCargando(false)
        return
      }
      setEditToken(data[0].edit_token)
      setCargando(false)
      navigate(`${rutaBase}/${data[0].edit_token}`, { replace: true })
    }

    init()
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    if (!editToken || cargando) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setGuardando(true)
      await supabase.rpc('actualizar_pagina', { p_edit_token: editToken, p_data: config as object })
      setGuardando(false)
    }, 800)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [config, editToken, cargando])

  const publicar = useCallback(
    async (slug: string, montoPagado: number) => {
      if (!editToken) throw new Error('Todavía no se guardó la página, esperá un segundo.')
      const { error: err } = await supabase.rpc('publicar_pagina', {
        p_edit_token: editToken,
        p_slug: slug,
        p_pago_id: 'promo-gratis',
        p_monto_pagado: montoPagado,
        p_moneda: 'ARS',
      })
      if (err) throw err
    },
    [editToken],
  )

  return { config, setConfig, editToken, cargando, guardando, error, publicar }
}
