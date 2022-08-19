import React from 'react'
import style from '../styles/layout.module.css'
import { useSession } from 'next-auth/react'

import Navbar from './Navbar'
import Player from './Player'

const Layout = ({ children, audio }) => {

  return (
    <div className="layoutContainer">
      <header>
        <Navbar />
      </header>

      <main className={style.main}>
        {children}
      </main>

      <div className={style.footerContainer}>
        <footer className={style.footer}>
          <Player />
        </footer>
      </div>
    </div>
  )
}

export default Layout