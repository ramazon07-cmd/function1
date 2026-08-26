import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import {
  Brain, Calculator, ChevronLeft, ChevronRight, Clock,
  HelpCircle, LayoutGrid, Star, TrendingUp, Triangle, X,
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
  const [buying, setBuying] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.all([
      api.subjects(),
      api.tests(category === 'all' ? {} : { subject: category }),
    ])
      .then(([subjectData, testData]) => {
        if (!active) return
        setSubjects(normalizeList(subjectData))
        setTests(normalizeList(testData))
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
  }, [category])

  useEffect(() => {
    AOS.refresh()
  }, [tests])

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

  async function buyPremium() {
    if (!selectedTest) return
    if (!isAuthenticated) {
      navigate('/hae')
      return
    }

    try {
      setBuying(true)
      await api.premiumMockPurchase({
        test_id: selectedTest.id,
        amount: selectedTest.price || 5000,
      })
      startTest(selectedTest)
    } catch (err) {
      setError(err.message || 'Premium testni ochishda xatolik yuz berdi.')
      setModalType(null)
    } finally {
      setBuying(false)
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
            return (
              <article key={test.id} className={`testlar_card ${test.is_premium ? 'premium-card' : ''}`} data-aos="zoom-in">
                <div className="testlar_card_wrapper">
                  <img src={meta.image} alt={test.title} />
                  <div className="card-header">
                    {test.is_premium ? <div className="card-badge"><Star size={16} fill="white" /><span>GOLDEN</span></div> : null}
                    <h4>{test.title}</h4>
                    <div className="card-meta"><span>{test.questions_count} savol</span><span>{test.duration_minutes} daqiqa</span></div>
                  </div>
                </div>
                <div className="butoon_test">
                  <button type="button" className="tafsilot" onClick={() => { setSelectedTest(test); setModalType('detail') }}>Tafsilot</button>
                  <button
                    type="button"
                    className={test.is_premium ? 'premium-btn' : 'boshlash'}
                    onClick={() => {
                      setSelectedTest(test)
                      if (test.is_premium) setModalType('payment')
                      else startTest(test)
                    }}
                  >
                    {test.is_premium ? 'Premium ochish' : 'Testni boshlash'}
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
              <button type="button" className={selectedTest.is_premium ? 'premium-btn' : 'boshlash'} onClick={() => selectedTest.is_premium ? setModalType('payment') : startTest(selectedTest)}>
                {selectedTest.is_premium ? 'Premium ochish' : 'Testni boshlash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedTest && modalType === 'payment' ? (
        <div className="fmBk-modal-overlay" onClick={() => setModalType(null)}>
          <div className="fmBk-modal-window" style={{ maxWidth: 420 }} onClick={(event) => event.stopPropagation()}>
            <div className="fmBk-modal-header">
              <div className="fmBk-modal-title"><h2>Premium faollashtirish</h2></div>
              <button type="button" className="fmBk-close-circle" aria-label="Yopish" onClick={() => setModalType(null)}><X size={20} /></button>
            </div>
            <div className="fmBk-modal-body" style={{ padding: 20, textAlign: 'center' }}>
              <p>“{selectedTest.title}” narxi: {selectedTest.price} so‘m.</p>
              <p>Demo rejim: haqiqiy karta ma’lumoti kiritilmaydi.</p>
              <button type="button" className="premium-btn" onClick={buyPremium} disabled={buying}>{buying ? 'Ochilmoqda...' : 'Premiumni ochish'}</button>
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
