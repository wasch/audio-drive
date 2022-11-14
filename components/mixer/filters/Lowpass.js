import React from 'react'
import style from '../../../styles/filters.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setLowpass } from '../../../redux/slices/filtersSlice';

const Lowpass = () => {

    // Redux
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters.value);

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

    return (
        <div>
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
    )
}

export default Lowpass