import React from 'react'

import style from '../styles/audio.module.css'

const Audio = (props) => {

    const { title, url, user } = props;

    const handleClick = () => {
        props.passAudioToParent({ title, url });
    }

    return (
        <div className="card grey darken-3">
            <div className={style.audioCardWrapper}>
                <div className="valign-wrapper">
                    <div className={style.playButton}>
                        <button className="z-depth-2 btn-floating blue" onClick={() => handleClick()}>
                            <i className="material-icons">play_arrow</i>
                        </button>
                    </div>
                    <div className={style.cardTitle}>
                        {title}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Audio