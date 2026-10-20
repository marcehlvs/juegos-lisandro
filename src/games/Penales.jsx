import { useEffect, useRef, useState } from 'react'
import { Ball, Keeper } from '../components/Icons'
import { displayName } from '../store'

const COL_X = [16.7, 50, 83.3]
const ROW_Y = [26, 72]
const ZONES = ['Arriba a la izquierda', 'Arriba al medio', 'Arriba a la derecha', 'Abajo a la izquierda', 'Abajo al medio', 'Abajo a la derecha']

function outcomeFor(zone) {
  const col = zone % 3
  const row = Math.floor(zone / 3)
  const kc = Math.floor(Math.random() * 3)
  let result = 'goal'
  if (row === 0 && Math.random() < 0.15) result = 'miss'
  else if (kc === col && Math.random() < (row === 0 ? 0.55 : 0.85)) result = 'saved'
  return { col, row, kc, result }
}

export default function Penales({ api }) {
  const { S, order, add, setTurn, finish, sfx } = api
  const shots = order.concat(order) // cada jugador patea dos veces
  const [i, setI] = useState(0)
  const [shot, setShot] = useState(null) // {zone,col,row,kc,result}
  const [shown, setShown] = useState(false)
  const alive = useRef(true)
  const who = shots[i]

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])
  useEffect(() => {
    setTurn(who)
  }, [who]) // eslint-disable-line

  const kick = (zone) => {
    if (shot) return
    sfx.pop()
    const o = outcomeFor(zone)
    setShot({ zone, ...o })
    setTimeout(() => {
      if (!alive.current) return
      setShown(true)
      if (o.result === 'goal') {
        add(who, 10)
        sfx.goal()
      } else sfx.bad()
    }, 900)
  }
  const next = () => {
    if (i + 1 >= shots.length) {
      finish('penales', 'Tanda de penales terminada')
      return
    }
    setI(i + 1)
    setShot(null)
    setShown(false)
  }

  // posiciones del arquero y de la pelota
  const kx = shot ? COL_X[shot.kc] : 50
  const krot = shot ? (shot.kc === 0 ? -42 : shot.kc === 2 ? 42 : 0) : 0
  const bx = shot ? (shot.result === 'miss' ? COL_X[shot.col] + (shot.col === 2 ? 16 : shot.col === 0 ? -16 : 6) : COL_X[shot.col]) : 50
  const by = shot ? (shot.result === 'miss' ? -14 : ROW_Y[shot.row]) : 128

  return (
    <div>
      <p className="kicker">
        Penal {i + 1} de {shots.length} · Patea <b>{displayName(S.players[who], who)}</b>
      </p>
      <h2 className="q">{shot ? (shown ? (shot.result === 'goal' ? '¡GOOOL! +10 puntos' : shot.result === 'saved' ? '¡Lo atajó el arquero!' : '¡Afuera! Pasó cerca del palo') : '…') : 'Elegí dónde patear'}</h2>
      <div className="pitch">
        <div className="goal">
          <div className="zones" aria-hidden={!!shot}>
            {ZONES.map((z, k) => (
              <button key={k} type="button" className="zone" disabled={!!shot} onClick={() => kick(k)} aria-label={z}>
                <span>{z.replace('Arriba ', '').replace('Abajo ', '')}</span>
              </button>
            ))}
          </div>
          <Keeper className="keeper" style={{ left: kx + '%', transform: 'translateX(-50%) rotate(' + krot + 'deg)' }} />
          <Ball className="ball" style={{ left: bx + '%', top: by + '%', transform: 'translate(-50%,-50%) scale(' + (shot ? 0.72 : 1) + ')' }} />
        </div>
      </div>
      <div className="fb" aria-live="polite">
        {shown && (
          <button className="btn" type="button" data-af="1" onClick={next}>
            {i + 1 < shots.length ? 'Siguiente penal' : 'Terminar tanda'}
          </button>
        )}
      </div>
    </div>
  )
}
