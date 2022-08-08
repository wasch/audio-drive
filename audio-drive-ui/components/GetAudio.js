import React, { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import { getStorage, ref } from 'firebase/storage'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import db from '../firebase'

// Gets and displays the current user's audio
const GetAudio = () => {

    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [audio, setAudio] = React.useState([]);

    useEffect(() => {
        const getAudio = async () => {
            if (session) {
                const q = query(collection(db, "audio"), where("user", "==", session.user.email));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    setAudio(audio.concat(doc.data()));
                });
                
            }
        }
        getAudio();
    }, [session]);

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
                <div key={index}>
                    {item.name}
                </div>
            ))}
        </div>
    )
}

export default GetAudio