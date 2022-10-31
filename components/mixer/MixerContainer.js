import React, { useEffect, useState } from 'react'
import Panner from './Panner'
import PlaybackSpeed from './PlaybackSpeed'
import WaveformVisualizer from './WaveformVisualizer'
import SpectrumAnalyzer from './SpectrumAnalyzer'
import { useSelector } from 'react-redux'

const MixerContainer = () => {

    const queue = useSelector((state) => state.queue.value);
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const currentAudio = queue[queueIndex];

    return (
        <div>
            {
                currentAudio ?
                    <p className="bg-zinc-700 my-2 p-5 rounded-md shadow-md text-2xl md:text-3xl">Now playing: {currentAudio.name}</p>
                    : <div className="hidden"></div>
            }
            <WaveformVisualizer />
            <SpectrumAnalyzer />
            <div className="flex flex-col md:flex-row">
                <PlaybackSpeed />
                <Panner />
            </div>
        </div>
    )
}

export default MixerContainer