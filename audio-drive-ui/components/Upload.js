import React from 'react'
import style from '../styles/upload.module.css'
import db from '../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, addDoc, collection } from 'firebase/firestore'

import { useSession } from 'next-auth/react'

function Upload() {

    const { data: session } = useSession();

    const [dragActive, setDragActive] = React.useState(false);
    const [disable, setDisable] = React.useState(true);
    const [audioList, setAudioList] = React.useState([]);

    React.useEffect(() => {
        if (audioList.length !== 0) {
            setDisable(false);
            console.log(audioList);
            console.log(disable);
        }
    }, [audioList])

    // Handle click to upload
    const audioChanged = (e) => {
        Array.from(e.target.files).forEach(async (file) => {
            let audio = file;
            let audioName = audio.name;

            // Add files to Firebase Storage
            const storagemRef = getStorage();
            const audioRef = ref(storagemRef, 'audio/' + audio.name);
            await uploadBytes(audioRef, audio).then((snapshot) => {
                console.log('Uploaded audio');
            });
            let audioUrl = await getDownloadURL(audioRef);

            // Get audio duration
            let audioTag = document.createElement('audio');
            audioTag.src = audioUrl;
            audioTag.addEventListener('loadedmetadata', async () => {

                let minutes = parseInt(audioTag.duration / 60, 10);
                let seconds = "0" + parseInt(audioTag.duration % 60);
                let convertedDuration = minutes + ":" + seconds.slice(-2)

                const audioObj = {
                    name: audioName.substr(0, audioName.lastIndexOf(".")),
                    audioSource: audioUrl,
                    audioDuration: convertedDuration,
                    user: session.user.email
                }

                // Add doc references for audio files in Firebase Cloud Firestore Database
                try {
                    const audioDatabaseRef = await addDoc(collection(db, "audio"), audioObj);
                    console.log(audioDatabaseRef);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
                setAudioList(current => [...current, audioObj]);
            });
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    // Handle drag and drop to upload
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            Array.from(e.dataTransfer.files).forEach(async (file) => {
                let audio = file;
                let audioName = audio.name;

                // Upload audio to Firebase Storage
                const storagemRef = getStorage();
                const audioRef = ref(storagemRef, 'audio/' + audio.name);
                await uploadBytes(audioRef, audio).then((snapshot) => {
                    console.log('Uploaded audio');
                });
                let audioUrl = await getDownloadURL(audioRef);

                // Get audio duration
                let audioTag = document.createElement('audio');
                audioTag.src = audioUrl;
                audioTag.addEventListener('loadedmetadata', async () => {

                    let minutes = parseInt(audioTag.duration / 60, 10);
                    let seconds = "0" + parseInt(audioTag.duration % 60);
                    let convertedDuration = minutes + ":" + seconds.slice(-2)

                    const audioObj = {
                        name: audioName.substr(0, audioName.lastIndexOf(".")),
                        audioSource: audioUrl,
                        audioDuration: convertedDuration,
                        user: session.user.email
                    }

                    // Add doc references for audio files in Firebase Cloud Firestore Database
                    try {
                        const audioDatabaseRef = await addDoc(collection(db, "audio"), audioObj);
                        console.log(audioDatabaseRef);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                    setAudioList(current => [...current, audioObj]);
                });
            });
        }
    }

    return (
        <div className={style.uploadpage}>
            <div className="row">
                <form onSubmit={handleSubmit} className={style.uploadform} id="uploadForm" onDragEnter={handleDrag}>
                    <label htmlFor="audioInput" className={dragActive ? style.dragActive : ""}>
                        Upload Audio Files
                        <input type="file" id="audioInput" name="audio" onChange={audioChanged} required multiple hidden />
                    </label>
                    {dragActive && <div className={style.dragFileElement} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                </form>

                {audioList.length === 0 ? <></> :
                    <div className={style.cardContainer}>
                        <h3>Audio Added:</h3>
                        {audioList.map((item, index) => (
                            <div className="card grey darken-3" key={index}>
                                <div className={style.audioCardWrapper}>
                                    <div className="card-title valign-wrapper">
                                        <div className="card-text">
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default Upload