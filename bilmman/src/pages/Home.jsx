import React from 'react'
import HomeBanner from '../components/HomeBanner'
import Oquvchilar from '../components/Oquvchilar'
import Admin from '../components/Admin'


function Home() {
  return (
    <div>
      <HomeBanner />
      <Admin/>
      <Oquvchilar />
    </div>
  )
}

export default Home