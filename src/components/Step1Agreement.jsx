import { useState, useEffect, useRef } from 'react'
import TermsModal from './TermsModal'
import './StepForm.css'

// 테스트용 인증번호
const TEST_CODE = '123456'
const TIMER_SEC = 180

export default function Step1Agreement({ t, onNext }) {
  const [agreements, setAgreements] = useState({ auction: false, privacy: false })
  const [memberType, setMemberType] = useState('')
  const [authMethod, setAuthMethod] = useState('phone')

  // 인증 플로우
  const [inputValue, setInputValue] = useState('')       // 전화번호 또는 이메일
  const [verifyStep, setVerifyStep] = useState('input')  // 'input' | 'code' | 'verified'
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [timer, setTimer] = useState(TIMER_SEC)
  const timerRef = useRef(null)

  // 약관 모달
  const [modal, setModal] = useState(null) // null | 'auction' | 'privacy'

  // 밸리데이션
  const [showErrors, setShowErrors] = useState(false)

  const allChecked = agreements.auction && agreements.privacy
  const toggleAll = () => { const v = !allChecked; setAgreements({ auction: v, privacy: v }) }
  const toggle = (key) => setAgreements((p) => ({ ...p, [key]: !p[key] }))

  const canContinue = allChecked && memberType && verifyStep === 'verified'

  const handleContinue = () => {
    if (!canContinue) { setShowErrors(true); return }
    onNext()
  }
  const memberTypes = [t.domestic, t.domesticBiz, t.overseas, t.overseasBiz]

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

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSendCode = () => {
    if (!inputValue.trim()) return
    setCode('')
    setCodeError(false)
    setVerifyStep('code')
  }

  const handleVerify = () => {
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
  }

  // 인증 방식 변경 시 리셋
  const handleAuthMethodChange = (method) => {
    setAuthMethod(method)
    setInputValue('')
    setCode('')
    setVerifyStep('input')
    setCodeError(false)
    clearInterval(timerRef.current)
  }

  const isPhone = authMethod === 'phone'
  const inputPlaceholder = isPhone ? t.phonePlaceholder : 'your.email@example.com'
  const inputType = isPhone ? 'tel' : 'email'

  return (
    <div className="step-form">
      <div className="step-form__heading">
        <h2 className="step-form__title">{t.step1Title}</h2>
        <p className="step-form__desc">{t.step1Desc}</p>
      </div>

      {/* 약관 동의 박스 */}
      <div className="agreement-box" style={showErrors && !allChecked ? { borderColor: '#E53E3E' } : {}}>
        <label className="agreement-box__all">
          <CheckBox checked={allChecked} onChange={toggleAll} />
          <span className="agreement-box__all-label">{t.agreeAll}</span>
        </label>
        <div className="agreement-box__items">
          <div className="agreement-item">
            <label className="agreement-item__label">
              <CheckBox checked={agreements.auction} onChange={() => toggle('auction')} />
              <div className="agreement-item__text">
                <p>{t.auctionTerms} <span className="text-accent">{t.required}</span></p>
                <p className="agreement-item__sub">{t.auctionTermsSub}</p>
              </div>
            </label>
            <button className="btn-detail" onClick={() => setModal('auction')}>{t.viewDetail} <ArrowIcon /></button>
          </div>
          <div className="agreement-item">
            <label className="agreement-item__label">
              <CheckBox checked={agreements.privacy} onChange={() => toggle('privacy')} />
              <div className="agreement-item__text">
                <p>{t.privacyTerms} <span className="text-accent">{t.required}</span></p>
                <p className="agreement-item__sub">{t.privacyTermsSub}</p>
              </div>
            </label>
            <button className="btn-detail" onClick={() => setModal('privacy')}>{t.viewDetail} <ArrowIcon /></button>
          </div>
        </div>
      </div>
      {showErrors && !allChecked && <p className="field-error">필수 약관에 모두 동의해주세요.</p>}

      {/* 회원 유형 */}
      <div className="field-group">
        <p className="field-group__label">{t.memberType} <span className="text-accent">*</span></p>
        <div className="member-type-grid">
          {memberTypes.map((type) => (
            <button
              key={type}
              className={`member-type-btn ${memberType === type ? 'member-type-btn--active' : ''}`}
              onClick={() => setMemberType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {showErrors && !memberType && <p className="field-error">회원 유형을 선택해주세요.</p>}
      </div>

      {/* 본인 인증 */}
      <div className="field-group">
        <p className="field-group__label">
          {t.verification} <span className="text-accent">*</span>
          <span className="field-group__hint"> {t.verificationHint}</span>
        </p>

        {/* 인증 방식 토글 */}
        <div className="auth-toggle">
          <button
            className={`auth-toggle__btn ${authMethod === 'phone' ? 'auth-toggle__btn--active' : ''}`}
            onClick={() => handleAuthMethodChange('phone')}
          >
            <PhoneIcon /> {t.phoneVerify}
          </button>
          <button
            className={`auth-toggle__btn ${authMethod === 'email' ? 'auth-toggle__btn--active' : ''}`}
            onClick={() => handleAuthMethodChange('email')}
          >
            <EmailIcon /> {t.emailVerify}
          </button>
        </div>

        {/* Step 1: 번호/이메일 입력 */}
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
                {t.lang === 'en' ? 'Resend' : '재발송'}
              </button>
            )}
          </div>
        )}

        {/* Step 2: 인증번호 입력 */}
        {verifyStep === 'code' && (
          <div className="verify-code-area">
            <div className="verify-hint">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#F76E33" strokeWidth="1.2"/>
                <path d="M7 4v3.5M7 10h.01" stroke="#F76E33" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>{t.lang === 'en' ? 'Test code: ' : '테스트 코드: '}<strong>{TEST_CODE}</strong></span>
            </div>
            <div className="code-input-row">
              <div className="code-input-wrap">
                <input
                  className={`code-input ${codeError ? 'code-input--error' : ''}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setCodeError(false) }}
                  autoFocus
                />
                <span className="code-timer">{formatTimer(timer)}</span>
              </div>
              <button
                className={`btn-send-code ${code.length !== 6 ? 'btn-send-code--disabled' : ''}`}
                onClick={handleVerify}
                disabled={code.length !== 6}
              >
                {t.lang === 'en' ? 'Verify' : '확인'}
              </button>
            </div>
            {codeError && (
              <p className="verify-error">
                {t.lang === 'en' ? 'Incorrect code. Please try again.' : '인증번호가 올바르지 않습니다.'}
              </p>
            )}
            {timer === 0 && (
              <p className="verify-expired">
                {t.lang === 'en' ? 'Code expired. Please resend.' : '인증번호가 만료되었습니다. 재발송해 주세요.'}
              </p>
            )}
          </div>
        )}

        {/* Step 3: 인증 완료 */}
        {verifyStep === 'verified' && (
          <div className="verify-success">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill="rgba(34,197,94,0.1)" stroke="#22C55E" strokeWidth="1.5"/>
              <path d="M6 10l3 3 5-6" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{t.lang === 'en' ? 'Verification complete' : '인증이 완료되었습니다'}</span>
            <button className="verify-success__change" onClick={() => { setVerifyStep('input'); setInputValue('') }}>
              {t.lang === 'en' ? 'Change' : '변경'}
            </button>
          </div>
        )}
        {showErrors && verifyStep !== 'verified' && <p className="field-error">본인인증을 완료해주세요.</p>}
      </div>

      {/* 신뢰 배지 */}
      <div className="trust-badge">
        <ShieldIcon />
        <span>{t.trustBadge}</span>
      </div>

      {/* CTA — step-actions 래퍼로 모바일 하단 고정 */}
      <div className="step-actions">
        <button className="btn-primary" onClick={handleContinue}>
          {t.continueBtn}
        </button>
      </div>

      {/* 로그인 리다이렉트 — 고정 영역 밖에 위치 */}
      <p className="login-redirect" style={{ textAlign: 'center', marginTop: '8px' }}>
        {t.langToggle === 'EN' ? '이미 계정이 있으신가요?' : 'Already have an account?'}
        {' '}
        <button className="login-redirect__link">
          {t.langToggle === 'EN' ? '로그인' : 'Sign in'}
        </button>
      </p>

      {/* 약관 모달 */}
      {modal && (
        <TermsModal
          type={modal}
          lang={t.langToggle === 'EN' ? 'ko' : 'en'}
          onClose={() => setModal(null)}
          onAgree={() => {
            setAgreements((p) => ({ ...p, [modal]: true }))
            setModal(null)
          }}
        />
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
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5v5c0 4.418 3.052 8.547 7 9.5C13.948 18.547 17 14.418 17 10V5L10 2z" stroke="#F76E33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10l2 2 4-4" stroke="#F76E33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
