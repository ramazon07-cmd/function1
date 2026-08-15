import React from 'react';
import '../styles/header.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <div>
      <div className="box">
        <header className="header">
          <div className="nav">
            <NavLink to="/">
              <div className="logo">Function</div>
            </NavLink>

            <ul>
              <NavLink to="/">
                <li>Bosh Sahifa</li>
              </NavLink>

              <NavLink to="/mtm">
                <li className='bosh'>Matematika</li>
              </NavLink>

              <NavLink to="/syt">
                <li>Iqtisod</li>
              </NavLink>

              <NavLink to="/test">
                <li className='bosh'>Testlar</li>
              </NavLink>

              {user && (
                <NavLink to="/attempts">
                  <li>Natijalarim</li>
                </NavLink>
              )}
            </ul>
          </div>

          <div className="butoon">
            {user ? (
              <>
                <span style={{ fontWeight: 700 }}>{user.email || user.username}</span>
                <button className='kirish' onClick={logout}>Chiqish</button>
              </>
            ) : (
              <>
                <NavLink to="/hae">
                  <button className='kirish'>Kirish</button>
                </NavLink>

                <NavLink to="/account">
                  <button className="btn">Ro‘yxatdan o‘tish</button>
                </NavLink>
              </>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}

export default Header;
