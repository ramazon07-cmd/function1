
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

function App() {

  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/card/") ||
    location.pathname === "/account"||
    location.pathname === "/hae"


  return (

    <div className='App'>

      {!hideLayout && <Header />}

      <ScrollToTop />

      <Outlet />

      {!hideLayout && <Footer />}

    </div>

  )
}

export default App
