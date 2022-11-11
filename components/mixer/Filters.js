import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setHighpass, setLowpass, setHighshelf, setLowshelf } from '../../redux/slices/filtersSlice';
import style from '../../styles/filters.module.css'

const Filters = () => {

    // Redux
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters.value);

    // Highpass frequency
    const handleHighpassFreqChange = (e) => {
        dispatch(setHighpass({ freq: e.target.value }));
    }

    const handleResetHighpassFreq = () => {
        dispatch(setHighpass({ freq: 0 }));
    }

    // Highpass Q
    const handleHighpassQChange = (e) => {
        dispatch(setHighpass({ q: e.target.value }));
    }

    const handleResetHighpassQ = () => {
        dispatch(setHighpass({ q: 0 }));
    }

    // Lowpass frequency
    const handleLowpassFreqChange = (e) => {
        dispatch(setLowpass({ freq: e.target.value }));
    }

    const handleResetLowpassFreq = () => {
        dispatch(setLowpass({ freq: 10000 }));
    }

    // Lowpass Q
    const handleLowpassQChange = (e) => {
        dispatch(setLowpass({ q: e.target.value }));
    }

    const handleResetLowpassQ = () => {
        dispatch(setLowpass({ q: 0 }));
    }

    // Highshelf frequency
    const handleHighshelfFreqChange = (e) => {
        dispatch(setHighshelf({ freq: e.target.value }));
    }

    const handleResetHighshelfFreq = () => {
        dispatch(setHighshelf({ freq: 800 }));
    }

    // Highshelf Q
    const handleHighshelfGainChange = (e) => {
        dispatch(setHighshelf({ gain: e.target.value }));
    }

    const handleResetHighshelfGain = () => {
        dispatch(setHighshelf({ gain: 0 }));
    }

    // Lowshelf frequency
    const handleLowshelfFreqChange = (e) => {
        dispatch(setLowshelf({ freq: e.target.value }));
    }

    const handleResetLowshelfFreq = () => {
        dispatch(setLowshelf({ freq: 0 }));
    }

    // Lowshelf Q
    const handleLowshelfGainChange = (e) => {
        dispatch(setLowshelf({ gain: e.target.value }));
    }

    const handleResetLowshelfGain = () => {
        dispatch(setLowshelf({ gain: 0 }));
    }

    return (
        <div className="flex flex-col bg-zinc-700 shadow-md rounded-md px-5 pt-5 pb-10 md:p-5 w-full">
            <p className="text-2xl mb-1">Filters</p>
            <div className="flex flex-row flex-grow justify-evenly">

                {/* High-pass filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-1 py-1 text-lg">High-pass</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Hz</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="0" max="3000" step="100" value={filters.highpass.freq} onChange={handleHighpassFreqChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetHighpassFreq}>{filters.highpass.freq}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Q</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="0" max="10" step="0.1" value={filters.highpass.q} onChange={handleHighpassQChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetHighpassQ}>{filters.highpass.q}</p>
                        </div>
                    </div>
                </div>

                {/* Low-pass filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-1 py-1 text-lg">Low-pass</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Hz</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="20" max="10000" step="10" value={filters.lowpass.freq} onChange={handleLowpassFreqChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetLowpassFreq}>{filters.lowpass.freq}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Q</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="0" max="10" step="0.1" value={filters.lowpass.q} onChange={handleLowpassQChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetLowpassQ}>{filters.lowpass.q}</p>
                        </div>
                    </div>
                </div>

                {/* High-shelf filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-1 py-1 text-lg">High-shelf</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Hz</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="800" max="5000" step="100" value={filters.highshelf.freq} onChange={handleHighshelfFreqChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetHighshelfFreq}>{filters.highshelf.freq}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Gain</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="-15" max="15" step="0.1" value={filters.highshelf.gain} onChange={handleHighshelfGainChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetHighshelfGain}>{filters.highshelf.gain}</p>
                        </div>
                    </div>
                </div>

                {/* Low-shelf filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-1 py-1 text-lg">Low-shelf</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Hz</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="0" max="220" step="1" value={filters.lowshelf.freq} onChange={handleLowshelfFreqChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetLowshelfFreq}>{filters.lowshelf.freq}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-lg mb-2">Gain</p>
                            <input orient="vertical" className={style.vertSlider} type="range" min="-50" max="50" step="0.1" value={filters.lowshelf.gain} onChange={handleLowshelfGainChange} />
                            <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetLowshelfGain}>{filters.lowshelf.gain}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Filters