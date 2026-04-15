import { useState } from 'react'
import ArtworkSlider from './ArtworkSlider'
import ProgressIndicator from './ProgressIndicator'
import Step1Agreement from './Step1Agreement'
import Step2BasicInfo from './Step2BasicInfo'
import Step3Personalization from './Step3Personalization'
import Step4Complete from './Step4Complete'
import { useT } from '../i18n'
import './JoinUs.css'

export default function JoinUs() {
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState('ko')
  const t = useT(lang)

  const next = () => setStep((s) => Math.min(s + 1, 4))
  const prev = () => setStep((s) => Math.max(s - 1, 1))
  const goHome = () => setStep(1)
  const toggleLang = () => setLang((l) => (l === 'ko' ? 'en' : 'ko'))

  return (
    <div className="joinus">
      <ArtworkSlider lang={lang} />

      <main className="joinus__main">
        <div className="joinus__form-wrap">

          {/* 헤더: 언어 버튼 */}
          <div className="joinus__header">
            <button className="joinus__lang-btn" onClick={toggleLang}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#0A1128" strokeWidth="1.2"/>
                <path d="M8 1.5C8 1.5 6 4.5 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4.5 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="#0A1128" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>{t.langToggle}</span>
            </button>
          </div>

          {/* 로고 */}
          <div className="joinus__logo">
            <h1 className="joinus__logo-text">ARTÉLITE</h1>
            <p className="joinus__logo-sub">{t.logoSub}</p>
          </div>

          {/* 진행 표시 (Step 4에서는 숨김) */}
          {step < 4 && (
            <ProgressIndicator
              currentStep={step}
              onStepClick={setStep}
              labels={t.stepLabels}
            />
          )}

          {/* 각 스텝 */}
          {step === 1 && <Step1Agreement t={t} onNext={next} />}
          {step === 2 && <Step2BasicInfo t={t} onNext={next} onPrev={prev} />}
          {step === 3 && <Step3Personalization t={t} onComplete={next} onSkip={next} onPrev={prev} />}
          {step === 4 && <Step4Complete t={t} onGoHome={goHome} />}
        </div>
      </main>
    </div>
  )
}
