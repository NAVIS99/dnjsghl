import { useState } from 'react'
import './StepForm.css'

const NTS_MOCK = {
  bizName: '쿠팡 주식회사',
  repName: 'ROGERS HAROLD LYNN(로저스해롤드린)',
  repPhone: '1577-7011',
  bizType: '도소매',
  bizStatus: '통신판매업',
}

export default function Step3BusinessInfo({ t, onNext, onPrev, memberTypeIdx = 1, prefillBizRegNum = '' }) {
  const isKo = t.langToggle === 'EN'
  const isDomesticBiz = memberTypeIdx === 1
  const isAutoFilled = isDomesticBiz && !!prefillBizRegNum

  const [form, setForm] = useState({
    bizRegNum: prefillBizRegNum,
    bizName: isAutoFilled ? NTS_MOCK.bizName : '',
    repName: isAutoFilled ? NTS_MOCK.repName : '',
    repPhone: isAutoFilled ? NTS_MOCK.repPhone : '',
    bizType: isAutoFilled ? NTS_MOCK.bizType : '',
    bizStatus: isAutoFilled ? NTS_MOCK.bizStatus : '',
    country: '',
    postalCode: '',
    address: '',
    addressDetail: '',
  })
  const [bizLicenseFile, setBizLicenseFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const bizLicenseInputRef = useState(null)[0]
  const [bizLicenseRef, setBizLicenseRef] = useState(null)

  const handleAddressSelect = ({ postal, road }) => {
    setForm((p) => ({ ...p, postalCode: postal, address: road }))
    setShowAddressModal(false)
  }

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const clear = (key) => () => setForm((p) => ({ ...p, [key]: '' }))

  const requiredKeys = (isDomesticBiz && !prefillBizRegNum)
    ? ['bizRegNum', 'bizName', 'repName', 'repPhone', 'bizType', 'bizStatus', 'postalCode', 'address']
    : ['bizName', 'repName', 'repPhone', 'bizType', 'bizStatus', 'postalCode', 'address']

  const canContinue = requiredKeys.every((k) => form[k].trim()) && bizLicenseFile !== null

  const handleNext = () => {
    if (canContinue) { onNext(); return }
    setSubmitted(true)
  }

  const err = (key, msg) => submitted && !form[key].trim() && <p className="field-error">{msg}</p>

  const dimStyle = { backgroundColor: '#F8F8FA', color: '#6B6B7B' }

  return (
    <div className="step-form">
      <div className="step-form__heading">
        <h2 className="step-form__title">{isKo ? '사업자 정보' : 'Business Information'}</h2>
        <p className="step-form__desc">{isKo ? '사업자 정보를 입력해주세요' : 'Please enter your business information'}</p>
      </div>

      {/* 안내 배너 */}
      <div className="biz-notice-banner">
        {isKo
          ? '회사 정보 도용 방지 등 안전한 서비스 제공을 위하여\n사업자 증빙자료 및 담당자 정보를 확인하고 있습니다.'
          : 'We verify business documentation and contact information\nto prevent fraud and provide secure services.'}
      </div>

      <div className="form-fields">
        {/* 사업자 등록번호 (항상 표시, 인증됨 or 입력 가능) */}
        {isDomesticBiz && (
          <div className="form-field">
            <label className="form-field__label">
              {isKo ? '사업자 등록번호' : 'Business Registration No.'} <span className="text-accent">*</span>
            </label>
            <div className="form-field__input-wrap">
              <BizIcon />
              {isAutoFilled ? (
                <>
                  <input
                    className="form-field__input"
                    value={prefillBizRegNum}
                    disabled
                    style={{ ...dimStyle, paddingRight: '44px' }}
                  />
                  <span className="field-verified-mark">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="8" fill="rgba(34,197,94,0.1)" stroke="#22C55E" strokeWidth="1.3"/>
                      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <input
                    className="form-field__input"
                    placeholder="000-00-00000"
                    value={form.bizRegNum}
                    onChange={set('bizRegNum')}
                    style={submitted && !form.bizRegNum.trim() ? { borderColor: '#E53E3E' } : {}}
                  />
                  {form.bizRegNum && <button className="field-clear-btn" type="button" onClick={clear('bizRegNum')}><ClearIcon /></button>}
                </>
              )}
            </div>
            {!isAutoFilled && err('bizRegNum', isKo ? '사업자 등록번호를 입력해주세요.' : 'Required.')}
            {isAutoFilled && (
              <p className="field-success">{isKo ? '국세청 조회를 통해 자동 입력되었습니다.' : 'Auto-filled via NTS verification.'}</p>
            )}
          </div>
        )}

        {/* 사업자명 */}
        <div className="form-field">
          <label className="form-field__label">{isKo ? '사업자명' : 'Business Name'} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <BuildingIcon />
            <input
              className="form-field__input"
              placeholder={isKo ? '사업자명을 입력해주세요' : 'Enter business name'}
              value={form.bizName}
              disabled={isAutoFilled}
              onChange={isAutoFilled ? undefined : set('bizName')}
              style={isAutoFilled ? dimStyle : (submitted && !form.bizName.trim() ? { borderColor: '#E53E3E' } : {})}
            />
            {!isAutoFilled && form.bizName && <button className="field-clear-btn" type="button" onClick={clear('bizName')}><ClearIcon /></button>}
          </div>
          {!isAutoFilled && err('bizName', isKo ? '사업자명을 입력해주세요.' : 'Required.')}
        </div>

        {/* 대표자 명 */}
        <div className="form-field">
          <label className="form-field__label">{isKo ? '대표자 명' : 'Representative Name'} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <UserIcon />
            <input
              className="form-field__input"
              placeholder={isKo ? '대표자 성명' : 'Representative name'}
              value={form.repName}
              disabled={isAutoFilled}
              onChange={isAutoFilled ? undefined : set('repName')}
              style={isAutoFilled ? dimStyle : (submitted && !form.repName.trim() ? { borderColor: '#E53E3E' } : {})}
            />
            {!isAutoFilled && form.repName && <button className="field-clear-btn" type="button" onClick={clear('repName')}><ClearIcon /></button>}
          </div>
          {!isAutoFilled && err('repName', isKo ? '대표자 명을 입력해주세요.' : 'Required.')}
        </div>

        {/* 대표 전화 */}
        <div className="form-field">
          <label className="form-field__label">{isKo ? '대표 전화' : 'Representative Phone'} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <PhoneIcon />
            <input
              className="form-field__input"
              type="tel"
              placeholder={isKo ? '대표 전화번호를 입력해주세요' : 'Enter representative phone'}
              value={form.repPhone}
              disabled={isAutoFilled}
              onChange={isAutoFilled ? undefined : set('repPhone')}
              style={isAutoFilled ? dimStyle : (submitted && !form.repPhone.trim() ? { borderColor: '#E53E3E' } : {})}
            />
            {!isAutoFilled && form.repPhone && <button className="field-clear-btn" type="button" onClick={clear('repPhone')}><ClearIcon /></button>}
          </div>
          {!isAutoFilled && err('repPhone', isKo ? '대표 전화를 입력해주세요.' : 'Required.')}
        </div>

        {/* 업종 */}
        <div className="form-field">
          <label className="form-field__label">{isKo ? '사업자 등록증 상의 업종' : 'Business Type'} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <TagIcon />
            <input
              className="form-field__input"
              placeholder={isKo ? '업종을 입력해주세요' : 'Enter business type'}
              value={form.bizType}
              disabled={isAutoFilled}
              onChange={isAutoFilled ? undefined : set('bizType')}
              style={isAutoFilled ? dimStyle : (submitted && !form.bizType.trim() ? { borderColor: '#E53E3E' } : {})}
            />
            {!isAutoFilled && form.bizType && <button className="field-clear-btn" type="button" onClick={clear('bizType')}><ClearIcon /></button>}
          </div>
          {!isAutoFilled && err('bizType', isKo ? '업종을 입력해주세요.' : 'Required.')}
        </div>

        {/* 업태 */}
        <div className="form-field">
          <label className="form-field__label">{isKo ? '사업자 등록증 상의 업태' : 'Business Status'} <span className="text-accent">*</span></label>
          <div className="form-field__input-wrap">
            <TagIcon />
            <input
              className="form-field__input"
              placeholder={isKo ? '업태를 입력해주세요' : 'Enter business status'}
              value={form.bizStatus}
              disabled={isAutoFilled}
              onChange={isAutoFilled ? undefined : set('bizStatus')}
              style={isAutoFilled ? dimStyle : (submitted && !form.bizStatus.trim() ? { borderColor: '#E53E3E' } : {})}
            />
            {!isAutoFilled && form.bizStatus && <button className="field-clear-btn" type="button" onClick={clear('bizStatus')}><ClearIcon /></button>}
          </div>
          {!isAutoFilled && err('bizStatus', isKo ? '업태를 입력해주세요.' : 'Required.')}
        </div>

        {/* 사업자 등록증 파일 */}
        <div className="form-field">
          <div className="form-field__label-row">
            <label className="form-field__label">{isKo ? '사업자 등록증' : 'Business License'} <span className="text-accent">*</span></label>
            <div className="biz-info-note">
              <InfoSmallIcon />
              <span className="biz-info-note__label">{isKo ? '세금계산서 발행 필요 시' : 'For Tax Invoice Issuance'}</span>
              <div className="biz-info-note__tooltip">
                {isKo ? '세금계산서 발행 필요 시 사업자 등록증의 주소 정보가 활용됩니다.' : 'Business license address will be used for tax invoice issuance.'}
              </div>
            </div>
          </div>
          <div className="form-field__file-row">
            <div className="form-field__input-wrap" style={{ flex: 1 }}>
              <AttachIcon />
              <input
                className="form-field__input"
                placeholder={isKo ? '파일을 첨부해주세요' : 'Attach a file'}
                value={bizLicenseFile?.name || ''}
                readOnly
                style={{ cursor: 'default', paddingRight: bizLicenseFile ? '40px' : '16px' }}
              />
              {bizLicenseFile && (
                <button className="field-clear-btn" type="button" onClick={() => setBizLicenseFile(null)}>
                  <ClearIcon />
                </button>
              )}
            </div>
            <button className="btn-file-browse" type="button" onClick={() => bizLicenseRef?.click()}>
              {isKo ? '파일찾기' : 'Browse'}
            </button>
          </div>
          {!bizLicenseFile && <p className="field-hint">{isKo ? 'jpg, jpeg, png, heic 또는 pdf 파일 업로드 (검수 후 모든 서비스 이용 가능)' : 'Upload jpg, jpeg, png, heic, or pdf (All services available after review)'}</p>}
          {submitted && !bizLicenseFile && <p className="field-error">{isKo ? '사업자 등록증을 첨부해주세요.' : 'Please attach business license.'}</p>}
          <input ref={setBizLicenseRef} type="file" accept=".jpg,.jpeg,.png,.heic,.pdf" style={{ display: 'none' }} onChange={(e) => setBizLicenseFile(e.target.files[0] || null)} />
        </div>

        {/* 국가 선택 (해외 사업자만) */}
        {!isDomesticBiz && (
          <div className="form-field">
            <label className="form-field__label">{isKo ? '국가' : 'Country'}</label>
            <div className="form-select-wrap">
              <select className="form-select" value={form.country} onChange={set('country')}>
                <option value="">{isKo ? '== 국가를 선택해주세요. ==' : '== Select Country =='}</option>
                <option value="US">{isKo ? '미국' : 'United States'}</option>
                <option value="JP">{isKo ? '일본' : 'Japan'}</option>
                <option value="CN">{isKo ? '중국' : 'China'}</option>
                <option value="GB">{isKo ? '영국' : 'United Kingdom'}</option>
                <option value="FR">{isKo ? '프랑스' : 'France'}</option>
                <option value="DE">{isKo ? '독일' : 'Germany'}</option>
                <option value="OTHER">{isKo ? '기타' : 'Other'}</option>
              </select>
            </div>
          </div>
        )}

        {/* 사업장 주소 */}
        <div className="form-field">
          <div className="form-field__label-row">
            <label className="form-field__label">{isKo ? '사업장 주소' : 'Business Address'} <span className="text-accent">*</span></label>
            <div className="biz-info-note">
              <InfoSmallIcon />
              <span className="biz-info-note__label">{isKo ? '유의사항' : 'Notice'}</span>
              <div className="biz-info-note__tooltip biz-info-note__tooltip--right">
                {isKo ? '허위 정보 제공 시 서비스 이용이 제한될 수 있습니다.' : 'Providing false information may result in service restrictions.'}
              </div>
            </div>
          </div>
          <div className="address-field-group">
            <div className="address-row">
              <input
                className="address-input address-input--postal"
                placeholder={isKo ? '우편번호' : 'Postal code'}
                value={form.postalCode}
                readOnly
                style={submitted && !form.postalCode.trim() ? { borderColor: '#E53E3E' } : {}}
              />
              <button type="button" className="btn-address-search" onClick={() => setShowAddressModal(true)}>
                {isKo ? '주소 검색' : 'Search Address'}
              </button>
            </div>
            <input
              className="address-input"
              placeholder={isKo ? '사업장 주소' : 'Business address'}
              value={form.address}
              readOnly
              style={submitted && !form.address.trim() ? { borderColor: '#E53E3E' } : {}}
            />
            <input
              className="address-input"
              placeholder={isKo ? '사업장 상세주소' : 'Business address detail'}
              value={form.addressDetail}
              onChange={set('addressDetail')}
            />
          </div>
          {submitted && (!form.postalCode.trim() || !form.address.trim()) && (
            <p className="field-error">{isKo ? '사업장 주소를 입력해주세요.' : 'Please enter business address.'}</p>
          )}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-accent" onClick={handleNext}>
          {t.completeBtn}
        </button>
      </div>

      {showAddressModal && (
        <BizAddressModal
          onSelect={handleAddressSelect}
          onClose={() => setShowAddressModal(false)}
          isKo={isKo}
        />
      )}
    </div>
  )
}

function BizAddressModal({ onSelect, onClose, isKo }) {
  const [query, setQuery] = useState('')

  const mockAddresses = [
    { postal: '06236', road: isKo ? '서울특별시 강남구 테헤란로 152' : '152 Teheran-ro, Gangnam-gu, Seoul' },
    { postal: '04524', road: isKo ? '서울특별시 중구 세종대로 110' : '110 Sejong-daero, Jung-gu, Seoul' },
    { postal: '03187', road: isKo ? '서울특별시 종로구 사직로 161' : '161 Sajik-ro, Jongno-gu, Seoul' },
    { postal: '16488', road: isKo ? '경기도 수원시 영통구 삼성로 129' : '129 Samsung-ro, Yeongtong-gu, Suwon' },
    { postal: '48058', road: isKo ? '부산광역시 해운대구 센텀남대로 59' : '59 Centum Nam-daero, Haeundae-gu, Busan' },
  ]

  const filtered = query.trim()
    ? mockAddresses.filter((a) => a.road.toLowerCase().includes(query.toLowerCase()) || a.postal.includes(query))
    : mockAddresses

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal__header">
          <h3 className="address-modal__title">{isKo ? '주소 검색' : 'Address Search'}</h3>
          <button className="address-modal__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="#6B6B7B" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="address-modal__search">
          <input
            className="address-modal__input"
            placeholder={isKo ? '도로명, 지번, 건물명으로 검색' : 'Search by road, lot number, or building'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="address-modal__results">
          {filtered.length > 0 ? filtered.map((a, i) => (
            <button key={i} className="address-modal__item" onClick={() => onSelect(a)}>
              <span className="address-modal__postal">{a.postal}</span>
              <span className="address-modal__road">{a.road}</span>
            </button>
          )) : (
            <p className="address-modal__empty">{isKo ? '검색 결과가 없습니다.' : 'No results found.'}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6" stroke="#9B9BAD" strokeWidth="1.2"/>
      <path d="M7 6.5v3.5M7 4.5h.01" stroke="#9B9BAD" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function BizIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="5.5" width="15" height="11" rx="1.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M7 5.5V4.5a2.5 2.5 0 015 0v1" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M2.5 10h15" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="1.5" stroke="#6B6B7B" strokeWidth="1.5"/>
      <path d="M7 8h2M11 8h2M7 12h2M11 12h2" stroke="#6B6B7B" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M8 17v-4h4v4" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 3.5h3.5l1.75 4.375-2.188 1.313A12.25 12.25 0 0011.813 14l1.312-2.188L17.5 13.5V17a1.75 1.75 0 01-1.75 1.75A15.75 15.75 0 011.75 5.25 1.75 1.75 0 013.5 3.5z" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10.5 3H4a1 1 0 00-1 1v6.5a1 1 0 00.293.707l6.5 6.5a1 1 0 001.414 0l6.5-6.5a1 1 0 000-1.414l-6.5-6.5A1 1 0 0010.5 3z" stroke="#6B6B7B" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="7" cy="7" r="1" fill="#6B6B7B"/>
    </svg>
  )
}

function AttachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 11l-7.5 7.5a5 5 0 01-7.07-7.07l7.5-7.5a3 3 0 014.24 4.24l-7.51 7.5a1 1 0 01-1.41-1.41l7-7" stroke="#6B6B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
