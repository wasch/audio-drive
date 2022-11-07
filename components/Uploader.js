import React, { useEffect, useState } from 'react'
import style from '../styles/upload.module.css'
import { db, fbAuth } from '../firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, addDoc, collection, getDoc, updateDoc } from 'firebase/firestore'

import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

import { addAudio } from '../redux/slices/audioSlice'

const Uploader = () => {

    // State
    const [dragActive, setDragActive] = useState(false);
    const [disable, setDisable] = useState(true);
    const [audioList, setAudioList] = useState([]);
    const [isOpenFileSizeLimitExceededDialog, setIsOpenFileSizeLimitExceededDialog] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    useEffect(() => {
        if (audioList.length !== 0) {
            setDisable(false);
        }
    }, [audioList])

    // Checks if the user will exceed their storage limit by uploading the file
    async function checkForStorageExceeded(file) {
        const docRef = doc(db, "capacity", user.uid);
        const docSnap = await getDoc(docRef);

        const MBFileSize = file.size / 1000000;
        console.log("Current file size: " + MBFileSize);
        if (docSnap.exists()) {
            const currentCapacity = docSnap.data().capacity;
            console.log("Current capacity: " + currentCapacity);
            if (MBFileSize + currentCapacity > process.env.NEXT_PUBLIC_MB_STORAGE_LIMIT) { // If adding the audio would exceed the per user storage limit (200MB)
                return true;
            } else {
                await updateDoc(docRef, {
                    capacity: MBFileSize + currentCapacity,
                });
            }
        } else {
            console.log("No files have been uploaded, setting up capacity");
            const capacityRef = collection(db, "capacity");
            await setDoc(doc(capacityRef, user.uid), {
                capacity: MBFileSize,
            });
        }
        return false;
    }

    // Handle click to upload
    const audioChanged = async (e) => {
        const audioArray = Array.from(e.target.files);
        for (const file of audioArray) {
            if (file.name.split('.').pop() === 'mp3' || file.name.split('.').pop() === 'wav') {
                const capacityCheck = await checkForStorageExceeded(file);
                if (!capacityCheck) {
                    // Add files to Firebase Storage
                    const storagemRef = getStorage();
                    const audioRef = ref(storagemRef, 'audio/' + file.name);
                    await uploadBytes(audioRef, file).then((snapshot) => {
                        console.log('Uploaded audio');
                    });
                    let audioUrl = await getDownloadURL(audioRef);

                    // Get audio duration
                    let audioTag = document.createElement('audio');
                    audioTag.src = audioUrl;
                    audioTag.name = file.name;
                    audioTag.size = file.size / 1000000;
                    audioTag.addEventListener('loadedmetadata', async (e) => {

                        let minutes = parseInt(audioTag.duration / 60, 10);
                        let seconds = "0" + parseInt(audioTag.duration % 60);
                        let convertedDuration = minutes + ":" + seconds.slice(-2);

                        const audioObj = {
                            name: e.currentTarget.name.substr(0, e.currentTarget.name.lastIndexOf('.')),
                            originalName: e.currentTarget.name.substr(0, e.currentTarget.name.lastIndexOf('.')),
                            audioSource: audioUrl,
                            audioDuration: convertedDuration,
                            user: fbAuth.currentUser.uid,
                            MBFileSize: e.currentTarget.size,
                            fileType: e.currentTarget.name.split('.').pop(),
                            isFavorite: false
                        }

                        // Add doc references for audio files in Firebase Cloud Firestore Database
                        try {
                            const audioDatabaseRef = await addDoc(collection(db, "audio"), audioObj);
                            audioObj.id = audioDatabaseRef.id;
                            dispatch(addAudio(audioObj));
                            setAudioList(current => [...current, audioObj]);
                        } catch (e) {
                            console.error("Error adding document: ", e);
                        }
                    });
                } else {
                    setIsOpenFileSizeLimitExceededDialog(true);    // Triggers dialog
                    setTimeout(() => setIsOpenFileSizeLimitExceededDialog(false), 3000); // Dismisses dialog after 3 seconds
                }
            }
        };
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
    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const audioArray = Array.from(e.dataTransfer.files);
            for (const file of audioArray) {
                if (file.name.split('.').pop() === 'mp3' || file.name.split('.').pop() === 'wav') {
                    const capacityCheck = await checkForStorageExceeded(file);
                    if (!capacityCheck) {
                        // Upload audio to Firebase Storage
                        const storagemRef = getStorage();
                        const audioRef = ref(storagemRef, 'audio/' + file.name);
                        await uploadBytes(audioRef, file).then((snapshot) => {
                            console.log('Uploaded audio');
                        });
                        let audioUrl = await getDownloadURL(audioRef);

                        // Get audio duration
                        let audioTag = document.createElement('audio');
                        audioTag.src = audioUrl;
                        audioTag.name = file.name;
                        audioTag.size = file.size / 1000000;
                        audioTag.addEventListener('loadedmetadata', async (e) => {

                            let minutes = parseInt(audioTag.duration / 60, 10);
                            let seconds = "0" + parseInt(audioTag.duration % 60);
                            let convertedDuration = minutes + ":" + seconds.slice(-2)

                            const audioObj = {
                                name: e.currentTarget.name.substr(0, e.currentTarget.name.lastIndexOf('.')),
                                originalName: e.currentTarget.name.substr(0, e.currentTarget.name.lastIndexOf('.')),
                                audioSource: audioUrl,
                                audioDuration: convertedDuration,
                                user: fbAuth.currentUser.uid,
                                MBFileSize: e.currentTarget.size,
                                fileType: e.currentTarget.name.split('.').pop(),
                                isFavorite: false
                            }

                            // Add doc references for audio files in Firebase Cloud Firestore Database and redux store
                            try {
                                const audioDatabaseRef = await addDoc(collection(db, "audio"), audioObj);
                                audioObj.id = audioDatabaseRef.id;
                                dispatch(addAudio(audioObj));
                                setAudioList(current => [...current, audioObj]);
                            } catch (e) {
                                console.error("Error adding document: ", e);
                            }
                        });
                    } else {
                        setIsOpenFileSizeLimitExceededDialog(true);    // Triggers dialog
                        setTimeout(() => setIsOpenFileSizeLimitExceededDialog(false), 3000); // Dismisses dialog after 3 seconds
                    }
                }
            };
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
                    <div className="p-5 mt-8 shadow-md rounded-md bg-zinc-700">
                        <h3 className="text-2xl">Audio Added:</h3>
                        {audioList.map((item, index) => (
                            <div key={index}>
                                <div className="card">
                                    <div className={style.audioCardWrapper}>
                                        <div className="text-xl">
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-zinc-600" />
                            </div>
                        ))}
                    </div>
                }
            </div>

            {/* File size limit exceeded dialog */}
            <Transition
                show={isOpenFileSizeLimitExceededDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-red-700" onClose={() => setIsOpenCreatePlaylistDialogConf(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Some files were not added due to storage limit ({process.env.NEXT_PUBLIC_MB_STORAGE_LIMIT}MB). Try deleting songs</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Uploader