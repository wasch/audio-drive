import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { addPlaylist } from '../redux/slices/playlistsSlice'

import { db, fbAuth } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

import Playlist from './Playlist'

const PlaylistsContainer = () => {

    // Redux
    const dispatch = useDispatch();
    const playlistList = useSelector((state) => state.playlists.value);

    // State
    const [search, setSearch] = useState("");

    const [playlistName, setPlaylistName] = useState("");
    const [canSubmitPlaylist, setCanSubmitPlaylist] = useState(false);

    const [isViewingPlaylist, setIsViewingPlaylist] = useState(false);
    const [activePlaylist, setActivePlaylist] = useState(null);

    // Dialog states
    const [isOpenCreatePlaylistDialog, setIsOpenCreatePlaylistDialog] = useState(false);
    const [isOpenCreatePlaylistDialogConf, setIsOpenCreatePlaylistDialogConf] = useState(false);
    const [isOpenCreatePlaylistDialogError, setIsOpenCreatePlaylistDialogError] = useState(false);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const handlePlaylistNameChange = (e) => {
        setPlaylistName(e.target.value);
        if (e.target.value && e.target.value.length > 0) {
            setCanSubmitPlaylist(true);
        } else {
            setCanSubmitPlaylist(false);
        }
    }

    const handleCreateNewPlaylist = () => {
        setPlaylistName("");
        setCanSubmitPlaylist(false);
        setIsOpenCreatePlaylistDialog(true);
    }

    const handleSubmitNewPlaylist = async (e) => {
        e.preventDefault();
        let name = playlistName;
        setIsOpenCreatePlaylistDialog(false);

        const playlistObj = {
            name: name,
            audioList: [],
            isFavorite: false,
            user: fbAuth.currentUser.uid,
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

    const handleSelectPlaylist = (item) => {
        setIsViewingPlaylist(true);
        setActivePlaylist(item);
    }

    const handleBack = () => {
        setIsViewingPlaylist(false);
        setActivePlaylist(null);
    }

    return (
        <div className="flex flex-col grow">
            <div className={`${isViewingPlaylist ? "hidden" : ""}`}>
                <div className="flex flex-row justify-center">
                    <button className="mr-4 p-2 min-w-fit text-lg shadow-md rounded-md bg-slate-600 transition ease-in-out hover:brightness-110" onClick={handleCreateNewPlaylist}>Create new playlist</button>
                    <input type="text" onChange={handleSearchChange} placeholder="Search" className="w-full max-w-md p-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
                </div>

                <div className="flex justify-center mt-5">
                    {playlistList.length > 0 ?
                        <div className="w-full grid grid-cols-1 md:grid-cols-3">
                            {playlistList.map((item, index) => (
                                search === "" || item.name.toLowerCase().includes(search.toLowerCase()) ?      // If a playlist matches the search criteria or search is not being used, show it
                                    <div key={index} className="p-4 m-4 bg-zinc-700 shadow-md hover:cursor-pointer" onClick={() => handleSelectPlaylist(item)} >
                                        <h2 className="text-4xl">{item.name}</h2>
                                    </div>
                                    : <div key={index} className="hidden"></div>
                            ))}
                        </div>
                        : <h3 className="text-lg">No playlists created</h3>
                    }
                </div>
            </div>

            {isViewingPlaylist ?
                <Playlist
                    name={activePlaylist.name}
                    audioList={activePlaylist.audioList}
                    isFavorite={activePlaylist.isFavorite}
                    user={activePlaylist.user}
                    handleBack={handleBack}
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
                <Dialog className="z-50 absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-1/2 p-3 rounded shadow-md bg-zinc-900" onClose={() => setIsOpenCreatePlaylistDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="text-xl">Create new playlist</Dialog.Title>
                        <form autoComplete="off" className="flex flex-col" onSubmit={handleSubmitNewPlaylist}>
                            <label htmlFor="playlistName" className="hidden">Playlist name:</label>
                            <input onChange={handlePlaylistNameChange} id="playlistName" name="playlistName" type="text" placeholder="Name" className="w-full max-w-md p-3 my-6 shadow-md bg-zinc-800 outline-none rounded-sm border-b-2 border-zinc-700 transition ease-in-out focus:border-zinc-500" />
                            <input disabled={!canSubmitPlaylist} type="submit" value="Create" className="bg-slate-600 rounded-sm disabled:brightness-75 transition ease-in-out" />
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
                        <Dialog.Title>Created playlist {playlistName}</Dialog.Title>
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
                        <Dialog.Title>Failed to create playlist {playlistName}</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div>
    )
}

export default PlaylistsContainer