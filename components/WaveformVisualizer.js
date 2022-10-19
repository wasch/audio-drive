import Image from 'next/image';
import React from 'react'
import { useEffect, useState, useRef } from 'react'

import { useSelector } from 'react-redux';

const WaveformVisualizer = () => {

    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);

    const formWaveSurferOptions = (ref) => ({
        container: ref,
        waveColor: "#eee",
        progressColor: "#0178FF",
        cursorColor: "OrangeRed",
        barWidth: 3,
        barRadius: 3,
        responsive: true,
        height: 200,
        normalize: true,
        partialRender: true
    });

    // Redux
    const currentIndex = useSelector((state) => state.queueIndex.value);
    const current = useSelector((state) => state.queue.value[currentIndex]);
    const currentTime = useSelector((state) => state.currentTime.value);

    // State
    const [waveSurfer, setWaveSurfer] = useState(false);

    const create = async () => {
        const WaveSurfer = (await import("wavesurfer.js")).default;

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        wavesurfer.current.on('ready', function () {
            setWaveSurfer(true);
        });
        wavesurfer.current.load(current.audioSource);
    };

    useEffect(() => {
        if (current) {
            create();
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [current]);

    useEffect(() => {
        if (waveSurfer && wavesurfer.current) {
            wavesurfer.current.setCurrentTime(currentTime);
        }
    }, [currentTime]);

    return (
        <div>
            <div className="flex justify-center">
                {!current ? <div className="text-lg">No active audio</div> : <div className="hidden"></div>}
                {current && !waveSurfer ? <Image src="/images/loading.svg" height={100} width={100} /> : <div className="hidden"></div>}
            </div>
            <div id="waveform" ref={waveformRef}/>
        </div>
    )
}

export default WaveformVisualizer