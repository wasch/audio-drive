import React from 'react'
import style from '../../../styles/filters.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setHighpass } from '../../../redux/slices/filtersSlice';

const Highpass = () => {

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

    return (
        <div className="text-center">
            <button className="mx-2 mb-1 py-1 text-xl">High-pass</button>
            <div className="flex flex-row -mb-5 justify-center w-36 relative">
                <div className="flex flex-col items-center absolute mr-14">
                    <p className="text-lg mb-2">Hz</p>
                    <input orient="vertical" className={style.vertSlider} type="range" min="0" max="3000" step="100" value={filters.highpass.freq} onChange={handleHighpassFreqChange} />
                    <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetHighpassFreq}>{filters.highpass.freq}</p>
                </div>
                <div className="flex flex-col items-center absolute ml-14">
                    <p className="text-lg mb-2">Q</p>
                    <input orient="vertical" className={style.vertSlider} type="range" min="0" max="10" step="0.1" value={filters.highpass.q} onChange={handleHighpassQChange} />
                    <p className="mt-2 text-xl hover:cursor-pointer" onClick={handleResetHighpassQ}>{filters.highpass.q}</p>
                </div>
            </div>
        </div>
    )
}

export default Highpass