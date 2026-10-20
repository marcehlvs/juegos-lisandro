import { createContext, useContext, useEffect, useReducer } from 'react'

const KEY = 'juegos-lisandro-v1'
export const GAME_KEYS = ['trivia', 'guess', 'memory', 'retos', 'penales', 'bingo', 'vf', 'flags', 'ruleta', 'rosco']
export const TEAM_NAMES = ['Los Celestes', 'Los Blancos']
export const DEFAULT_NUMBERS = [10, 9, 11, 7, 23, 5]

const zeroRounds = () => GAME_KEYS.reduce((o, k) => ((o[k] = 0), o), {})
const emptySeen = () => ({ trivia: [], guess: [], vf: [], flags: [] })

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s || !Array.isArray(s.players) || s.players.length !== 6) return null
    return { ...s, rounds: { ...zeroRounds(), ...s.rounds }, seen: { ...emptySeen(), ...s.seen }, log: s.log || [] }
  } catch (e) {
    return null
  }
}

function reducer(S, a) {
  switch (a.type) {
    case 'setup':
      return {
        players: a.players,
        mode: a.mode,
        rounds: a.keep && S ? S.rounds : zeroRounds(),
        seen: a.keep && S ? S.seen : emptySeen(),
        log: a.keep && S ? S.log : [],
      }
    case 'add': {
      const g = a.g || 'ajuste'
      const players = S.players.map((p, i) => (i === a.i ? { ...p, pts: p.pts + a.n, by: { ...(p.by || {}), [g]: ((p.by || {})[g] || 0) + a.n } } : p))
      return { ...S, players, log: [...S.log, { i: a.i, n: a.n, g }].slice(-60) }
    }
    case 'undo': {
      if (!S.log.length) return S
      const last = S.log[S.log.length - 1]
      const players = S.players.map((p, i) => (i === last.i ? { ...p, pts: p.pts - last.n, by: { ...(p.by || {}), [last.g || 'ajuste']: ((p.by || {})[last.g || 'ajuste'] || 0) - last.n } } : p))
      return { ...S, players, log: S.log.slice(0, -1) }
    }
    case 'resetPoints':
      return { ...S, players: S.players.map((p) => ({ ...p, pts: 0, by: {} })), log: [], rounds: zeroRounds() }
    case 'resetGame': {
      const g = a.game
      return {
        ...S,
        players: S.players.map((p) => ({ ...p, pts: p.pts - ((p.by || {})[g] || 0), by: { ...(p.by || {}), [g]: 0 } })),
        log: S.log.filter((l) => l.g !== g),
        rounds: { ...S.rounds, [g]: 0 },
      }
    }
    case 'round':
      return { ...S, rounds: { ...S.rounds, [a.game]: (S.rounds[a.game] || 0) + 1 } }
    case 'seen': {
      const prev = S.seen[a.game] || []
      const merged = prev.concat(a.ids.filter((x) => prev.indexOf(x) === -1))
      return { ...S, seen: { ...S.seen, [a.game]: merged } }
    }
    case 'seenReset':
      return { ...S, seen: { ...S.seen, [a.game]: [] } }
    default:
      return S
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [S, dispatch] = useReducer(reducer, null, load)
  useEffect(() => {
    try {
      if (S) localStorage.setItem(KEY, JSON.stringify(S))
    } catch (e) {
      /* sin almacenamiento */
    }
  }, [S])
  return <Ctx.Provider value={{ S, dispatch }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

// Orden de turnos: en equipos se alternan Celestes y Blancos
export function turnOrder(S) {
  const idx = S.players.map((_, i) => i)
  if (S.mode !== 'team') return idx
  const a = idx.filter((i) => S.players[i].team === 0)
  const b = idx.filter((i) => S.players[i].team === 1)
  const out = []
  for (let k = 0; k < Math.max(a.length, b.length); k++) {
    if (a[k] !== undefined) out.push(a[k])
    if (b[k] !== undefined) out.push(b[k])
  }
  return out
}

export function teamTotals(S) {
  return [0, 1].map((t) => S.players.filter((p) => p.team === t).reduce((s, p) => s + p.pts, 0))
}

export function displayName(p, i) {
  return p.name && p.name.trim() ? p.name : 'Jugador ' + (i + 1)
}
