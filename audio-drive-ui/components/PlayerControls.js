import React from 'react'
import style from '../styles/player.module.css'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

const PlayerControls = (props) => {
  return (
    <div className={style.playerControlsContainer}>
        <AudioPlayer
            autoPlay
            src={props.url}
            onPlay={(e) => console.log("playing")}
            volume={0.20}
            // other props here
            showSkipControls
            autoPlayAfterSrcChange
        />
    </div>
  )
}

export default PlayerControls