import React from 'react'
import style from '../../../styles/filters.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setLowshelf } from '../../../redux/slices/filtersSlice';

const Lowshelf = () => {

    // Redux
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters.value);

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
        <div className="text-center">
            <button className="mx-2 mb-1 py-1 text-xl">Low-shelf</button>
            <div className="flex flex-row -mb-5 justify-center w-36 relative">
                <div className="flex flex-col items-center absolute mr-14">
                    <p className="text-lg mb-2">Hz</p>
                    <input orient="vertical" className={style.vertSlider} type="range" min="0" max="220" step="1" value={filters.lowshelf.freq} onChange={handleLowshelfFreqChange} />
                    <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetLowshelfFreq}>{filters.lowshelf.freq}</p>
                </div>
                <div className="flex flex-col items-center absolute ml-14">
                    <p className="text-lg mb-2">Gain</p>
                    <input orient="vertical" className={style.vertSlider} type="range" min="-50" max="50" step="0.1" value={filters.lowshelf.gain} onChange={handleLowshelfGainChange} />
                    <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetLowshelfGain}>{filters.lowshelf.gain}</p>
                </div>
            </div>
        </div>
    )
}

export default Lowshelf