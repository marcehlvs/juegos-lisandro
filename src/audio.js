let ctx = null
let on = true

export const setSound = (v) => {
  on = v
}
export const soundOn = () => on

function tone(f, d, type, delay) {
  if (!on) return
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = ctx || new AC()
    if (ctx.state === 'suspended') ctx.resume()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const t0 = ctx.currentTime + (delay || 0)
    o.type = type || 'sine'
    o.frequency.value = f
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(t0)
    o.stop(t0 + d + 0.05)
  } catch (e) {
    /* sin audio */
  }
}

export const sfx = {
  ok() {
    tone(660, 0.15)
    tone(880, 0.25, 'sine', 0.15)
  },
  bad() {
    tone(220, 0.35, 'sawtooth')
  },
  pop() {
    tone(520, 0.1, 'triangle')
  },
  tick() {
    tone(900, 0.04, 'square')
  },
  win() {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, 'triangle', i * 0.14))
  },
  goal() {
    ;[392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', i * 0.09))
  },
}

// Lee en voz alta si el navegador lo permite (no pasa nada si no)
export function say(text) {
  if (!on) return
  try {
    const s = window.speechSynthesis
    if (!s) return
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-AR'
    u.rate = 0.95
    s.speak(u)
  } catch (e) {
    /* sin voz */
  }
}
