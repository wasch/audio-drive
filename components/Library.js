import Audio from './Audio'

import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

import { useSelector, useDispatch } from 'react-redux'
import { setAudio } from '../redux/slices/audioSlice'
import { setPlaylists } from '../redux/slices/playlistsSlice'

import { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Library = () => {

    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const audio = useSelector((state) => state.audio.value);
    const queue = useSelector((state) => state.queue.value);
    const playlists = useSelector((state) => state.playlists.value);

    // State
    const [search, setSearch] = useState("");
    const [playlistSearch, setPlaylistSearch] = useState("");
    const [libraryAudio, setLibraryAudio] = useState([]);
    const [selectedAudioCount, setSelectedAudioCount] = useState(0);
    const [prevSelectIndex, setPrevSelectIndex] = useState(null);

    // Dialog State
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdatePlaylistDialogConf, setIsOpenUpdatePlaylistDialogConf] = useState(false);
    const [isOpenUpdatePlaylistDialogError, setIsOpenUpdatePlaylistDialogError] = useState(false);

    // Fetch audio from redux and add it to library state
    useEffect(() => {
        setLibraryAudio(audio);
        setSelectedAudioCount(0);
        setPrevSelectIndex(null);
    }, [user, queue, audio]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const handlePlaylistSearchChange = (e) => {
        setPlaylistSearch(e.target.value);
    }

    function handleSelectAudio(e, url, isSelected) {
        const matchingAudio = audio.findIndex(element => element.audioSource === url);

        let selectCheck = !isSelected;
        let tempAudios = [...libraryAudio];

        if (e.shiftKey && prevSelectIndex !== null && prevSelectIndex !== matchingAudio) {   // Shift select, ignore if no previous select or if selecting the same audio
            if (prevSelectIndex < matchingAudio) { // Descending shift select
                for (let i = prevSelectIndex; i <= matchingAudio; i++) {
                    let tempAudio = { ...tempAudios[i] };
                    tempAudio.isSelected = selectCheck;
                    tempAudios[i] = tempAudio;
                }
            } else { // Ascending shift select
                for (let i = prevSelectIndex; i >= matchingAudio; i--) {
                    let tempAudio = { ...tempAudios[i] };
                    tempAudio.isSelected = selectCheck;
                    tempAudios[i] = tempAudio;
                }
            }
        } else {
            let tempAudio = { ...tempAudios[matchingAudio] };
            tempAudio.isSelected = selectCheck;
            tempAudios[matchingAudio] = tempAudio;
        }

        // Get number of selected audios
        let count = 0;
        for (let i in tempAudios) {
            if (tempAudios[i].isSelected) count++;
        }

        setLibraryAudio(tempAudios);
        setPrevSelectIndex(matchingAudio);
        setSelectedAudioCount(count);
    }

    function handleDeselectAudio(url) {
        const matchingAudio = audio.findIndex(element => element.audioSource === url);

        let selectCheck = false;
        setSelectedAudioCount(selectedAudioCount - 1);

        let tempAudios = [...libraryAudio];
        let tempAudio = { ...tempAudios[matchingAudio] };
        tempAudio.isSelected = selectCheck;
        tempAudios[matchingAudio] = tempAudio;
        setLibraryAudio(tempAudios);
    }

    const handleAddAudioToPlaylist = async (id) => {
        // Get selected audio
        let tempAudio = [];
        for (let i in libraryAudio) {
            if (libraryAudio[i].isSelected) tempAudio.push(libraryAudio[i]);
        }

        const matchingPlaylist = playlists.findIndex(element => element.id === id);
        let tempPlaylists = [...playlists];
        let tempPlaylist = { ...tempPlaylists[matchingPlaylist] };
        tempPlaylist.audioList = [...tempPlaylist.audioList, ...tempAudio];

        // Add playlist to Firebase Cloud Firestore Database and redux state
        try {
            const playlistsRef = doc(db, "playlists", id);
            await updateDoc(playlistsRef, {
                audioList: tempPlaylist.audioList
            });
            tempPlaylists[matchingPlaylist] = tempPlaylist;
            dispatch(setPlaylists(tempPlaylists));
            setIsOpenUpdatePlaylistDialogConf(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdatePlaylistDialogConf(false), 3000); // Dismisses dialog after 3 seconds
        } catch (e) {
            console.log(e);
            setIsOpenUpdatePlaylistDialogError(true);    // Triggers dialog
            setTimeout(() => setIsOpenUpdatePlaylistDialogError(false), 3000); // Dismisses dialog after 3 seconds
        }
    }

    return (
        <div className="flex flex-col items-center bg-[#2c2c31] p-5 rounded-md shadow-md">
            <button className={`absolute right-3 bottom-44 md:right-10 shadow-md transition ease-in-out ${selectedAudioCount === 0 ? "opacity-0" : ""}`} onClick={() => setIsOpen(true)} title="Add selected to playlist">
                <i className="material-icons flex text-6xl">add_circle</i>
            </button>
            <input type="text" onChange={handleSearchChange} placeholder="Search" className="self-center w-full max-w-md p-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
            {libraryAudio ?
                <div className="w-full">
                    {
                        libraryAudio.map((item, index) => (
                            search === "" || item.name.toLowerCase().includes(search.toLowerCase()) ?      // If the audio matches the search criteria or search is not being used, show it
                                <div key={index}>
                                    <Audio
                                        id={item.id}
                                        title={item.name}
                                        url={item.audioSource}
                                        duration={item.audioDuration}
                                        user={item.user}
                                        size={item.MBFileSize}
                                        isSelected={item.isSelected}
                                        handleClick={handleSelectAudio}
                                        deselect={handleDeselectAudio}
                                    />
                                </div>
                                : <div key={index} className="hidden"></div>
                        ))
                    }
                </div>
                : <h3>No audio in library</h3>
            }

            {/* Add selected audio to playlist dialog */}
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
                <Dialog className="z-50 absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-3  overflow-y-auto rounded shadow-md bg-zinc-900" onClose={() => setIsOpen(false)}>
                    <Dialog.Panel>
                        <Dialog.Title className="text-xl mb-3">Select playlist to add to</Dialog.Title>
                        <input type="text" onChange={handlePlaylistSearchChange} placeholder="Search" className="self-center w-full max-w-md p-3 mb-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
                        {
                            playlists.length > 0 ?
                                <div>
                                    {
                                        playlists.map((item, index) => {
                                            return (
                                                playlistSearch === "" || item.name.toLowerCase().includes(playlistSearch.toLowerCase()) ?      // If a playlist matches the search criteria or search is not being used, show it
                                                    <div key={index} onClick={() => handleAddAudioToPlaylist(item.id)} className="p-2 m-2 bg-zinc-700 shadow-md transition ease-in-out hover:brightness-110 hover:scale-105 hover:cursor-pointer">
                                                        <h2 className="text-2xl">{item.name}</h2>
                                                    </div>
                                                    : <div key={index} className="hidden"></div>
                                            )
                                        })
                                    }
                                </div>
                                : <h3 className="text-lg">No playlists created</h3>
                        }
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update playlist confirmation dialog */}
            <Transition
                show={isOpenUpdatePlaylistDialogConf}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-slate-600" onClose={() => setIsOpenUpdatePlaylistDialogConf(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Successfully updated playlist</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>

            {/* Update playlist error dialog */}
            <Transition
                show={isOpenUpdatePlaylistDialogError}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-red-700" onClose={() => setIsOpenUpdatePlaylistDialogError(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Failed to update playlist</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Library
