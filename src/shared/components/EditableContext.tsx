import { createContext, useContext } from 'react'

export type EditableCtx = {
  editable: boolean
  onChange: (path: string, value: string) => void
  onArchivoChange: (path: string, file: File) => void
  onAgregarFaq: () => void
  onQuitarFaq: (i: number) => void
  onAgregarContactoBullet: () => void
  onQuitarContactoBullet: (i: number) => void
}

const noop = () => {}
const noopIdx = (_i: number) => {}

const defaultCtx: EditableCtx = {
  editable: false,
  onChange: noop,
  onArchivoChange: noop,
  onAgregarFaq: noop,
  onQuitarFaq: noopIdx,
  onAgregarContactoBullet: noop,
  onQuitarContactoBullet: noopIdx,
}

const EditableContext = createContext<EditableCtx>(defaultCtx)

export const EditableProvider = EditableContext.Provider

export function useEditable() {
  return useContext(EditableContext)
}
