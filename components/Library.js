import Audio from './Audio'

import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

import { useSelector, useDispatch } from 'react-redux'
import { setAudio } from '../redux/slices/audioSlice'
import { useEffect } from 'react'
import { useState } from 'react'

const Library = () => {

    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const audio = useSelector((state) => state.audio.value);
    const queue = useSelector((state) => state.queue.value);

    // State
    const [search, setSearch] = useState("");

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
            dispatch(setAudio(audio));
        }
        fetchAudio();
    }, [user, queue]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    return (
        <div className="flex flex-col items-center">
            <input type="text" onChange={handleSearchChange} placeholder="Search" className="w-full max-w-md p-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
            {audio ?
                <div className="w-full">
                    {audio.map((item, index) => (
                        search === "" || item.name.toLowerCase().includes(search.toLowerCase()) ?      // If the audio matches the search criteria or search is not being used, show it
                            <div key={index}>
                                <Audio
                                    title={item.name}
                                    url={item.audioSource}
                                    duration={item.audioDuration}
                                    user={item.user}
                                    size={item.MBFileSize}
                                />
                            </div>
                            : <div key={index} className="hidden"></div>
                    ))}
                </div>
                : <h3>No audio in library</h3>
            }
        </div>
    )
}

export default Library
