import React, { useEffect } from 'react'
import style from '../styles/player.module.css'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import { useDispatch, useSelector } from 'react-redux'
import { next, previous } from '../redux/slices/queueIndexSlice'

const PlayerControls = (props) => {

  // Redux
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.queueIndex.value);
  const queue = useSelector((state) => state.queue.value);

  const checkForQueueLengthExceeded = () => {
    if (queueIndex + 1 < queue.length)
      dispatch(next());
  }

  useEffect(() => {
    // Enables next and previous media keys (play and pause work by default)
    navigator.mediaSession.setActionHandler('nexttrack', () => checkForQueueLengthExceeded());
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(previous()));
  });

  return (
    <div className={style.playerControlsContainer}>
      <AudioPlayer
        id="audioPlayer"
        autoPlay
        src={props.url}
        onPlay={(e) => console.log("playing")}
        onEnded={(e) => dispatch(next())}
        onClickNext={(e) => checkForQueueLengthExceeded()}
        onClickPrevious={(e) => dispatch(previous())}
        volume={0.20}
        // other props here
        showSkipControls
        autoPlayAfterSrcChange
      />
    </div>
  )
}

export default PlayerControls