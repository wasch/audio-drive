import Head from 'next/head'
import React from 'react'
import { useSelector } from 'react-redux'
import style from '../styles/layout.module.css'

import Navbar from './Navbar'
import Player from './player/Player'

const Layout = ({ children }) => {

  // Redux
  const queue = useSelector((state) => state.queue.value);
  const queueIndex = useSelector((state) => state.queueIndex.value);

  return (
    <div className="layoutContainer">
      <Head>
        <title>{queue[queueIndex] ? queue[queueIndex].name : "Audio Drive"}</title>
      </Head>
      
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