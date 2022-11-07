import React, { useState, useEffect, Fragment } from 'react'
import { Menu, Switch, Transition } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux'
import { addAudioToEndOfList, addAudioToStartOfList, replaceQueue } from '../redux/slices/queueSlice'
import { next } from '../redux/slices/queueIndexSlice'
import { removeAudio, setAudio } from '../redux/slices/audioSlice'

import { db } from '../firebase'
import { doc, deleteDoc, query, where, collection, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { Dialog } from '@headlessui/react'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setIsLooping, setLoopStart } from '../redux/slices/loopSlice'
import { removeFromPlaylists, editNameInPlaylists } from '../redux/slices/playlistsSlice'

const Audio = (props) => {

    // Props
    const { id, title, originalName, fileType, url, duration, user, size, isFavorite, isSelected, handleClick, deselect } = props;

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const queue = useSelector((state) => state.queue.value);
    const audioList = useSelector((state) => state.audio.value);

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [audioInfo, setAudioInfo] = useState({});
    const [tempAudioInfo, setTempAudioInfo] = useState({});
    const [canSubmitAudioChange, setCanSubmitAudioChange] = useState(false);

    // Dialog State
    const [isOpen, setIsOpen] = useState(false);

    const [isOpenUpdateAudioInfoDialog, setIsOpenUpdateAudioInfoDialog] = useState(false);
    const [isOpenUpdateAudioInfoDialogConf, setIsOpenUpdateAudioInfoDialogConf] = useState(false);
    const [isOpenUpdateAudioInfoDialogError, setIsOpenUpdateAudioInfoDialogError] = useState(false);
    const [isOpenDeleteAudioConfDialog, setIsOpenDeleteAudioConfDialog] = useState(false);

    const [isFavoriteSwitch, setIsFavoriteSwitch] = useState(isFavorite);

    useEffect(() => {
        setCurrentIndex(queueIndex);
    }, [queueIndex]);

    // Handles toggling the isFavorite switch
    useEffect(() => {
        let temp = { ...tempAudioInfo };
        temp.isFavorite = isFavoriteSwitch;
        setTempAudioInfo(temp);
        setCanSubmitAudioChange(isFavoriteSwitch !== audioInfo.isFavorite);
    }, [isFavoriteSwitch]);

    // Checks for active changes in the change audio dialog
    const handleAudioChange = (e) => {
        let temp = { ...tempAudioInfo };
        temp[e.target.getAttribute("name")] = e.target.value;
        if (e.target.getAttribute("name") === "isFavorite") {
            temp.isFavorite = !temp.isFavorite;    // The complement is because of the way the headless ui toggle behaves with onChange and onClick
        }
        setTempAudioInfo(temp);
        if ((audioInfo.title || temp.title.length > 0) && (temp.title !== audioInfo.title || temp.isFavorite !== audioInfo.isFavorite)) {
            setCanSubmitAudioChange(true);
        } else {
            setCanSubmitAudioChange(false);
        }
    }

    const handleDeleteAudio = async () => {
        setIsOpenDeleteAudioConfDialog(false);
        try {
            // Remove doc
            await deleteDoc(doc(db, "audio", id));

            // Remove file
            const storage = getStorage();
            const fileRef = ref(storage, "audio/" + originalName + "." + fileType);
            deleteObject(fileRef).then(() => {
                console.log("Successfully deleted: " + title);
            }).catch((err) => {
                console.log("Unable to delete: " + title);
                console.log(err);
            });

            // Remove from playlists
            const q = query(collection(db, "playlists"), where("user", "==", user));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
                let data = document.data();
                for (let i = 0; i < data.audioList.length; i++) {
                    if (data.audioList[i].id === id) {
                        data.audioList.splice(i, 1);
                        await updateDoc(doc(db, "playlists", document.id), {
                            audioList: data.audioList
                        });
                    }
                }
            });

            // Update user's capacity
            const docRef = doc(db, "capacity", user);
            const docSnap = await getDoc(docRef);
            const currentCapacity = docSnap.data().capacity;
            await updateDoc(docRef, {
                capacity: currentCapacity - size,
            });

            // Remove from redux store
            dispatch(removeAudio(id));
            dispatch(removeFromPlaylists(id));

            // Clear queue
            dispatch(replaceQueue([queue[0]]));
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateAudioInfo = () => {
        setIsFavoriteSwitch(isFavorite);
        setTempAudioInfo(props);
        setAudioInfo(props);
        setCanSubmitAudioChange(false);
        setIsOpenUpdateAudioInfoDialog(true);
    }

    const handleSubmitUpdateAudioInfo = async (e) => {
        e.preventDefault();
        setIsOpenUpdateAudioInfoDialog(false);
        const matchingAudio = audioList.findIndex(element => element.id === tempAudioInfo.id);
        let tempAudios = [...audioList];
        let tempAudio = { ...tempAudios[matchingAudio] };
        tempAudio.name = tempAudioInfo.title;
        tempAudio.isFavorite = tempAudioInfo.isFavorite;

        // Update audio in Firebase Cloud Firestore Database and redux state
        try {
            console.log(tempAudioInfo);
            const audioRef = doc(db, "audio", tempAudioInfo.id);
            await updateDoc(audioRef, {
                name: tempAudioInfo.title,
                isFavorite: tempAudioInfo.isFavorite
            });
            tempAudios[matchingAudio] = tempAudio;
            dispatch(setAudio(tempAudios));

            // Remove from playlists
            const q = query(collection(db, "playlists"), where("user", "==", user));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (document) => {
                let data = document.data();
                for (let i = 0; i < data.audioList.length; i++) {
                    if (data.audioList[i].id === tempAudioInfo.id) {
                        data.audioList[i].name = tempAudioInfo.title;
                        await updateDoc(doc(db, "playlists", document.id), {
                            audioList: data.audioList
                        });
                    }
                }
            });

            // Remove from redux store playlists
            dispatch(editNameInPlaylists({
                id: tempAudioInfo.id,
                newName: tempAudioInfo.title
            }));

            setIsOpenUpdateAudioInfoDialogConf(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdateAudioInfoDialogConf(false), 3000); // Dismisses dialog after 3 seconds
        } catch (e) {
            console.log(e);
            setIsOpenUpdateAudioInfoDialogError(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdateAudioInfoDialogError(false), 3000); // Dismisses dialog after 3 seconds
        }
    }

    const handleClickDeleteAudio = () => {
        setIsOpenUpdateAudioInfoDialog(false);
        setIsOpenDeleteAudioConfDialog(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className={`bg-zinc-700 flex flex-row items-center my-3 px-2 shadow-md transition ease-in-out ${isSelected ? 'brightness-125 translate-x-2' : ''}`}>
            <div className="mr-2">
                <button className="flex hover:brightness-110" onClick={() => {
                    let audioObj = {
                        name: title,
                        audioSource: url,
                        audioDuration: duration,
                        user: user,
                        isFavorite: isFavorite,
                        currentIndex: currentIndex
                    };
                    dispatch(setIsLooping(false));
                    dispatch(setLoopStart(null));
                    if (queue[0]) { // If audio already exists in the queue
                        audioObj.currentIndex += 1;
                        dispatch(addAudioToStartOfList(audioObj));
                        dispatch(next());
                    } else {
                        dispatch(addAudioToStartOfList(audioObj));
                    }
                    deselect(id);
                }
                }>
                    <i className="material-icons">play_arrow</i>
                </button>
            </div>
            <div className="flex flex-grow items-center py-3 select-none hover:cursor-pointer" onClick={(e) => handleClick(e, id, isSelected)}>
                <div className="text-lg mr-4">
                    {title}
                </div>
                <div className="text-md text-zinc-400 ml-auto mr-3">
                    {duration}
                </div>
            </div>
            <div className="flex items-center ml-auto">
                <button className="flex mr-1" title="Add to queue" onClick={() => {
                    dispatch(addAudioToEndOfList({
                        name: title,
                        audioSource: url,
                        audioDuration: duration,
                        isFavorite: isFavorite,
                        user: user
                    }));
                    deselect(id);
                    setIsOpen(true);    // Triggers dialog
                    setTimeout(() => setIsOpen(false), 3000); // Dismisses dialog after 3 seconds
                }}>
                    <i className="material-icons">add</i>
                </button>
                <button onClick={() => handleUpdateAudioInfo()} className="self-center ml-auto" title="Edit">
                    <FontAwesomeIcon className="text-2xl m-2" icon={faEllipsisV} />
                </button>
            </div>

            <Transition
                show={isOpen}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 fixed bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-slate-600" onClose={() => setIsOpen(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Added {title} to queue</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update audio info dialog */}
            <Transition
                show={isOpenUpdateAudioInfoDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="max-w-md z-50 fixed left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 p-5 rounded shadow-md bg-zinc-900" onClose={() => setIsOpenUpdateAudioInfoDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="overflow-hidden text-xl">Update {title}</Dialog.Title>
                        <form autoComplete="off" className="flex flex-col" onSubmit={handleSubmit}>
                            <label htmlFor="name" className="hidden">Name:</label>
                            <input onChange={handleAudioChange} id="name" name="title" value={tempAudioInfo.title} type="text" className="w-full p-3 my-6 shadow-md bg-zinc-800 outline-none rounded-sm border-b-2 border-zinc-700 transition ease-in-out focus:border-zinc-500" />
                            <div className="flex flex-row flex-grow">
                                <p>Favorite:</p>
                                <Switch
                                    checked={isFavoriteSwitch}
                                    onChange={setIsFavoriteSwitch}
                                    id="isFavorite"
                                    name="isFavorite"
                                    value={isFavorite}
                                    className={`${isFavoriteSwitch ? 'bg-slate-600' : 'bg-slate-600 brightness-75'}
          ml-auto mb-4 relative inline-flex h-[26px] w-[51px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span
                                        className={`${isFavoriteSwitch ? 'translate-x-6' : 'translate-x-0'}
                                    pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                            </div>
                            <button disabled={!canSubmitAudioChange} onClick={handleSubmitUpdateAudioInfo} className="bg-slate-600 rounded-sm mt-2 py-1 cursor-pointer disabled:cursor-not-allowed disabled:brightness-75 transition ease-in-out">Update</button>
                            <hr className="mt-10 mb-5 border border-zinc-600" />
                            <div className="flex flex-row flex-grow items-center mb-3">
                                <p>Delete:</p>
                                <button onClick={handleClickDeleteAudio} className="px-2 ml-auto self-center border-2 border-red-500 text-red-500 rounded-sm hover:brightness-125">Delete</button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Delete audio confirmation dialog */}
            <Transition
                show={isOpenDeleteAudioConfDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 fixed left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 p-5 max-w-xl rounded shadow-md bg-zinc-900" onClose={() => setIsOpenDeleteAudioConfDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="text-xl">Are you sure you want to remove {title} from your account?</Dialog.Title>
                        <div className="flex flex-row flex-grow justify-between mt-8">
                            <button onClick={() => setIsOpenDeleteAudioConfDialog(false)} className="px-2 py-1 border-2 ">Cancel</button>
                            <button onClick={handleDeleteAudio} className="px-2 py-1 border-2 border-red-500 text-red-500">Delete</button>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update audio info confirmation dialog */}
            <Transition
                show={isOpenUpdateAudioInfoDialogConf}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 fixed bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded max-w-xl shadow-md bg-slate-600" onClose={() => setIsOpenUpdateAudioInfoDialogConf(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Updated info</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update audio info error dialog */}
            <Transition
                show={isOpenUpdateAudioInfoDialogError}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 fixed bottom-44 left-1/2 transform -translate-x-1/2 p-3 max-w-xl rounded shadow-md bg-red-700" onClose={() => setIsOpenUpdateAudioInfoDialogError(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Failed to update info</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Audio