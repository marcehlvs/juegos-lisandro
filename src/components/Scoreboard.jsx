import { displayName, teamTotals, TEAM_NAMES } from '../store'

export default function Scoreboard({ S, turn }) {
  const max = Math.max(...S.players.map((p) => p.pts))
  if (S.mode === 'team') {
    const tot = teamTotals(S)
    const tmax = Math.max(...tot)
    return (
      <section className="teams" aria-label="Tabla de puntos por equipo">
        {[0, 1].map((t) => (
          <div key={t} className={'team t' + t + (tmax > 0 && tot[t] === tmax ? ' lead' : '')}>
            <div className="team-head">
              <span className="team-name">{TEAM_NAMES[t]}</span>
              <span className="team-pts">{tot[t]}</span>
            </div>
            <div className="team-members">
              {S.players.map((p, i) =>
                p.team === t ? (
                  <span key={i} className={'mem-chip' + (turn === i ? ' turn' : '')}>
                    <b>{p.no}</b> {displayName(p, i)} <em>{p.pts}</em>
                  </span>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </section>
    )
  }
  return (
    <section className="board" aria-label="Tabla de puntos">
      {S.players.map((p, i) => (
        <div key={i} className={'pl' + (turn === i ? ' turn' : '') + (max > 0 && p.pts === max ? ' lead' : '')}>
          <span className="no">{p.no}</span>
          <span className="nm">{displayName(p, i)}</span>
          <span className="pt">{p.pts} pts</span>
        </div>
      ))}
    </section>
  )
}
