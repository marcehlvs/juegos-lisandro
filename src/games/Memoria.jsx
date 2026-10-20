import { useEffect, useRef, useState } from 'react'
import { Star } from '../components/Icons'
import { displayName } from '../store'
import { shuffle } from '../util'

const PAIRS = [
  { no: '10', n: 'Messi' },
  { no: '23', n: 'Dibu' },
  { no: '11', n: 'Di María' },
  { no: '9', n: 'Julián' },
  { no: '24', n: 'Enzo' },
  { no: '7', n: 'De Paul' },
  { no: '20', n: 'Mac Allister' },
  { no: '22', n: 'Lautaro' },
  { no: '13', n: 'Cuti' },
]

export default function Memoria({ api }) {
  const { S, order, add, setTurn, finish, sfx } = api
  const [cards] = useState(() =>
    shuffle(
      shuffle(PAIRS)
        .slice(0, 6)
        .reduce((a, m, i) => {
          a.push({ p: i, k: 'no', t: m.no }, { p: i, k: 'nm', t: m.n })
          return a
        }, []),
    ),
  )
  const [tp, setTp] = useState(0) // posición en el orden de turnos
  const [up, setUp] = useState([])
  const [done, setDone] = useState([])
  const lock = useRef(false)
  const alive = useRef(true)
  const turn = order[tp % order.length]

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])
  useEffect(() => {
    setTurn(turn)
  }, [turn]) // eslint-disable-line

  const flip = (i) => {
    if (lock.current || up.indexOf(i) >= 0 || done.indexOf(i) >= 0) return
    sfx.pop()
    const nu = up.concat(i)
    setUp(nu)
    if (nu.length < 2) return
    lock.current = true
    const [a, b] = nu
    if (cards[a].p === cards[b].p) {
      setTimeout(() => {
        if (!alive.current) return
        const nd = done.concat(a, b)
        setDone(nd)
        setUp([])
        add(turn, 15)
        sfx.ok()
        lock.current = false
        if (nd.length === cards.length) setTimeout(() => alive.current && finish('memory', '¡Memoria completa!'), 1200)
      }, 600)
    } else {
      setTimeout(() => {
        if (!alive.current) return
        setUp([])
        setTp((t) => t + 1)
        sfx.bad()
        lock.current = false
      }, 1300)
    }
  }

  return (
    <div>
      <p className="kicker">
        Turno de <b>{displayName(S.players[turn], turn)}</b> · Parejas: {done.length / 2} de {cards.length / 2}
      </p>
      <div className="mem">
        {cards.map((c, i) => {
          const open = up.indexOf(i) >= 0 || done.indexOf(i) >= 0
          return (
            <button key={i} type="button" className={'card' + (open ? ' up' : '') + (done.indexOf(i) >= 0 ? ' done' : '')} onClick={() => flip(i)} aria-label={open ? c.t : 'Carta ' + (i + 1)}>
              <span className="in">
                <span className="face back">
                  <Star size="1.4em" color="var(--sol)" />
                </span>
                <span className={'face front ' + c.k}>{c.t}</span>
              </span>
            </button>
          )
        })}
      </div>
      <p className="note">Unir cada número con su jugador (camisetas de Qatar 2022). Si acertás una pareja, seguís jugando.</p>
    </div>
  )
}
