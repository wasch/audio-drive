import React from 'react'
import style from '../styles/player.module.css'

const PlayerInfo = (props) => {
  return (
    <div className="flex h-22">
        <h1 className="text-4xl md:text-5xl whitespace-nowrap overflow-hidden hover:overflow-x-auto mt-5 pb-3 pl-3">{props.title}</h1>
    </div>
  )
}

export default PlayerInfo