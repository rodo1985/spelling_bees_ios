import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #FFF8E1 0%, #FFF3C4 60%, #FFE082 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Nunito', sans-serif",
  },
  corner: {
    position: 'absolute',
    fontSize: '28px',
    lineHeight: 1,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(10px)',
    borderRadius: '32px',
    padding: '40px 36px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 40px rgba(26,26,62,0.10)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  bee: {
    fontSize: '80px',
    lineHeight: 1,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
  },
  title: {
    fontFamily: "'Fredoka One', cursive",
    fontSize: '42px',
    color: '#1A1A3E',
    margin: 0,
    letterSpacing: '1px',
  },
  subtitle: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '16px',
    color: '#6B6B8A',
    margin: 0,
    letterSpacing: '2px',
    fontWeight: 600,
  },
  divider: {
    width: '48px',
    height: '4px',
    borderRadius: '2px',
    background: '#FFD93D',
  },
  fieldGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '15px',
    color: '#1A1A3E',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '16px',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    borderRadius: '16px',
    border: '2px solid #FFD93D',
    outline: 'none',
    background: '#FFFDF0',
    color: '#1A1A3E',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontFamily: "'Fredoka One', cursive",
    letterSpacing: '1px',
    borderRadius: '20px',
    border: 'none',
    background: '#1A1A3E',
    color: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s, opacity 0.2s',
    boxShadow: '0 4px 16px rgba(26,26,62,0.25)',
  },
  buttonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
}

const CORNERS = [
  { top: '18px', left: '20px', content: '✨' },
  { top: '18px', right: '20px', content: '⭐' },
  { bottom: '18px', left: '20px', content: '⭐' },
  { bottom: '18px', right: '20px', content: '✨' },
]

export default function WelcomeScreen() {
  const [name, setName] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const canPlay = name.trim().length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canPlay) return
    navigate('/level', { state: { playerName: name.trim() } })
  }

  return (
    <div style={styles.container}>
      {CORNERS.map((c, i) => (
        <span key={i} style={{ ...styles.corner, ...c }}>
          {c.content}
        </span>
      ))}

      <div style={styles.card}>
        <div style={styles.bee}>🐝</div>

        <h1 style={styles.title}>Spelling Bee!</h1>
        <p style={styles.subtitle}>Learn · Spell · Shine</p>

        <div style={styles.divider} />

        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div style={styles.fieldGroup}>
            <label htmlFor="player-name" style={styles.label}>
              Who&apos;s playing today?
            </label>
            <input
              id="player-name"
              type="text"
              placeholder="Type your name…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                ...styles.input,
                borderColor: focused ? '#6BCB77' : '#FFD93D',
              }}
              autoComplete="off"
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={!canPlay}
            style={{
              ...styles.button,
              ...(!canPlay ? styles.buttonDisabled : {}),
            }}
            onMouseEnter={(e) => {
              if (canPlay) {
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 8px 24px rgba(26,26,62,0.30)'
              }
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'none'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 4px 16px rgba(26,26,62,0.25)'
            }}
          >
            🚀 Let&apos;s Play!
          </button>
        </form>
      </div>
    </div>
  )
}
