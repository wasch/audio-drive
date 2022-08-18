import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { addAudioToList } from '../redux/slices/queueSlice'

import style from '../styles/audio.module.css'

const Audio = (props) => {

    // Props
    const { title, url, user } = props;

    // Redux
    const queue = useSelector((state) => state.queue.value);
    const dispatch = useDispatch();

    // Handlers
    const handleClick = () => {
        props.passAudioToParent({ title, url });
    }

    return (
        <div className="card grey darken-3">
            <div className={style.audioCardWrapper}>
                <div className={style.playButton}>
                    <button className="z-depth-2 btn-floating blue" onClick={() => handleClick()}>
                        <i className="material-icons">play_arrow</i>
                    </button>
                </div>
                <div className={style.cardTitle}>
                    {title}
                </div>
                <div className={style.rightIcon}>
                    <button className="z-depth-2 btn blue" onClick={() => dispatch(addAudioToList({
                        name: title,
                        audioSource: url,
                        user: user
                    }))}>
                        <i className="material-icons">add</i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Audio