import React, { useState } from 'react'
import '../styles/header.css'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
                <NavLink
                  to={'/'}
                  end
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMenuOpen(false)}
                >
                  Bosh Sahifa
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/mtm'}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMenuOpen(false)}
                >
                  Matematika
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/syt'}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMenuOpen(false)}
                >
                  Iqtisod
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/test'}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMenuOpen(false)}
                >
                  Testlar
                </NavLink>
              </li>
              {isAuthenticated && (
                <li>
                  <NavLink
                    to={'/attempts'}
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    onClick={() => setMenuOpen(false)}
                  >
                    Natijalar
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
          <div className="butoon">
            {isAuthenticated ? (
              <>
                <span style={{ marginRight: 12, fontWeight: 700 }}>{user?.username}</span>
                <button className='kirish' type="button" onClick={logout}>Chiqish</button>
              </>
            ) : (
              <>
                <NavLink to={"/hae"}>
                  <button className='kirish'>Kirish</button>
                </NavLink>

                <NavLink to={"/account"}>
                  <button className="btn">Boshlash</button>
                </NavLink>
              </>
            )}
          </div>


        </header>
      </div>

    </div>
  )

}

export default Header
