import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { addAudioToEndOfList, addAudioToStartOfList } from '../redux/slices/queueSlice'
import { next } from '../redux/slices/queueIndexSlice'

import style from '../styles/audio.module.css'

const Audio = (props) => {

    // Props
    const { title, url, duration, user } = props;

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const queue = useSelector((state) => state.queue.value);

    // State
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(queueIndex);
    }, [queueIndex]);

    return (
        <div className="bg-zinc-700">
            <div className={style.audioCardWrapper}>
                <div className={style.playButton}>
                    <button className="z-depth-2 btn-floating blue" onClick={() => {
                        let audioObj = {
                            name: title,
                            audioSource: url,
                            audioDuration: duration,
                            user: user,
                            currentIndex: currentIndex
                        };
                        if (queue[0]) {
                            audioObj.currentIndex += 1;
                            dispatch(addAudioToStartOfList(audioObj));
                            dispatch(next());
                        } else {
                            dispatch(addAudioToStartOfList(audioObj));
                        }
                    }
                    }>
                        <i className="material-icons">play_arrow</i>
                    </button>
                </div>

                <div className={style.cardTitle}>
                    {title}
                </div>
                <div className={style.duration}>
                    {duration}
                </div>
                <div className={style.rightIcon}>
                    <button className="z-depth-2 btn blue" onClick={() => dispatch(addAudioToEndOfList({
                        name: title,
                        audioSource: url,
                        audioDuration: duration,
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