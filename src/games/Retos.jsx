import { useEffect, useRef, useState } from 'react'
import { RETOS } from '../data/retos'
import { displayName } from '../store'
import { shuffle } from '../util'

export default function Retos({ api }) {
  const { S, order, add, setTurn, finish, sfx } = api
  const [deck] = useState(() => shuffle(RETOS).slice(0, order.length))
  const [n, setN] = useState(0)
  const [left, setLeft] = useState(null)
  const timer = useRef(null)
  const who = order[n]
  const r = deck[n]

  useEffect(() => {
    setTurn(who)
  }, [who]) // eslint-disable-line
  useEffect(() => () => clearInterval(timer.current), [])

  const start = () => {
    clearInterval(timer.current)
    let t = 20
    setLeft(t)
    timer.current = setInterval(() => {
      t -= 1
      setLeft(t)
      if (t <= 0) {
        clearInterval(timer.current)
        sfx.bad()
      } else if (t <= 3) sfx.tick()
    }, 1000)
  }
  const award = (v) => {
    clearInterval(timer.current)
    setLeft(null)
    if (v) {
      add(who, v)
      sfx.ok()
    }
    if (n + 1 >= order.length) finish('retos', '¡Retos cumplidos!')
    else setN(n + 1)
  }

  return (
    <div>
      <p className="kicker">
        Reto {n + 1} de {order.length}
      </p>
      <h2 className="q">
        Le toca a <span className="who1">{displayName(S.players[who], who)}</span>
      </h2>
      <div className="reto">
        <h3>{r.t}</h3>
        <p>{r.d}</p>
      </div>
      <div className="actions">
        <button className="btn alt" type="button" onClick={start}>
          Cronómetro 20 s
        </button>
        <span className="clock" aria-live="polite">
          {left === null ? '' : left > 0 ? left : '¡Tiempo!'}
        </span>
      </div>
      <div className="award">
        <span>¿Cuántos puntos se lleva?</span>
        {[0, 10, 20, 30].map((v) => (
          <button key={v} type="button" className={'btn' + (v ? '' : ' alt')} onClick={() => award(v)}>
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
