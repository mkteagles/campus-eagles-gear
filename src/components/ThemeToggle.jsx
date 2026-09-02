import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const isDark = theme === 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('eagles-theme', theme)
  }, [theme])

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {isDark ? <Sun /> : <Moon />}
      <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  )
}
