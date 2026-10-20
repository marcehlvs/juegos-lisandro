export function shuffle(a) {
  const r = a.slice()
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = r[i]
    r[i] = r[j]
    r[j] = t
  }
  return r
}

export const pick = (a) => a[Math.floor(Math.random() * a.length)]

// minúsculas, sin tildes, sin signos
export function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function dist(a, b) {
  const m = []
  for (let i = 0; i <= a.length; i++) m[i] = [i]
  for (let j = 1; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
  }
  return m[a.length][b.length]
}

// acepta alias exactos o con un error de tipeo
export function matches(input, aliases) {
  const x = norm(input)
  if (!x) return false
  return aliases.some((a) => x === a || (x.length >= 4 && a.length >= 4 && dist(x, a) <= 1))
}

// Toma n elementos, primero los que no salieron ("seen"). Devuelve ids elegidos.
export function pickUnseen(total, n, seen) {
  const all = Array.from({ length: total }, (_, i) => i)
  const fresh = shuffle(all.filter((i) => seen.indexOf(i) === -1))
  if (fresh.length >= n) return fresh.slice(0, n)
  const rest = shuffle(all.filter((i) => fresh.indexOf(i) === -1))
  return fresh.concat(rest).slice(0, n)
}

// Como pickUnseen, pero sobre una lista de índices candidatos
export function pickFrom(cands, n, seen) {
  const fresh = shuffle(cands.filter((i) => seen.indexOf(i) === -1))
  if (fresh.length >= n) return fresh.slice(0, n)
  const rest = shuffle(cands.filter((i) => fresh.indexOf(i) === -1))
  return fresh.concat(rest).slice(0, n)
}
