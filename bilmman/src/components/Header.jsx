import React, { useState } from 'react'
import '../styles/header.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <div>
      <div className="box">
        <header className="header">
          <div className="nav">
            <NavLink to={'/'}>
              <div className="logo">Finaris</div>
            </NavLink>

            <button
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Menu"
              type="button"
            >
              <span />
            </button>

            <ul className={menuOpen ? 'open' : ''}>
              <li>
                <NavLink to={'/'} end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                  Bosh Sahifa
                </NavLink>
              </li>
              <li>
                <NavLink to={'/mtm'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                  Matematika
                </NavLink>
              </li>
              <li>
                <NavLink to={'/syt'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                  Iqtisod
                </NavLink>
              </li>
              <li>
                <NavLink to={'/test'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                  Testlar
                </NavLink>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <NavLink to={'/attempts'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                      Natijalar
                    </NavLink>
                  </li>
                  {user?.is_staff && (
                    <li>
                      <NavLink to={'/admin/payments'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                        To‘lovlar
                      </NavLink>
                    </li>
                  )}
                  <li className="nav-profile-item">
                    <NavLink to={'/profile'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
                      Profil
                    </NavLink>
                  </li>
                  <li className="nav-profile-item">
                    <button type="button" className="mobile-logout-link" onClick={handleLogout}>Chiqish</button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="butoon">
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="header-profile-chip" aria-label="Profilga o‘tish">
                  <span className="header-avatar">
                    {user?.profile_image_url ? <img src={user.profile_image_url} alt="" /> : <span>{initials(user?.name)}</span>}
                  </span>
                  <span className="header-profile-copy">
                    <strong>{user?.name || 'Foydalanuvchi'}</strong>
                    <small>Profil va sozlamalar</small>
                  </span>
                  <UserRound size={17} className="header-profile-icon" />
                </NavLink>
                <button className="header-logout" type="button" onClick={handleLogout}><LogOut size={17} /> Chiqish</button>
              </>
            ) : (
              <>
                <NavLink to="/hae"><button className="kirish">Kirish</button></NavLink>
                <NavLink to="/account"><button className="btn">Boshlash</button></NavLink>
              </>
            )}
          </div>
        </header>
      </div>
    </div>
  )
}

export default Header
