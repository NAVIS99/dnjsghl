import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import './StepForm.css'

const AUCTIONS = [
  {
    badge: 'Live',
    title: '5월 메이저 경매',
    dday: 9,
    type: 'Major',
    color: '#F76E33',
  },
  {
    badge: 'Online',
    title: '프리미엄 온라인경매',
    dday: 14,
    type: 'Premium',
    color: '#C9A86A',
  },
  {
    badge: 'Online',
    title: '위클리 온라인경매',
    dday: 3,
    type: 'Weekly',
    color: '#4ECDC4',
  },
]

export default function Step4Complete({ t, onGoHome }) {
  const isKo = t.langToggle === 'EN'

  useEffect(() => {
    const fire = (opts) => confetti({ particleCount: 60, spread: 70, origin: { y: 0.55 }, ...opts })
    fire({ angle: 60, origin: { x: 0.1, y: 0.6 }, colors: ['#F76E33', '#C9A86A', '#0A1128'] })
    fire({ angle: 120, origin: { x: 0.9, y: 0.6 }, colors: ['#F76E33', '#C9A86A', '#FFFFFF'] })
    setTimeout(() => fire({ angle: 90, origin: { x: 0.5, y: 0.65 }, particleCount: 80 }), 250)
  }, [])

  return (
    <div className="complete-screen">
      {/* 완료 아이콘 */}
      <div className="complete-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="rgba(247,110,51,0.15)"/>
          <path d="M12 20l6 6 10-12" stroke="#F76E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* 완료 헤딩 */}
      <div className="complete-heading">
        <h2>{t.step4Title}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{t.step4Desc}</p>
      </div>

      {/* 진행중 경매 섹션 */}
      <div className="auction-section">
        <div className="auction-section__header">
          <p className="auction-section__title">{isKo ? '진행중 경매' : 'Live Auctions'}</p>
          <span className="auction-section__badge">{AUCTIONS.length}</span>
        </div>
        <div className="auction-list">
          {AUCTIONS.map((a, i) => (
            <button key={i} className="auction-item" onClick={onGoHome}>
              <div className="auction-item__left">
                <div className="auction-item__top">
                  <span className={`auction-item__badge ${a.badge === 'Live' ? 'auction-item__badge--live' : ''}`}>
                    {a.badge}
                  </span>
                  <span className="auction-item__title">{a.title}</span>
                </div>
                <p className="auction-item__dday">
                  {isKo ? '경매마감' : 'Closes'}{' '}
                  <strong style={{ color: a.dday <= 5 ? '#E53E3E' : '#F76E33' }}>D-{a.dday}</strong>
                </p>
                <p className="auction-item__type">{a.type}</p>
              </div>
              <div className="auction-item__preview" style={{ background: a.color }}>
                <span>{isKo ? '프리뷰' : 'Preview'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 홈으로 이동 버튼 */}
      <button className="btn-accent" style={{ width: '100%' }} onClick={onGoHome}>
        {t.startAuction}
      </button>
    </div>
  )
}
