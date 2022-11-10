import Image from 'next/image';
import React from 'react'
import { useEffect, useState, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { setTime } from '../../redux/slices/currentTimeSlice';

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
    const dispatch = useDispatch();
    const currentIndex = useSelector((state) => state.queueIndex.value);
    const current = useSelector((state) => state.queue.value[currentIndex]);
    const currentTime = useSelector((state) => state.currentTime.value);
    const isPaused = useSelector((state) => state.isPaused.value);

    // State
    const [waveSurfer, setWaveSurfer] = useState(false); // Indicates if the waveform has finished generating
    const [isLooping, setIsLooping] = useState(false);

    // Toggles the loop region
    const handleClickToggleLoop = async () => {
        if (wavesurfer.current) {
            if (isLooping) {
                setIsLooping(false);
                wavesurfer.current.clearRegions();
            } else {
                setIsLooping(true);
                const WaveSurferRegions = (await import("wavesurfer.js/dist/plugin/wavesurfer.regions")).default;
                wavesurfer.current.addPlugin(WaveSurferRegions.create({
                    regionsMinLength: 2,
                    regions: [
                        {
                            id: "loop_region",
                            start: 0,
                            end: 30,
                            loop: true,
                            color: 'rgba(253, 224, 71, 0.5)',
                            minLength: 1,
                        }
                    ],
                })).initPlugin('regions');
                wavesurfer.current.regions.list.loop_region.on('out', function () {
                    document.querySelector('audio').pause();
                    document.querySelector('audio').currentTime = wavesurfer.current.regions.list.loop_region.start;
                    document.querySelector('audio').play();
                });
                wavesurfer.current.regions.list.loop_region.on('remove', function () {
                    setIsLooping(false);
                });
            }
        }
    }

    // Seeks to start of loop
    const handleClickGoToStartOfLoop = () => {
        document.querySelector('audio').pause();
        document.querySelector('audio').currentTime = wavesurfer.current.regions.list.loop_region.start;
        document.querySelector('audio').play();
    }

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
            <div className="flex flex-row mb-5">
                {waveSurfer && current ? <button className={`${isLooping ? "bg-yellow-300 text-zinc-800" : "bg-zinc-600"} hover:brightness-110 hover:scale-105 transition ease-in-out p-3 rounded-md shadow-md`} onClick={handleClickToggleLoop}>Repeat section</button> : <div className="hidden"></div>}
                {waveSurfer && current && isLooping ? <button className="bg-zinc-600 hover:brightness-110 hover:scale-105 transition ease-in-out ml-3 p-3 rounded-md shadow-md" onClick={handleClickGoToStartOfLoop}>Go to start</button> : <div className="hidden"></div>}
            </div>
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