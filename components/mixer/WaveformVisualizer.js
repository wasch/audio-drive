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
        progressColor: "#42b1fc",
        cursorColor: "OrangeRed",
        cursorWidth: 2,
        barWidth: 3,
        barRadius: 3,
        responsive: true,
        height: 200,
        normalize: true,
        partialRender: true,
    });

    // Redux
    const currentIndex = useSelector((state) => state.queueIndex.value);
    const current = useSelector((state) => state.queue.value[currentIndex]);
    const currentTime = useSelector((state) => state.currentTime.value);
    const isPaused = useSelector((state) => state.isPaused.value);

    // State
    const [waveSurfer, setWaveSurfer] = useState(false); // Indicates if the waveform has finished generating

    // Creates the waveform and adds event listeners
    const create = async () => {
        setWaveSurfer(false);
        const WaveSurfer = (await import("wavesurfer.js")).default;
        const WaveSurferCursor = (await import("wavesurfer.js/dist/plugin/wavesurfer.cursor")).default;
        const WaveSurferTimeline = (await import("wavesurfer.js/dist/plugin/wavesurfer.timeline")).default;

        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        wavesurfer.current.on('ready', function () {
            setWaveSurfer(true);
            wavesurfer.current.addPlugin(WaveSurferCursor.create({
                showTime: true,
                opacity: 1,
                customShowTimeStyle: {
                    'background-color': '#000',
                    color: '#fff',
                    padding: '2px',
                    'font-size': '14px'
                }
            })).initPlugin('cursor');
            wavesurfer.current.addPlugin(WaveSurferTimeline.create({
                container: "#timeline",
                primaryColor: '#fff',
                primaryFontColor: '#fff',
                secondaryFontColor: '#fff',
                notchPercentHeight: '30'
            })).initPlugin('timeline');
        });

        wavesurfer.current.setMute(true);

        wavesurfer.current.on('seek', function (position) {
            document.querySelector('audio').currentTime = position * wavesurfer.current.getDuration();
        });

        wavesurfer.current.load(current.audioSource);
    };

    // Generates the waveform when the current audio is updated
    useEffect(() => {
        if (current) {
            create();
            return () => {
                if (wavesurfer.current) {
                    wavesurfer.current.destroy();
                }
            };
        }
    }, [current]);

    useEffect(() => {
        if (wavesurfer.current && isPaused) {
            wavesurfer.current.pause()
        }
    }, [isPaused]);

    // Seeks the waveform
    useEffect(() => {
        if (waveSurfer && wavesurfer.current && wavesurfer.current.backend) {
            wavesurfer.current.play(currentTime);
        }
    }, [currentTime]);

    return (
        <div className="bg-zinc-700 shadow-md rounded-md p-5 mb-2">
            <div className={`${current && !waveSurfer ? "pointer-events-none" : ""} flex justify-center`}>
                {!current ? <div className="text-lg">No active audio</div> : <div className="hidden"></div>}
                {current && !waveSurfer ? <Image src="/images/loading.svg" height={100} width={100} /> : <div className="hidden"></div>}
            </div>
            <div id="waveform" ref={waveformRef} />
            <div id="timeline" className="mt-6 text-zinc-100"></div>
        </div>
    )
}

export default WaveformVisualizer