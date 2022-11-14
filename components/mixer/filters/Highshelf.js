import React from 'react'
import style from '../../../styles/filters.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setHighshelf } from '../../../redux/slices/filtersSlice';

const Highshelf = () => {

    // Redux
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters.value);

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

    return (
        <div>
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
    )
}

export default Highshelf