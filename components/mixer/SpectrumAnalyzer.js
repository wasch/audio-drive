import React, { useEffect, useState } from 'react'

const SpectrumAnalyzer = () => {

    // State
    const [size, setSize] = useState();

    // Handles responsive(ish) design of canvas. HTML/JS must be used
    // instead of CSS, CSS will make the drawn canvas blurry :(
    useEffect(() => {
        let containerWidth = document.getElementById('spectrumContainer').offsetWidth;
        if (containerWidth > 700) {
            setSize(containerWidth * 0.96);
        } else if (containerWidth > 500) {
            setSize(containerWidth * 0.93);
        } else {
            setSize(containerWidth * 0.9);
        }

        window.addEventListener('resize', () => {
            containerWidth = document.getElementById('spectrumContainer').offsetWidth;
            if (containerWidth > 700) {
                setSize(containerWidth * 0.96);
            } else if (containerWidth > 500) {
                setSize(containerWidth * 0.93);
            } else {
                setSize(containerWidth * 0.9);
            }
        });
    }, []);

    return (
        <div id="spectrumContainer" className="bg-zinc-700 shadow-md rounded-md p-5 mb-1">
            <canvas width={size} id="audioCanvas"></canvas>
        </div>
    )
}

export default SpectrumAnalyzer