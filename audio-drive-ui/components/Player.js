import React from 'react'
import style from '../styles/player.module.css'

import PlayerInfo from './PlayerInfo'
import PlayerControls from './PlayerControls'

const Player = (props) => {
  const { title, url } = props.currentAudio;
  
  return (
    <div className={style.player}>
        <audio></audio>
        <PlayerInfo title={title} />
        <PlayerControls url={url} />
        {/*<p><strong>Next: </strong>{props.audioNext.title}</p>*/}
    </div>
  )
}

export default Player