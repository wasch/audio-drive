import React, { useEffect, useState } from 'react'
import Panner from './Panner'
import PlaybackSpeed from './PlaybackSpeed'
import WaveformVisualizer from './WaveformVisualizer'

const MixerContainer = () => {

    return (
        <div>
            <WaveformVisualizer />
            <div className="flex flex-row">
                <Panner />
                <PlaybackSpeed />
            </div>
        </div>
    )
}

export default MixerContainer