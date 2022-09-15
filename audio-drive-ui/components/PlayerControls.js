import React, { useEffect } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import { useDispatch, useSelector } from 'react-redux'
import { next, previous } from '../redux/slices/queueIndexSlice'
import { increment, decrement } from '../redux/slices/playbackSpeedSlice'

const PlayerControls = (props) => {

  // Redux
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.queueIndex.value);
  const queue = useSelector((state) => state.queue.value);
  const playbackSpeed = useSelector((state) => state.playbackSpeed.value);

  const checkForQueueLengthExceeded = () => {
    if (queueIndex + 1 < queue.length)
      dispatch(next());
  }

  useEffect(() => {
    // Enables next and previous media keys (play and pause work by default)
    navigator.mediaSession.setActionHandler('nexttrack', () => checkForQueueLengthExceeded());
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(previous()));

    // Setup slow down and speed up buttons
    const speedUp = document.querySelector('button.speedUp');
    speedUp.addEventListener("click", () => {
      dispatch(increment());
    });

    const slowDown = document.querySelector('button.slowDown');
    slowDown.addEventListener("click", () => {
      dispatch(decrement());
    });
  }, []);

  return (
    <div>
      <button className="slowDown">Slow Down</button>
      <h5>{playbackSpeed.toFixed(2)}</h5>
      <button className="speedUp">Speed Up</button>
      <AudioPlayer
        id="audioPlayer"
        autoPlay
        src={props.url}
        onPlay={(e) => console.log("playing")}
        onEnded={(e) => dispatch(next())}
        onClickNext={(e) => checkForQueueLengthExceeded()}
        onClickPrevious={(e) => dispatch(previous())}
        onClickForwards={(e) => console.log(test)}
        volume={0.20}
        // other props here
        showSkipControls
        autoPlayAfterSrcChange
      />
    </div>
  )
}

export default PlayerControls