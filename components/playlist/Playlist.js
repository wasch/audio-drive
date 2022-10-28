import { Dialog, Transition } from '@headlessui/react';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState, Fragment } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../firebase';
import { setPlaylists } from '../../redux/slices/playlistsSlice';

import PlaylistAudio from './PlaylistAudio'

const Playlist = (props) => {

    const { id, name, audioList, handleBack, handlePlay, handleShufflePlay } = props;

    // Redux
    const dispatch = useDispatch();
    const playlists = useSelector((state) => state.playlists.value);

    // State
    const [playlistAudio, setPlaylistAudio] = useState(audioList);

    // Dialog state
    const [isOpenRemoveAudioFromPlaylistErrorDialog, setIsOpenRemoveAudioFromPlaylistErrorDialog] = useState(false);

    // Update audio when changed
    useEffect(() => {
        const matchingPlaylist = playlists.findIndex(element => element.id === id);
        setPlaylistAudio(playlists[matchingPlaylist].audioList);
    }, [playlists]);

    const handleRemoveAudio = async (audioId) => {
        const matchingPlaylist = playlists.findIndex(element => element.id === id);
        let tempPlaylists = playlists.slice();
        let tempPlaylist = structuredClone(tempPlaylists[matchingPlaylist]);    // Deep clone object
        let tempAudioList = tempPlaylist.audioList.slice();
        const matchingAudio = tempAudioList.findIndex(element => element.id === audioId);
        tempAudioList.splice(matchingAudio, 1);

        // Update playlist in Firebase Cloud Firestore Database and redux state
        try {
            const playlistsRef = doc(db, "playlists", id);
            await updateDoc(playlistsRef, {
                audioList: tempAudioList
            });
            tempPlaylist.audioList.splice(matchingAudio, 1);
            tempPlaylists.splice(matchingPlaylist, 1, tempPlaylist);
            dispatch(setPlaylists(tempPlaylists));
        } catch (e) {
            console.log(e);
            setIsOpenRemoveAudioFromPlaylistErrorDialog(true);    // Triggers dialog
            setTimeout(() => setIsOpenRemoveAudioFromPlaylistErrorDialog(false), 3000); // Dismisses dialog after 3 seconds
        }
    }

    return (
        <div>
            <div className="relative flex flex-col flex-grow mb-6">
                <div className="w-full overflow-scroll">
                    <p className="text-4xl py-1">{name}</p>
                </div>
                <div className="flex flex-row mt-4 mr-auto">
                    <button className="flex mr-2 p-1 hover:cursor-pointer" title="Play" onClick={handlePlay}>
                        <i className="material-icons text-4xl">play_circle_filled</i>
                    </button>
                    <button className="flex p-1 hover:cursor-pointer" title="Shuffle play" onClick={handleShufflePlay}>
                        <i className="material-icons text-4xl">shuffle</i>
                    </button>
                </div>
                <button className="absolute top-0 right-0 rounded-sm bg-[#2c2c31] z-10 py-1 hover:cursor-pointer" title="Back" onClick={handleBack}>
                    <i className="material-icons text-4xl">arrow_back</i>
                </button>
            </div>
            {playlistAudio.map((item, index) => (
                <div key={index}>
                    <PlaylistAudio
                        playlistId={id}
                        id={item.id}
                        title={item.name}
                        url={item.audioSource}
                        duration={item.audioDuration}
                        user={item.user}
                        size={item.MBFileSize}
                        handleRemoveAudio={handleRemoveAudio}
                    />
                </div>
            ))}

            {/* Remove audio from playlist error dialog */}
            <Transition
                show={isOpenRemoveAudioFromPlaylistErrorDialog}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-red-700" onClose={() => setIsOpenRemoveAudioFromPlaylistErrorDialog(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Failed to update playlist</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Playlist