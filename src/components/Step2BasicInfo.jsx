import { useState, useRef } from 'react'
import './StepForm.css'

export default function Step2BasicInfo({ t, onNext, onPrev, memberTypeIdx = 0, verifiedInput = '', verifiedMethod = 'phone' }) {
  const [form, setForm] = useState({
    userId: '', password: '', passwordConfirm: '', email: '', name: '', birthdate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [gender, setGender] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [roadAddress, setRoadAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [occupation, setOccupation] = useState('')
  const [bizCardFile, setBizCardFile] = useState(null)
  const [idDocFile, setIdDocFile] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [showPwConfirm, setShowPwConfirm] = useState(false)
  const bizCardInputRef = useRef(null)
  const idDocInputRef = useRef(null)

  const isKo = t.langToggle === 'EN'
  const isBiz = memberTypeIdx === 1 || memberTypeIdx === 3
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const clear = (key) => () => setForm((p) => ({ ...p, [key]: '' }))
  const canContinue = Object.values(form).every(Boolean) && form.password === form.passwordConfirm

  const refs = {
    userId: useRef(null),
    password: useRef(null),
    passwordConfirm: useRef(null),
    email: useRef(null),
    name: useRef(null),
    birthdate: useRef(null),
  }

  const handleNext = () => {
    if (canContinue) { onNext(); return }
    setSubmitted(true)
    const checks = [
      { ref: refs.userId, invalid: !form.userId },
      { ref: refs.password, invalid: !form.password },
      { ref: refs.passwordConfirm, invalid: !form.passwordConfirm || (form.passwordConfirm && form.password !== form.passwordConfirm) },
      { ref: refs.name, invalid: !form.name },
      { ref: refs.birthdate, invalid: !form.birthdate },
      { ref: refs.email, invalid: !form.email },
    ]
    const first = checks.find((c) => c.invalid)
    if (first?.ref.current) {
      first.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleAddressSelect = ({ postal, road }) => {
    setPostalCode(postal)
    setRoadAddress(road)
    setShowAddressModal(false)
  }

  const nameLabel = isBiz ? t.managerName : t.name
  const namePlaceholder = isBiz ? t.managerNamePlaceholder : t.namePlaceholder

  return (
    <div className="step-form">
      <div className="step-form__heading">
        <h2 className="step-form__title">{t.step2Title}</h2>
        <p className="step-form__desc">{t.step2Desc}</p>
      </div>

      <div className="form-fields">
        {/* 사용자 ID */}
        <div className="form-field" ref={refs.userId}>
          <label className="form-field__label">{t.userId} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <UserIcon />
            <input className="form-field__input" placeholder={t.userIdPlaceholder} value={form.userId} onChange={set('userId')} style={submitted && !form.userId ? { borderColor: '#E53E3E' } : {}} />
            {form.userId && <button className="field-clear-btn" type="button" onClick={clear('userId')}><ClearIcon /></button>}
          </div>
          {submitted && !form.userId && <p className="field-error">{isKo ? '사용자 ID를 입력해주세요.' : 'Please enter a username.'}</p>}
        </div>

        {/* 비밀번호 */}
        <div className="form-field" ref={refs.password}>
          <label className="form-field__label">{t.password} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <LockIcon />
            <input className="form-field__input" type={showPw ? 'text' : 'password'} placeholder={t.passwordPlaceholder} value={form.password} onChange={set('password')} style={{ paddingRight: '80px', ...(submitted && !form.password ? { borderColor: '#E53E3E' } : {}) }} />
            <div className="pw-icons">
              {form.password && <button className="field-icon-btn" type="button" onClick={clear('password')}><ClearIcon /></button>}
              <button className="field-icon-btn" type="button" onClick={() => setShowPw((v) => !v)}><EyeIcon open={showPw} /></button>
            </div>
          </div>
          {submitted && !form.password && <p className="field-error">{isKo ? '비밀번호를 입력해주세요.' : 'Please enter a password.'}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-field" ref={refs.passwordConfirm}>
          <label className="form-field__label">{t.passwordConfirm} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <LockIcon />
            <input
              className="form-field__input"
              type={showPwConfirm ? 'text' : 'password'}
              placeholder={t.passwordConfirmPlaceholder}
              value={form.passwordConfirm}
              onChange={set('passwordConfirm')}
              style={{ paddingRight: '80px', ...((form.passwordConfirm && form.password !== form.passwordConfirm) || (submitted && !form.passwordConfirm) ? { borderColor: '#E53E3E' } : {}) }}
            />
            <div className="pw-icons">
              {form.passwordConfirm && <button className="field-icon-btn" type="button" onClick={clear('passwordConfirm')}><ClearIcon /></button>}
              <button className="field-icon-btn" type="button" onClick={() => setShowPwConfirm((v) => !v)}><EyeIcon open={showPwConfirm} /></button>
            </div>
          </div>
          {submitted && !form.passwordConfirm && <p className="field-error">{isKo ? '비밀번호 확인을 입력해주세요.' : 'Please confirm your password.'}</p>}
          {form.passwordConfirm && form.password !== form.passwordConfirm && <p className="field-error">{isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.'}</p>}
        </div>

        {/* 신분증 사본 (선택) */}
        <div className="form-field">
          <label className="form-field__label">{isKo ? '신분증 사본' : 'ID Document'} <span className="label-optional">{t.optionalMark}</span></label>
          <div className="form-field__file-row">
            <div className="form-field__input-wrap" style={{ flex: 1 }}>
              <AttachIcon />
              <input
                className="form-field__input"
                placeholder={isKo ? '여권 등 신분증 사본' : 'Passport or ID copy'}
                value={idDocFile?.name || ''}
                readOnly
                style={{ cursor: 'default', paddingRight: idDocFile ? '40px' : '16px' }}
              />
              {idDocFile && (
                <button className="field-clear-btn" type="button" onClick={() => setIdDocFile(null)}>
                  <ClearIcon />
                </button>
              )}
            </div>
            <button className="btn-file-browse" type="button" onClick={() => idDocInputRef.current?.click()}>
              {isKo ? '파일찾기' : 'Browse'}
            </button>
          </div>
          <p className="field-hint">{isKo ? 'jpg, jpeg, png, heic 또는 pdf 파일 업로드 (검수 후 모든 서비스 이용 가능)' : 'Upload jpg, jpeg, png, heic, or pdf (All services available after review)'}</p>
          <input ref={idDocInputRef} type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" style={{ display: 'none' }} onChange={(e) => setIdDocFile(e.target.files[0] || null)} />
        </div>

        {/* 이름 / 담당자 이름 */}
        <div className="form-field" ref={refs.name}>
          <label className="form-field__label">{nameLabel} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <UserIcon />
            <input className="form-field__input" placeholder={namePlaceholder} value={form.name} onChange={set('name')} style={submitted && !form.name ? { borderColor: '#E53E3E' } : {}} />
            {form.name && <button className="field-clear-btn" type="button" onClick={clear('name')}><ClearIcon /></button>}
          </div>
          {submitted && !form.name && <p className="field-error">{isKo ? `${nameLabel}을 입력해주세요.` : `Please enter ${nameLabel}.`}</p>}
        </div>

        {/* 생년월일 */}
        <div className="form-field" ref={refs.birthdate}>
          <label className="form-field__label">{t.birthdate} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <CalendarIcon />
            <input className="form-field__input" type="date" value={form.birthdate} onChange={set('birthdate')} style={submitted && !form.birthdate ? { borderColor: '#E53E3E' } : {}} />
          </div>
          {submitted && !form.birthdate && <p className="field-error">{isKo ? '생년월일을 선택해주세요.' : 'Please select your date of birth.'}</p>}
        </div>

        {/* 이메일 */}
        <div className="form-field" ref={refs.email}>
          <label className="form-field__label">{t.email} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <EmailIcon />
            <input className="form-field__input" type="email" placeholder="your.email@example.com" value={form.email} onChange={set('email')} style={submitted && !form.email ? { borderColor: '#E53E3E' } : {}} />
            {form.email && <button className="field-clear-btn" type="button" onClick={clear('email')}><ClearIcon /></button>}
          </div>
          {submitted && !form.email && <p className="field-error">{isKo ? '이메일을 입력해주세요.' : 'Please enter your email.'}</p>}
        </div>

        {/* 휴대폰 번호 (사업자 유형, 휴대폰 인증인 경우) */}
        {isBiz && verifiedInput && verifiedMethod === 'phone' && (
          <div className="form-field">
            <label className="form-field__label">{t.verifiedPhoneLabel} <span className="text-accent">*</span></label>
            <div className="form-field__input-wrap">
              <PhoneIcon />
              <input
                className="form-field__input"
                value={verifiedInput}
                disabled
                style={{ backgroundColor: '#F8F8FA', color: '#6B6B7B', paddingRight: '44px' }}
              />
              <span className="field-verified-mark">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="rgba(34,197,94,0.1)" stroke="#22C55E" strokeWidth="1.3"/>
                  <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* 담당자 명함 (사업자 유형) */}
        {isBiz && (
          <div className="form-field">
            <label className="form-field__label">{t.bizCard} <span className="text-accent">*</span></label>
            <div className="form-field__file-row">
              <div className="form-field__input-wrap" style={{ flex: 1 }}>
                <AttachIcon />
                <input
                  className="form-field__input"
                  placeholder={isKo ? '파일을 첨부해주세요' : 'Attach a file'}
                  value={bizCardFile?.name || ''}
                  readOnly
                  style={{ cursor: 'default', paddingRight: bizCardFile ? '40px' : '16px' }}
                />
                {bizCardFile && (
                  <button className="field-clear-btn" type="button" onClick={() => setBizCardFile(null)}>
                    <ClearIcon />
                  </button>
                )}
              </div>
              <button className="btn-file-browse" type="button" onClick={() => bizCardInputRef.current?.click()}>
                {t.fileUpload}
              </button>
            </div>
            {!bizCardFile && <p className="field-hint">{t.bizCardDesc}</p>}
            <input ref={bizCardInputRef} type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" style={{ display: 'none' }} onChange={(e) => setBizCardFile(e.target.files[0] || null)} />
          </div>
        )}

        {/* 성별 (사업자 유형 제외) */}
        {!isBiz && (
          <div className="form-field">
            <label className="form-field__label">
              {t.gender} <span className="label-optional">{t.optionalMark}</span>
            </label>
            <div className="gender-box-group">
              {t.genders.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`gender-box-btn ${gender === g ? 'gender-box-btn--active' : ''}`}
                  onClick={() => setGender(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 주소 (개인 유형만) */}
        {!isBiz && (
          <div className="form-field">
            <label className="form-field__label">
              {t.address} <span className="label-optional">{t.optionalMark}</span>
            </label>
            <div className="address-field-group">
              <div className="address-row">
                <input
                  className="address-input address-input--postal"
                  placeholder={t.postalCode}
                  value={postalCode}
                  readOnly
                />
                <button
                  type="button"
                  className="btn-address-search"
                  onClick={() => setShowAddressModal(true)}
                >
                  {t.addressSearch}
                </button>
              </div>
              <input
                className="address-input"
                placeholder={t.addressPlaceholder}
                value={roadAddress}
                readOnly
              />
              <input
                className="address-input"
                placeholder={t.addressDetailPlaceholder}
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 직업 (개인 유형만) */}
        {!isBiz && (
          <div className="form-field">
            <label className="form-field__label">
              {t.occupation} <span className="label-optional">{t.optionalMark}</span>
            </label>
            <div className="form-select-wrap">
              <select className="form-select" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
                {t.occupations.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className={isBiz ? 'btn-primary' : 'btn-accent'} onClick={handleNext}>
          {isBiz ? t.continueBtn : t.completeBtn}
        </button>
      </div>

      {/* 주소 검색 모달 */}
      {showAddressModal && (
        <AddressModal
          onSelect={handleAddressSelect}
          onClose={() => setShowAddressModal(false)}
          isKo={isKo}
        />
      )}
    </div>
  )
}

function AddressModal({ onSelect, onClose, isKo }) {
  const [query, setQuery] = useState('')

  const mockAddresses = [
    { postal: '06236', road: isKo ? '서울특별시 강남구 테헤란로 152' : '152 Teheran-ro, Gangnam-gu, Seoul' },
    { postal: '04524', road: isKo ? '서울특별시 중구 세종대로 110' : '110 Sejong-daero, Jung-gu, Seoul' },
    { postal: '03187', road: isKo ? '서울특별시 종로구 사직로 161' : '161 Sajik-ro, Jongno-gu, Seoul' },
    { postal: '16488', road: isKo ? '경기도 수원시 영통구 삼성로 129' : '129 Samsung-ro, Yeongtong-gu, Suwon' },
    { postal: '48058', road: isKo ? '부산광역시 해운대구 센텀남대로 59' : '59 Centum Nam-daero, Haeundae-gu, Busan' },
  ]

  const filtered = query.trim()
    ? mockAddresses.filter((a) => a.road.toLowerCase().includes(query.toLowerCase()) || a.postal.includes(query))
    : mockAddresses

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal__header">
          <h3 className="address-modal__title">{isKo ? '주소 검색' : 'Address Search'}</h3>
          <button className="address-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="#6B6B7B" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="address-modal__search">
          <input
            className="address-modal__input"
            placeholder={isKo ? '도로명, 지번, 건물명으로 검색' : 'Search by road, lot number, or building'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="address-modal__results">
          {filtered.length > 0 ? filtered.map((a, i) => (
            <button key={i} className="address-modal__item" onClick={() => onSelect(a)}>
              <span className="address-modal__postal">{a.postal}</span>
              <span className="address-modal__road">{a.road}</span>
            </button>
          )) : (
            <p className="address-modal__empty">{isKo ? '검색 결과가 없습니다.' : 'No results found.'}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="3.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M7 9V6a3 3 0 016 0v3" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="13.5" r="1.5" fill="#6B6B7B"/>
    </svg>
  )
}
function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4.5" width="16" height="11" rx="1.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M2 7.5L10 12L18 7.5" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3.5" width="15" height="14" rx="1.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M6.5 2v3M13.5 2v3M2.5 8.5h15" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 3.5h3.5l1.75 4.375-2.188 1.313A12.25 12.25 0 0011.813 14l1.312-2.188L17.5 13.5V17a1.75 1.75 0 01-1.75 1.75A15.75 15.75 0 011.75 5.25 1.75 1.75 0 013.5 3.5z" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C2.5 5 5.5 3 9 3s6.5 2 8 6c-1.5 4-4.5 6-8 6S2.5 13 1 9z" stroke="#6B6B7B" strokeWidth="1.4"/>
      <circle cx="9" cy="9" r="2.5" stroke="#6B6B7B" strokeWidth="1.4"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9C2.5 5 5.5 3 9 3s6.5 2 8 6c-1.5 4-4.5 6-8 6S2.5 13 1 9z" stroke="#6B6B7B" strokeWidth="1.4"/>
      <circle cx="9" cy="9" r="2.5" stroke="#6B6B7B" strokeWidth="1.4"/>
      <path d="M2 2l14 14" stroke="#6B6B7B" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}
function AttachIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 7.5l-6 6a4 4 0 01-5.657-5.657l6-6a2.5 2.5 0 013.536 3.536l-6.001 6A1 1 0 014.37 9.966l5.293-5.293" stroke="#6B6B7B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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
