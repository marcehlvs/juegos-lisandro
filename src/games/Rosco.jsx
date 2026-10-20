import { useEffect, useMemo, useRef, useState } from 'react'
import { ROSCOS } from '../data/rosco'
import Variantes from '../components/Variantes'
import { displayName } from '../store'
import { matches, shuffle } from '../util'

function nextOpen(st, from) {
  const N = st.length
  for (let k = 1; k <= N; k++) {
    const i = (from + k) % N
    if (st[i] === 'pending' || st[i] === 'pass') return i
  }
  return -1
}

export default function Rosco({ api }) {
  const [set, setSet] = useState(null)
  if (!set) return <Variantes title="Elegí el rosco" sets={ROSCOS} onPick={(id) => setSet(ROSCOS.filter((x) => x.id === id)[0])} />
  return <RoscoRound api={api} set={set} />
}

function RoscoRound({ api, set }) {
  const ROSCO = set.items
  const N = ROSCO.length
  const { S, order, add, setTurn, finish, sfx } = api
  const [st, setSt] = useState(() => ROSCO.map(() => 'pending'))
  const [cur, setCur] = useState(0)
  const [tp, setTp] = useState(0)
  const [text, setText] = useState('')
  const [res, setRes] = useState(null) // {ok, r}
  const [useOpts, setUseOpts] = useState(false)
  const input = useRef(null)
  const who = order[tp % order.length]
  const item = ROSCO[cur]

  useEffect(() => {
    setTurn(who)
  }, [who]) // eslint-disable-line

  const options = useMemo(() => {
    const others = shuffle(ROSCO.filter((x) => x !== item)).slice(0, 3)
    return shuffle([item, ...others]).map((x) => x.r)
  }, [cur]) // eslint-disable-line

  const okCount = st.filter((s) => s === 'ok').length
  const badCount = st.filter((s) => s === 'bad').length
  const left = st.filter((s) => s === 'pending' || s === 'pass').length

  const resolve = (ok) => {
    const ns = st.slice()
    ns[cur] = ok ? 'ok' : 'bad'
    setSt(ns)
    setRes({ ok, r: item.r })
    if (ok) {
      add(who, 10)
      sfx.ok()
    } else sfx.bad()
  }
  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    resolve(matches(text, item.a))
  }
  const advance = (ns, turnToo) => {
    const nx = nextOpen(ns, cur)
    if (nx < 0) {
      const ok = ns.filter((s) => s === 'ok').length
      finish('rosco', 'Rosco terminado: ' + ok + ' de ' + N)
      return
    }
    setCur(nx)
    if (turnToo) setTp(tp + 1)
    setText('')
    setRes(null)
    if (input.current && !useOpts) input.current.focus()
  }
  const pass = () => {
    const ns = st.slice()
    ns[cur] = 'pass'
    setSt(ns)
    sfx.pop()
    advance(ns, true)
  }
  const next = () => advance(st, true)

  return (
    <div className="rosco-game">
      <div className="rosco">
        {ROSCO.map((x, i) => {
          const a = (i / N) * 2 * Math.PI - Math.PI / 2
          return (
            <span
              key={x.l}
              className={'rl ' + st[i] + (i === cur ? ' cur' : '')}
              style={{ left: 50 + 43 * Math.cos(a) + '%', top: 50 + 43 * Math.sin(a) + '%' }}
            >
              {x.l}
            </span>
          )
        })}
        <div className="rosco-mid">
          <span className="kicker">Quedan</span>
          <strong>{left}</strong>
          <span className="rs">
            <b className="g">{okCount}</b> bien · <b className="b">{badCount}</b> mal
          </span>
        </div>
      </div>

      <div className="rosco-side">
        <p className="kicker">
          Turno de <b>{displayName(S.players[who], who)}</b>
        </p>
        <h2 className="q">
          <span className="who1">{item.t}</span>
        </h2>
        <p className="rdef">{item.d}</p>

        {!res ? (
          <>
            {!useOpts ? (
              <form className="ans" autoComplete="off" onSubmit={submit}>
                <label className="sr" htmlFor="ri">
                  Tu respuesta
                </label>
                <input id="ri" ref={input} type="text" maxLength={30} placeholder="Escribí la respuesta…" value={text} onChange={(e) => setText(e.target.value)} />
                <button className="btn" type="submit">
                  Responder
                </button>
              </form>
            ) : (
              <div className="opts">
                {options.map((name) => (
                  <button key={name} type="button" className="opt" onClick={() => resolve(name === item.r)}>
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="actions">
              <button className="btn alt" type="button" onClick={pass}>
                Pasapalabra
              </button>
              <button className="btn alt" type="button" onClick={() => setUseOpts(!useOpts)}>
                {useOpts ? 'Escribir la respuesta' : 'Elegir entre opciones'}
              </button>
              <button className="btn alt" type="button" onClick={() => finish('rosco', 'Rosco terminado: ' + okCount + ' de ' + N)}>
                Terminar rosco
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={'answer' + (res.ok ? '' : ' wrongans')}>
              <span>{res.ok ? '¡Bien! +10' : 'Era'}</span>
              <strong>{res.r}</strong>
            </div>
            <div className="actions">
              <button className="btn" type="button" data-af="1" onClick={next}>
                {left > 0 ? 'Siguiente letra' : 'Terminar rosco'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
