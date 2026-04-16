import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './StepForm.css'

export default function Step4Complete({ t, onGoHome }) {
  const [categories, setCategories] = useState([])
  const [artists, setArtists] = useState([])
  const [artistInput, setArtistInput] = useState('')
  const artistInputRef = useRef(null)

  const isKo = t.langToggle === 'EN'

  // 빵빠레 효과
  useEffect(() => {
    const fire = (opts) => confetti({ particleCount: 60, spread: 70, origin: { y: 0.55 }, ...opts })
    fire({ angle: 60, origin: { x: 0.1, y: 0.6 }, colors: ['#F76E33', '#C9A86A', '#0A1128'] })
    fire({ angle: 120, origin: { x: 0.9, y: 0.6 }, colors: ['#F76E33', '#C9A86A', '#FFFFFF'] })
    setTimeout(() => fire({ angle: 90, origin: { x: 0.5, y: 0.65 }, particleCount: 80 }), 250)
  }, [])

  const toggleCategory = (c) => setCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])

  const addArtist = () => {
    const name = artistInput.trim()
    if (!name || artists.includes(name)) return
    setArtists((p) => [...p, name])
    setArtistInput('')
    artistInputRef.current?.focus()
  }

  const removeArtist = (name) => setArtists((p) => p.filter((a) => a !== name))

  const handleArtistKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addArtist() }
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
            <span style={{ fontSize: '20px' }}>✨</span>
            <p className="personalization-panel__title">{t.step3Title}</p>
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

          {/* 추가된 작가 태그 */}
          {artists.length > 0 && (
            <div className="artist-tags-row">
              {artists.map((a) => (
                <span key={a} className="artist-tag">
                  {a}
                  <button type="button" className="artist-tag__remove" onClick={() => removeArtist(a)}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 작가 입력 필드 */}
          <div className="artist-input-row">
            <input
              ref={artistInputRef}
              className="form-field__input artist-text-input"
              placeholder={isKo ? '작가 이름을 입력하세요' : 'Enter artist name'}
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              onKeyDown={handleArtistKeyDown}
            />
            <button
              type="button"
              className={`btn-add-artist ${!artistInput.trim() ? 'btn-add-artist--disabled' : ''}`}
              onClick={addArtist}
              disabled={!artistInput.trim()}
            >
              {isKo ? '추가' : 'Add'}
            </button>
          </div>
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
