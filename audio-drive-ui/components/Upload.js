import React from 'react'
import style from '../styles/upload.module.css'
import db from '../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, addDoc, collection } from 'firebase/firestore'

import { useSession } from 'next-auth/react'

function Upload() {

    const { data: session } = useSession();

    const [disable, setDisable] = React.useState(true);
    const [audioList, setAudioList] = React.useState([]);

    React.useEffect(() => {
        if (audioList.length !== 0) {
            setDisable(false);
            console.log(audioList);
            console.log(disable);
        }
    }, [audioList])

    const audioChanged = (e) => {
        Array.from(e.target.files).forEach(async (file) => {
            let audio = file;
            let audioName = audio.name;
            const storagemRef = getStorage();
            const audioRef = ref(storagemRef, 'audio/' + audio.name);
            await uploadBytes(audioRef, audio).then((snapshot) => {
                console.log('Uploaded audio');
            });
            let audioUrl = await getDownloadURL(audioRef);
            setAudioList(current => [...current, {
                name: audioName.substr(0, audioName.lastIndexOf(".")),
                audioSource: audioUrl,
                user: session.user.email
            }]);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        audioList.forEach(async (audio) => {
            try {
                const audioDatabaseRef = await addDoc(collection(db, "audio"), audio);
                console.log(audioDatabaseRef);

            } catch (e) {
                console.error("Error adding documents: ", e);
            }
        });
        alert("Audio added");
        setAudioList([]);
    }

    return (
        <div className={style.uploadpage}>
            <div className="row">
                <div className="col s12">
                    <form onSubmit={handleSubmit} className={style.uploadform} id="uploadForm">
                        <label htmlFor="audioInput">
                            Upload Audio Files
                            <input type="file" id="audioInput" name="audio" onChange={audioChanged} required multiple hidden />
                        </label>
                        <button className="btn waves-effect waves-light blue" type="submit" name="action" disabled={disable}>Upload Files</button>
                    </form>

                    {audioList.length === 0 ? <></> :
                        <div className={style.cardContainer}>
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
        </div>
    );
}

export default Upload