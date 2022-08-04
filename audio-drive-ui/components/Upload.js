import React from 'react'
import style from '../styles/library.module.css'
import db from '../firebase'

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function Upload() {
    const [fileUrl, setFileUrl] = React.useState(null)
    const [musicUrl, setMusicUrl] = React.useState(null)
    const [disable, setDisable] = React.useState(true);

    React.useEffect(() => {
        if (musicUrl !== null && fileUrl !== null) {
            setDisable(false);
            alert("click on submit")
            console.log(disable)
        }
    }, [musicUrl, fileUrl])

    const filechanged = async (e) => {
        let file = e.target.files[0];
        const storagemRef = getStorage();
        const fileRef = ref(storagemRef, 'images/' + file.name)
        uploadBytes(fileRef, music).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        setMusicUrl(await getDownloadURL(musicRef));
    }

    const musicchanged = async (e) => {
        let music = e.target.files[0];
        const storagemRef = getStorage();
        const musicRef = ref(storagemRef, 'audio/' + music.name)
        uploadBytes(musicRef, music).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        setMusicUrl(await getDownloadURL(musicRef));
    }

    const submit = (e) => {
        e.preventDefault();
        const musicname = e.target.musicname.value;
        if (!musicname) {
            return
        }
        db.collection("Music").doc(musicname).set({
            name: musicname,
            music: musicUrl,
            image: fileUrl
        })
        alert("Music added")
    }

    return (
        <div className={style.uploadpage}>
            <form onSubmit={submit} className={style.uploadform}>
                <label>images</label>
                <input
                    type="file"
                    className={style.myfile}
                    name="img"
                    onChange={filechanged}
                    required
                />
                <label>Music files</label>
                <input type="file" name="music" onChange={musicchanged} required />
                <input
                    type="text"
                    name="musicname"
                    placeholder="Music name"
                    required
                />
                <button className={style.btn} disabled={disable}>Submit</button>
            </form>
        </div>
    );
}

export default Upload