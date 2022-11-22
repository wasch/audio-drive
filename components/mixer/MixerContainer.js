import React, { useEffect, useState } from 'react'
import Panner from './Panner'
import PlaybackSpeed from './PlaybackSpeed'
import WaveformVisualizer from './WaveformVisualizer'
import SpectrumAnalyzer from './SpectrumAnalyzer'
import Filters from './Filters'
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
        <div className={`px-2 md:p-5 md:bg-[#2c2c31] ${props.isExpanded ? "max-w-[992px]" : "flex flex-col w-full"}`}>
            {
                currentAudio ?
                    <div className="flex flex-row items-center">
                        <p className="bg-zinc-700 mb-2 md:my-2 p-5 rounded-md shadow-md text-2xl md:text-3xl flex-grow">{currentAudio.name}</p>
                        <div className="my-1 ml-auto p-3 pl-5 rounded-md justify-center hidden md:inline-flex cursor-pointer hover:brightness-125">
                            <button className={`text-6xl ${props.isExpanded ? "text-red-500 scale-110" : "transform -rotate-90 hover:scale-110"} transition ease-in-out`} title="Expanded View" onClick={handleClickToggleExpandedLayout}>
                                <FontAwesomeIcon icon={faSquareCaretLeft} />
                            </button>
                        </div>
                    </div>
                    : <div className="hidden"></div>
            }
            <WaveformVisualizer />
            <SpectrumAnalyzer />
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col md:w-1/4">
                    <div className="my-1 md:mr-1 bg-zinc-700 shadow-md rounded-md p-5 h-1/2">
                        <p className="text-2xl mb-1">Playback Speed</p>
                        <PlaybackSpeed />
                    </div>
                    <div className="my-1 md:mr-1 h-1/2 bg-zinc-700 shadow-md rounded-md p-5">
                        <Panner />
                    </div>
                </div>
                <div className="my-1 flex md:ml-1 md:w-3/4">
                    <Filters />
                </div>
            </div>
        </div>
    )
}

export default MixerContainer