import React, { useState, useEffect, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux'
import { addAudioToEndOfList, addAudioToStartOfList, replaceQueue } from '../redux/slices/queueSlice'
import { next } from '../redux/slices/queueIndexSlice'

import { db } from '../firebase'
import { doc, deleteDoc, query, where, collection, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import style from '../styles/audio.module.css'

const Audio = (props) => {

    // Props
    const { title, url, duration, user, size } = props;

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const queue = useSelector((state) => state.queue.value);

    // State
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(queueIndex);
    }, [queueIndex]);

    const removeFromLibrary = async () => {
        // Remove doc
        const q = query(collection(db, "audio"),
            where("user", "==", user),
            where("name", "==", title),
            where("audioSource", "==", url),
            where("audioDuration", "==", duration));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (audio) => {
            await deleteDoc(doc(db, "audio", audio.id));
        });

        // Remove file
        const storage = getStorage();
        const fileRef = ref(storage, "audio/" + title + ".mp3");
        deleteObject(fileRef).then(() => {
            console.log("Successfully deleted: " + title);
        }).catch((err) => {
            console.log("Unable to delete: " + title);
            console.log(err);
        });

        // Update user's capacity
        const docRef = doc(db, "capacity", user);
        const docSnap = await getDoc(docRef);
        const currentCapacity = docSnap.data().capacity;
        await updateDoc(docRef, {
            capacity: currentCapacity - size,
        });

        // Clear queue
        dispatch(replaceQueue([queue[0]]));
    }

    return (
        <div className="bg-zinc-700 flex items-center my-3 px-2 py-3">
            <div className="mr-2">
                <button className="flex hover:brightness-110" onClick={() => {
                    let audioObj = {
                        name: title,
                        audioSource: url,
                        audioDuration: duration,
                        user: user,
                        currentIndex: currentIndex
                    };
                    if (queue[0]) { // If audio already exists in the queue
                        audioObj.currentIndex += 1;
                        dispatch(addAudioToStartOfList(audioObj));
                        dispatch(next());
                    } else {
                        dispatch(addAudioToStartOfList(audioObj));
                    }
                }
                }>
                    <i className="material-icons">play_arrow</i>
                </button>
            </div>
            <div className="text-lg mr-4">
                {title}
            </div>
            <div className="text-md text-zinc-400 ml-auto mr-3">
                {duration}
            </div>
            <div className={style.rightIcon}>
                <button className="flex" title="Add to queue" onClick={() => dispatch(addAudioToEndOfList({
                    name: title,
                    audioSource: url,
                    audioDuration: duration,
                    user: user
                }))}>
                    <i className="material-icons">add</i>
                </button>
            </div>
            <Menu as="div" className="relative inline-block">
                <div>
                    <Menu.Button className="flex" title="Menu">
                        <i className="material-icons">more_vert</i>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute bg-slate-600 shadow-md rounded-sm z-10">
                        <div className="flex flex-col">
                            <Menu.Item className="px-4 py-2 hover:backdrop-brightness-110">
                                {({ active }) => (
                                    <button
                                        onClick={removeFromLibrary}
                                        className={`${active && 'bg-blue-500'}`}
                                        href="#"
                                    >
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                            {/**
                            <Menu.Item className="px-4 py-2 hover:backdrop-brightness-110">
                                {({ active }) => (
                                    <a
                                        className={`${active && 'bg-blue-500'}`}
                                        href="#"
                                    >
                                        Documentation
                                    </a>
                                )}
                            </Menu.Item>
                             */}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

export default Audio