// Banderas dibujadas con SVG (los emojis de banderas no se ven en muchas Smart TV)
function star(cx, cy, R, r) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r
    const a = (-90 + i * 36) * (Math.PI / 180)
    pts.push((cx + rad * Math.cos(a)).toFixed(2) + ',' + (cy + rad * Math.sin(a)).toFixed(2))
  }
  return pts.join(' ')
}
function pentagram(cx, cy, R) {
  const order = [0, 2, 4, 1, 3]
  return order
    .map((k) => {
      const a = (-90 + k * 72) * (Math.PI / 180)
      return (cx + R * Math.cos(a)).toFixed(2) + ',' + (cy + R * Math.sin(a)).toFixed(2)
    })
    .join(' ')
}
const H = (cols) => cols.map((c, i) => <rect key={i} x="0" y={(i * 20) / cols.length} width="30" height={20 / cols.length + 0.05} fill={c} />)
const V = (cols) => cols.map((c, i) => <rect key={i} x={(i * 30) / cols.length} y="0" width={30 / cols.length + 0.05} height="20" fill={c} />)

const uruStripes = []
for (let i = 0; i < 9; i++) uruStripes.push(<rect key={i} x="0" y={(i * 20) / 9} width="30" height={20 / 9 + 0.05} fill={i % 2 === 0 ? '#fff' : '#0038a8'} />)

const sunRays = []
for (let i = 0; i < 16; i++) {
  const a = i * 22.5 * (Math.PI / 180)
  sunRays.push(<line key={i} x1={15 + 1.9 * Math.cos(a)} y1={10 + 1.9 * Math.sin(a)} x2={15 + 3 * Math.cos(a)} y2={10 + 3 * Math.sin(a)} stroke="#f6b40e" strokeWidth="0.45" />)
}

export const FLAGS = [
  { n: 'Argentina', d: (<><rect width="30" height="20" fill="#75aadb" /><rect y="6.67" width="30" height="6.67" fill="#fff" />{sunRays}<circle cx="15" cy="10" r="1.7" fill="#f6b40e" /></>) },
  { n: 'Francia', d: V(['#0055a4', '#fff', '#ef4135']) },
  { n: 'Italia', d: V(['#009246', '#fff', '#ce2b37']) },
  { n: 'Alemania', d: H(['#000', '#dd0000', '#ffce00']) },
  { n: 'Japón', d: (<><rect width="30" height="20" fill="#fff" /><circle cx="15" cy="10" r="6" fill="#bc002d" /></>) },
  { n: 'Países Bajos', d: H(['#ae1c28', '#fff', '#21468b']) },
  { n: 'Inglaterra', d: (<><rect width="30" height="20" fill="#fff" /><rect x="13" width="4" height="20" fill="#ce1124" /><rect y="8" width="30" height="4" fill="#ce1124" /></>) },
  { n: 'Colombia', d: (<><rect width="30" height="10" fill="#fcd116" /><rect y="10" width="30" height="5" fill="#003893" /><rect y="15" width="30" height="5" fill="#ce1126" /></>) },
  { n: 'Bélgica', d: V(['#000', '#fdda24', '#ef3340']) },
  { n: 'Chile', d: (<><rect width="30" height="10" fill="#fff" /><rect y="10" width="30" height="10" fill="#d52b1e" /><rect width="10" height="10" fill="#0039a6" /><polygon points={star(5, 5, 3.2, 1.3)} fill="#fff" /></>) },
  { n: 'Uruguay', d: (<>{uruStripes}<rect width="8.9" height="8.9" fill="#fff" /><circle cx="4.45" cy="4.45" r="2.2" fill="#fcd116" /></>) },
  { n: 'Brasil', d: (<><rect width="30" height="20" fill="#009c3b" /><polygon points="15,1.8 27.4,10 15,18.2 2.6,10" fill="#ffdf00" /><circle cx="15" cy="10" r="4.3" fill="#002776" /></>) },
  { n: 'Marruecos', d: (<><rect width="30" height="20" fill="#c1272d" /><polygon points={pentagram(15, 10.5, 4.6)} fill="none" stroke="#006233" strokeWidth="0.9" strokeLinejoin="miter" /></>) },
  { n: 'Suiza', d: (<><rect width="30" height="20" fill="#2a3b57" /><rect x="5" width="20" height="20" fill="#d52b1e" /><rect x="13.4" y="4" width="3.2" height="12" fill="#fff" /><rect x="9" y="8.4" width="12" height="3.2" fill="#fff" /></>) },
  { n: 'Suecia', d: (<><rect width="30" height="20" fill="#006aa7" /><rect x="9" width="3.2" height="20" fill="#fecc00" /><rect y="8.4" width="30" height="3.2" fill="#fecc00" /></>) },
  { n: 'Perú', d: (<><rect width="30" height="20" fill="#d91023" /><rect x="7.5" width="15" height="20" fill="#fff" /></>) },
  { n: 'Polonia', d: H(['#fff', '#dc143c']) },
  { n: 'Dinamarca', d: (<><rect width="30" height="20" fill="#c8102e" /><rect x="9" width="3.2" height="20" fill="#fff" /><rect y="8.4" width="30" height="3.2" fill="#fff" /></>) },
  { n: 'Paraguay', d: H(['#d52b1e', '#fff', '#0038a8']) },
  { n: 'Bolivia', d: H(['#d52b1e', '#f9e300', '#007934']) },
  { n: 'Ecuador', d: (<><rect width="30" height="10" fill="#ffdd00" /><rect y="10" width="30" height="5" fill="#034ea2" /><rect y="15" width="30" height="5" fill="#ed1c24" /></>) },
]

export function Flag({ index, className }) {
  return (
    <svg className={className} viewBox="0 0 30 20" role="img" aria-label="Bandera" preserveAspectRatio="xMidYMid meet">
      {FLAGS[index].d}
    </svg>
  )
}
