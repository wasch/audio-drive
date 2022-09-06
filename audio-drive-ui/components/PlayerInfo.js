import React from 'react'
import style from '../styles/player.module.css'

const PlayerInfo = (props) => {
  return (
    <div className="flex h-24">
        <h1 className="text-5xl whitespace-nowrap overflow-hidden hover:overflow-x-auto mt-auto pb-3 pl-3">{props.title}</h1>
    </div>
  )
}

export default PlayerInfo