import React from 'react'
import style from '../styles/player.module.css'

import PlayerInfo from './PlayerInfo'
import PlayerControls from './PlayerControls'

const Player = (props) => {
  return (
    <div className={style.player}>
        <audio></audio>
        <h4>Playing</h4>
        <PlayerInfo audio={props.currentAudio} />
        <PlayerControls audio={props.currentAudio} />
        <p><strong>Next: </strong>{props.audioNext.title}</p>
    </div>
  )
}

export default Player