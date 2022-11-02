import React, { useEffect, useState } from 'react'
import Panner from './Panner'
import PlaybackSpeed from './PlaybackSpeed'
import WaveformVisualizer from './WaveformVisualizer'
import SpectrumAnalyzer from './SpectrumAnalyzer'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { setIsExpandedLayout, toggleIsExpandedLayout } from '../../redux/slices/layoutSlice'

const MixerContainer = (props) => {

    // Redux
    const dispatch = useDispatch();
    const queue = useSelector((state) => state.queue.value);
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const currentAudio = queue[queueIndex];

    const handleClickToggleExpandedLayout = () => {
        dispatch(toggleIsExpandedLayout());
    }

    // Makes sure the layout doesn't stay expanded if
    // the user leaves the page
    useEffect(() => {
        return () => {
            dispatch(setIsExpandedLayout(false));
        };
    }, []);

    return (
        <div className={`px-2 md:p-5 md:bg-[#2c2c31] ${props.isExpanded ? "" : "flex flex-col w-full"}`}>
            {
                currentAudio ?
                    <div className="flex flex-row items-center">
                        <p className="bg-zinc-700 my-2 p-5 rounded-md shadow-md text-2xl md:text-3xl">Now playing: {currentAudio.name}</p>
                        <div className="my-1 ml-auto p-3 pl-5 rounded-md justify-center hidden md:inline-flex cursor-pointer hover:brightness-125">
                            <button className={`text-6xl ${props.isExpanded ? "text-red-500" : ""}`} title="Expanded View (experimental)" onClick={handleClickToggleExpandedLayout}>
                                <FontAwesomeIcon icon={faSquareCaretLeft} />
                            </button>
                        </div>
                    </div>
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