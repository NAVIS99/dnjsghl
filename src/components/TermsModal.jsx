import { useEffect } from 'react'
import './TermsModal.css'

const TERMS_CONTENT = {
  auction: {
    ko: {
      title: '온라인/오프라인 경매 약관',
      sections: [
        {
          heading: '제1조 (목적)',
          body: '본 약관은 ARTÉLITE(이하 "회사")가 제공하는 온라인 및 오프라인 경매 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
        },
        {
          heading: '제2조 (정의)',
          body: '"경매"란 회사가 주관하는 온라인 또는 오프라인 방식의 미술품 매매 행위를 말합니다. "낙찰자"란 경매에서 최고가를 제시하여 해당 작품의 구매 권리를 획득한 자를 말합니다. "응찰"이란 경매 참여자가 특정 작품에 대한 구매 의사를 금액으로 표시하는 행위를 말합니다.',
        },
        {
          heading: '제3조 (경매 참여 자격)',
          body: '경매에 참여하려면 만 19세 이상이어야 하며, 회사의 회원가입 절차를 완료하고 본 약관에 동의하여야 합니다. 해외 거주자의 경우 해당 국가의 법령에 따른 추가 요건을 충족하여야 할 수 있습니다.',
        },
        {
          heading: '제4조 (낙찰 및 결제)',
          body: '낙찰 후 5영업일 이내에 낙찰가의 110%(낙찰가 + 낙찰 수수료 10%)를 결제하여야 합니다. 결제가 지연되는 경우 회사는 낙찰을 취소하고 보증금을 몰수할 수 있습니다. 결제는 신용카드, 무통장입금, 계좌이체 등을 통해 이루어집니다.',
        },
        {
          heading: '제5조 (작품 인도)',
          body: '낙찰 작품은 결제 완료 후 7영업일 이내에 인도됩니다. 작품의 배송비 및 보험료는 낙찰자가 부담합니다. 해외 배송의 경우 관세 및 세금은 낙찰자의 책임입니다.',
        },
        {
          heading: '제6조 (면책 조항)',
          body: '회사는 경매 작품의 진품 여부에 대하여 합리적인 주의를 기울이나, 이에 대한 완전한 보증을 제공하지 않습니다. 작품의 상태, 출처, 저작권에 관한 최종 책임은 판매자에게 있습니다.',
        },
      ],
    },
    en: {
      title: 'Online/Offline Auction Terms',
      sections: [
        {
          heading: 'Article 1 (Purpose)',
          body: 'These terms govern the use of auction services provided by ARTÉLITE, including conditions, procedures, and the rights and obligations of both the company and users.',
        },
        {
          heading: 'Article 2 (Definitions)',
          body: '"Auction" refers to the buying and selling of artworks organized by the company in online or offline format. "Successful Bidder" refers to the person who submits the highest bid and acquires the right to purchase the artwork. "Bidding" refers to the act of expressing a purchase intention with a monetary amount.',
        },
        {
          heading: 'Article 3 (Eligibility)',
          body: 'To participate in auctions, you must be at least 19 years old, have completed the company\'s membership registration, and agreed to these terms. International residents may need to fulfill additional requirements under their country\'s laws.',
        },
        {
          heading: 'Article 4 (Settlement & Payment)',
          body: 'Payment of 110% of the hammer price (hammer price + 10% buyer\'s premium) must be completed within 5 business days of winning. Failure to pay may result in cancellation of the winning bid and forfeiture of the deposit.',
        },
        {
          heading: 'Article 5 (Delivery)',
          body: 'Winning artworks will be delivered within 7 business days after payment is complete. Shipping and insurance costs are borne by the winning bidder. For international shipping, customs and taxes are the winning bidder\'s responsibility.',
        },
      ],
    },
  },
  privacy: {
    ko: {
      title: '개인정보 처리방침',
      sections: [
        {
          heading: '제1조 (수집하는 개인정보)',
          body: '회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다: 이름, 생년월일, 이메일 주소, 휴대폰 번호, 주소, 결제 정보. 서비스 이용 과정에서 IP 주소, 쿠키, 서비스 이용 기록, 기기 정보가 자동으로 생성·수집될 수 있습니다.',
        },
        {
          heading: '제2조 (개인정보의 이용 목적)',
          body: '수집된 개인정보는 회원 관리, 경매 서비스 제공, 낙찰 및 결제 처리, 고객 상담, 분쟁 처리, 마케팅 및 광고(동의한 경우)에 한하여 이용됩니다.',
        },
        {
          heading: '제3조 (개인정보의 보유 및 이용기간)',
          body: '회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일부 정보는 법정 기간 동안 보관됩니다. 전자상거래 관련 기록은 5년, 소비자 불만 기록은 3년간 보존됩니다.',
        },
        {
          heading: '제4조 (개인정보의 제3자 제공)',
          body: '회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 이용자의 동의가 있거나 법령의 규정에 의한 경우에는 예외로 합니다.',
        },
        {
          heading: '제5조 (이용자의 권리)',
          body: '이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다. 또한 개인정보 처리에 대한 동의를 철회할 수 있으며, 이 경우 일부 서비스 이용이 제한될 수 있습니다.',
        },
        {
          heading: '제6조 (개인정보 보호책임자)',
          body: '개인정보 처리에 관한 업무를 총괄하는 개인정보 보호책임자: 성명 김아트, 직책 개인정보보호팀장, 이메일 privacy@artelite.kr, 전화 02-1234-5678.',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          heading: 'Article 1 (Information Collected)',
          body: 'We collect: name, date of birth, email address, mobile number, address, and payment information. IP addresses, cookies, service usage records, and device information may be automatically generated and collected.',
        },
        {
          heading: 'Article 2 (Purpose of Use)',
          body: 'Collected personal information is used solely for member management, auction services, payment processing, customer support, dispute resolution, and marketing (if consented).',
        },
        {
          heading: 'Article 3 (Retention Period)',
          body: 'Information is retained until membership withdrawal. Some information is retained for legally mandated periods: e-commerce records for 5 years, consumer complaint records for 3 years.',
        },
        {
          heading: 'Article 4 (Third-Party Disclosure)',
          body: 'We do not provide personal information to third parties without user consent, except as required by law.',
        },
        {
          heading: "Article 5 (User Rights)",
          body: 'Users may request access, correction, or deletion of their personal information at any time. Users may also withdraw consent for data processing, which may limit access to certain services.',
        },
      ],
    },
  },
}

export default function TermsModal({ type, lang, onClose, onAgree }) {
  const content = TERMS_CONTENT[type]?.[lang] || TERMS_CONTENT[type]?.ko
  const agreeLabel = lang === 'en' ? 'Agree & Continue' : '동의하고 계속하기'
  const closeLabel = lang === 'en' ? 'Close' : '닫기'

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="terms-overlay" onClick={onClose}>
      <div className="terms-sheet" onClick={(e) => e.stopPropagation()}>
        {/* 모바일 핸들 */}
        <div className="terms-sheet__handle" />

        {/* 헤더 */}
        <div className="terms-sheet__header">
          <h3 className="terms-sheet__title">{content.title}</h3>
          <button className="terms-sheet__close" onClick={onClose} aria-label={closeLabel}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="#0A1128" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="terms-sheet__body">
          {content.sections.map((s, i) => (
            <div key={i} className="terms-section">
              <h4 className="terms-section__heading">{s.heading}</h4>
              <p className="terms-section__body">{s.body}</p>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div className="terms-sheet__footer">
          <button className="terms-sheet__agree" onClick={onAgree}>
            {agreeLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
