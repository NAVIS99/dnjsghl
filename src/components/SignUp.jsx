import { useState, useEffect } from 'react'
import { track } from '@vercel/analytics'
import ArtworkSlider from './ArtworkSlider'
import ProgressIndicator from './ProgressIndicator'
import Step1Agreement from './Step1Agreement'
import Step2BasicInfo from './Step2BasicInfo'
import Step4Complete from './Step4Complete'
import { useT } from '../i18n'
import './SignUp.css'

const STEP_NAMES = {
  1: 'step1_terms_completed',
  2: 'step2_account_completed',
}

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState('ko')
  const t = useT(lang)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const next = () => {
    if (STEP_NAMES[step]) track(STEP_NAMES[step])
    setStep((s) => Math.min(s + 1, 3))
  }
  const prev = () => setStep((s) => Math.max(s - 1, 1))
  const goHome = () => setStep(1)
  const toggleLang = () => setLang((l) => (l === 'ko' ? 'en' : 'ko'))

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
          {step < 3 && (
            <div className="signup__logo">
              <h1 className="signup__logo-text">ARTÉLITE</h1>
              <p className="signup__logo-sub">{t.logoSub}</p>
            </div>
          )}

          {/* 진행 표시 (완료 화면에서는 숨김) */}
          {step < 3 && (
            <ProgressIndicator
              currentStep={step}
              onStepClick={setStep}
              labels={t.stepLabels}
            />
          )}

          {/* 각 스텝 */}
          {step === 1 && <Step1Agreement t={t} onNext={next} />}
          {step === 2 && <Step2BasicInfo t={t} onNext={next} onPrev={prev} />}
          {step === 3 && <Step4Complete t={t} onGoHome={goHome} />}
        </div>
      </main>
    </div>
  )
}
