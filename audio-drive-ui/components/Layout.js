import React from 'react'
import style from '../styles/layout.module.css'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import Navbar from './Navbar'
import Player from './Player'

const Layout = ({ children, audio }) => {

  return (
    <div className="layoutContainer">
      <header>
        <Navbar />
      </header>

      <main>
        {children}
      </main>

      <div className={style.footerContainer}>
        <footer className={style.footer}>
          <Player
            currentAudio={audio}
          //audioNext={audio}
          />
        </footer>
      </div>
    </div>
  )
}

export default Layout