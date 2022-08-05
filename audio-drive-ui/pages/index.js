import Head from 'next/head'
import Image from 'next/image'
import style from '../styles/Home.module.css'

import Player from '../components/Player.js'

import { useState } from 'react'

export default function Home() {

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

  const getAudio = (data) => {
    newAudio(data);
  }

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

        <Player
          currentAudio={audio[audioCurrentIndex]}
          audioNext={audio[audioNextIndex]}
        />

      </main>


    </div>
  )
}
