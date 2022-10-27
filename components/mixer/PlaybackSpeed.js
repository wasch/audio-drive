import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPlaybackSpeed, increment, decrement } from '../../redux/slices/playbackSpeedSlice';
import { toggleShouldMaintainPitch } from '../../redux/slices/maintainPitchSlice';

const Panner = () => {

    // Redux
    const dispatch = useDispatch();
    const speedValue = useSelector((state) => state.playbackSpeed.value);

    // State
    const [speed, setSpeed] = useState(1);
    const [maintainPitchIsToggled, setMaintainPitchIsToggled] = useState(false);

    const handleResetSpeed = () => {
        dispatch(setPlaybackSpeed(1));
    }

    const handlePlaybackSpeedChange = (e) => {
        let speedChange = e.target.value;
        dispatch(setPlaybackSpeed(speedChange));
    }

    const handleSlowdown = () => {
        dispatch(decrement());
    }

    const handleSpeedup = () => {
        dispatch(increment());
    }

    const handleToggleMaintainPitch = () => {
        dispatch(toggleShouldMaintainPitch());
        setMaintainPitchIsToggled(!maintainPitchIsToggled);
    }

    useEffect(() => {
        if (speedValue) setSpeed(speedValue);
    }, [speedValue]);

    return (
        <div className="bg-zinc-700 shadow-md rounded-md p-5 my-1 md:mx-1">
            <p className="text-2xl mb-1">Playback Speed</p>
            <input onChange={handlePlaybackSpeedChange} type="range" id="speedRange" min="0" max="2" value={speed} step="0.01" />
            <div className="flex flex-row flex-grow items-center">
                <button className="slowDown" title="Slow down (5%)" onClick={handleSlowdown}>
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/rotate-left.png" />
                    { /* Source: <a target="_blank" href="https://icons8.com/icon/78748/rotate-left">Rotate Left icon by Icons8</a> */}
                </button>
                <p onClick={handleResetSpeed} className="mx-1 hover:cursor-pointer">{Number.parseFloat(speed).toFixed(2) + "x"}</p>
                <button className="speedUp" title="Speed up (5%)" onClick={handleSpeedup}>
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/rotate-right.png" />
                    { /* Source: <a target="_blank" href="https://icons8.com/icon/78746/rotate-right">Rotate Right icon by Icons8</a> */}
                </button>
                <div className="flex flex-row ml-auto">
                    <input onChange={handleToggleMaintainPitch} type="checkbox" checked={maintainPitchIsToggled} id="maintainPitchToggle" name="maintainPitchToggle" className="ml-4 maintainPitchToggle" />
                    <label htmlFor="maintainPitchToggle" title="Maintain pitch when changing speed">
                        <img src="https://img.icons8.com/windows/32/FFFFFF/tuning-fork.png" />
                        { /* Source: <a target="_blank" href="https://icons8.com/icon/bSsj0HDWJRzb/tuning-fork">Tuning Fork icon by Icons8</a> */}
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Panner