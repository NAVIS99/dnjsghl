import { useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
import ArtworkSlider from './ArtworkSlider'
import ProgressIndicator from './ProgressIndicator'
import Step1Agreement from './Step1Agreement'
import Step2BasicInfo from './Step2BasicInfo'
import Step3BusinessInfo from './Step3BusinessInfo'
import Step4Complete from './Step4Complete'
import { useT } from '../i18n'
import './SignUp.css'

const STEP_NAMES = {
  1: 'step1_terms_completed',
  2: 'step2_account_completed',
  3: 'step3_business_info_completed',
}

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState('ko')
  const [memberTypeIdx, setMemberTypeIdx] = useState(0)
  const [verifiedInput, setVerifiedInput] = useState('')
  const [verifiedMethod, setVerifiedMethod] = useState('phone')
  const [bizRegNum, setBizRegNum] = useState('')
  const t = useT(lang)

  const isKo = t.langToggle === 'EN'
  const isBiz = memberTypeIdx === 1 || memberTypeIdx === 3
  const totalSteps = isBiz ? 3 : 2
  const isComplete = step > totalSteps

  const stepLabels = isBiz
    ? [...t.stepLabels, isKo ? '사업자 정보' : 'Business Info']
    : t.stepLabels

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const handleMemberTypeChange = (idx) => {
    setMemberTypeIdx(idx)
  }

  const handleStep1Next = ({ memberTypeIdx: idx, verifiedInput: input, verifiedMethod: method, bizRegNum: regNum = '' }) => {
    setMemberTypeIdx(idx)
    setVerifiedInput(input)
    setVerifiedMethod(method)
    setBizRegNum(regNum)
    if (STEP_NAMES[step]) track(STEP_NAMES[step])
    setStep(2)
  }

  const next = () => {
    if (STEP_NAMES[step]) track(STEP_NAMES[step])
    setStep((s) => s + 1)
  }
  const prev = () => setStep((s) => Math.max(s - 1, 1))
  const goHome = () => setStep(1)
  const toggleLang = () => setLang((l) => (l === 'ko' ? 'en' : 'ko'))

  const handleStepClick = (stepNum) => {
    if (stepNum === step) {
      setStep(totalSteps + 1)  // 현재 단계 재클릭 → 가입완료
    } else {
      setStep(stepNum)
    }
  }

  return (
    <div className="signup">
      <ArtworkSlider lang={lang} />

      <main className="signup__main">
        <div className="signup__form-wrap">

          {/* 헤더: 언어 버튼 */}
          <div className="signup__header">
            <button className="signup__lang-btn" onClick={toggleLang}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#0A1128" strokeWidth="1.2"/>
                <path d="M8 1.5C8 1.5 6 4.5 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4.5 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="#0A1128" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>{t.langToggle}</span>
            </button>
          </div>

          {/* 로고: 완료 화면에서는 숨김 */}
          {!isComplete && (
            <div className="signup__logo">
              <h1 className="signup__logo-text">ARTÉLITE</h1>
              <p className="signup__logo-sub">{t.logoSub}</p>
            </div>
          )}

          {/* 진행 표시 (완료 화면에서는 숨김) */}
          {!isComplete && (
            <ProgressIndicator
              currentStep={step}
              onStepClick={handleStepClick}
              labels={stepLabels}
              wide={stepLabels.length > 2}
            />
          )}

          {/* 각 스텝 */}
          {step === 1 && <Step1Agreement t={t} onNext={handleStep1Next} onMemberTypeChange={handleMemberTypeChange} />}
          {step === 2 && (
            <Step2BasicInfo
              t={t}
              onNext={next}
              onPrev={prev}
              memberTypeIdx={memberTypeIdx}
              verifiedInput={verifiedInput}
              verifiedMethod={verifiedMethod}
            />
          )}
          {step === 3 && isBiz && (
            <Step3BusinessInfo
              t={t}
              onNext={next}
              onPrev={prev}
              memberTypeIdx={memberTypeIdx}
              prefillBizRegNum={bizRegNum}
            />
          )}
          {isComplete && <Step4Complete t={t} onGoHome={goHome} />}
        </div>
      </main>
    </div>
  )
}
