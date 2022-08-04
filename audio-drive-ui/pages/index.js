import Head from 'next/head'
import Image from 'next/image'
import style from '../styles/Home.module.css'

import Player from '../components/Player.js'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import Search from '../components/Search'

export default function Home() {
  const { data: session } = useSession();

  const [audioCurrentIndex, setAudioCurrentIndex] = useState(0);
  const [audioNextIndex, setAudioNextIndex] = useState(audioCurrentIndex + 1);
  const [audio, setAudio] = useState([
    {
      title: "song 1",
      artist: "artist 1",
      img_src: "./images/img1.jpg",
      src: "./audio/Black Tar.mp3"
    },
    {
      title: "song 2",
      artist: "artist 2",
      img_src: "./images/img2.jpg",
      src: "./audio/CODENAMEZ.mp3"
    }
  ]);

  return (
    <div className={style.container}>
      <Head>
        <title>Audio Drive</title>
        <meta name="Audio Drive" content="music, entertainment" />
      </Head>

      <main className={style.main}>

        {!session && <button onClick={() => signIn()}>Sign in</button>}
        {session && <button onClick={() => signOut()}>Sign out {session.user.name}</button>}
        
        <h1 className={style.title}>
          Audio Drive
        </h1>

        <Search />

        <Player 
          currentAudio={audio[audioCurrentIndex]}
          audioNext={audio[audioNextIndex]}
        />

      </main>

      
    </div>
  )
}
