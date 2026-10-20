import { useRef, useEffect, useState } from 'react'
import { BINGO_ITEMS } from '../data/bingo'
import { displayName } from '../store'
import { say } from '../audio'
import { shuffle } from '../util'
import { useKeys } from '../useKeys'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export default function Bingo({ api }) {
  const { S, add, setTurn, finish, sfx } = api
  const [cards] = useState(() => S.players.map(() => shuffle(BINGO_ITEMS).slice(0, 9)))
  const [called, setCalled] = useState([])
  const [lineDone, setLineDone] = useState(false)
  const [banner, setBanner] = useState('')
  const [over, setOver] = useState(false)
  const raf = useRef(null)

  useEffect(() => {
    setTurn(null)
  }, []) // eslint-disable-line
  useEffect(() => () => clearTimeout(raf.current), [])

  const marked = (card, list) => card.map((t) => list.indexOf(t) >= 0)
  const linesOf = (card, list) => {
    const m = marked(card, list)
    return LINES.filter((l) => l.every((k) => m[k])).length
  }

  const draw = () => {
    if (over) return
    const left = BINGO_ITEMS.filter((t) => called.indexOf(t) < 0)
    if (!left.length) {
      setOver(true)
      return
    }
    const item = left[Math.floor(Math.random() * left.length)]
    const list = called.concat(item)
    setCalled(list)
    sfx.pop()
    say(item)

    const full = cards.map((c, i) => (c.every((t) => list.indexOf(t) >= 0) ? i : -1)).filter((i) => i >= 0)
    const lined = cards.map((c, i) => (linesOf(c, list) > 0 ? i : -1)).filter((i) => i >= 0)
    const names = (arr) => arr.map((i) => displayName(S.players[i], i)).join(' y ')
    if (full.length) {
      full.forEach((i) => add(i, 30))
      setBanner('¡BINGO! ' + names(full) + ' (+30)')
      setOver(true)
      sfx.goal()
      say('Bingo')
    } else if (!lineDone && lined.length) {
      lined.forEach((i) => add(i, 15))
      setLineDone(true)
      setBanner('¡LÍNEA! ' + names(lined) + ' (+15)')
      sfx.ok()
      say('Línea')
    } else if (list.length >= BINGO_ITEMS.length) {
      setOver(true)
    }
  }

  useKeys((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (over) finish('bingo', 'Bingo terminado')
      else draw()
    }
  })

  const last = called.length ? called[called.length - 1] : null

  return (
    <div className="bingo">
      <div className="bingo-left">
        <div className="ballbox" aria-live="polite">
          <span className="kicker">{called.length ? 'Salió' : 'Bingo mundialista'}</span>
          <strong>{last || 'Sacá la primera bolilla'}</strong>
        </div>
        <div className="bingo-actions">
          {!over ? (
            <button className="btn" type="button" data-af="1" onClick={draw}>
              Sacar bolilla
            </button>
          ) : (
            <button className="btn" type="button" data-af="1" onClick={() => finish('bingo', 'Bingo terminado')}>
              Terminar
            </button>
          )}
          {banner && <span className="banner">{banner}</span>}
        </div>
        <div className="hist" aria-label="Bolillas que salieron">
          {called.slice(0, -1).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <div className="cards">
        {cards.map((card, ci) => (
          <div key={ci} className="bcard">
            <div className="bcard-name">
              <b>{S.players[ci].no}</b> {displayName(S.players[ci], ci)}
            </div>
            <div className="bgrid">
              {card.map((t) => (
                <span key={t} className={called.indexOf(t) >= 0 ? 'hit' : ''}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
