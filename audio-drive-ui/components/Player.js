import React from 'react'
import style from '../styles/player.module.css'

import PlayerInfo from './PlayerInfo'
import PlayerControls from './PlayerControls'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Player = () => {

  // Redux
  const currentIndex = useSelector((state) => state.queueIndex.value);
  const current = useSelector((state) => state.queue.value[currentIndex]);

  // State
  const [currentAudio, setCurrentAudio] = React.useState({});
  const [title, setTitle] = React.useState(null);
  const [url, setUrl] = React.useState(null);

  useEffect(() => {
    if (current) {
      setCurrentAudio(current);
      setTitle(currentAudio.name);
      setUrl(currentAudio.audioSource);
    }
  });

  return (
    <div className={style.player}>
      <PlayerInfo title={title} />
      <PlayerControls url={url} />
    </div>
  )
}

export default Player

/*
 * Useful audio commands
 *
 * document.querySelector('audio').playbackRate = 1; 
 * document.querySelector('audio').mozPreservesPitch = false 
 */