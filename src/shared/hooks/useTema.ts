import { useEffect, useState } from 'react'

const CLAVE = 'generador-tema'

function preferenciaInicial(): 'claro' | 'oscuro' {
  const guardado = localStorage.getItem(CLAVE)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function useTema() {
  const [tema, setTema] = useState<'claro' | 'oscuro'>(preferenciaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'oscuro')
    localStorage.setItem(CLAVE, tema)
  }, [tema])

  function alternar() {
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))
  }

  return { tema, alternar }
}
