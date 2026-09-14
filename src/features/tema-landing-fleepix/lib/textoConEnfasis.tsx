import { Fragment, type ReactNode } from 'react'

const PATRON = /\*\*(.+?)\*\*|==(.+?)==/g

/**
 * Convierte texto plano en JSX:
 *   **negrita** -> <strong>
 *   ==destacado== -> <span className="hl"> (subrayado animado de la plantilla)
 */
export function textoConEnfasis(texto: string): ReactNode[] {
  const nodos: ReactNode[] = []
  let ultimoIndice = 0
  let key = 0
  let match: RegExpExecArray | null

  PATRON.lastIndex = 0
  while ((match = PATRON.exec(texto))) {
    if (match.index > ultimoIndice) {
      nodos.push(<Fragment key={key++}>{texto.slice(ultimoIndice, match.index)}</Fragment>)
    }
    if (match[1] !== undefined) {
      nodos.push(<strong key={key++}>{match[1]}</strong>)
    } else {
      nodos.push(<span className="hl" key={key++}>{match[2]}</span>)
    }
    ultimoIndice = PATRON.lastIndex
  }
  if (ultimoIndice < texto.length) {
    nodos.push(<Fragment key={key++}>{texto.slice(ultimoIndice)}</Fragment>)
  }
  return nodos
}
