import { useKeys } from '../useKeys'

// Pantalla para elegir la variante de una actividad
export default function Variantes({ title, sets, onPick, mix }) {
  const all = mix ? sets.concat([{ id: 'mix', title: 'Todo mezclado', desc: mix }]) : sets
  useKeys((e) => {
    const i = parseInt(e.key, 10) - 1
    if (i >= 0 && i < all.length) onPick(all[i].id)
  })
  return (
    <div className="variantes">
      <h2 className="q">{title}</h2>
      <div className="vgrid">
        {all.map((s, i) => (
          <button key={s.id} type="button" className="vcard" data-af={i === 0 ? '1' : undefined} onClick={() => onPick(s.id)}>
            <span className="vnum">{i + 1}</span>
            <strong>{s.title}</strong>
            <span>{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
