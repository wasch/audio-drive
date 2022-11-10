import React, { useEffect, Fragment, useState, useRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import { Popover, Transition } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux'
import { next, previous, setQueueIndex } from '../../redux/slices/queueIndexSlice'
import { increment, decrement, setPlaybackSpeed } from '../../redux/slices/playbackSpeedSlice'
import { toggleShouldMaintainPitch } from '../../redux/slices/maintainPitchSlice'
import { setTime } from '../../redux/slices/currentTimeSlice'
import { setIsPaused } from '../../redux/slices/pausedSlice'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { setVolume } from '../../redux/slices/volumeSlice'
import PlaybackSpeed from '../mixer/PlaybackSpeed'

const PlayerControls = (props) => {

  // Redux
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.queueIndex.value);
  const queue = useSelector((state) => state.queue.value);
  const playbackSpeed = useSelector((state) => state.playbackSpeed.value);
  const maintainPitchValue = useSelector((state) => state.maintainPitch.value);
  const panValue = useSelector((state) => state.pannerRef.value);
  const loopInfo = useSelector((state) => state.loopInfo.value);
  const user = useSelector((state) => state.user.value);
  const volume = useSelector((state) => state.volume.value);

  // State
  const [audioAnalyser, setAudioAnalyser] = useState(null);
  const [audioGainNode, setAudioGainNode] = useState(null);
  const [playStatus, setPlayStatus] = useState('PAUSED');
  const [isDrawing, setIsDrawing] = useState(false);

  // Ref
  const audioCtx = useRef();
  const track = useRef();

  useEffect(() => {
    // Enables next and previous media keys (play and pause work by default)
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (loopInfo.isLooping && queueIndex === queue.length - 1) { // If looping and reached end of loop, return to start of loop 
        dispatch(setQueueIndex(loopInfo.loopStart));
      } else if (queueIndex + 1 < queue.length) dispatch(next());
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {  // Restarts audio if current time is over 3 seconds, goes to previous audio otherwise
      if (document.querySelector('audio').currentTime > 3) {
        document.querySelector('audio').pause();
        document.querySelector('audio').currentTime = 0;
        document.querySelector('audio').play();
      } else if (queueIndex !== loopInfo.loopStart) { // Don't leave the loop if looping
        dispatch(previous());
      }
    });
  }, [queue, queueIndex]);

  // Set volume
  useEffect(() => {
    // Add doc references for volume in Firebase Cloud Firestore Database
    document.querySelector('audio').volume = volume;
    if (user) {
      async function setVolume() {
        try {
          await setDoc(doc(db, 'volume', user.uid), {
            volume: volume
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
      setVolume();
    }
  }, [volume]);

  // Setup audio context
  useEffect(() => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
  }, []);

  // Setup web audio api effects
  useEffect(() => {
    if (audioCtx.current) {
      if (!track.current) track.current = audioCtx.current.createMediaElementSource(document.querySelector('audio'));

      // TODO: Filters

      // Panning
      const pannerOptions = { pan: panValue };
      const panner = new StereoPannerNode(audioCtx.current, pannerOptions);

      // Analyzer
      let analyser;
      if (!audioAnalyser) {
        analyser = audioCtx.current.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.85;
        setAudioAnalyser(analyser);
      } else {
        analyser = audioAnalyser;
      }

      // General gain
      let gainNode;
      if (!audioGainNode) {
        gainNode = audioCtx.current.createGain();
        setAudioGainNode(gainNode);
      } else {
        gainNode = audioGainNode;
      }

      track.current.connect(panner);
      panner.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioCtx.current.destination);
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
  // (canvas is located in the Spectrum Analyzer component)
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

        const barWidth = (canvasWidth / bufferLength) * 4;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;

          canvasCtx.fillStyle = "rgb(100, 130, 250)";
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
        onEnded={(e) => {
          if (loopInfo.isLooping && queueIndex === queue.length - 1) { // If looping and reached end of loop, return to start of loop 
            document.querySelector('audio').pause();
            document.querySelector('audio').currentTime = 0;
            document.querySelector('audio').play();
            dispatch(setQueueIndex(loopInfo.loopStart));
          } else if (queueIndex < queue.length - 1) dispatch(next()); // Don't increment the queueIndex if there is no more audio in the queue
        }}
        onClickNext={(e) => {
          if (loopInfo.isLooping && queueIndex === queue.length - 1) { // If looping and reached end of loop, return to start of loop 
            dispatch(setQueueIndex(loopInfo.loopStart));
          } else if (queueIndex + 1 < queue.length) dispatch(next());
        }}
        onClickPrevious={(e) => {
          if (document.querySelector('audio').currentTime > 3) {
            handleRestart();
          } else if (queueIndex !== loopInfo.loopStart) { // Don't exit loop if looping
            dispatch(previous())
          }
        }}
        onListen={(e) => {
          dispatch(setTime(document.querySelector('audio').currentTime));
        }}
        volume={volume}
        onVolumeChange={(e) => dispatch(setVolume(e.target.volume))}
        // other props here
        listenInterval={10}
        customAdditionalControls={
          [
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
                <Popover.Panel className="fixed -translate-y-20 translate-x-6 p-3 border-2 border-zinc-700 bg-zinc-800 rounded-md shadow-md z-50">
                  <PlaybackSpeed />
                </Popover.Panel>
              </Transition>
            </Popover>,
            <div className="ml-6" key="spacer"></div>
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