import { useState, useEffect } from 'react'
import { useT } from '../i18n'
import './ArtworkSlider.css'

const IMAGES = [
  'https://www.figma.com/api/mcp/asset/8556bf3d-fc9e-4ff7-94b2-b8a15f595b64',
  'https://www.figma.com/api/mcp/asset/f1129209-18ef-4d5c-b248-48bcdc71e397',
  'https://www.figma.com/api/mcp/asset/d8e850b7-2332-475c-8945-dabedce273e2',
]

const AUTO_INTERVAL = 5000

export default function ArtworkSlider({ lang }) {
  const t = useT(lang)
  const slides = t.slides
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)

  const goTo = (idx) => {
    if (idx === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(idx)
      setFading(false)
    }, 350)
  }

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length)
        setFading(false)
      }, 350)
    }, AUTO_INTERVAL)
    return () => clearInterval(id)
  }, [paused, slides.length])

  const slide = slides[current]

  return (
    <div
      className="artwork-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 배경 이미지들 (크로스페이드) */}
      {IMAGES.map((img, i) => (
        <div
          key={i}
          className={`artwork-slider__bg ${i === current ? 'artwork-slider__bg--active' : ''}`}
        >
          <img src={img} alt="" />
          <div className="artwork-slider__overlay" />
        </div>
      ))}

      {/* 상단 신뢰 뱃지 */}
      <div className="artwork-slider__trust">
        <div className="trust-pill">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1L2 3v3.5c0 2.878 1.983 5.556 4.5 6.18C9.017 12.056 11 9.378 11 6.5V3L6.5 1z" stroke="#C9A86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 6.5l1.5 1.5 2.5-3" stroke="#C9A86A" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          SSL 보안
        </div>
        <div className="trust-pill">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="4.5" r="2" stroke="#C9A86A" strokeWidth="1.1"/>
            <path d="M2 11c0-2.21 2.015-4 4.5-4s4.5 1.79 4.5 4" stroke="#C9A86A" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          10,000+ 컬렉터
        </div>
        <div className="trust-pill">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1.5" y="3" width="10" height="7" rx="1.2" stroke="#C9A86A" strokeWidth="1.1"/>
            <path d="M1.5 5.5h10" stroke="#C9A86A" strokeWidth="1.1"/>
            <path d="M4 8h2" stroke="#C9A86A" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          안전 결제
        </div>
        <div className="trust-pill">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5l1.3 2.6 2.9.4-2.1 2 .5 2.9L6.5 8l-2.6 1.4.5-2.9-2.1-2 2.9-.4L6.5 1.5z" stroke="#C9A86A" strokeWidth="1.1" strokeLinejoin="round"/>
          </svg>
          20년 전문 감정
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <button className="artwork-slider__nav artwork-slider__nav--prev" onClick={prev} aria-label="이전">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="artwork-slider__nav artwork-slider__nav--next" onClick={next} aria-label="다음">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 슬라이드 텍스트 정보 */}
      <div className="artwork-slider__info">
        <div className={`artwork-slider__text ${fading ? 'artwork-slider__text--fading' : ''}`}>
          <p className="artwork-slider__badge">{slide.badge}</p>
          <p className="artwork-slider__title">{slide.title}</p>
          <p className="artwork-slider__subtitle">{slide.subtitle}</p>
          <p className="artwork-slider__price">{slide.price}</p>
        </div>

        {/* 진행 바 */}
        <div className="artwork-slider__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`artwork-slider__dot ${i === current ? 'artwork-slider__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
