import React from 'react'

import { useSelector } from 'react-redux'

import style from '../styles/queue.module.css'

const QueueAudio = (props) => {

    // Redux
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const storeQueue = useSelector((state) => state.queue.value);

    return (
        <div className={style.queueContainer}>
            <div className="card grey darken-3">
                <div className={style.audioCardWrapper}>
                    <div className={style.cardTitle}>
                        {props.card.name}
                    </div>
                    <div className={style.duration}>
                        {props.card.audioDuration}
                    </div>
                    <div className={style.removeButton}>
                        <button className="btn blue" onClick={() => {
                            if (props.card !== storeQueue[queueIndex]) {     // Don't remove currently playing audio
                                props.setQueueFromButtonClick(props.card);
                            }
                        }}>
                            <i className="material-icons">remove</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QueueAudio