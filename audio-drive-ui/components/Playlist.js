import React from 'react'

import Audio from './Audio'

const Playlist = (props) => {

    const { name, audioList } = props;

    return (
        <div>
            <h3>{name}</h3>
            {audioList.map((item, index) => (
                <div key={index}>
                    <Audio
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