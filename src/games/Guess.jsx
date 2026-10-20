import { useEffect, useMemo, useRef, useState } from 'react'
import { FIGURES, FIGURE_SETS } from '../data/figures'
import Variantes from '../components/Variantes'
import { displayName } from '../store'
import { matches, pickFrom, shuffle } from '../util'

const PTS = [30, 20, 10, 5]

function candIdx(id) {
  const all = FIGURES.map((_, i) => i)
  if (id === 'mix') return all
  const names = FIGURE_SETS.filter((x) => x.id === id)[0].names
  return all.filter((i) => names.indexOf(FIGURES[i].n) !== -1)
}

export default function Guess({ api }) {
  const [set, setSet] = useState(null)
  if (!set) return <Variantes title="¿De quiénes jugamos?" sets={FIGURE_SETS} mix="Jugadores de 2022 y leyendas, todos juntos." onPick={setSet} />
  return <GuessRound api={api} set={set} />
}

function GuessRound({ api, set }) {
  const { S, add, setTurn, finish, sfx } = api
  const [ids] = useState(() => pickFrom(candIdx(set), 6, S.seen.guess))
  useEffect(() => {
    api.markSeen('guess', ids)
    setTurn(null)
  }, []) // eslint-disable-line

  const [n, setN] = useState(0)
  const [c, setC] = useState(1) // pistas visibles
  const [sel, setSel] = useState(null) // quién responde
  const [text, setText] = useState('')
  const [wrong, setWrong] = useState('')
  const [over, setOver] = useState(false)
  const [msg, setMsg] = useState('')
  const [useOpts, setUseOpts] = useState(false)
  const [gone, setGone] = useState([]) // opciones descartadas
  const input = useRef(null)

  const fig = FIGURES[ids[n]]
  const options = useMemo(() => {
    const others = shuffle(FIGURES.filter((f) => f !== fig)).slice(0, 3)
    return shuffle([fig, ...others]).map((f) => f.n)
  }, [n]) // eslint-disable-line

  const pts = PTS[c - 1]

  const win = (who) => {
    add(who, pts)
    sfx.ok()
    setMsg(displayName(S.players[who], who) + ' suma ' + pts + ' puntos')
    setOver(true)
    setWrong('')
  }
  const lose = () => {
    sfx.bad()
    setMsg('Nadie sumó esta vez')
    setOver(true)
    setWrong('')
  }
  const submit = (e) => {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    if (sel === null) {
      setWrong('Primero elegí quién responde.')
      return
    }
    if (matches(v, fig.a)) win(sel)
    else {
      setWrong('«' + v + '» no es. ¡Seguí pensando!')
      setText('')
      sfx.bad()
      if (input.current) input.current.focus()
    }
  }
  const chooseOpt = (name) => {
    if (sel === null) {
      setWrong('Primero elegí quién responde.')
      return
    }
    if (name === fig.n) win(sel)
    else {
      setGone((g) => g.concat(name))
      setWrong('«' + name + '» no es. ¡Probá con otra!')
      sfx.bad()
    }
  }
  const choosePlayer = (i) => {
    setSel(i)
    setTurn(i)
    setWrong('')
    sfx.pop()
    if (!useOpts && input.current) input.current.focus()
  }
  const moreClue = () => {
    if (c < fig.c.length) {
      setC(c + 1)
      setWrong('')
      sfx.pop()
    }
  }
  const next = () => {
    if (n + 1 >= ids.length) {
      finish('guess', 'Ronda de misterio terminada')
      return
    }
    setN(n + 1)
    setC(1)
    setText('')
    setWrong('')
    setOver(false)
    setMsg('')
    setGone([])
    setTurn(null)
  }

  return (
    <div>
      <p className="kicker">
        Jugador misterioso {n + 1} de {ids.length}
      </p>
      <h2 className="q">¿Quién es?</h2>
      <ol className="clues">
        {fig.c.slice(0, over ? fig.c.length : c).map((t, i) => (
          <li key={i}>
            <span className="bdg">{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>

      {!over ? (
        <>
          <p className="worth">
            Esta pista vale <b>{pts}</b> puntos
          </p>
          <div className="who" role="group" aria-label="Quién responde">
            <span>¿Quién responde?</span>
            {S.players.map((p, i) => (
              <button key={i} type="button" className={'btn alt chip' + (sel === i ? ' on' : '')} aria-pressed={sel === i} onClick={() => choosePlayer(i)}>
                {displayName(p, i)}
              </button>
            ))}
          </div>

          {!useOpts ? (
            <form className="ans" autoComplete="off" onSubmit={submit}>
              <label className="sr" htmlFor="ai">
                Tu respuesta
              </label>
              <input id="ai" ref={input} type="text" maxLength={40} placeholder="Escribí el nombre…" value={text} onChange={(e) => setText(e.target.value)} />
              <button className="btn" type="submit">
                Responder
              </button>
            </form>
          ) : (
            <div className="opts">
              {options.map((name) => (
                <button key={name} type="button" className={'opt' + (gone.indexOf(name) >= 0 ? ' bad' : '')} disabled={gone.indexOf(name) >= 0} onClick={() => chooseOpt(name)}>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}
          <p className="msg-bad" aria-live="polite">
            {wrong}
          </p>
          <div className="actions">
            {c < fig.c.length && (
              <button className="btn" type="button" onClick={moreClue}>
                Otra pista
              </button>
            )}
            <button className="btn alt" type="button" onClick={() => setUseOpts(!useOpts)}>
              {useOpts ? 'Escribir la respuesta' : 'Elegir entre opciones'}
            </button>
            <button className="btn alt" type="button" onClick={lose}>
              Nadie lo adivinó
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="answer">
            <span>Era</span>
            <strong>{fig.n}</strong>
          </div>
          <p className="fb">{msg}</p>
          <div className="actions">
            <button className="btn" type="button" data-af="1" onClick={next}>
              {n + 1 < ids.length ? 'Siguiente jugador' : 'Terminar ronda'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
