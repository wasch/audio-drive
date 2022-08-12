import Head from 'next/head'
import Image from 'next/image'
import style from '../styles/Home.module.css'

import Player from '../components/Player'
import Audio from '../components/Audio'
import Queue from '../components/Queue'

import { useState } from 'react'
import { useSession, getSession, loading } from 'next-auth/react'
import { authOptions } from "./api/auth/[...nextauth]"

import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import db from '../firebase'

export default function Home({ retrievedAudio, passAudioToApp }) {

  const [audioCurrentIndex, setAudioCurrentIndex] = useState(0);
  const [audioNextIndex, setAudioNextIndex] = useState(audioCurrentIndex + 1);
  const [audio, setAudio] = useState({});
  const [audioList, setAudioList] = useState(retrievedAudio);

  const retrieveAudio = (audioData) => {
    setAudio(audioData);
    passAudioToApp(audioData); // Pass current audio to _app.js, then layout component, then player component  
  }

  return (
    <div className={style.container}>
      <Head>
        <title>Audio Drive</title>
        <meta name="Audio Drive" content="music, entertainment" />
      </Head>

      <div className="row">
        <div className="col s3"></div>
        <div className="col s6">
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
        <div className="col s3"></div>
      </div>

    </div>
  )
}

export async function getServerSideProps(context) {

  const session = await getSession(context, authOptions);

  let audio = [];
  if (session) {           // Check if user is signed in before getting audio
    const q = query(collection(db, "audio"), where("user", "==", session.user.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let newAudio = doc.data();
      newAudio.id = doc.id;
      if (!audio.some(audio => audio.id === newAudio.id)) {   // Don't add audio if it already exists
        audio.push(newAudio);
      }
    });
  }
  console.log(audio);
  return {
    props: {
      retrievedAudio: audio
    }
  }
}
