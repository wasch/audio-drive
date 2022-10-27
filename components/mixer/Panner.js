import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPannerRef } from '../../redux/slices/pannerRefSlice';

const Panner = () => {

    // Redux
    const dispatch = useDispatch();
    const panValue = useSelector((state) => state.pannerRef.value);

    // State
    const [pannerValue, setPannerValue] = useState(0);

    const handleResetPan = () => {
        dispatch(setPannerRef(0));
        setPannerValue(0);
    }

    const handlePanChange = (e) => {
        let panValue = e.target.value;
        dispatch(setPannerRef(panValue));
        setPannerValue(panValue);
    }

    useEffect(() => {
        if (panValue) setPannerValue(panValue);
    }, []);

    return (
        <div className="bg-zinc-700 shadow-md rounded-md p-5">
            <p className="text-2xl mb-1">Panning</p>
            <input onChange={handlePanChange} type="range" id="panner" min="-1" max="1" value={pannerValue} step="0.01" />
            <p onClick={handleResetPan} className="hover:cursor-pointer">{pannerValue}</p>
        </div>
    )
}

export default Panner