import { useState } from 'react'

const CORRECT_PASSWORD = 'zpdldhrtus'

export default function PasswordGate({ children }) {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === CORRECT_PASSWORD) {
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (unlocked) return children

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A1128',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
      }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: '36px',
            color: '#FAF8F5',
            letterSpacing: '0.04em',
            marginBottom: '8px',
          }}>
            ARTÉLITE
          </p>
          <p style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '13px',
            color: '#C9A86A',
            letterSpacing: '1.4px',
          }}>
            PREVIEW ACCESS
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false) }}
              autoFocus
              style={{
                width: '100%',
                height: '52px',
                padding: '0 16px',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${error ? '#E53E3E' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '4px',
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '15px',
                color: '#FAF8F5',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
            />
          </div>
          {error && (
            <p style={{
              fontFamily: 'Pretendard, sans-serif',
              fontSize: '13px',
              color: '#E53E3E',
              marginTop: '-4px',
            }}>
              비밀번호가 올바르지 않습니다.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '52px',
              background: '#F76E33',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Pretendard, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              color: 'white',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            입장하기
          </button>
        </form>
      </div>
    </div>
  )
}
