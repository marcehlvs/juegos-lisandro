import { useEffect } from 'react'
import Confetti from './Confetti'
import { Stars } from './Icons'
import { sfx } from '../audio'
import { displayName, teamTotals, TEAM_NAMES } from '../store'

export default function Podium({ S, onMenu }) {
  const team = S.mode === 'team'
  const entries = team
    ? teamTotals(S).map((pts, t) => ({ name: TEAM_NAMES[t], pts, no: t === 0 ? 'C' : 'B' }))
    : S.players.map((p, i) => ({ name: displayName(p, i), pts: p.pts, no: p.no }))
  const rank = entries.slice().sort((a, b) => b.pts - a.pts)
  const top = rank[0].pts
  const champs = rank.filter((e) => e.pts === top)
  const best = team ? S.players.map((p, i) => ({ p, i })).sort((a, b) => b.p.pts - a.p.pts)[0] : null

  useEffect(() => {
    if (top > 0) sfx.win()
  }, [top])

  if (top <= 0) {
    return (
      <div>
        <h1>Todavía no hay podio</h1>
        <p className="lede">Nadie sumó puntos. Jugá un partido y volvé.</p>
        <div className="actions">
          <button className="btn" type="button" onClick={onMenu}>
            Volver al menú
          </button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="podio">
        <p className="kicker">{team ? 'Equipo campeón' : champs.length > 1 ? 'Campeones' : 'Campeón'} de la pijamada</p>
        <h1 className="champ">{champs.map((c) => c.name).join(' y ')}</h1>
        <Stars n={3} />
        <p className="champpts">{top} puntos</p>
      </div>
      <ol className="rank">
        {rank.map((e, i) => (
          <li key={i}>
            <span className="no">{e.no}</span>
            <span className="nm">{e.name}</span>
            <span className="bar">
              <i style={{ width: Math.round((e.pts / top) * 100) + '%' }} />
            </span>
            <span className="pt">{e.pts}</span>
          </li>
        ))}
      </ol>
      {best && best.p.pts > 0 && (
        <p className="note center">
          Mejor jugador: <b>{displayName(best.p, best.i)}</b> con {best.p.pts} puntos.
        </p>
      )}
      <div className="actions center">
        <button className="btn" type="button" onClick={onMenu}>
          Volver al menú
        </button>
      </div>
      <Confetti />
    </div>
  )
}
