import { useState, useEffect, useRef } from 'react'
import TermsModal from './TermsModal'
import './StepForm.css'

const TEST_CODE = '123456'
const TIMER_SEC = 180

export default function Step1Agreement({ t, onNext }) {
  const [agreements, setAgreements] = useState([false, false, false, false])
  const [memberType, setMemberType] = useState('')
  const [authMethod, setAuthMethod] = useState('phone')

  const [inputValue, setInputValue] = useState('')
  const [verifyStep, setVerifyStep] = useState('input') // 'input' | 'code' | 'verified'
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [timer, setTimer] = useState(TIMER_SEC)
  const timerRef = useRef(null)

  const [modal, setModal] = useState(null) // null | 0 | 1 | 2 | 3
  const [showErrors, setShowErrors] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const allChecked = agreements.every(Boolean)
  const toggleAll = () => { const v = !allChecked; setAgreements([v, v, v, v]) }
  const toggle = (i) => setAgreements((p) => p.map((val, idx) => idx === i ? !val : val))

  const canContinue = allChecked && memberType && verifyStep === 'verified'
  const isKo = t.langToggle === 'EN'
  const memberTypes = [t.domestic, t.domesticBiz, t.overseas, t.overseasBiz]
  const isPhone = authMethod === 'phone'

  const handleContinue = () => {
    if (!canContinue) { setShowErrors(true); return }
    onNext()
  }

  // 타이머
  useEffect(() => {
    if (verifyStep !== 'code') return
    setTimer(TIMER_SEC)
    timerRef.current = setInterval(() => {
      setTimer((s) => {
        if (s <= 1) { clearInterval(timerRef.current); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [verifyStep])

  // 토스트 자동 소멸
  useEffect(() => {
    if (!showToast) return
    const id = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(id)
  }, [showToast])

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSendCode = () => {
    if (!inputValue.trim()) return
    setCode('')
    setCodeError(false)
    setVerifyStep('code')
    setShowToast(true)
  }

  const handleVerify = () => {
    if (timer === 0) return
    if (code === TEST_CODE) {
      setVerifyStep('verified')
      clearInterval(timerRef.current)
    } else {
      setCodeError(true)
    }
  }

  const handleResend = () => {
    setCode('')
    setCodeError(false)
    setVerifyStep('code')
    setShowToast(true)
  }

  const switchAuthMethod = () => {
    setAuthMethod(isPhone ? 'email' : 'phone')
    setInputValue('')
    setCode('')
    setVerifyStep('input')
    setCodeError(false)
    clearInterval(timerRef.current)
  }

  const inputPlaceholder = isPhone ? t.phonePlaceholder : 'your.email@example.com'
  const inputType = isPhone ? 'tel' : 'email'

  return (
    <div className="step-form">
      <div className="step-form__heading">
        <h2 className="step-form__title">{t.step1Title}</h2>
        <p className="step-form__desc">{t.step1Desc}</p>
      </div>

      {/* 약관 동의 */}
      <div className="agreement-section">
        <div className="agreement-box" style={showErrors && !allChecked ? { borderColor: '#E53E3E' } : {}}>
          <label className="agreement-box__all">
            <CheckBox checked={allChecked} onChange={toggleAll} />
            <span className="agreement-box__all-label">{t.agreeAll}</span>
          </label>
          <div className="agreement-box__items">
            {t.agreementItems.map((label, i) => (
              <div key={i} className="agreement-item">
                <label className="agreement-item__label">
                  <CheckBox checked={agreements[i]} onChange={() => toggle(i)} />
                  <div className="agreement-item__text">
                    <p><span className="text-accent">{t.required}</span> {label}</p>
                  </div>
                </label>
                <button className="btn-detail" onClick={() => setModal(i)}>{t.viewDetail} <ArrowIcon /></button>
              </div>
            ))}
          </div>
        </div>
        {showErrors && !allChecked && (
          <p className="field-error">{isKo ? '필수 약관에 모두 동의해주세요.' : 'Please agree to all required terms.'}</p>
        )}
      </div>

      {/* 회원 유형 */}
      <div className="field-group">
        <p className="field-group__label">{t.memberType} <span className="text-accent">*</span></p>
        <div className="form-select-wrap">
          <select
            className="form-select"
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
            style={showErrors && !memberType ? { borderColor: '#E53E3E' } : {}}
          >
            <option value="">{t.memberTypePlaceholder}</option>
            {memberTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {showErrors && !memberType && (
          <p className="field-error">{isKo ? '회원 유형을 선택해주세요.' : 'Please select a member type.'}</p>
        )}
      </div>

      {/* 본인 인증 */}
      <div className="field-group">
        {/* 라벨 + 인증 전환 링크 */}
        <div className="field-group__label-row">
          <p className="field-group__label">
            {isPhone ? t.phoneVerify : t.emailVerify} <span className="text-accent">*</span>
          </p>
          {verifyStep === 'input' && (
            <button className="auth-fallback-link" onClick={switchAuthMethod}>
              {isPhone ? t.emailFallbackLink : t.phoneFallbackLink} →
            </button>
          )}
        </div>

        {/* 입력 + 발송 버튼 */}
        {verifyStep !== 'verified' && (
          <div className="phone-input-row">
            <div className="input-with-icon" style={{ position: 'relative' }}>
              {isPhone ? <PhoneIcon /> : <EmailIcon />}
              <input
                type={inputType}
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={verifyStep === 'code'}
                style={{ paddingRight: inputValue ? '40px' : '16px' }}
              />
              {inputValue && verifyStep === 'input' && (
                <button className="field-clear-btn" onClick={() => setInputValue('')} type="button">
                  <ClearIcon />
                </button>
              )}
            </div>
            {verifyStep === 'input' ? (
              <button
                className={`btn-send-code ${!inputValue.trim() ? 'btn-send-code--disabled' : ''}`}
                onClick={handleSendCode}
                disabled={!inputValue.trim()}
              >
                {t.sendCode}
              </button>
            ) : (
              <button className="btn-send-code btn-send-code--resend" onClick={handleResend}>
                {isKo ? '재발송' : 'Resend'}
              </button>
            )}
          </div>
        )}

        {/* 유효성 오류: 입력란 바로 아래 */}
        {showErrors && verifyStep !== 'verified' && (
          <p className="field-error">{isKo ? '본인인증을 완료해주세요.' : 'Please complete identity verification.'}</p>
        )}

        {/* 인증번호 입력 */}
        {verifyStep === 'code' && (
          <div className="verify-code-area">
            <div className="verify-hint">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#F76E33" strokeWidth="1.2"/>
                <path d="M7 4v3.5M7 10h.01" stroke="#F76E33" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>{isKo ? '테스트 코드: ' : 'Test code: '}<strong>{TEST_CODE}</strong></span>
            </div>
            <div className="code-input-row">
              <div className="code-input-wrap">
                <input
                  className={`code-input ${codeError ? 'code-input--error' : ''}`}
                  type="tel"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setCodeError(false) }}
                  autoFocus
                />
                <span className="code-timer">{formatTimer(timer)}</span>
              </div>
              <button
                className={`btn-send-code ${code.length !== 6 || timer === 0 ? 'btn-send-code--disabled' : ''}`}
                onClick={handleVerify}
                disabled={code.length !== 6 || timer === 0}
              >
                {isKo ? '확인' : 'Verify'}
              </button>
            </div>
            {codeError && <p className="verify-error">{isKo ? '인증번호가 올바르지 않습니다.' : 'Incorrect code. Please try again.'}</p>}
            {timer === 0 && <p className="verify-expired">{isKo ? '인증번호가 만료되었습니다. 재발송해 주세요.' : 'Code expired. Please resend.'}</p>}
          </div>
        )}

        {/* 인증 완료 */}
        {verifyStep === 'verified' && (
          <div className="verify-success">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill="rgba(34,197,94,0.1)" stroke="#22C55E" strokeWidth="1.5"/>
              <path d="M6 10l3 3 5-6" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{isKo ? '인증이 완료되었습니다' : 'Verification complete'}</span>
            <button className="verify-success__change" onClick={() => { setVerifyStep('input'); setInputValue('') }}>
              {isKo ? '변경' : 'Change'}
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="step-actions">
        <button className="btn-primary" onClick={handleContinue}>
          {t.continueBtn}
        </button>
      </div>

      <p className="login-redirect" style={{ textAlign: 'center', marginTop: '8px' }}>
        {isKo ? '이미 계정이 있으신가요?' : 'Already have an account?'}
        {' '}
        <button className="login-redirect__link">
          {isKo ? '로그인' : 'Sign in'}
        </button>
      </p>

      {/* 약관 모달 */}
      {modal !== null && (
        <TermsModal
          type={modal === 3 ? 'privacy' : 'auction'}
          lang={isKo ? 'ko' : 'en'}
          onClose={() => setModal(null)}
          onAgree={() => {
            setAgreements((p) => p.map((val, idx) => idx === modal ? true : val))
            setModal(null)
          }}
        />
      )}

      {/* 인증번호 발송 토스트 */}
      {showToast && (
        <div className="toast-notification">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
            <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{isKo ? '인증번호가 발송되었습니다.' : 'Verification code sent.'}</span>
        </div>
      )}
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
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 3h3l1.5 3.75-1.875 1.125A10.5 10.5 0 0010.125 12L11.25 10.125 15 11.625V15a1.5 1.5 0 01-1.5 1.5A13.5 13.5 0 011.5 4.5 1.5 1.5 0 013 3z" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="3.75" width="15" height="10.5" rx="1.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M1.5 6.75L9 11.25L16.5 6.75" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
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
