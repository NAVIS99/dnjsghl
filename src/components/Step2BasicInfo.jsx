import { useState } from 'react'
import './StepForm.css'

export default function Step2BasicInfo({ t, onNext, onPrev }) {
  const [form, setForm] = useState({
    userId: '', password: '', passwordConfirm: '', email: '', name: '', birthdate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const clear = (key) => () => setForm((p) => ({ ...p, [key]: '' }))
  const canContinue = Object.values(form).every(Boolean) && form.password === form.passwordConfirm

  const handleNext = () => {
    if (!canContinue) { setSubmitted(true); return }
    onNext()
  }

  return (
    <div className="step-form">
      <div className="step-form__heading">
        <h2 className="step-form__title">{t.step2Title}</h2>
        <p className="step-form__desc">{t.step2Desc}</p>
      </div>

      <div className="form-fields">
        <div className="form-field">
          <label className="form-field__label">{t.userId} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <UserIcon />
            <input className="form-field__input" placeholder={t.userIdPlaceholder} value={form.userId} onChange={set('userId')} style={submitted && !form.userId ? { borderColor: '#E53E3E' } : {}} />
            {form.userId && <button className="field-clear-btn" type="button" onClick={clear('userId')}><ClearIcon /></button>}
          </div>
          {submitted && !form.userId && <p className="field-error">사용자 ID를 입력해주세요.</p>}
        </div>

        <div className="form-field">
          <label className="form-field__label">{t.password} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <LockIcon />
            <input className="form-field__input" type="password" placeholder={t.passwordPlaceholder} value={form.password} onChange={set('password')} style={submitted && !form.password ? { borderColor: '#E53E3E' } : {}} />
            {form.password && <button className="field-clear-btn" type="button" onClick={clear('password')}><ClearIcon /></button>}
          </div>
          {submitted && !form.password && <p className="field-error">비밀번호를 입력해주세요.</p>}
        </div>

        <div className="form-field">
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
          {submitted && !form.passwordConfirm && <p className="field-error">비밀번호 확인을 입력해주세요.</p>}
          {form.passwordConfirm && form.password !== form.passwordConfirm && <p className="field-error">비밀번호가 일치하지 않습니다.</p>}
        </div>

        <div className="form-field">
          <label className="form-field__label">{t.email} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <EmailIcon />
            <input className="form-field__input" type="email" placeholder="your.email@example.com" value={form.email} onChange={set('email')} style={submitted && !form.email ? { borderColor: '#E53E3E' } : {}} />
            {form.email && <button className="field-clear-btn" type="button" onClick={clear('email')}><ClearIcon /></button>}
          </div>
          {submitted && !form.email && <p className="field-error">이메일을 입력해주세요.</p>}
        </div>

        <div className="form-field">
          <label className="form-field__label">{t.name} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <UserIcon />
            <input className="form-field__input" placeholder={t.namePlaceholder} value={form.name} onChange={set('name')} style={submitted && !form.name ? { borderColor: '#E53E3E' } : {}} />
            {form.name && <button className="field-clear-btn" type="button" onClick={clear('name')}><ClearIcon /></button>}
          </div>
          {submitted && !form.name && <p className="field-error">이름을 입력해주세요.</p>}
        </div>

        <div className="form-field">
          <label className="form-field__label">{t.birthdate} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <CalendarIcon />
            <input className="form-field__input" type="date" value={form.birthdate} onChange={set('birthdate')} style={submitted && !form.birthdate ? { borderColor: '#E53E3E' } : {}} />
          </div>
          {submitted && !form.birthdate && <p className="field-error">생년월일을 선택해주세요.</p>}
        </div>
      </div>

      <div className="step-actions step-actions--row">
        <button className="btn-outline" style={{ flex: '0 0 calc(50% - 6px)' }} onClick={onPrev}>{t.prevBtn}</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={handleNext}>
          {t.continueBtn}
        </button>
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

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="#C4C4C8"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
