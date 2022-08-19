import React from 'react'
import style from '../styles/player.module.css'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

import { useDispatch } from 'react-redux'
import { next, previous } from '../redux/slices/queueIndexSlice'

const PlayerControls = (props) => {

  // Redux
  const dispatch = useDispatch();

  return (
    <div className={style.playerControlsContainer}>
      <AudioPlayer
        id="audioPlayer"
        autoPlay
        src={props.url}
        onPlay={(e) => console.log("playing")}
        onEnded={(e) => dispatch(next())}
        volume={0.20}
        // other props here
        showSkipControls
        autoPlayAfterSrcChange
      />
    </div>
  )
}

export default PlayerControls