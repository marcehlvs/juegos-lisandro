import { useState } from 'react'
import { DEFAULT_NUMBERS, TEAM_NAMES, displayName } from '../store'
import { shuffle } from '../util'

export default function Setup({ S, onSave }) {
  const [mode, setMode] = useState(S ? S.mode : 'solo')
  const [rows, setRows] = useState(() =>
    Array.from({ length: 6 }, (_, i) => {
      const p = S ? S.players[i] : null
      return { name: p ? p.name : '', no: p ? p.no : DEFAULT_NUMBERS[i], team: p ? p.team : i < 3 ? 0 : 1, pts: p ? p.pts : 0 }
    }),
  )
  const [msg, setMsg] = useState('')

  const set = (i, patch) => setRows((r) => r.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const mix = () => {
    const t = shuffle([0, 0, 0, 1, 1, 1])
    setRows((r) => r.map((x, i) => ({ ...x, team: t[i] })))
  }
  const save = (keep) => {
    const players = rows.map((r, i) => ({
      name: r.name.trim() || 'Jugador ' + (i + 1),
      no: Math.min(99, Math.max(1, parseInt(r.no, 10) || DEFAULT_NUMBERS[i])),
      team: r.team,
      pts: keep ? r.pts : 0,
    }))
    if (mode === 'team' && (players.every((p) => p.team === 0) || players.every((p) => p.team === 1))) {
      setMsg('Cada equipo necesita al menos un jugador.')
      return
    }
    onSave({ players, mode, keep })
  }

  return (
    <div>
      <h1>¿Quiénes juegan?</h1>
      <p className="lede">Poné el nombre y el número de camiseta de cada jugador. Si dejás un nombre vacío, se usa &quot;Jugador&quot; y su lugar.</p>
      <div className="seg" role="group" aria-label="Forma de jugar">
        <button type="button" className={'btn' + (mode === 'solo' ? '' : ' alt')} aria-pressed={mode === 'solo'} onClick={() => setMode('solo')}>
          Cada uno por su cuenta
        </button>
        <button type="button" className={'btn' + (mode === 'team' ? '' : ' alt')} aria-pressed={mode === 'team'} onClick={() => setMode('team')}>
          Dos equipos
        </button>
        {mode === 'team' && (
          <button type="button" className="btn alt" onClick={mix}>
            Mezclar equipos
          </button>
        )}
      </div>
      <div className="setup">
        {rows.map((r, i) => (
          <div className="row" key={i}>
            <label className="sr" htmlFor={'d' + i}>
              Número del jugador {i + 1}
            </label>
            <input id={'d' + i} className="dn" type="number" inputMode="numeric" min="1" max="99" value={r.no} onChange={(e) => set(i, { no: e.target.value })} />
            <label className="sr" htmlFor={'n' + i}>
              Nombre del jugador {i + 1}
            </label>
            <input id={'n' + i} type="text" maxLength={14} placeholder={'Jugador ' + (i + 1)} value={r.name} onChange={(e) => set(i, { name: e.target.value })} />
            {mode === 'team' && (
              <button type="button" className={'btn sm tm t' + r.team} onClick={() => set(i, { team: r.team === 0 ? 1 : 0 })} aria-label={'Equipo de ' + displayName(r, i) + ': ' + TEAM_NAMES[r.team] + '. Tocar para cambiar'}>
                {TEAM_NAMES[r.team].replace('Los ', '')}
              </button>
            )}
          </div>
        ))}
      </div>
      {mode === 'team' && <p className="note">Conviene que sean tres y tres.</p>}
      {msg && <p className="msg-bad">{msg}</p>}
      <div className="actions">
        {S ? (
          <>
            <button className="btn" type="button" onClick={() => save(true)}>
              Guardar y seguir
            </button>
            <button className="btn alt" type="button" onClick={() => save(false)}>
              Torneo nuevo (puntos en 0)
            </button>
          </>
        ) : (
          <button className="btn" type="button" onClick={() => save(false)}>
            ¡Que ruede la pelota!
          </button>
        )}
      </div>
    </div>
  )
}
