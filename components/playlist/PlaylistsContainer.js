import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { addPlaylist, setPlaylists } from '../../redux/slices/playlistsSlice'
import { setQueueIndex } from '../../redux/slices/queueIndexSlice'
import { replaceQueue } from '../../redux/slices/queueSlice'

import shuffler from '../../functions/shuffler';

import { db, fbAuth } from '../../firebase'
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

import Playlist from './Playlist'

import { Switch } from '@headlessui/react';
import { useEffect } from 'react';


import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setIsLooping, setLoopStart } from '../../redux/slices/loopSlice';

const PlaylistsContainer = () => {

    // Redux
    const dispatch = useDispatch();
    const playlistList = useSelector((state) => state.playlists.value);
    const queue = useSelector((state) => state.queue.value);

    // State
    const [search, setSearch] = useState("");

    const [tempPlaylistInfo, setTempPlaylistInfo] = useState({});
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [canSubmitPlaylist, setCanSubmitPlaylist] = useState(false);

    const [isViewingPlaylist, setIsViewingPlaylist] = useState(false);
    const [activePlaylist, setActivePlaylist] = useState(null);

    // Dialog states
    const [isOpenCreatePlaylistDialog, setIsOpenCreatePlaylistDialog] = useState(false);
    const [isOpenCreatePlaylistDialogConf, setIsOpenCreatePlaylistDialogConf] = useState(false);
    const [isOpenCreatePlaylistDialogError, setIsOpenCreatePlaylistDialogError] = useState(false);

    const [isOpenUpdatePlaylistInfoDialog, setIsOpenUpdatePlaylistInfoDialog] = useState(false);
    const [isOpenUpdatePlaylistInfoDialogConf, setIsOpenUpdatePlaylistInfoDialogConf] = useState(false);
    const [isOpenUpdatePlaylistInfoDialogError, setIsOpenUpdatePlaylistInfoDialogError] = useState(false);
    const [isOpenDeletePlaylistConfDialog, setIsOpenDeletePlaylistConfDialog] = useState(false);

    const [isFavoriteSwitch, setIsFavoriteSwitch] = useState(playlistInfo.isFavorite);


    // Handles toggling the isFavorite switch
    useEffect(() => {
        let temp = { ...tempPlaylistInfo };
        temp.isFavorite = isFavoriteSwitch;
        setTempPlaylistInfo(temp);
        setCanSubmitPlaylist(isFavoriteSwitch !== playlistInfo.isFavorite);
    }, [isFavoriteSwitch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    // Checks for active changes in the change playlist dialog
    const handlePlaylistChange = (e) => {
        let temp = { ...tempPlaylistInfo };
        temp[e.target.getAttribute("name")] = e.target.value;
        if (e.target.getAttribute("name") === "isFavorite") {
            temp.isFavorite = !temp.isFavorite;    // The complement is because of the way the headless ui toggle behaves with onChange and onClick
        }
        setTempPlaylistInfo(temp);
        if ((playlistInfo.name || temp.name.length > 0) && (temp.name !== playlistInfo.name || temp.isFavorite !== playlistInfo.isFavorite)) {
            setCanSubmitPlaylist(true);
        } else {
            setCanSubmitPlaylist(false);
        }
    }

    const handleCreateNewPlaylist = () => {
        setPlaylistInfo({});
        setCanSubmitPlaylist(false);
        setIsOpenCreatePlaylistDialog(true);
    }

    const handleSubmitNewPlaylist = async (e) => {
        e.preventDefault();
        const d = new Date();
        setIsOpenCreatePlaylistDialog(false);

        const playlistObj = {
            name: tempPlaylistInfo.name,
            audioList: [],
            isFavorite: false,
            user: fbAuth.currentUser.uid,
            timeCreated: d.toISOString()
        }

        // Add doc references for playlist in Firebase Cloud Firestore Database
        try {
            const res = await addDoc(collection(db, "playlists"), playlistObj);
            playlistObj.id = res.id;
            dispatch(addPlaylist(playlistObj));
            setIsOpenCreatePlaylistDialogConf(true);    // Triggers dialog
            setTimeout(() => setIsOpenCreatePlaylistDialogConf(false), 3000); // Dismisses dialog after 3 seconds
        } catch (e) {
            console.log(e);
            setIsOpenCreatePlaylistDialogError(true);    // Triggers dialog
            setTimeout(() => setIsOpenCreatePlaylistDialogError(false), 3000); // Dismisses dialog after 3 seconds
        }
    }

    const handleUpdatePlaylistInfo = (playlist) => {
        setIsFavoriteSwitch(playlist.isFavorite);
        setTempPlaylistInfo(playlist);
        setPlaylistInfo(playlist);
        setCanSubmitPlaylist(false);
        setIsOpenUpdatePlaylistInfoDialog(true);
    }

    const handleSubmitUpdatePlaylistInfo = async (e) => {
        e.preventDefault();
        setIsOpenUpdatePlaylistInfoDialog(false);
        const matchingPlaylist = playlistList.findIndex(element => element.id === tempPlaylistInfo.id);
        let tempPlaylists = [...playlistList];
        let tempPlaylist = { ...tempPlaylists[matchingPlaylist] };
        tempPlaylist.name = tempPlaylistInfo.name;
        tempPlaylist.isFavorite = tempPlaylistInfo.isFavorite;

        // Update playlist in Firebase Cloud Firestore Database and redux state
        try {
            const playlistsRef = doc(db, "playlists", tempPlaylistInfo.id);
            await updateDoc(playlistsRef, {
                name: tempPlaylistInfo.name,
                isFavorite: tempPlaylistInfo.isFavorite
            });
            tempPlaylists[matchingPlaylist] = tempPlaylist;
            dispatch(setPlaylists(tempPlaylists));
            setIsOpenUpdatePlaylistInfoDialogConf(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdatePlaylistInfoDialogConf(false), 3000); // Dismisses dialog after 3 seconds
        } catch (e) {
            console.log(e);
            setIsOpenUpdatePlaylistInfoDialogError(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdatePlaylistInfoDialogError(false), 3000); // Dismisses dialog after 3 seconds
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleSelectPlaylist = (item) => {
        setIsViewingPlaylist(true);
        setActivePlaylist(item);
    }

    const handleClickDeletePlaylist = () => {
        setIsOpenUpdatePlaylistInfoDialog(false);
        setIsOpenDeletePlaylistConfDialog(true);
    }

    const handleDeletePlaylist = async () => {
        setIsOpenDeletePlaylistConfDialog(false);
        const matchingPlaylist = playlistList.findIndex(element => element.id === tempPlaylistInfo.id);
        let tempPlaylists = [...playlistList];

        // Delete playlist in Firebase Cloud Firestore Database and redux state
        try {
            const playlistsRef = doc(db, "playlists", tempPlaylistInfo.id);
            await deleteDoc(playlistsRef);
            tempPlaylists.splice(matchingPlaylist, 1);
            dispatch(setPlaylists(tempPlaylists));
        } catch (e) {
            console.log(e);
            setIsOpenUpdatePlaylistInfoDialogError(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdatePlaylistInfoDialogError(false), 3000); // Dismisses dialog after 3 seconds
        }
    }

    const handleBack = () => {
        setIsViewingPlaylist(false);
        setActivePlaylist(null);
    }

    const handlePlay = () => {
        dispatch(setIsLooping(true));
        dispatch(setLoopStart(0));
        dispatch(replaceQueue(activePlaylist.audioList.slice().sort((a, b) => a.name.localeCompare(b.name))));
        dispatch(setQueueIndex(0));

        // Don't try and restart the audio if there is nothing in the queue
        if (queue[0]) {
            document.querySelector('audio').pause();
            document.querySelector('audio').currentTime = 0;
            document.querySelector('audio').play();
        }
    }

    const handleShufflePlay = () => {
        dispatch(setIsLooping(true));
        dispatch(setLoopStart(0));
        let tempPlaylist = activePlaylist.audioList.slice();
        tempPlaylist = shuffler(tempPlaylist);
        dispatch(replaceQueue(tempPlaylist));
        dispatch(setQueueIndex(0));

        // Don't try and restart the audio if there is nothing in the queue
        if (queue[0]) {
            document.querySelector('audio').pause();
            document.querySelector('audio').currentTime = 0;
            document.querySelector('audio').play();
        }
    }

    return (
        <div className="flex flex-col grow bg-[#2c2c31] p-5 rounded-md shadow-md">
            <div className={`${isViewingPlaylist ? "hidden" : ""}`}>
                <div className="flex flex-row justify-center mt-5">
                    <button className="mr-4 p-2 min-w-fit text-lg shadow-md rounded-md bg-slate-600 transition ease-in-out hover:brightness-110" onClick={handleCreateNewPlaylist}>Create new playlist</button>
                    <input type="text" onChange={handleSearchChange} placeholder="Search" className="w-full max-w-md p-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
                </div>

                <div className="flex justify-center mt-5">
                    {playlistList.length > 0 ?
                        <div>
                            {/* Favorites */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 justify-center">
                                {playlistList.map((item, index) => (
                                    item.isFavorite && (search === "" || item.name.toLowerCase().includes(search.toLowerCase())) ?      // If a playlist matches the search criteria or search is not being used, show it
                                        <div key={index} className="relative bg-zinc-700 py-4 px-1 m-4 shadow-md flex flex-row overflow-hidden">
                                            <div className="absolute top-0 right-0 border-t-yellow-300 border-t-[20px] border-x-[20px] border-y-[20px] border-x-zinc-700 border-r-0 border-b-0"></div>
                                            <div className="pl-4 overflow-hidden hover:cursor-pointer" onClick={() => handleSelectPlaylist(item)} >
                                                <h2 className="text-4xl py-1">{item.name}</h2>
                                            </div>
                                            <button onClick={() => handleUpdatePlaylistInfo(item)} className="self-center ml-auto">
                                                <FontAwesomeIcon className="text-2xl m-2 pl-2 pr-1" icon={faEllipsisV} />
                                            </button>
                                        </div>
                                        : <div key={index} className="hidden"></div>
                                ))}
                            </div>

                            {/* Non-favorites */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-3">
                                {playlistList.map((item, index) => (
                                    !item.isFavorite && (search === "" || item.name.toLowerCase().includes(search.toLowerCase())) ?      // If a playlist matches the search criteria or search is not being used, show it
                                        <div key={index} className="bg-zinc-700 py-3 px-1 m-4 shadow-md flex flex-row overflow-hidden">
                                            <div className="pl-4 overflow-hidden hover:cursor-pointer" onClick={() => handleSelectPlaylist(item)} >
                                                <h2 className="text-4xl py-1">{item.name}</h2>
                                            </div>
                                            <button onClick={() => handleUpdatePlaylistInfo(item)} className="self-center ml-auto">
                                                <FontAwesomeIcon className="text-2xl m-2 pl-2 pr-1" icon={faEllipsisV} />
                                            </button>
                                        </div>
                                        : <div key={index} className="hidden"></div>
                                ))}
                            </div>
                        </div>
                        : <h3 className="text-lg">No playlists created</h3>
                    }
                </div>
            </div>

            {
                isViewingPlaylist ?
                    <Playlist
                        id={activePlaylist.id}
                        name={activePlaylist.name}
                        audioList={activePlaylist.audioList}
                        isFavorite={activePlaylist.isFavorite}
                        user={activePlaylist.user}
                        handleBack={handleBack}
                        handlePlay={handlePlay}
                        handleShufflePlay={handleShufflePlay}
                    />
                    : <div className="hidden"></div>
            }

            {/* Create playlist dialog */}
            <Transition
                show={isOpenCreatePlaylistDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="max-w-md z-50 absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 p-3 rounded shadow-md bg-zinc-900" onClose={() => setIsOpenCreatePlaylistDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="text-xl">Create new playlist</Dialog.Title>
                        <form autoComplete="off" className="flex flex-col" onSubmit={handleSubmitNewPlaylist}>
                            <label htmlFor="playlistName" className="hidden">Playlist name:</label>
                            <input onChange={handlePlaylistChange} id="playlistName" name="name" type="text" placeholder="Name" className="w-full p-3 my-6 shadow-md bg-zinc-800 outline-none rounded-sm border-b-2 border-zinc-700 transition ease-in-out focus:border-zinc-500" />
                            <input disabled={!canSubmitPlaylist} type="submit" value="Create" className="bg-slate-600 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:brightness-75 transition ease-in-out" />
                        </form>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Create playlist confirmation dialog */}
            <Transition
                show={isOpenCreatePlaylistDialogConf}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-slate-600" onClose={() => setIsOpenCreatePlaylistDialogConf(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Created playlist {playlistInfo.name}</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Create playlist error dialog */}
            <Transition
                show={isOpenCreatePlaylistDialogError}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-red-700" onClose={() => setIsOpenCreatePlaylistDialogError(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Failed to create playlist {playlistInfo.name}</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>


            {/* Update playlist info dialog */}
            <Transition
                show={isOpenUpdatePlaylistInfoDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="max-w-md z-50 absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 p-5 rounded shadow-md bg-zinc-900" onClose={() => setIsOpenUpdatePlaylistInfoDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="overflow-hidden text-xl">Update playlist {playlistInfo.name}</Dialog.Title>
                        <form autoComplete="off" className="flex flex-col" onSubmit={handleSubmit}>
                            <label htmlFor="playlistName" className="hidden">Playlist name:</label>
                            <input onChange={handlePlaylistChange} id="playlistName" name="name" value={tempPlaylistInfo.name} type="text" className="w-full p-3 my-6 shadow-md bg-zinc-800 outline-none rounded-sm border-b-2 border-zinc-700 transition ease-in-out focus:border-zinc-500" />
                            <div className="flex flex-row flex-grow">
                                <p>Favorite:</p>
                                <Switch
                                    checked={isFavoriteSwitch}
                                    onChange={setIsFavoriteSwitch}
                                    id="isFavorite"
                                    name="isFavorite"
                                    value={tempPlaylistInfo.isFavorite}
                                    className={`${isFavoriteSwitch ? 'bg-slate-600' : 'bg-slate-600 brightness-75'}
          ml-auto mb-4 relative inline-flex h-[26px] w-[51px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span
                                        className={`${isFavoriteSwitch ? 'translate-x-6' : 'translate-x-0'}
                                    pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                            </div>
                            <button disabled={!canSubmitPlaylist} onClick={handleSubmitUpdatePlaylistInfo} className="bg-slate-600 rounded-sm mt-2 py-1 cursor-pointer disabled:cursor-not-allowed disabled:brightness-75 transition ease-in-out">Update</button>
                            <hr className="mt-10 mb-5 border border-zinc-600" />
                            <div className="flex flex-row flex-grow items-center mb-3">
                                <p>Delete playlist:</p>
                                <button onClick={handleClickDeletePlaylist} className="px-2 ml-auto self-center border-2 border-red-500 text-red-500 rounded-sm hover:brightness-125">Delete</button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Delete playlist confirmation dialog */}
            <Transition
                show={isOpenDeletePlaylistConfDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 p-5  rounded shadow-md bg-zinc-900" onClose={() => setIsOpenDeletePlaylistConfDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="text-xl">Are you sure you want to delete playlist {playlistInfo.name}?</Dialog.Title>
                        <div className="flex flex-row flex-grow justify-between mt-8">
                            <button onClick={() => setIsOpenDeletePlaylistConfDialog(false)} className="px-2 py-1 border-2 ">Cancel</button>
                            <button onClick={handleDeletePlaylist} className="px-2 py-1 border-2 border-red-500 text-red-500">Delete</button>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update playlist info confirmation dialog */}
            <Transition
                show={isOpenUpdatePlaylistInfoDialogConf}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-slate-600" onClose={() => setIsOpenUpdatePlaylistInfoDialogConf(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Updated playlist {playlistInfo.name}</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update playlist info error dialog */}
            <Transition
                show={isOpenUpdatePlaylistInfoDialogError}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-red-700" onClose={() => setIsOpenUpdatePlaylistInfoDialogError(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Failed to update playlist {playlistInfo.name}</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div >
    )
}

export default PlaylistsContainer