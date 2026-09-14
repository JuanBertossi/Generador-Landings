import { Sun, Moon } from 'lucide-react'
import { useTema } from '../hooks/useTema'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { tema, alternar } = useTema()

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-neutral-700 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 ${className}`}
    >
      {tema === 'oscuro' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
