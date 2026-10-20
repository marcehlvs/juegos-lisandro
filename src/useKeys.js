import { useEffect, useRef } from 'react'

// Atajos de teclado. Se ignoran mientras se escribe en un campo de texto.
export function useKeys(handler) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    const f = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target
      if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return
      ref.current(e)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [])
}
