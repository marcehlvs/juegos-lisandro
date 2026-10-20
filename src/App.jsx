import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore, turnOrder } from './store'
import { sfx, setSound } from './audio'
import { useKeys } from './useKeys'
import { Stars } from './components/Icons'
import Scoreboard from './components/Scoreboard'
import PointsModal from './components/PointsModal'
import Setup from './components/Setup'
import Fin from './components/Fin'
import Podium from './components/Podium'
import Trivia from './games/Trivia'
import Guess from './games/Guess'
import Memoria from './games/Memoria'
import Retos from './games/Retos'
import Penales from './games/Penales'
import Bingo from './games/Bingo'
import VerdaderoFalso from './games/VerdaderoFalso'
import Banderas from './games/Banderas'
import Ruleta from './games/Ruleta'
import Rosco from './games/Rosco'

const GAMES = [
  { key: 'trivia', title: 'Trivia de la Selección', desc: 'Una pregunta por turno. 10 puntos por acierto.', C: Trivia },
  { key: 'guess', title: '¿Quién es?', desc: 'Pistas de a una. Escribí el nombre: hasta 30 puntos.', C: Guess },
  { key: 'penales', title: 'Penales en pantalla', desc: 'Elegí el ángulo y patéale al arquero. Gol: 10 puntos.', C: Penales },
  { key: 'bingo', title: 'Bingo mundialista', desc: 'Seis cartones se llenan solos. Línea 15, bingo 30.', C: Bingo },
  { key: 'memory', title: 'Memoria de dorsales', desc: 'Unir cada número con su jugador. 15 por pareja.', C: Memoria },
  { key: 'vf', title: 'Verdadero o falso', desc: 'Rápido y por turnos. 10 puntos por acierto.', C: VerdaderoFalso },
  { key: 'flags', title: 'Banderas del mundo', desc: 'Adiviná el país por su bandera. 10 puntos.', C: Banderas },
  { key: 'ruleta', title: 'Ruleta de la suerte', desc: 'Cada uno gira una vez: de 0 a 30 puntos.', C: Ruleta },
  { key: 'rosco', title: 'El rosco', desc: 'Una letra por turno. Adiviná la palabra o pasapalabra.', C: Rosco },
  { key: 'retos', title: 'Retos del hincha', desc: 'Mímica, relatos y desafíos de living. Hasta 30.', C: Retos },
]

function Hub({ S, open, onPodium }) {
  useKeys((e) => {
    if (e.key === 'p' || e.key === 'P') {
      onPodium()
      return
    }
    const i = '1234567890'.indexOf(e.key)
    if (i >= 0) open(GAMES[i].key)
  })
  return (
    <div>
      <div className="games">
        {GAMES.map((g, i) => (
          <button key={g.key} type="button" className="game" onClick={() => open(g.key)}>
            <span className="gnum">{(i + 1) % 10}</span>
            <h2>{g.title}</h2>
            <p>{g.desc}</p>
            <span className="stt">Rondas jugadas: {S.rounds[g.key] || 0}</span>
          </button>
        ))}
        <button type="button" className="game podio-card" onClick={onPodium}>
          <span className="gnum">P</span>
          <h2>Ver el podio</h2>
          <p>Mirá quién va ganando y festejá al campeón.</p>
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const { S, dispatch } = useStore()
  const [screen, setScreen] = useState(S ? { name: 'hub' } : { name: 'setup' })
  const [turn, setTurn] = useState(null)
  const [modal, setModal] = useState(false)
  const [snd, setSnd] = useState(true)
  const inGame = useRef(false)
  const Sref = useRef(S)
  Sref.current = S

  // Cuando una pantalla cambia y el foco se pierde, lo llevamos al botón principal ("Siguiente", "Sacar bolilla"...)
  useEffect(() => {
    const f = () => {
      const ae = document.activeElement
      if (ae && ae !== document.body) return
      const el = document.querySelector('[data-af]')
      if (el) el.focus()
    }
    const root = document.getElementById('root')
    const mo = new MutationObserver(() => setTimeout(f, 0))
    mo.observe(root, { childList: true, subtree: true })
    f()
    return () => mo.disconnect()
  }, [])

  // El botón "atrás" del control vuelve al menú en vez de salir de la página
  useEffect(() => {
    const f = () => {
      inGame.current = false
      setTurn(null)
      setScreen(Sref.current ? { name: 'hub' } : { name: 'setup' })
    }
    window.addEventListener('popstate', f)
    return () => window.removeEventListener('popstate', f)
  }, [])

  const open = (name, extra) => {
    setTurn(null)
    if (!inGame.current) {
      try {
        window.history.pushState({ g: 1 }, '')
        inGame.current = true
      } catch (e) {
        /* sin historial */
      }
    }
    setScreen({ name, ...extra })
  }
  const toHub = () => {
    setTurn(null)
    if (inGame.current) {
      try {
        window.history.back()
        setTimeout(() => {
          if (inGame.current) {
            inGame.current = false
            setScreen({ name: 'hub' })
          }
        }, 400)
        return
      } catch (e) {
        inGame.current = false
      }
    }
    setScreen({ name: 'hub' })
  }

  const add = useCallback((i, n) => dispatch({ type: 'add', i, n }), [dispatch]) // ajuste manual
  const addIn = (game) => (i, n) => dispatch({ type: 'add', i, n, g: game })
  const markSeen = useCallback((game, ids) => dispatch({ type: 'seen', game, ids }), [dispatch])
  const finish = (game, title) => {
    dispatch({ type: 'round', game })
    setTurn(null)
    setScreen({ name: 'fin', title })
  }

  const toggleSound = () => {
    const v = !snd
    setSnd(v)
    setSound(v)
    if (v) sfx.pop()
  }
  const fullscreen = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {})
    } catch (e) {
      /* sin pantalla completa */
    }
  }

  const onSetup = ({ players, mode, keep }) => {
    dispatch({ type: 'setup', players, mode, keep })
    if (inGame.current) toHub()
    else setScreen({ name: 'hub' })
  }

  let body = null
  if (!S || screen.name === 'setup') {
    body = <Setup S={S} onSave={onSetup} />
  } else if (screen.name === 'hub') {
    body = <Hub S={S} open={open} onPodium={() => open('podium')} />
  } else if (screen.name === 'fin') {
    body = <Fin title={screen.title} onMenu={toHub} />
  } else if (screen.name === 'podium') {
    body = <Podium S={S} onMenu={toHub} />
  } else {
    const g = GAMES.filter((x) => x.key === screen.name)[0]
    if (g) {
      const api = { S, order: turnOrder(S), add: addIn(g.key), setTurn, finish, markSeen, sfx }
      body = <g.C key={g.key} api={api} />
    }
  }

  return (
    <div className="app">
      <div className="flag" />
      <header className="top">
        <div className="brand">
          <Stars n={3} /> Pijamada Albiceleste
        </div>
        <nav className="tools" aria-label="Opciones">
          {S && (
            <>
              <button className="btn alt sm" type="button" onClick={toHub} disabled={screen.name === 'hub'}>
                Menú
              </button>
              <button className="btn alt sm" type="button" onClick={() => setModal(true)}>
                Puntos
              </button>
              <button className="btn alt sm" type="button" onClick={() => open('setup')}>
                Jugadores
              </button>
            </>
          )}
          <button className="btn alt sm" type="button" onClick={toggleSound}>
            Sonido: {snd ? 'sí' : 'no'}
          </button>
          <button className="btn alt sm" type="button" onClick={fullscreen}>
            Pantalla completa
          </button>
        </nav>
      </header>
      {S && screen.name !== 'podium' && <Scoreboard S={S} turn={turn} />}
      <main className="stage">{body}</main>
      {modal && S && (
        <PointsModal
          S={S}
          add={add}
          undo={() => dispatch({ type: 'undo' })}
          reset={() => dispatch({ type: 'resetPoints' })}
          games={GAMES}
          current={screen.name}
          resetGame={(game) => dispatch({ type: 'resetGame', game })}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  )
}
