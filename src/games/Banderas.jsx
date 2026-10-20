import { useEffect, useState } from 'react'
import Quiz from '../components/Quiz'
import Variantes from '../components/Variantes'
import { FLAGS, Flag } from '../data/flags'
import { pickFrom, shuffle } from '../util'

const SUD = ['Argentina', 'Colombia', 'Chile', 'Uruguay', 'Brasil', 'Perú', 'Paraguay', 'Bolivia', 'Ecuador']
const EUR = ['Francia', 'Italia', 'Alemania', 'Países Bajos', 'Inglaterra', 'Bélgica', 'Suiza', 'Suecia', 'Polonia', 'Dinamarca']
const SETS = [
  { id: 'sud', title: 'Sudamérica', desc: 'Los vecinos y rivales de las Eliminatorias.', names: SUD },
  { id: 'eur', title: 'Europa', desc: 'Selecciones europeas de los Mundiales.', names: EUR },
]

function pool(id) {
  const all = FLAGS.map((_, i) => i)
  if (id === 'mix') return all
  const names = SETS.filter((x) => x.id === id)[0].names
  return all.filter((i) => names.indexOf(FLAGS[i].n) !== -1)
}

export default function Banderas({ api }) {
  const [set, setSet] = useState(null)
  if (!set) return <Variantes title="Elegí las banderas" sets={SETS} mix="Banderas de todo el mundo, mezcladas." onPick={setSet} />
  return <Round api={api} set={set} />
}

function Round({ api, set }) {
  const [pl] = useState(() => pool(set))
  const [ids] = useState(() => pickFrom(pl, Math.min(12, pl.length), api.S.seen.flags))
  useEffect(() => {
    api.markSeen('flags', ids)
  }, []) // eslint-disable-line
  const [items] = useState(() =>
    ids.map((id) => {
      const others = shuffle(pl.filter((i) => i !== id)).slice(0, 3)
      return {
        q: '¿De qué país es esta bandera?',
        media: <Flag index={id} className="flagimg" />,
        options: [{ t: FLAGS[id].n, ok: true }, ...others.map((i) => ({ t: FLAGS[i].n, ok: false }))],
      }
    }),
  )
  return <Quiz api={api} game="flags" items={items} points={10} finishTitle="Banderas terminadas" />
}
