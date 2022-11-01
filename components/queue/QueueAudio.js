import React from 'react'

import { useSelector } from 'react-redux'

import style from '../../styles/queue.module.css'

const QueueAudio = (props) => {

    // Redux
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const storeQueue = useSelector((state) => state.queue.value);

    return (
        <div className={style.queueContainer}>
            <div className="bg-zinc-700 px-1 py-2 shadow-md">
                <div className={style.audioCardWrapper}>
                    <div className="text-lg">
                        {props.item.name}
                    </div>
                    <div className="text-md text-zinc-400 ml-auto mr-3">
                        {props.item.audioDuration}
                    </div>
                    <div title="Remove from queue">
                        <button className="flex" onClick={() => {
                            if (props.item !== storeQueue[queueIndex]) {     // Don't remove currently playing audio
                                props.setQueueFromButtonClick(props.item);
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