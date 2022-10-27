import React, { useEffect, useState } from 'react'
import Panner from './Panner'
import WaveformVisualizer from './WaveformVisualizer'

const MixerContainer = () => {

    // State
    const [audioRef, setAudioRef] = useState(null);
    const [audioContext, setAudioContext] = useState(null);

    return (
        <div>
            <WaveformVisualizer />
            <div className="flex flex-row">
                <Panner 
                    audioContext={audioContext}
                    audioRef={audioRef}
                />
            </div>
        </div>
    )
}

export default MixerContainer