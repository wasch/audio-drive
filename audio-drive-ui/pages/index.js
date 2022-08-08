import Head from 'next/head'
import Image from 'next/image'
import style from '../styles/Home.module.css'

import Player from '../components/Player.js'
import GetAudio from '../components/GetAudio'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Home() {

  const [audioCurrentIndex, setAudioCurrentIndex] = useState(0);
  const [audioNextIndex, setAudioNextIndex] = useState(audioCurrentIndex + 1);
  const [audio, setAudio] = useState([
    {
      title: "song 1",
      artist: "artist 1",
      src: "./audio/Black Tar.mp3"
    },
    {
      title: "song 2",
      artist: "artist 2",
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

        <h1 className={style.title}>
          Audio Drive
        </h1>

        <GetAudio />

        <Player
          currentAudio={audio[audioCurrentIndex]}
          audioNext={audio[audioNextIndex]}
        />

      </main>


    </div>
  )
}
