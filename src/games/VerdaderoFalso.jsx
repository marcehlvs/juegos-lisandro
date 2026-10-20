import { useEffect, useState } from 'react'
import Quiz from '../components/Quiz'
import Variantes from '../components/Variantes'
import { VF_SETS, VF_MIX } from '../data/vf'
import { pickFrom } from '../util'

function cands(id) {
  if (id === 'mix') return VF_MIX.map((_, i) => i)
  let off = 0
  for (const s of VF_SETS) {
    if (s.id === id) return s.items.map((_, i) => off + i)
    off += s.items.length
  }
  return []
}

export default function VerdaderoFalso({ api }) {
  const [set, setSet] = useState(null)
  if (!set) return <Variantes title="Elegí el verdadero o falso" sets={VF_SETS} mix="Afirmaciones de los tres juegos juntas." onPick={setSet} />
  return <Round api={api} set={set} />
}

function Round({ api, set }) {
  const [ids] = useState(() => pickFrom(cands(set), 12, api.S.seen.vf))
  useEffect(() => {
    api.markSeen('vf', ids)
  }, []) // eslint-disable-line
  const items = ids.map((id) => ({
    q: VF_MIX[id][0],
    fixed: true,
    options: [
      { t: 'Verdadero', ok: VF_MIX[id][1] === true },
      { t: 'Falso', ok: VF_MIX[id][1] === false },
    ],
  }))
  return <Quiz api={api} game="vf" items={items} points={10} finishTitle="Verdadero o falso terminado" />
}
