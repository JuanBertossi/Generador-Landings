import { supabase } from '@/shared/lib/supabaseClient'

type Tema = 'invitacion' | 'landing-fleepix' | 'landing-vortex'

export type PaginaCargada<T> = { data: T; edit_token?: string }

/**
 * Las 5 llamadas a Supabase que arman la persistencia de páginas — usadas
 * por los 3 temas + PaginaPublicada, por eso viven acá y no en
 * features/*\/api (ver supabase/schema.sql para las funciones RPC).
 */

export async function obtenerPaginaPorToken<T>(token: string): Promise<T> {
  const { data, error } = await supabase.rpc('obtener_pagina_por_token', { p_edit_token: token })
  if (error || !data || data.length === 0) {
    throw error ?? new Error('No encontramos esa página.')
  }
  return data[0].data as T
}

export async function crearPagina<T>(tema: Tema, dataInicial: T): Promise<{ editToken: string; data: T }> {
  const { data, error } = await supabase.rpc('crear_pagina', { p_tema: tema, p_data: dataInicial as object })
  if (error || !data || data.length === 0) {
    throw error ?? new Error('No pudimos crear la página.')
  }
  return { editToken: data[0].edit_token as string, data: dataInicial }
}

export async function actualizarPagina<T>(editToken: string, data: T): Promise<void> {
  const { error } = await supabase.rpc('actualizar_pagina', { p_edit_token: editToken, p_data: data as object })
  if (error) throw error
}

export async function publicarPagina(params: {
  editToken: string
  slug: string
  montoPagado: number
}): Promise<void> {
  const { error } = await supabase.rpc('publicar_pagina', {
    p_edit_token: params.editToken,
    p_slug: params.slug,
    p_pago_id: 'promo-gratis',
    p_monto_pagado: params.montoPagado,
    p_moneda: 'ARS',
  })
  if (error) throw error
}

export async function obtenerPaginaPublica<T>(slug: string): Promise<{ id: string; tema: Tema; data: T } | null> {
  const { data, error } = await supabase.rpc('obtener_pagina_publica', { p_slug: slug })
  const fila = Array.isArray(data) ? data[0] : null
  if (error || !fila) return null
  return fila as { id: string; tema: Tema; data: T }
}
