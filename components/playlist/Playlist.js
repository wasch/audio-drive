import React from 'react'

import PlaylistAudio from './PlaylistAudio'

const Playlist = (props) => {

    const { name, audioList, handleBack, handlePlay, handleShufflePlay } = props;

    return (
        <div>
            <div className="flex flex-row flex-grow items-center mb-6">
                <h3 className="text-4xl">{name}</h3>
                <div className="flex flex-row items-center ml-auto">
                    <button className="flex mr-2 p-1 hover:cursor-pointer" title="Play" onClick={handlePlay}>
                        <i className="material-icons text-4xl">play_circle_filled</i>
                    </button>
                    <button className="flex p-1 hover:cursor-pointer" title="Shuffle play" onClick={handleShufflePlay}>
                        <i className="material-icons text-4xl">shuffle</i>
                    </button>
                    <button className="flex border-2 rounded-sm border-zinc-500 ml-5 p-1 hover:cursor-pointer" title="Back" onClick={handleBack}>
                        <i className="material-icons text-3xl">arrow_back</i>
                    </button>
                </div>
            </div>
            {audioList.map((item, index) => (
                <div key={index}>
                    <PlaylistAudio
                        title={item.name}
                        url={item.audioSource}
                        duration={item.audioDuration}
                        user={item.user}
                        size={item.MBFileSize}
                    />
                </div>
            ))}
        </div>
    )
}

export default Playlist