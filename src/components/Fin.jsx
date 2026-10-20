import { useEffect } from 'react'
import { sfx } from '../audio'
import { useKeys } from '../useKeys'

export default function Fin({ title, onMenu }) {
  useEffect(() => {
    sfx.win()
  }, [])
  useKeys((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onMenu()
    }
  })
  return (
    <div>
      <h1>{title}</h1>
      <p className="lede">Mirá cómo quedó la tabla. ¿Seguimos con otro partido?</p>
      <div className="actions">
        <button className="btn" type="button" data-af="1" onClick={onMenu}>
          Volver al menú
        </button>
      </div>
    </div>
  )
}
