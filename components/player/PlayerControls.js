import React, { useEffect, Fragment, useState, useRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import { Popover, Transition } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux'
import { next, previous } from '../../redux/slices/queueIndexSlice'
import { increment, decrement, setPlaybackSpeed } from '../../redux/slices/playbackSpeedSlice'
import { toggleShouldMaintainPitch } from '../../redux/slices/maintainPitchSlice'
import { setTime } from '../../redux/slices/currentTimeSlice'
import { setIsPaused } from '../../redux/slices/pausedSlice'

const PlayerControls = (props) => {

  const audioRef = useRef(null);

  // Redux
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.queueIndex.value);
  const queue = useSelector((state) => state.queue.value);
  const playbackSpeed = useSelector((state) => state.playbackSpeed.value);
  const panValue = useSelector((state) => state.pannerRef.value);

  // State
  const [maintainPitchIsToggled, setMaintainPitchIsToggled] = useState(false);
  const [audioAnalyser, setAudioAnalyser] = useState(null);
  const [playStatus, setPlayStatus] = useState('PAUSED');
  const [isDrawing, setIsDrawing] = useState(false);

  // Ref
  const audioCtx = useRef();
  const audioTag = useRef();
  const track = useRef();

  useEffect(() => {
    // Enables next and previous media keys (play and pause work by default)
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      console.log(queueIndex);
      console.log(queue.length);
      if (queueIndex + 1 < queue.length) dispatch(next());
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {  // Restarts audio if current time is over 3 seconds, goes to previous audio otherwise
      if (document.querySelector('audio').currentTime > 3) {
        document.querySelector('audio').pause();
        document.querySelector('audio').currentTime = 0;
        document.querySelector('audio').play();
      } else {
        dispatch(previous());
      }
    });
  }, [queue, queueIndex]);

  // Setup audio context
  useEffect(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  // Setup web audio api effects
  useEffect(() => {
    if (audioCtx.current) {
      if (!audioTag.current) audioTag.current = document.querySelector('audio');
      if (!track.current) track.current = audioCtx.current.createMediaElementSource(audioTag.current);

      // TODO: Filters

      // Panning
      const pannerOptions = { pan: panValue };
      const panner = new StereoPannerNode(audioCtx.current, pannerOptions);

      // Analyzer
      let analyser;
      if (!audioAnalyser) {
        analyser = audioCtx.current.createAnalyser();
        analyser.fftSize = 256;
        setAudioAnalyser(analyser);
      } else {
        analyser = audioAnalyser;
      }

      track.current.connect(panner);
      panner.connect(analyser);
      analyser.connect(audioCtx.current.destination);
    }
    return () => {
      track.current.disconnect();
    }
  }, [audioCtx.current, panValue]);

  useEffect(() => {
    if (audioAnalyser && !isDrawing) {
      draw();
      setIsDrawing(true);   // Don't draw over itself
    }
  }, [playStatus]);

  // Draws the audio visualizer using a canvas
  function draw() {
    const canvas = document.getElementById("audioCanvas");
    if (canvas) {
      try {
        let canvasHeight = canvas.height;
        let canvasWidth = canvas.width;
        let canvasCtx = canvas.getContext("2d");
        const bufferLength = audioAnalyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        audioAnalyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = "rgb(63, 63, 70)";
        canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);

        const barWidth = (canvasWidth / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          canvasCtx.fillStyle = `rgb(70, 85, 250)`;
          canvasCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      } catch (error) {
        console.log(error);
      }
    }
    window.requestAnimationFrame(draw);
  }

  const handleSlowdown = () => {
    dispatch(decrement());
  }

  const handleSpeedup = () => {
    dispatch(increment());
  }

  const handleResetSpeed = () => {
    dispatch(setPlaybackSpeed(1));
  }

  const handleToggleMaintainPitch = () => {
    dispatch(toggleShouldMaintainPitch());
    setMaintainPitchIsToggled(!maintainPitchIsToggled);
  }

  const handleRestart = () => {
    document.querySelector('audio').pause();
    document.querySelector('audio').currentTime = 0;
    document.querySelector('audio').play();
  }

  return (
    <div>
      <AudioPlayer
        id="audioPlayer"
        ref={audioRef}
        crossOrigin="anonymous"
        autoPlay
        src={props.url}
        onPlay={(e) => {
          dispatch(setIsPaused(false));
          setPlayStatus('PLAYING');
        }}
        onPause={(e) => {
          dispatch(setIsPaused(true));
          setPlayStatus('PAUSED');
        }}
        onEnded={(e) => { if (queueIndex < queue.length - 1) dispatch(next()); }}   // Don't increment the queueIndex if there is no more audio in the queue
        onClickNext={(e) => { if (queueIndex + 1 < queue.length) dispatch(next()); }}
        onClickPrevious={(e) => {
          if (document.querySelector('audio').currentTime > 3) {
            handleRestart();
          } else {
            dispatch(previous())
          }
        }}
        onListen={(e) => {
          dispatch(setTime(document.querySelector('audio').currentTime));
        }}
        volume={0.20}
        // other props here
        listenInterval={10}
        customAdditionalControls={
          [
            RHAP_UI.LOOP,
            <Popover as="div" key="popover" className="flex mt-0.5 -mr-6 md:mr-0">
              <div>
                <Popover.Button title="Other controls">
                  <i className="material-icons">more_vert</i>
                </Popover.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Popover.Panel className="flex flex-row justify-center items-center absolute border-2 border-zinc-700 rounded-md px-2 my-1 w-52 h-10 -translate-y-3 translate-x-6 bg-zinc-900 shadow-md z-10">
                  <button className="slowDown" title="Slow down (5%)" onClick={handleSlowdown}>
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/rotate-left.png" />
                    { /* Source: <a target="_blank" href="https://icons8.com/icon/78748/rotate-left">Rotate Left icon by Icons8</a> */}
                  </button>
                  <p onClick={handleResetSpeed} className="mx-1 hover:cursor-pointer">{Number.parseFloat(playbackSpeed).toFixed(2) + "x"}</p>
                  <button className="speedUp" title="Speed up (5%)" onClick={handleSpeedup}>
                    <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/rotate-right.png" />
                    { /* Source: <a target="_blank" href="https://icons8.com/icon/78746/rotate-right">Rotate Right icon by Icons8</a> */}
                  </button>
                  <div className="border border-l-2 border-zinc-700 h-full ml-4"></div>
                  <div className="flex flex-row">
                    <input onChange={handleToggleMaintainPitch} type="checkbox" checked={maintainPitchIsToggled} id="maintainPitchToggle" name="maintainPitchToggle" className="ml-4 maintainPitchToggle" />
                    <label htmlFor="maintainPitchToggle" title="Maintain pitch when changing speed">
                      <img src="https://img.icons8.com/windows/32/FFFFFF/tuning-fork.png" />
                      { /* Source: <a target="_blank" href="https://icons8.com/icon/bSsj0HDWJRzb/tuning-fork">Tuning Fork icon by Icons8</a> */}
                    </label>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          ]
        }
        customVolumeControls={[
          <div className="md:ml-4" key="spacer"></div>,
          RHAP_UI.VOLUME
        ]}
        showSkipControls
        autoPlayAfterSrcChange
      />
    </div>
  )
}

export default PlayerControls