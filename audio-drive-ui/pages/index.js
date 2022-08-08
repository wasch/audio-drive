import Head from 'next/head'
import Image from 'next/image'
import style from '../styles/Home.module.css'

import Player from '../components/Player.js'
import Audio from '../components/Audio'

import { useState } from 'react'
import { useSession, getSession, loading } from 'next-auth/react'
import { authOptions } from "./api/auth/[...nextauth]"

import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import db from '../firebase'

export default function Home({ retrievedAudio }) {

  const [audioCurrentIndex, setAudioCurrentIndex] = useState(0);
  const [audioNextIndex, setAudioNextIndex] = useState(audioCurrentIndex + 1);
  const [audio, setAudio] = useState({});
  const [audioList, setAudioList] = useState(retrievedAudio);

  const retrieveAudio = (audioData) => {
    setAudio(audioData);
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

        <div>
          {audioList.map((item, index) => (
            <div className={style.singularAudio} key={index}>
              <Audio
                title={item.name}
                url={item.music}
                user={item.user}
                passAudioToParent={retrieveAudio}
              />
            </div>
          ))}
        </div>

        <Player
          currentAudio={audio}
        //audioNext={audio}
        />

      </main>


    </div>
  )
}

export async function getServerSideProps(context) {

  const session = await getSession(context, authOptions);

  let audio = [];
  const q = query(collection(db, "audio"), where("user", "==", session.user.email));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let newAudio = doc.data();
    newAudio.id = doc.id;
    if (!audio.some(audio => audio.id === newAudio.id)) {   // Don't add audio if it already exists
      audio.push(newAudio);
    }
  });
  console.log(audio);
  return {
    props: {
      retrievedAudio: audio
    }
  }
}
