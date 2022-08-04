import React from 'react'
import style from '../styles/player.module.css'

const PlayerInfo = (props) => {
  return (
    <div className={style.playerInfo}>
        <div className={style.imgInfo}>
            <img src={props.audio.img_src} alt=""/>
        </div>
        <h3 className={style.title}>{props.audio.title}</h3>
        <h3 className={style.artist}>{props.audio.artist}</h3>
    </div>
  )
}

export default PlayerInfo