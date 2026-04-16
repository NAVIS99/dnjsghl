import { useState, useRef } from 'react'
import './StepForm.css'

export default function Step2BasicInfo({ t, onNext, onPrev }) {
  const [form, setForm] = useState({
    userId: '', password: '', passwordConfirm: '', email: '', name: '', birthdate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [gender, setGender] = useState('')
  const [occupation, setOccupation] = useState('')
  const [marketing, setMarketing] = useState({ email: false, sms: false, phone: false })
  const [clickCount, setClickCount] = useState(0)

  const isKo = t.langToggle === 'EN'
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const clear = (key) => () => setForm((p) => ({ ...p, [key]: '' }))
  const allMarketing = marketing.email && marketing.sms && marketing.phone
  const toggleAllMarketing = () => { const v = !allMarketing; setMarketing({ email: v, sms: v, phone: v }) }
  const toggleMarketing = (k) => setMarketing((p) => ({ ...p, [k]: !p[k] }))
  const canContinue = Object.values(form).every(Boolean) && form.password === form.passwordConfirm

  // 스크롤 앵커 refs
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
    const next = clickCount + 1
    setClickCount(next)
    if (next >= 3) { onNext(); return }
    setSubmitted(true)

    // 첫 번째 미입력 항목으로 스크롤
    const checks = [
      { ref: refs.userId, invalid: !form.userId },
      { ref: refs.password, invalid: !form.password },
      { ref: refs.passwordConfirm, invalid: !form.passwordConfirm || (form.passwordConfirm && form.password !== form.passwordConfirm) },
      { ref: refs.email, invalid: !form.email },
      { ref: refs.name, invalid: !form.name },
      { ref: refs.birthdate, invalid: !form.birthdate },
    ]
    const first = checks.find((c) => c.invalid)
    if (first?.ref.current) {
      first.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

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
            <input className="form-field__input" type="password" placeholder={t.passwordPlaceholder} value={form.password} onChange={set('password')} style={submitted && !form.password ? { borderColor: '#E53E3E' } : {}} />
            {form.password && <button className="field-clear-btn" type="button" onClick={clear('password')}><ClearIcon /></button>}
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
              type="password"
              placeholder={t.passwordConfirmPlaceholder}
              value={form.passwordConfirm}
              onChange={set('passwordConfirm')}
              style={(form.passwordConfirm && form.password !== form.passwordConfirm) || (submitted && !form.passwordConfirm) ? { borderColor: '#E53E3E' } : {}}
            />
            {form.passwordConfirm && <button className="field-clear-btn" type="button" onClick={clear('passwordConfirm')}><ClearIcon /></button>}
          </div>
          {submitted && !form.passwordConfirm && <p className="field-error">{isKo ? '비밀번호 확인을 입력해주세요.' : 'Please confirm your password.'}</p>}
          {form.passwordConfirm && form.password !== form.passwordConfirm && <p className="field-error">{isKo ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.'}</p>}
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

        {/* 이름 */}
        <div className="form-field" ref={refs.name}>
          <label className="form-field__label">{t.name} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <UserIcon />
            <input className="form-field__input" placeholder={t.namePlaceholder} value={form.name} onChange={set('name')} style={submitted && !form.name ? { borderColor: '#E53E3E' } : {}} />
            {form.name && <button className="field-clear-btn" type="button" onClick={clear('name')}><ClearIcon /></button>}
          </div>
          {submitted && !form.name && <p className="field-error">{isKo ? '이름을 입력해주세요.' : 'Please enter your name.'}</p>}
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

        {/* 성별 (박스 선택) */}
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

        {/* 직업 */}
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
      </div>

      {/* 마케팅 수신 동의 */}
      <div className="field-group">
        <p className="field-group__label">
          {t.marketingTitle} <span className="label-optional">{t.optionalMark}</span>
        </p>
        <div className="marketing-agree-box">
          {/* 전체동의 */}
          <label className="marketing-agree-all">
            <CheckBox checked={allMarketing} onChange={toggleAllMarketing} />
            <div className="marketing-agree-all__text">
              <span className="marketing-agree-all__title">{t.marketingAll}</span>
              <span className="marketing-agree-all__desc">{t.marketingDesc}</span>
            </div>
          </label>
          <div className="marketing-agree-divider" />
          {/* 개별 항목 — 1행 3등분 */}
          <div className="marketing-agree-items-row">
            {[
              { key: 'email', label: t.emailNotif },
              { key: 'sms', label: t.smsNotif },
              { key: 'phone', label: t.phoneNotif },
            ].map(({ key, label }) => (
              <label key={key} className="marketing-agree-item">
                <CheckBox checked={marketing[key]} onChange={() => toggleMarketing(key)} />
                <span className="marketing-agree-item__label">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="step-actions step-actions--row">
        <button className="btn-outline" style={{ flex: '0 0 128px' }} onClick={onPrev}>{t.prevBtn}</button>
        <button className="btn-accent" style={{ flex: 1 }} onClick={handleNext}>
          {t.completeBtn}
        </button>
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
function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="#C4C4C8"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
