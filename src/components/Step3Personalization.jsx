import { useState } from 'react'
import './StepForm.css'

const SUGGESTED_ARTISTS = ['Yayoi Kusama', 'David Hockney', 'Gerhard Richter', 'Banksy', 'Takashi Murakami', 'Jeff Koons']

export default function Step3Personalization({ t, onComplete, onSkip, onPrev }) {
  const [categories, setCategories] = useState([])
  const [selectedArtists, setSelectedArtists] = useState([])
  const [artistQuery, setArtistQuery] = useState('')
  const [gender, setGender] = useState('')
  const [occupation, setOccupation] = useState('')
  const [marketing, setMarketing] = useState({ email: false, sms: false, phone: false })

  const toggleCategory = (c) => setCategories((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])
  const toggleMarketing = (k) => setMarketing((p) => ({ ...p, [k]: !p[k] }))

  const addArtist = (name) => {
    if (!selectedArtists.includes(name)) setSelectedArtists((p) => [...p, name])
  }
  const removeArtist = (name) => setSelectedArtists((p) => p.filter((x) => x !== name))

  const handleArtistSearch = (e) => setArtistQuery(e.target.value)

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && artistQuery.trim()) {
      addArtist(artistQuery.trim())
      setArtistQuery('')
    }
  }

  return (
    <div className="step-form">
      <div className="step-form__heading">
        <div className="step-header-with-badge">
          <span style={{ fontSize: '20px' }}>✨</span>
          <h2 className="step-form__title">{t.step3Title}</h2>
          <span className="optional-badge">{t.optional}</span>
        </div>
        <p className="step-form__desc">{t.step3Desc}</p>
      </div>

      {/* 관심 카테고리 */}
      <div className="field-group">
        <p className="field-group__label">{t.interestCategories}</p>
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

      {/* 선호 작가 */}
      <div className="field-group">
        <p className="field-group__label">{t.preferredArtists}</p>

        {/* 검색 입력 */}
        <div className="form-field__input-wrap">
          <SearchIcon />
          <input
            className="form-field__input"
            placeholder={t.artistSearchPlaceholder}
            value={artistQuery}
            onChange={handleArtistSearch}
            onKeyDown={handleSearchKeyDown}
          />
          {artistQuery && (
            <button className="field-clear-btn" onClick={() => setArtistQuery('')} type="button">
              <ClearIcon />
            </button>
          )}
        </div>

        {/* 추가된 작가 태그 */}
        {selectedArtists.length > 0 && (
          <div className="artist-added-list">
            <p className="artist-added-label">
              {t.preferredArtists} <span className="artist-added-count">{selectedArtists.length}</span>
            </p>
            <div className="artist-chips">
              {selectedArtists.map((a) => (
                <span key={a} className="artist-chip artist-chip--added">
                  {a}
                  <button className="artist-chip__remove" onClick={() => removeArtist(a)} type="button">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 2l6 6M8 2L2 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 추천 작가 */}
        <div>
          <p className="artist-section-label">{t.recommendedArtists}</p>
          <div className="artist-chips">
            {SUGGESTED_ARTISTS.map((a) => {
              const isAdded = selectedArtists.includes(a)
              return (
                <button
                  key={a}
                  className={`artist-chip ${isAdded ? 'artist-chip--selected' : ''}`}
                  onClick={() => isAdded ? removeArtist(a) : addArtist(a)}
                >
                  {isAdded ? (
                    <>
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5l3 3 6-7" stroke="#F76E33" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {a}
                    </>
                  ) : (
                    <>+ {a}</>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 성별 */}
      <div className="field-group">
        <p className="field-group__label">{t.gender}</p>
        <div className="gender-grid">
          {t.genders.map((g) => (
            <button
              key={g}
              className={`gender-btn ${gender === g ? 'gender-btn--active' : ''}`}
              onClick={() => setGender(g)}
            >
              {gender === g && <CheckMark color="#F76E33" />}
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 직업 */}
      <div className="field-group">
        <p className="field-group__label">{t.occupation}</p>
        <div className="form-select-wrap">
          <select className="form-select" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
            {t.occupations.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 마케팅 수신 동의 */}
      <div className="marketing-card">
        <p className="marketing-card__title">{t.marketingTitle}</p>
        <p className="marketing-card__desc">{t.marketingDesc}</p>
        <div className="marketing-card__items">
          {[
            { key: 'email', label: t.emailNotif },
            { key: 'sms', label: t.smsNotif },
            { key: 'phone', label: t.phoneNotif },
          ].map(({ key, label }) => (
            <label key={key} className="marketing-item">
              <CheckBox checked={marketing[key]} onChange={() => toggleMarketing(key)} />
              <span className="marketing-item__label">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="step-actions">
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ flex: '0 0 128px' }} onClick={onPrev}>{t.prevBtn}</button>
          <button className="btn-accent" style={{ flex: 1 }} onClick={onComplete}>{t.completeBtn}</button>
        </div>
        <button className="btn-text" onClick={onSkip}>{t.skipBtn}</button>
      </div>
    </div>
  )
}

function CheckBox({ checked, onChange }) {
  return (
    <button className={`checkbox ${checked ? 'checkbox--checked' : ''}`} onClick={onChange} type="button">
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

function CheckMark({ color = 'currentColor' }) {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 5L4.5 8.5L11 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M13 13L17 17" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="#C4C4C8"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
