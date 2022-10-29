import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setHighShelfFreq, setHighShelfGain } from '../../redux/slices/eqSlices/highShelfSlice';

const Filters = () => {

    // Redux
    const dispatch = useDispatch();
    const highShelfValue = useSelector((state) => state.highShelf.value);

    // State
    const [highShelfFreqState, setHighShelfFreqState] = useState(4700)
    const [highShelfGainState, setHighShelfGainState] = useState(50)

    // High Shelf Frequency
    const handleResetHighShelfFreq = () => {
        dispatch(setHighShelfFreq(4700));
        setHighShelfFreqState(4700);
    }

    const handleHighShelfFreqChange = (e) => {
        let freqValue = e.target.value;
        dispatch(setHighShelfFreq(freqValue));
        setHighShelfFreqState(freqValue);
    }

    // High Shelf Gain
    const handleResetHighShelfGain = () => {
        dispatch(setHighShelfGain(50));
        setHighShelfGainState(50);
    }

    const handleHighShelfGainChange = (e) => {
        let gainValue = e.target.value;
        dispatch(setHighShelfGain(gainValue));
        setHighShelfGainState(gainValue);
    }

    useEffect(() => {
        if (highShelfValue.freq) setHighShelfFreqState(highShelfValue.freq);
        if (highShelfValue.gain) setHighShelfGainState(highShelfValue.gain);
    }, []);

    return (
        <div className="flex flex-col bg-zinc-700 shadow-md rounded-md p-5 my-1 md:mr-1">
            <p className="text-2xl mb-1">Filters (WIP)</p>
            {/* 
            
            <input className="h-full my-2" onChange={handleHighShelfFreqChange} type="range" id="highShelfFreqSlider" min="0" max="22000" value={highShelfFreqState} step="100" />
            <div className="flex flex-grow items-center justify-center mt-2">
                <p onClick={handleResetHighShelfFreq} className="text-xl hover:cursor-pointer">{highShelfFreqState}</p>
            </div>

            <input className="h-full my-2" onChange={handleHighShelfGainChange} type="range" id="highShelfGainSlider" min="-50" max="50" value={highShelfGainState} />
            <div className="flex flex-grow items-center justify-center mt-2">
                <p onClick={handleResetHighShelfGain} className="text-xl hover:cursor-pointer">{highShelfGainState}</p>
            </div>
            
            */}
            
        </div>
    )
}

export default Filters