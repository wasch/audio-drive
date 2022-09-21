import style from '../styles/Home.module.css'

import Audio from './Audio'

import { useState } from 'react'

import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const Library = () => {

    // Redux
    const user = useSelector((state) => state.user.value);

    // State
    const [audioList, setAudioList] = useState([]);

    useEffect(() => {
        async function fetchAudio() {
            let audio = [];
            if (user) {           // Check if user is signed in before getting audio
                const q = query(collection(db, "audio"), where("user", "==", user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    let newAudio = doc.data();
                    newAudio.id = doc.id;
                    if (!audio.some(audio => audio.id === newAudio.id)) {   // Don't add audio if it already exists
                        audio.push(newAudio);
                    }
                });
            }
            setAudioList(audio);
            console.log("test");
        }
        fetchAudio();
    }, [user]);

    return (
        <>
            {audioList ?
                <div className="row">
                    <div className={style.audioContainer}>
                        {audioList.map((item, index) => (
                            <div className={style.singularAudio} key={index}>
                                <Audio
                                    title={item.name}
                                    url={item.audioSource}
                                    duration={item.audioDuration}
                                    user={item.user}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                : <h3>No audio in library</h3>
            }
        </>
    )
}

export default Library