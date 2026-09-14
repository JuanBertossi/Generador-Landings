import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { obtenerPaginaPorToken, crearPagina, actualizarPagina, publicarPagina } from '@/shared/api/paginas.service'

type Tema = 'invitacion' | 'landing-fleepix' | 'landing-vortex'

type ErrorConCodigo = { code?: string; message?: string }

/**
 * Persiste el formulario de creación en Supabase vía edit_token (sin login,
 * ver supabase/schema.sql). Al entrar sin token crea la fila y la mete en la
 * URL; con token, recupera lo que ya se guardó. `datosIniciales` es el punto
 * de partida para el `useForm({defaultValues})` de react-hook-form del
 * llamador — este hook no dueña el estado del formulario, react-hook-form sí.
 * `guardarDebounced(data)` la llama el llamador cuando su propio `watch()`
 * cambia, para autoguardar con debounce mientras la persona completa el
 * formulario.
 */
export function usePaginaPersistida<T>(tema: Tema, configInicial: T, rutaBase: string) {
  const { token } = useParams<{ token?: string }>()
  const navigate = useNavigate()
  const [editToken, setEditToken] = useState<string | null>(token ?? null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cargaQuery = useQuery({
    queryKey: ['pagina', tema, token ?? 'nueva'],
    queryFn: async () => {
      if (token) {
        const data = await obtenerPaginaPorToken<T>(token)
        return { editToken: token, data }
      }
      const { editToken: nuevoToken, data } = await crearPagina<T>(tema, configInicial)
      return { editToken: nuevoToken, data }
    },
    staleTime: Infinity,
    retry: false,
  })

  // Guarda el editToken apenas la carga/creación resuelve, y navega a la
  // URL con token recién creada.
  useEffect(() => {
    if (!cargaQuery.data) return
    setEditToken(cargaQuery.data.editToken)
    if (!token) {
      navigate(`${rutaBase}/${cargaQuery.data.editToken}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargaQuery.data])

  const guardarMutation = useMutation({
    mutationFn: (data: T) => actualizarPagina(editToken as string, data),
  })

  const guardarDebounced = useCallback(
    (data: T) => {
      if (!editToken) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => guardarMutation.mutate(data), 800)
    },
    [editToken, guardarMutation],
  )

  const publicarMutation = useMutation({
    mutationFn: (params: { slug: string; montoPagado: number }) =>
      publicarPagina({ editToken: editToken as string, slug: params.slug, montoPagado: params.montoPagado }),
  })

  const publicar = useCallback(
    async (slug: string, montoPagado: number) => {
      if (!editToken) throw new Error('Todavía no se guardó la página, esperá un segundo.')
      await publicarMutation.mutateAsync({ slug, montoPagado })
    },
    [editToken, publicarMutation],
  )

  let error: string | null = null
  if (cargaQuery.isError) {
    const err = cargaQuery.error as ErrorConCodigo
    if (token) {
      error = 'No encontramos esa página. Puede que el link esté vencido o mal copiado.'
    } else {
      // P0001 = "raise exception" nuestro del lado de la función SQL (ej:
      // límite de páginas por IP) — ese mensaje ya está escrito para que lo
      // lea la persona, se muestra tal cual. Cualquier otro error usa el
      // mensaje genérico de siempre.
      error = err?.code === 'P0001' && err.message ? err.message : 'No pudimos empezar tu página. Probá de nuevo en un momento.'
    }
  }

  return {
    datosIniciales: cargaQuery.data?.data ?? null,
    guardarDebounced,
    editToken,
    cargando: cargaQuery.isLoading,
    guardando: guardarMutation.isPending,
    error,
    publicar,
  }
}
