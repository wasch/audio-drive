import React from 'react'
import style from '../styles/library.module.css'
import db from '../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, addDoc, collection } from 'firebase/firestore'

import { useSession } from 'next-auth/react'

function Upload() {

    const { data: session } = useSession();

    const [musicUrl, setMusicUrl] = React.useState(null)
    const [disable, setDisable] = React.useState(true);

    React.useEffect(() => {
        if (musicUrl !== null) {
            setDisable(false);
            alert("Audio Uploaded");
            console.log(disable);
        }
    }, [musicUrl])

    const musicchanged = async (e) => {
        let music = e.target.files[0];
        const storagemRef = getStorage();
        const musicRef = ref(storagemRef, 'audio/' + music.name);
        await uploadBytes(musicRef, music).then((snapshot) => {
            console.log('Uploaded audio');
        });
        setMusicUrl(await getDownloadURL(musicRef));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const musicname = e.target.musicname.value;
        if (!musicname) {
            return;
        }
        try {
            const audioDatabaseRef = await addDoc(collection(db, "audio"), {
                name: musicname,
                music: musicUrl,
                user: session.user.email
            });
            console.log(audioDatabaseRef);
            alert("Audio added");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <div className={style.uploadpage}>
            <form onSubmit={handleSubmit} className={style.uploadform}>
                <label onChange={musicchanged} htmlFor="audioInput">
                    Upload Audio Files
                    <input type="file" id="audioInput" name="music" onChange={musicchanged} required multiple hidden/>
                </label>
                <input
                    type="text"
                    name="musicname"
                    placeholder="Audio name"
                    required
                />
                <button className="btn waves-effect waves-light blue" type="submit" name="action" disabled={disable}>Submit</button>
            </form>
        </div>
    );
}

export default Upload