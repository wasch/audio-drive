import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Playlist from './Playlist';

const PlaylistsContainer = () => {

    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    // State
    const [search, setSearch] = useState("");
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        // TODO: fetch user's playlists
    });

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    const handleCreateNewPlaylist = () => {
        // TODO: create playlist popup 
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <button className="mr-4 p-2 min-w-fit text-lg shadow-md rounded-md bg-slate-600 transition ease-in-out hover:brightness-110" onClick={handleCreateNewPlaylist}>Create new playlist</button>
                <input type="text" onChange={handleSearchChange} placeholder="Search" className="w-full max-w-md p-3 shadow-md bg-zinc-800 outline-none rounded-sm border-2 border-zinc-700 transition ease-in-out focus:border-zinc-600" />
            </div>
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