import React from 'react'

import PlaylistAudio from './PlaylistAudio'

const Playlist = (props) => {

    const { name, audioList, handleBack } = props;

    return (
        <div className="">
            <div className="flex flex-row items-center mb-6">
                <h3 className="text-4xl">{name}</h3>
                <button className="flex ml-auto border-2 rounded-md hover:cursor-pointer" title="Back" onClick={handleBack}>
                    <i className="material-icons text-3xl">arrow_back</i>
                </button>
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