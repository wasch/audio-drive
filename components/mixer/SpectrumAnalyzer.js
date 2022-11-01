import React, { useEffect, useState } from 'react'

const SpectrumAnalyzer = () => {

    // State
    const [size, setSize] = useState();

    // Handles responsive(ish) design of canvas. HTML/JS must be used
    // instead of CSS, CSS will make the drawn canvas blurry :(
    useEffect(() => {
        try {
            if (document && document.getElementById('spectrumContainer')) {
                let containerWidth = document.getElementById('spectrumContainer').offsetWidth;
                if (containerWidth > 700) {
                    setSize(containerWidth * 0.96);
                } else if (containerWidth > 500) {
                    setSize(containerWidth * 0.93);
                } else {
                    setSize(containerWidth * 0.9);
                }

                window.addEventListener('resize', () => {
                    if (document && document.getElementById('spectrumContainer')) {
                        containerWidth = document.getElementById('spectrumContainer').offsetWidth;
                        if (containerWidth > 700) {
                            setSize(containerWidth * 0.96);
                        } else if (containerWidth > 500) {
                            setSize(containerWidth * 0.93);
                        } else {
                            setSize(containerWidth * 0.9);
                        }
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    }, []);

    return (
        <div id="spectrumContainer" className="bg-zinc-700 shadow-md rounded-md p-5 mb-1">
            <canvas width={size} id="audioCanvas"></canvas>
        </div>
    )
}

export default SpectrumAnalyzer