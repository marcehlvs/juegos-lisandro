import { useState } from 'react'
import Modal from './Modal'
import { displayName } from '../store'

export default function PointsModal({ S, add, undo, reset, onClose, games, current, resetGame }) {
  const [sure, setSure] = useState(false)
  const [gsure, setGsure] = useState(null)
  const gameTotal = (k) => S.players.reduce((t, p) => t + ((p.by || {})[k] || 0), 0)
  const rows = (games || []).filter((g) => g.key === current || gameTotal(g.key) !== 0)
  const last = S.log.length ? S.log[S.log.length - 1] : null
  return (
    <Modal title="Puntos" onClose={onClose}>
      <p className="lede">Corregí los puntos si hubo un error, o empezá de cero.</p>
      <ul className="adj">
        {S.players.map((p, i) => (
          <li key={i}>
            <span className="adj-no">{p.no}</span>
            <span className="adj-nm">{displayName(p, i)}</span>
            <button className="btn alt sm" type="button" onClick={() => add(i, -10)}>
              −10
            </button>
            <button className="btn alt sm" type="button" onClick={() => add(i, -5)}>
              −5
            </button>
            <span className="adj-pt">{p.pts}</span>
            <button className="btn alt sm" type="button" onClick={() => add(i, 5)}>
              +5
            </button>
            <button className="btn alt sm" type="button" onClick={() => add(i, 10)}>
              +10
            </button>
          </li>
        ))}
      </ul>
      {rows.length > 0 && (
        <>
          <h3 className="adj-h">Puntos por juego</h3>
          <ul className="gpts">
            {rows.map((g) => (
              <li key={g.key} className={g.key === current ? 'cur' : ''}>
                <span className="gp-nm">{g.title}{g.key === current ? ' (este juego)' : ''}</span>
                <span className="adj-pt">{gameTotal(g.key)}</span>
                {gsure === g.key ? (
                  <>
                    <button className="btn bad sm" type="button" onClick={() => { resetGame(g.key); setGsure(null) }}>
                      Sí, reiniciar
                    </button>
                    <button className="btn alt sm" type="button" onClick={() => setGsure(null)}>
                      No
                    </button>
                  </>
                ) : (
                  <button className="btn alt sm" type="button" disabled={gameTotal(g.key) === 0} onClick={() => setGsure(g.key)}>
                    Reiniciar este juego
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="actions">
        <button className="btn alt" type="button" disabled={!last} onClick={undo}>
          {last ? 'Deshacer último: ' + displayName(S.players[last.i], last.i) + ' ' + (last.n > 0 ? '+' : '') + last.n : 'Nada para deshacer'}
        </button>
      </div>
      <div className="actions danger">
        {!sure ? (
          <button className="btn alt" type="button" onClick={() => setSure(true)}>
            Reiniciar puntos a cero
          </button>
        ) : (
          <>
            <span className="ask">¿Seguro? Se borran los puntos de todos.</span>
            <button
              className="btn bad"
              type="button"
              onClick={() => {
                reset()
                setSure(false)
              }}
            >
              Sí, reiniciar
            </button>
            <button className="btn alt" type="button" onClick={() => setSure(false)}>
              No, cancelar
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
