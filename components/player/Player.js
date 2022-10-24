import React, { useState } from 'react'
import style from '../../styles/player.module.css'

import PlayerInfo from './PlayerInfo'
import PlayerControls from './PlayerControls'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Player = () => {

  // Redux
  const currentIndex = useSelector((state) => state.queueIndex.value);
  const current = useSelector((state) => state.queue.value[currentIndex]);
  const playbackSpeed = useSelector((state) => state.playbackSpeed.value);
  const maintainPitch = useSelector((state) => state.maintainPitch.value);

  // State
  const [currentAudio, setCurrentAudio] = useState({});
  const [title, setTitle] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (current) {
      setCurrentAudio(current);
      setTitle(currentAudio.name);
      setUrl(currentAudio.audioSource);

      const audioTag = document.querySelector('audio');
      audioTag.playbackRate = playbackSpeed; 
      audioTag.mozPreservesPitch = maintainPitch;
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