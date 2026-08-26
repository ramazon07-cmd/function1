import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import {
  Brain, Calculator, ChevronLeft, ChevronRight, Clock, Copy,
  HelpCircle, LayoutGrid, Star, TrendingUp, Triangle, Upload, X,
} from 'lucide-react'
import '../styles/testlar.css'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import jovo from '../images/jovo.jpg'
import mathImage from '../images/math1.jpg'
import geometryImage from '../images/images (1).jpg'
import logicImage from '../images/images (2).jpg'
import economyImage from '../images/phoh.jpg'
import qosh1 from '../images/qshimcha1.png'
import qosh2 from '../images/qoshimcha2.png'
import qosh3 from '../images/qoshimcha3.png'
import qosh4 from '../images/qoshimcha4.png'
import qosh5 from '../images/qoshimcha5.png'
import qosh6 from '../images/qoshimcha6.png'
import qosh7 from '../images/qoshimcha7.png'
import qosh8 from '../images/qoshimcha8.png'
import qosh9 from '../images/qoshimcha9.png'
import qosh10 from '../images/qoshimcha10.png'
import qosh11 from '../images/qoshimcha11.png'
import qosh12 from '../images/qoshimcha12.png'
import qosh13 from '../images/qoshimcha13.png'
import qosh14 from '../images/qoshimcha14.png'
import qosh15 from '../images/qoshimcha15.png'
import abu1 from '../images/abu1.png'
import abu2 from '../images/abu2.png'
import abu3 from '../images/abu3.png'
import abu4 from '../images/abu4.png'
import abu5 from '../images/abu5.png'
import abu6 from '../images/abu6.png'
import abu7 from '../images/abu7.png'
import abu8 from '../images/abu8.png'
import abu9 from '../images/abu9.png'
import abu10 from '../images/abu10.png'
import abu11 from '../images/abu11.png'
import abu12 from '../images/abu12.png'
import abu13 from '../images/abu13.png'
import abu14 from '../images/abu14.png'
import abu15 from '../images/abu15.png'
import abu16 from '../images/abu16.png'

const SUBJECT_META = {
  math: { icon: <Calculator size={24} />, image: mathImage },
  geo: { icon: <Triangle size={24} />, image: geometryImage },
  logic: { icon: <Brain size={24} />, image: logicImage },
  iq: { icon: <TrendingUp size={28} />, image: economyImage, special: true },
}

const FORMULA_BOOKS = [
  {
    title: 'Matematika formulalar kitobi',
    category: 'math',
    images: [qosh1, qosh2, qosh3, qosh4, qosh5, qosh6, qosh7, qosh8, qosh9, qosh10, qosh11, qosh12, qosh13, qosh14, qosh15],
  },
  {
    title: 'Geometriya formulalar kitobi',
    category: 'geo',
    images: [abu1, abu2, abu3, abu4, abu5, abu6, abu7, abu8, abu9, abu10, abu11, abu12, abu13, abu14, abu15, abu16],
  },
]

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || []
}

function formatCardNumber(value = '') {
  return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
}

export default function TestHeader() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const wrapperRef = useRef(null)
  const [subjects, setSubjects] = useState([])
  const [tests, setTests] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTest, setSelectedTest] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const [paymentInfo, setPaymentInfo] = useState(null)
  const [paymentInfoError, setPaymentInfoError] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [receiptFile, setReceiptFile] = useState(null)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [submittingPayment, setSubmittingPayment] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  async function loadTests(nextCategory = category) {
    const data = await api.tests(nextCategory === 'all' ? {} : { subject: nextCategory })
    return normalizeList(data)
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([
      api.subjects(),
      loadTests(category),
    ])
      .then(([subjectData, testData]) => {
        if (!active) return
        setSubjects(normalizeList(subjectData))
        setTests(testData)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Testlarni yuklashda xatolik yuz berdi.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  useEffect(() => {
    AOS.refresh()
  }, [tests])

  useEffect(() => {
    setPaymentInfo(null)
    setPaymentInfoError('')
    setTransactionId('')
    setReceiptFile(null)
    setPaymentMessage('')

    if (
      modalType !== 'payment' ||
      !selectedTest?.is_premium ||
      selectedTest?.has_access ||
      !isAuthenticated
    ) {
      return
    }

    let active = true
    api.paymentCardInfo()
      .then((data) => {
        if (active) setPaymentInfo(data)
      })
      .catch((err) => {
        if (active) setPaymentInfoError(err.message || "Karta ma'lumotini olishda xatolik.")
      })

    return () => {
      active = false
    }
  }, [modalType, selectedTest?.id, selectedTest?.has_access, isAuthenticated])

  const regularSubjects = useMemo(
    () => subjects.filter((subject) => !SUBJECT_META[subject.slug]?.special),
    [subjects],
  )
  const specialSubject = useMemo(
    () => subjects.find((subject) => SUBJECT_META[subject.slug]?.special),
    [subjects],
  )
  const visibleBooks = FORMULA_BOOKS.filter((book) => category === 'all' || book.category === category)

  function chooseCategory(nextCategory) {
    setCategory(nextCategory)
    window.requestAnimationFrame(() => wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function startTest(test) {
    setModalType(null)
    navigate(`/card/${test.id}`, {
      state: {
        category: test.subject.slug,
        title: test.title,
      },
    })
  }

  function openPremium(test) {
    setSelectedTest(test)
    if (test.has_access) {
      startTest(test)
      return
    }
    if (!isAuthenticated) {
      navigate('/hae')
      return
    }
    setModalType('payment')
  }

  async function copyCardNumber() {
    if (!paymentInfo?.card_number) return
    try {
      await navigator.clipboard.writeText(paymentInfo.card_number)
      setPaymentMessage('Karta raqami nusxalandi.')
    } catch {
      setPaymentMessage("Karta raqamini qo'lda nusxalang.")
    }
  }

  async function submitPaymentProof() {
    if (!selectedTest) return
    if (!isAuthenticated) {
      navigate('/hae')
      return
    }
    if (!transactionId.trim() && !receiptFile) {
      setPaymentMessage('Transaction ID yoki chek rasmini/faylini yuboring.')
      return
    }

    try {
      setSubmittingPayment(true)
      setPaymentMessage('')
      const result = await api.submitPayment({
        test_id: selectedTest.id,
        transaction_id: transactionId.trim(),
        receipt: receiptFile,
      })
      const statusValue = result?.payment?.status || 'pending'
      setSelectedTest((prev) => ({ ...prev, payment_status: statusValue }))
      setTests((prev) => prev.map((item) => (
        item.id === selectedTest.id ? { ...item, payment_status: statusValue } : item
      )))
      setPaymentMessage(result?.message || "To'lov ma'lumoti yuborildi. Admin tekshiradi.")
      setTransactionId('')
      setReceiptFile(null)
    } catch (err) {
      setPaymentMessage(err.message || "To'lov ma'lumotini yuborishda xatolik.")
    } finally {
      setSubmittingPayment(false)
    }
  }

  async function checkPaymentStatus() {
    if (!selectedTest) return
    try {
      setCheckingPayment(true)
      const freshTests = await loadTests(category)
      setTests(freshTests)
      const refreshed = freshTests.find((item) => item.id === selectedTest.id)
      if (!refreshed) {
        setPaymentMessage('Test topilmadi.')
        return
      }
      setSelectedTest(refreshed)
      if (refreshed.has_access) {
        setPaymentMessage("To'lov tasdiqlandi. Premium test ochildi ✅")
      } else if (refreshed.payment_status === 'pending') {
        setPaymentMessage("To'lov hali admin tekshiruvida.")
      } else if (refreshed.payment_status === 'rejected') {
        setPaymentMessage("To'lov rad etilgan. Ma'lumotni tekshirib qayta yuboring.")
      } else {
        setPaymentMessage("Tasdiqlangan to'lov topilmadi.")
      }
    } catch (err) {
      setPaymentMessage(err.message || 'Holatni tekshirishda xatolik.')
    } finally {
      setCheckingPayment(false)
    }
  }

  if (loading) {
    return <section className="testlar_section"><div className="box"><h2 style={{ padding: '40px 0' }}>Testlar yuklanmoqda...</h2></div></section>
  }

  if (error) {
    return (
      <section className="testlar_section">
        <div className="box">
          <h2 style={{ paddingTop: 40, color: 'crimson' }}>{error}</h2>
          <p style={{ paddingBottom: 40 }}>Django serveri ishlayotganini va REACT_APP_API_URL qiymatini tekshiring.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="testlar_section">
      <div className="box">
        <div className="header_testlar_wrapper">
          <div className="header_testlar">
            <button type="button" onClick={() => chooseCategory('all')} className={`category-btn ${category === 'all' ? 'active' : ''}`}>
              <LayoutGrid size={24} /><span>Barchasi</span>
            </button>
            {regularSubjects.map((subject) => (
              <button
                type="button"
                key={subject.id}
                onClick={() => chooseCategory(subject.slug)}
                className={`category-btn ${category === subject.slug ? 'active' : ''}`}
              >
                {SUBJECT_META[subject.slug]?.icon || <Calculator size={24} />}
                <span>{subject.name}</span>
              </button>
            ))}
          </div>
          {specialSubject ? (
            <div className="economy-card" style={{ backgroundImage: `url(${jovo})` }}>
              <div className="economy-card-overlay" />
              <div className="economy-card-content">
                <div className="economy-badge"><Star size={20} fill="currentColor" />Asosiy yo‘nalish</div>
                <div className="economy-title-row">
                  <h1 className="grg">{specialSubject.name}</h1>
                  <h2 className="economy-count">{specialSubject.tests_count} test</h2>
                </div>
                <h1 className="pl">Platformaning asosiy yo‘nalishi</h1>
                <button type="button" className="economy-action" onClick={() => chooseCategory(specialSubject.slug)}>Testlarni boshlash</button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="wrapper" ref={wrapperRef}>
          {visibleBooks.map((book) => (
            <article key={book.category} className="fmBk-premium-card" data-aos="zoom-in">
              <div className="fmBk-premium-glow" />
              <div className="fmBk-premium-inner">
                <span className="fmBk-badge">KUTUBXONA</span>
                <div><h3>{book.title}</h3><p>{book.images.length} ta formulalar varag‘i jamlangan.</p></div>
                <button type="button" className="fmBk-open-btn" onClick={() => setSelectedBook(book)}>Katalogga kirish</button>
              </div>
            </article>
          ))}

          {tests.length === 0 ? <div style={{ padding: '40px 0' }}><h2>Hali test yo‘q.</h2></div> : null}

          {tests.map((test) => {
            const meta = SUBJECT_META[test.subject?.slug] || SUBJECT_META.math
            const lockedPremium = test.is_premium && !test.has_access
            return (
              <article key={test.id} className={`testlar_card ${test.is_premium ? 'premium-card' : ''}`} data-aos="zoom-in">
                <div className="testlar_card_wrapper">
                  <img src={meta.image} alt={test.title} />
                  <div className="card-header">
                    {test.is_premium ? (
                      <div className="card-badge"><Star size={16} fill="white" /><span>{test.has_access ? 'PURCHASED' : 'GOLDEN'}</span></div>
                    ) : null}
                    <h4>{test.title}</h4>
                    <div className="card-meta"><span>{test.questions_count} savol</span><span>{test.duration_minutes} daqiqa</span></div>
                  </div>
                </div>
                <div className="butoon_test">
                  <button type="button" className="tafsilot" onClick={() => { setSelectedTest(test); setModalType('detail') }}>Tafsilot</button>
                  <button
                    type="button"
                    className={lockedPremium ? 'premium-btn' : 'boshlash'}
                    onClick={() => lockedPremium ? openPremium(test) : startTest(test)}
                  >
                    {lockedPremium
                      ? (test.payment_status === 'pending' ? 'Tekshiruvda' : 'Premium ochish')
                      : 'Testni boshlash'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {selectedTest && modalType === 'detail' ? (
        <div className="fmBk-modal-overlay" onClick={() => setModalType(null)}>
          <div className="fmBk-modal-window" style={{ maxWidth: 500 }} onClick={(event) => event.stopPropagation()}>
            <div className="fmBk-modal-header">
              <div className="fmBk-modal-title"><h2>{selectedTest.title}</h2><span>{selectedTest.subject.name}</span></div>
              <button type="button" className="fmBk-close-circle" aria-label="Yopish" onClick={() => setModalType(null)}><X size={20} /></button>
            </div>
            <div className="fmBk-modal-body" style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                <div style={{ padding: 15 }}><HelpCircle size={24} /><strong>{selectedTest.questions_count} savol</strong></div>
                <div style={{ padding: 15 }}><Clock size={24} /><strong>{selectedTest.duration_minutes} daqiqa</strong></div>
              </div>
              <p>{selectedTest.description}</p>
              <button
                type="button"
                className={selectedTest.is_premium && !selectedTest.has_access ? 'premium-btn' : 'boshlash'}
                onClick={() => selectedTest.is_premium && !selectedTest.has_access ? openPremium(selectedTest) : startTest(selectedTest)}
              >
                {selectedTest.is_premium && !selectedTest.has_access ? 'Premium ochish' : 'Testni boshlash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedTest && modalType === 'payment' ? (
        <div className="fmBk-modal-overlay" onClick={() => setModalType(null)}>
          <div className="fmBk-modal-window p2p-payment-modal" style={{ maxWidth: 520 }} onClick={(event) => event.stopPropagation()}>
            <div className="fmBk-modal-header">
              <div className="fmBk-modal-title"><h2>Premium test uchun to‘lov</h2><span>{selectedTest.title}</span></div>
              <button type="button" className="fmBk-close-circle" aria-label="Yopish" onClick={() => setModalType(null)}><X size={20} /></button>
            </div>
            <div className="fmBk-modal-body p2p-payment-body" style={{ padding: 20 }}>
              {/* FUNCTION1_P2P_UI_V3 */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <strong style={{ fontSize: 22 }}>{selectedTest.price} so‘m</strong>
                <p style={{ margin: '8px 0 0' }}>Pulni ko‘rsatilgan kartaga o‘tkazing, keyin transaction ID yoki chekni yuboring.</p>
              </div>

              {selectedTest.has_access ? (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(34,197,94,.10)', marginBottom: 14 }}>
                  <strong>To‘lov tasdiqlangan ✅</strong>
                  <p style={{ margin: '6px 0 0' }}>Bu premium test siz uchun ochiq.</p>
                </div>
              ) : null}

              {!selectedTest.has_access && selectedTest.payment_status === 'pending' ? (
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(245,158,11,.12)', marginBottom: 14 }}>
                  <strong>To‘lov tekshiruvda ⏳</strong>
                  <p style={{ margin: '6px 0 0' }}>Admin tasdiqlagach test ochiladi.</p>
                </div>
              ) : null}

              {!selectedTest.has_access && selectedTest.payment_status !== 'pending' ? (
                <>
                  {selectedTest.payment_status === 'rejected' ? (
                    <div style={{ padding: 12, borderRadius: 12, background: 'rgba(220,38,38,.08)', marginBottom: 12 }}>
                      Oldingi to‘lov rad etilgan. To‘g‘ri ma’lumot bilan qayta yuboring.
                    </div>
                  ) : null}

                  {paymentInfoError ? <p style={{ color: 'crimson' }}>{paymentInfoError}</p> : null}
                  {paymentInfo ? (
                    <div className="p2p-card-box">
                      <small className="p2p-card-caption">Pulni ushbu kartaga o‘tkazing:</small>
                      <div className="p2p-card-row">
                        <strong className="p2p-card-number">{formatCardNumber(paymentInfo.card_number)}</strong>
                        <button type="button" className="p2p-copy-btn" onClick={copyCardNumber} title="Karta raqamini nusxalash" aria-label="Karta raqamini nusxalash"><Copy size={17} /></button>
                      </div>
                      {paymentInfo.card_holder ? <div className="p2p-card-holder">{paymentInfo.card_holder}</div> : null}
                    </div>
                  ) : null}

                  <div className="p2p-payment-fields">
                    <label className="p2p-field">
                      <span className="p2p-field-label">Transaction ID <span className="p2p-optional">(chek yuklasangiz ixtiyoriy)</span></span>
                      <input
                        className="p2p-payment-input"
                        value={transactionId}
                        onChange={(event) => setTransactionId(event.target.value)}
                        placeholder="Masalan: 123456789"
                      />
                    </label>
                    <div className="p2p-field">
                      <span className="p2p-field-label">Chek rasmi yoki PDF</span>
                      <label className="p2p-file-picker">
                        <input
                          className="p2p-file-input"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(event) => setReceiptFile(event.target.files?.[0] || null)}
                        />
                        <span className="p2p-file-button"><Upload size={18} /> Fayl tanlash</span>
                        <span className="p2p-file-name">{receiptFile?.name || 'Fayl tanlanmagan'}</span>
                      </label>
                    </div>
                  </div>
                </>
              ) : null}

              {paymentMessage ? <p className="p2p-payment-message">{paymentMessage}</p> : null}

              <div className="p2p-payment-actions">
                {selectedTest.has_access ? (
                  <button type="button" className="p2p-payment-btn p2p-payment-btn--primary" onClick={() => startTest(selectedTest)}>Testni boshlash</button>
                ) : null}

                {!selectedTest.has_access && selectedTest.payment_status !== 'pending' ? (
                  <button type="button" className="p2p-payment-btn p2p-payment-btn--primary" onClick={submitPaymentProof} disabled={submittingPayment}>
                    {submittingPayment ? 'Yuborilmoqda...' : 'To‘lovni tekshirishga yuborish'}
                  </button>
                ) : null}

                {!selectedTest.has_access ? (
                  <button type="button" className="p2p-payment-btn p2p-payment-btn--secondary" onClick={checkPaymentStatus} disabled={checkingPayment}>
                    {checkingPayment ? 'Tekshirilmoqda...' : 'Holatni tekshirish'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBook ? (
        <div className="fmBk-modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="fmBk-modal-window" onClick={(event) => event.stopPropagation()}>
            <div className="fmBk-modal-header">
              <div className="fmBk-modal-title"><h2>{selectedBook.title}</h2><span>Kattalashtirish uchun rasmni bosing.</span></div>
              <button type="button" className="fmBk-close-circle" aria-label="Yopish" onClick={() => setSelectedBook(null)}><X size={20} /></button>
            </div>
            <div className="fmBk-modal-body">
              <div className="fmBk-grid-container">
                {selectedBook.images.map((image, index) => (
                  <button type="button" key={image} className="fmBk-grid-item" onClick={() => setLightboxIndex(index)}>
                    <div className="fmBk-image-wrapper"><span className="fmBk-item-number">Varaq #{index + 1}</span><img src={image} alt={`${selectedBook.title}, ${index + 1}-varaq`} /></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBook && lightboxIndex !== null ? (
        <div className="fmBk-lightbox" onClick={() => setLightboxIndex(null)}>
          <button type="button" className="fmBk-lightbox-nav fmBk-prev" aria-label="Oldingi" disabled={lightboxIndex === 0} onClick={(event) => { event.stopPropagation(); setLightboxIndex((index) => index - 1) }}><ChevronLeft size={32} /></button>
          <div className="fmBk-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="fmBk-lightbox-close" aria-label="Yopish" onClick={() => setLightboxIndex(null)}><X size={24} /></button>
            <img src={selectedBook.images[lightboxIndex]} alt={`${selectedBook.title}, ${lightboxIndex + 1}-varaq`} className="fmBk-lightbox-img" />
          </div>
          <button type="button" className="fmBk-lightbox-nav fmBk-next" aria-label="Keyingi" disabled={lightboxIndex === selectedBook.images.length - 1} onClick={(event) => { event.stopPropagation(); setLightboxIndex((index) => index + 1) }}><ChevronRight size={32} /></button>
        </div>
      ) : null}
    </section>
  )
}
