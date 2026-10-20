import { useEffect, useRef } from 'react'

export default function Modal({ title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const f = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', f)
    if (ref.current) ref.current.focus()
    return () => window.removeEventListener('keydown', f)
  }, [onClose])
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-top">
          <h2>{title}</h2>
          <button ref={ref} className="btn alt sm" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
