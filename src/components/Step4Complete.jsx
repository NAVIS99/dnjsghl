import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './StepForm.css'

const SUGGESTED_ARTISTS = ['Yayoi Kusama', 'David Hockney', 'Gerhard Richter', 'Banksy']

export default function Step4Complete({ t, onGoHome }) {
  const [categories, setCategories] = useState([])
  const [artists, setArtists] = useState([])
  const [showDirectInput, setShowDirectInput] = useState(false)
  const [customArtist, setCustomArtist] = useState('')
  const directInputRef = useRef(null)

  const isKo = t.langToggle === 'EN'

  // 빵빠레 효과
  useEffect(() => {
    const fire = (opts) => confetti({ particleCount: 60, spread: 70, origin: { y: 0.55 }, ...opts })
    fire({ angle: 60, origin: { x: 0.1, y: 0.6 }, colors: ['#F76E33', '#C9A86A', '#0A1128'] })
    fire({ angle: 120, origin: { x: 0.9, y: 0.6 }, colors: ['#F76E33', '#C9A86A', '#FFFFFF'] })
    setTimeout(() => fire({ angle: 90, origin: { x: 0.5, y: 0.65 }, particleCount: 80 }), 250)
  }, [])

  const toggleCategory = (c) => setCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])
  const toggleArtist = (a) => setArtists((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a])

  const handleDirectToggle = () => {
    setShowDirectInput((v) => !v)
    if (!showDirectInput) {
      setTimeout(() => directInputRef.current?.focus(), 50)
    }
  }

  return (
    <div className="complete-screen">
      {/* 완료 아이콘 */}
      <div className="complete-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(247,110,51,0.15)"/>
          <path d="M12 20l6 6 10-12" stroke="#F76E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* 완료 헤딩 */}
      <div className="complete-heading">
        <h2>{t.step4Title}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{t.step4Desc}</p>
      </div>

      {/* 맞춤 설정 패널 */}
      <div className="personalization-panel">
        <div className="personalization-panel__header">
          <div className="personalization-panel__title-row">
            <span style={{ fontSize: '18px' }}>✨</span>
            <p className="personalization-panel__title">{t.step3Title}</p>
            <span className="optional-badge">{t.optional}</span>
          </div>
          <p className="personalization-panel__desc">{t.step3Desc}</p>
        </div>

        {/* 관심분야 */}
        <div className="field-group">
          <p className="field-group__label">
            {t.interestCategories} <span className="label-optional">{t.optionalMark}</span>
          </p>
          <div className="category-tags">
            {t.categories.map((c) => (
              <button
                key={c}
                className={`category-tag ${categories.includes(c) ? 'category-tag--active' : ''}`}
                onClick={() => toggleCategory(c)}
              >
                {categories.includes(c) && <CheckMark />}
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 관심작가 */}
        <div className="field-group">
          <p className="field-group__label">
            {t.preferredArtists} <span className="label-optional">{t.optionalMark}</span>
          </p>
          <div className="artist-chips">
            {SUGGESTED_ARTISTS.map((a) => {
              const isSelected = artists.includes(a)
              return (
                <button
                  key={a}
                  className={`artist-chip ${isSelected ? 'artist-chip--selected' : ''}`}
                  onClick={() => toggleArtist(a)}
                >
                  {isSelected && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M1 4.5l3 3 6-7" stroke="#F76E33" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {!isSelected && <span style={{ marginRight: '2px' }}>+</span>}
                  {a}
                </button>
              )
            })}
            {/* 직접입력 칩 */}
            <button
              className={`artist-chip ${showDirectInput ? 'artist-chip--selected' : ''}`}
              onClick={handleDirectToggle}
            >
              {showDirectInput ? (
                <>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M1 4.5l3 3 6-7" stroke="#F76E33" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isKo ? '직접입력' : 'Custom'}
                </>
              ) : (
                <>{isKo ? '+ 직접입력' : '+ Custom'}</>
              )}
            </button>
          </div>

          {/* 직접입력 인풋 */}
          {showDirectInput && (
            <div className="direct-input-row">
              <input
                ref={directInputRef}
                className="form-field__input direct-artist-input"
                placeholder={isKo ? '작가 이름을 입력하세요' : 'Enter artist name'}
                value={customArtist}
                onChange={(e) => setCustomArtist(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* CTA 버튼 */}
      <div className="complete-btns">
        <button className="btn-accent" style={{ width: '100%' }} onClick={onGoHome}>{t.startAuction}</button>
        <button className="btn-outline" style={{ width: '100%' }} onClick={onGoHome}>{t.laterBtn}</button>
      </div>
    </div>
  )
}

function CheckMark() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
