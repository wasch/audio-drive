import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Playlist from './Playlist';

const PlaylistsContainer = () => {

    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    // State
    const [search, setSearch] = useState("");
    const [playlistName, setPlaylistName] = useState("");
    const [canSubmitPlaylist, setCanSubmitPlaylist] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [isOpenCreatePlaylistDialog, setIsOpenCreatePlaylistDialog] = useState(false);
    const [isOpenCreatePlaylistDialogConf, setIsOpenCreatePlaylistDialogConf] = useState(false);

    useEffect(() => {
        // TODO: fetch user's playlists
    });

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

    const handleSubmitNewPlaylist = (e) => {
        e.preventDefault();
        let name = playlistName;
        console.log(name);
        setIsOpenCreatePlaylistDialog(false);
        setIsOpenCreatePlaylistDialogConf(true);    // Triggers dialog
        setTimeout(() => setIsOpenCreatePlaylistDialogConf(false), 3000); // Dismisses dialog after 3 seconds

        // TODO: Add playlist to database and show it in the ui
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <button className="mr-4 p-2 min-w-fit text-lg shadow-md rounded-md bg-slate-600 transition ease-in-out hover:brightness-110" onClick={handleCreateNewPlaylist}>Create new playlist</button>
                <input type="text" onChange={handleSearchChange} placeholder="Search" className="w-full max-w-md p-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
            </div>

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
                <Dialog className="z-50 absolute left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-zinc-900" onClose={() => setIsOpenCreatePlaylistDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="text-xl">Create new playlist</Dialog.Title>
                        <form autoComplete="off" className="flex flex-col" onSubmit={handleSubmitNewPlaylist}>
                            <label for="playlistName" className="hidden">Playlist name:</label>
                            <input onChange={handlePlaylistNameChange} id="playlistName" name="playlistName" type="text" placeholder="Name" className="w-full max-w-md p-3 my-6 shadow-md bg-zinc-800 outline-none rounded-sm border-b-2 border-zinc-700 transition ease-in-out focus:border-zinc-500" />
                            <input disabled={!canSubmitPlaylist} type="submit" value="Create" className="bg-slate-600 rounded-sm disabled:brightness-75 transition ease-in-out"/>
                        </form>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Create playlist dialog confirmation */}
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

            {playlists ?
                <div className="w-full">
                    {playlists.map((item, index) => (
                        search === "" || item.name.toLowerCase().includes(search.toLowerCase()) ?      // If the audio matches the search criteria or search is not being used, show it
                            <div key={index}>
                                <Playlist
                                    name={item.name}
                                    audioList={item.audioList}
                                />
                            </div>
                            : <div key={index}></div>
                    ))}
                </div>
                : <h3>No audio in library</h3>
            }
        </div>
    )
}

export default PlaylistsContainer