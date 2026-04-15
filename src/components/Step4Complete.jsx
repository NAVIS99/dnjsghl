import './StepForm.css'

const ICONS = ['🏛️', '👁️', '🎨', '💬']

export default function Step4Complete({ t, onGoHome }) {
  return (
    <div className="complete-screen">
      <div className="complete-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(247,110,51,0.15)"/>
          <path d="M12 20l6 6 10-12" stroke="#F76E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="complete-heading">
        <h2>{t.step4Title}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{t.step4Desc}</p>
      </div>

      <div className="benefits-list">
        {t.benefits.map((benefit, i) => (
          <div key={i} className="benefit-item">
            <div className="benefit-item__icon">
              <span style={{ fontSize: '20px' }}>{ICONS[i]}</span>
            </div>
            <p className="benefit-item__text">{benefit}</p>
          </div>
        ))}
      </div>

      <div className="complete-btns">
        <button className="btn-accent" style={{ width: '100%' }}>{t.startAuction}</button>
        <button className="btn-outline" style={{ width: '100%' }} onClick={onGoHome}>{t.goHome}</button>
      </div>
    </div>
  )
}
