import { useEffect, useRef, useState } from 'react'
import { displayName } from '../store'
import { useKeys } from '../useKeys'

const SEGS = [
  { v: 10, name: 'Pase corto', c: '#75aadb' },
  { v: 20, name: 'Gol', c: '#ffffff' },
  { v: 5, name: 'Córner', c: '#f6b40e' },
  { v: 30, name: '¡La Copa!', c: '#75aadb' },
  { v: 0, name: 'Offside', c: '#ffffff' },
  { v: 15, name: 'Tiro libre', c: '#f6b40e' },
  { v: 10, name: 'Atajada', c: '#75aadb' },
  { v: 25, name: 'Gol de oro', c: '#ffffff' },
]
const A = 360 / SEGS.length
const pt = (deg, r) => {
  const t = (deg * Math.PI) / 180
  return [100 + r * Math.sin(t), 100 - r * Math.cos(t)]
}
const wedge = (k) => {
  const [x1, y1] = pt(k * A, 96)
  const [x2, y2] = pt((k + 1) * A, 96)
  return 'M100,100 L' + x1.toFixed(2) + ',' + y1.toFixed(2) + ' A96,96 0 0 1 ' + x2.toFixed(2) + ',' + y2.toFixed(2) + ' Z'
}

export default function Ruleta({ api }) {
  const { S, order, add, setTurn, finish, sfx } = api
  const [n, setN] = useState(0)
  const [rot, setRot] = useState(0)
  const [spins, setSpins] = useState(0)
  const [state, setState] = useState('ready') // ready | spinning | result
  const [seg, setSeg] = useState(null)
  const alive = useRef(true)
  const who = order[n]

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])
  useEffect(() => {
    setTurn(who)
  }, [who]) // eslint-disable-line

  const spin = () => {
    if (state !== 'ready') return
    const k = Math.floor(Math.random() * SEGS.length)
    const center = k * A + A / 2
    const base = (spins + 1) * 1800
    setSpins(spins + 1)
    setRot(base + (360 - center))
    setState('spinning')
    sfx.pop()
    setTimeout(() => {
      if (!alive.current) return
      setSeg(SEGS[k])
      setState('result')
      if (SEGS[k].v > 0) {
        add(who, SEGS[k].v)
        sfx.goal()
      } else sfx.bad()
    }, 4400)
  }
  const next = () => {
    if (n + 1 >= order.length) {
      finish('ruleta', 'Ruleta terminada')
      return
    }
    setN(n + 1)
    setState('ready')
    setSeg(null)
  }

  useKeys((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (state === 'ready') spin()
      else if (state === 'result') next()
    }
  })

  return (
    <div className="ruleta">
      <div className="wheel-wrap">
        <div className="pointer" aria-hidden="true" />
        <div className="wheel" style={{ transform: 'rotate(' + rot + 'deg)' }}>
          <svg viewBox="0 0 200 200" role="img" aria-label="Ruleta de puntos">
            {SEGS.map((s, k) => (
              <g key={k}>
                <path d={wedge(k)} fill={s.c} stroke="#07142b" strokeWidth="1.5" />
                <text transform={'rotate(' + (k * A + A / 2) + ' 100 100) translate(100 38)'} textAnchor="middle" fontFamily="Big Shoulders Display, Arial Narrow, sans-serif" fontWeight="900" fontSize="22" fill="#07142b">
                  {s.v}
                </text>
              </g>
            ))}
            <circle cx="100" cy="100" r="9" fill="#07142b" />
          </svg>
        </div>
      </div>
      <div className="ruleta-side">
        <p className="kicker">
          Giro {n + 1} de {order.length}
        </p>
        <h2 className="q">
          Gira <span className="who1">{displayName(S.players[who], who)}</span>
        </h2>
        <p className="lede">{state === 'ready' ? 'Apretá el botón y mirá dónde frena la ruleta.' : state === 'spinning' ? 'Girando…' : ''}</p>
        {state === 'result' && seg && (
          <div className="answer">
            <span>{seg.name}</span>
            <strong>{seg.v > 0 ? '+' + seg.v + ' puntos' : 'Sin puntos'}</strong>
          </div>
        )}
        <div className="actions">
          {state === 'ready' && (
            <button className="btn" type="button" data-af="1" onClick={spin}>
              ¡Girar!
            </button>
          )}
          {state === 'result' && (
            <button className="btn" type="button" data-af="1" onClick={next}>
              {n + 1 < order.length ? 'Siguiente jugador' : 'Terminar ronda'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
