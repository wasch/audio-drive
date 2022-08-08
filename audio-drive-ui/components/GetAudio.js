import React, { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import { getStorage, ref } from 'firebase/storage'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import db from '../firebase'

import Audio from './Audio'

import style from '../styles/Home.module.css'

// Gets and displays the current user's audio
const GetAudio = (props) => {

    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [audio, setAudio] = React.useState([]);

    useEffect(() => {
        const getAudio = async () => {
            if (session) {
                const q = query(collection(db, "audio"), where("user", "==", session.user.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    let newAudio = doc.data();
                    newAudio.id = doc.id;
                    if (!audio.some(audio => audio.id === newAudio.id)) {   // Don't add audio if it already exists
                        setAudio(current => [...current, newAudio]);
                        console.log(session);
                    }
                });
            }
        }
        getAudio();
    }, [session]);

    const handleClick = (data) => {
        props.passAudioToIndex(data);
    }

    // When rendering client side don't display anything until loading is complete
    if (typeof window !== "undefined" && loading) return null;

    // If no session exists, display nothing
    if (!session) {
        return (
            <></>
        )
    }

    return (
        <div>
            {audio.map((item, index) => (
                <div className={style.singularAudio} key={index}>
                    <Audio
                        title={item.name}
                        url={item.music}
                        user={item.user}
                        passDataToGetAudio={handleClick}
                    />
                </div>
            ))}
        </div>
    )
}

export default GetAudio