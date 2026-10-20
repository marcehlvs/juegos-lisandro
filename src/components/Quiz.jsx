import { useEffect, useMemo, useState } from 'react'
import { shuffle } from '../util'
import { displayName } from '../store'
import { useKeys } from '../useKeys'

// Ronda de preguntas con opciones. Sirve para trivia, verdadero o falso y banderas.
export default function Quiz({ api, game, items, points = 10, finishTitle }) {
  const { S, order, add, setTurn, finish, sfx } = api
  const [n, setN] = useState(0)
  const [picked, setPicked] = useState(null)
  const item = items[n]
  const turn = order[n % order.length]
  const opts = useMemo(() => (item.fixed ? item.options : shuffle(item.options)), [n]) // eslint-disable-line

  useEffect(() => {
    setTurn(turn)
  }, [turn]) // eslint-disable-line

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (opts[i].ok) {
      add(turn, points)
      sfx.ok()
    } else sfx.bad()
  }
  const next = () => {
    if (n + 1 >= items.length) finish(game, finishTitle)
    else {
      setN(n + 1)
      setPicked(null)
    }
  }

  useKeys((e) => {
    const k = e.key.toLowerCase()
    if (picked !== null) {
      if (k === 'enter' || k === ' ') {
        e.preventDefault()
        next()
      }
      return
    }
    const keys = item.fixed ? ['v', 'f'] : ['a', 'b', 'c', 'd']
    let i = keys.indexOf(k)
    if (i < 0) i = '1234'.indexOf(k)
    if (i >= 0 && i < opts.length) pick(i)
  })

  const good = picked !== null && opts[picked].ok
  const right = opts.filter((o) => o.ok)[0]
  const letters = item.fixed ? ['V', 'F'] : ['A', 'B', 'C', 'D']

  return (
    <div>
      <p className="kicker">
        Pregunta {n + 1} de {items.length} · Turno de <b>{displayName(S.players[turn], turn)}</b>
      </p>
      <div className={'quiz' + (item.media ? ' with-media' : '')}>
        {item.media && <div className="media">{item.media}</div>}
        <div className="quiz-main">
          <h2 className="q">{item.q}</h2>
          <div className={'opts' + (item.fixed ? ' two' : '')}>
            {opts.map((o, i) => (
              <button
                key={i}
                type="button"
                className={'opt' + (picked !== null ? (o.ok ? ' ok' : i === picked ? ' bad' : '') : '')}
                disabled={picked !== null}
                onClick={() => pick(i)}
              >
                <span className="ltr">{letters[i]}</span>
                <span>{o.t}</span>
              </button>
            ))}
          </div>
          <div className="fb" aria-live="polite">
            {picked !== null && (
              <>
                <span className={good ? 'g' : 'b'}>{good ? '¡Correcto! +' + points + ' puntos' : 'Era: ' + right.t}</span>
                <button className="btn" type="button" data-af="1" onClick={next}>
                  {n + 1 < items.length ? 'Siguiente' : 'Terminar ronda'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
