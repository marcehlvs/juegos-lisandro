import { useEffect, useState } from 'react'
import Quiz from '../components/Quiz'
import Variantes from '../components/Variantes'
import { TRIVIA, TRIVIA_MIX } from '../data/questions'
import { pickFrom } from '../util'

function range(a, n) {
  return Array.from({ length: n }, (_, i) => a + i)
}
function cands(id) {
  if (id === 'mix') return range(0, TRIVIA_MIX.length)
  let off = 0
  for (const s of TRIVIA) {
    if (s.id === id) return range(off, s.items.length)
    off += s.items.length
  }
  return []
}

export default function Trivia({ api }) {
  const [set, setSet] = useState(null)
  if (!set) return <Variantes title="Elegí la trivia" sets={TRIVIA} mix="Preguntas de las tres trivias juntas." onPick={setSet} />
  return <Round api={api} set={set} />
}

function Round({ api, set }) {
  const [ids] = useState(() => pickFrom(cands(set), 12, api.S.seen.trivia))
  useEffect(() => {
    api.markSeen('trivia', ids)
  }, []) // eslint-disable-line
  const items = ids.map((id) => {
    const [q, ok, ...bad] = TRIVIA_MIX[id]
    return { q, options: [{ t: ok, ok: true }, ...bad.map((t) => ({ t, ok: false }))] }
  })
  return <Quiz api={api} game="trivia" items={items} points={10} finishTitle="Trivia terminada" />
}
