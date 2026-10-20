export function Star({ size = '1em', color = 'currentColor' }) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 10 : 4.2
    const a = (-90 + i * 36) * (Math.PI / 180)
    pts.push((12 + r * Math.cos(a)).toFixed(2) + ',' + (12 + r * Math.sin(a)).toFixed(2))
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-0.12em' }}>
      <polygon points={pts.join(' ')} fill={color} />
    </svg>
  )
}

export function Stars({ n = 3 }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <Star key={i} color="var(--sol)" />
      ))}
    </span>
  )
}

export function Ball({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#fff" stroke="#07142b" strokeWidth="1.5" />
      <polygon points="20,12 27,17 24.5,25.5 15.5,25.5 13,17" fill="#07142b" />
      <path d="M20 12V3M27 17l8-3M24.5 25.5l5 7M15.5 25.5l-5 7M13 17l-8-3" stroke="#07142b" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function Keeper({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 64" aria-hidden="true">
      <line x1="13" y1="20" x2="3" y2="5" stroke="#2fae72" strokeWidth="5" strokeLinecap="round" />
      <line x1="27" y1="20" x2="37" y2="5" stroke="#2fae72" strokeWidth="5" strokeLinecap="round" />
      <circle cx="3" cy="4" r="4.2" fill="#f6b40e" />
      <circle cx="37" cy="4" r="4.2" fill="#f6b40e" />
      <rect x="12" y="15" width="16" height="26" rx="5" fill="#3ecf8e" />
      <rect x="13" y="40" width="6" height="21" rx="3" fill="#07142b" />
      <rect x="21" y="40" width="6" height="21" rx="3" fill="#07142b" />
      <circle cx="20" cy="9" r="6" fill="#f1c27d" />
    </svg>
  )
}
