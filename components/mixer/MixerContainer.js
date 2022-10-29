import React, { useEffect, useState } from 'react'
import Panner from './Panner'
import PlaybackSpeed from './PlaybackSpeed'
import WaveformVisualizer from './WaveformVisualizer'
import SpectrumAnalyzer from './SpectrumAnalyzer'

const MixerContainer = () => {

    return (
        <div>
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