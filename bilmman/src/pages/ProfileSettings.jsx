import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, KeyRound, Mail, Save, Trash2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/profile.css'

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
}

function firstError(err, fallback) {
  const data = err?.data
  if (data && typeof data === 'object') {
    const value = Object.values(data).flat()[0]
    if (value) return String(value)
  }
  return err?.message || fallback
}

export default function ProfileSettings() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const { user, loading, isAuthenticated, updateProfile, changePassword, deleteAccount } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/hae', { replace: true })
  }, [loading, isAuthenticated, navigate])

  useEffect(() => {
    if (!user) return
    setName(user.name || '')
    setEmail(user.email || '')
  }, [user])

  const previewUrl = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : '', [imageFile])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  if (loading || !user) {
    return <main className="profile-page"><div className="profile-shell"><div className="profile-loading">Sozlamalar yuklanmoqda...</div></div></main>
  }

  async function saveProfile(event) {
    event.preventDefault()
    setProfileMessage('')
    setProfileError('')
    if (name.trim().length < 2) {
      setProfileError('Ism kamida 2 ta belgidan iborat bo‘lsin.')
      return
    }
    try {
      setSavingProfile(true)
      await updateProfile({ name: name.trim(), email: email.trim().toLowerCase(), profile_image: imageFile })
      setImageFile(null)
      if (fileRef.current) fileRef.current.value = ''
      setProfileMessage('Profil ma’lumotlari saqlandi ✅')
    } catch (err) {
      setProfileError(firstError(err, 'Profilni saqlashda xatolik yuz berdi.'))
    } finally {
      setSavingProfile(false)
    }
  }

  async function savePassword(event) {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError('Yangi parol kamida 8 ta belgidan iborat bo‘lsin.')
      return
    }
    if (newPassword !== newPassword2) {
      setPasswordError('Yangi parollar bir xil emas.')
      return
    }
    try {
      setSavingPassword(true)
      const result = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      })
      setCurrentPassword('')
      setNewPassword('')
      setNewPassword2('')
      setPasswordMessage(result?.message || 'Parol o‘zgartirildi ✅')
    } catch (err) {
      setPasswordError(firstError(err, 'Parolni o‘zgartirishda xatolik yuz berdi.'))
    } finally {
      setSavingPassword(false)
    }
  }

  async function removeAccount() {
    const confirmed = window.confirm('Akkauntni butunlay o‘chirmoqchimisiz? Test natijalari, premium access va to‘lov yozuvlari ham qayta tiklanmaydi.')
    if (!confirmed) return
    const finalConfirm = window.prompt('Tasdiqlash uchun DELETE deb yozing.')
    if (finalConfirm !== 'DELETE') return
    try {
      setDeleting(true)
      await deleteAccount()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleting(false)
      setProfileError(firstError(err, 'Akkauntni o‘chirishda xatolik yuz berdi.'))
    }
  }

  const shownImage = previewUrl || user.profile_image_url

  return (
    <main className="profile-page">
      <div className="profile-shell profile-settings-shell">
        <div className="profile-page-heading">
          <span className="profile-eyebrow">Profil</span>
          <h1>Sozlamalar</h1>
          <p>Ism, email, profil rasmi va parolingizni boshqaring.</p>
        </div>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="profile-card-icon"><UserRound size={22} /></div>
            <div><h2>Profil ma’lumotlari</h2><p>Saytda ko‘rinadigan ism va akkaunt emailingiz.</p></div>
          </div>

          <form className="settings-form" onSubmit={saveProfile}>
            <div className="profile-photo-row">
              <div className="profile-avatar profile-avatar--settings">
                {shownImage ? <img src={shownImage} alt="Profil preview" /> : <span>{initials(name)}</span>}
              </div>
              <div>
                <input
                  ref={fileRef}
                  className="profile-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                />
                <button type="button" className="profile-upload-button" onClick={() => fileRef.current?.click()}><Camera size={18} /> Rasm tanlash</button>
                <small>JPG, PNG yoki WEBP · maksimum 1.5 MB</small>
              </div>
            </div>

            <label className="settings-field">
              <span><UserRound size={16} /> Ism</span>
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            </label>
            <label className="settings-field">
              <span><Mail size={16} /> Email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>

            {profileError ? <p className="settings-alert settings-alert--error">{profileError}</p> : null}
            {profileMessage ? <p className="settings-alert settings-alert--success">{profileMessage}</p> : null}
            <button className="settings-save-button" disabled={savingProfile}><Save size={18} /> {savingProfile ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}</button>
          </form>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="profile-card-icon"><KeyRound size={22} /></div>
            <div><h2>Parol</h2><p>Avval hozirgi parolni kiriting, keyin yangi parol yarating.</p></div>
          </div>
          <form className="settings-form" onSubmit={savePassword}>
            <label className="settings-field"><span>Hozirgi parol</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /></label>
            <label className="settings-field"><span>Yangi parol</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /></label>
            <label className="settings-field"><span>Yangi parolni takrorlang</span><input type="password" value={newPassword2} onChange={(event) => setNewPassword2(event.target.value)} autoComplete="new-password" /></label>
            {passwordError ? <p className="settings-alert settings-alert--error">{passwordError}</p> : null}
            {passwordMessage ? <p className="settings-alert settings-alert--success">{passwordMessage}</p> : null}
            <button className="settings-save-button" disabled={savingPassword}><KeyRound size={18} /> {savingPassword ? 'O‘zgartirilmoqda...' : 'Parolni o‘zgartirish'}</button>
          </form>
        </section>

        <section className="settings-card settings-card--danger">
          <div className="settings-card-heading">
            <div className="profile-card-icon profile-card-icon--danger"><Trash2 size={22} /></div>
            <div><h2>Akkauntni o‘chirish</h2><p>Bu amal qaytarilmaydi. Akkaunt va unga bog‘liq ma’lumotlar databasedan o‘chiriladi.</p></div>
          </div>
          <button className="danger-delete-button" type="button" onClick={removeAccount} disabled={deleting}><Trash2 size={18} /> {deleting ? 'O‘chirilmoqda...' : 'Akkauntni butunlay o‘chirish'}</button>
        </section>
      </div>
    </main>
  )
}
