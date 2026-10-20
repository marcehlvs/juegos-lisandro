import { useMemo } from 'react'

export default function Confetti() {
  const bits = useMemo(() => {
    const cols = ['#75aadb', '#ffffff', '#f6b40e']
    return Array.from({ length: 44 }, (_, i) => ({
      left: Math.round(Math.random() * 100),
      bg: cols[i % 3],
      delay: -(Math.random() * 5).toFixed(2),
      dur: (3.5 + Math.random() * 2.5).toFixed(2),
    }))
  }, [])
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i key={i} style={{ left: b.left + '%', background: b.bg, animationDelay: b.delay + 's', animationDuration: b.dur + 's' }} />
      ))}
    </div>
  )
}
