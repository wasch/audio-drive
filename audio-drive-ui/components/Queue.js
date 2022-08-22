import React from 'react'
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { replaceQueue } from '../redux/slices/queueSlice'

import style from '../styles/queue.module.css'

const Queue = () => {

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const storeQueue = useSelector((state) => state.queue.value);

    // State
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState({});

    useEffect(() => {
        setCurrent(storeQueue[queueIndex]);
        setQueue(storeQueue.slice(queueIndex));     // Don't show songs that were already played

        console.log(storeQueue);
    }, [queueIndex]);

    const swapQueue = (currentIndex, swapToIndex) => {
        if (currentIndex === 0 || swapToIndex === 0 || swapToIndex > queue.length - 1) return;
        let tempArray = [...queue];
        let temp = tempArray[swapToIndex];
        tempArray[swapToIndex] = tempArray[currentIndex];
        tempArray[currentIndex] = temp;
        setQueue(tempArray);
    }

    return (
        <div className={style.container}>
            <h4 className="center grey-text text-lighten-2">Queue</h4>
            {/*
            <form className="form" onSubmit={this.handleSubmit}>
                <label>Enter a command:</label>
                <input type="text" onChange={this.handleChange} />
            </form>
             */}
            {queue ? (
                queue.map((card, index) => (
                    <div className="card grey darken-3" key={index}>
                        <div className={style.audioCardWrapper}>
                            <div className={style.playButton}>
                                <button className="z-depth-2 btn-floating blue">
                                    <i className="material-icons">play_arrow</i>
                                </button>
                            </div>
                            <div className={style.cardTitle}>
                                {card.name}
                            </div>
                            <div className={style.duration}>
                                {card.audioDuration}
                            </div>
                            <div className={style.removeButton}>
                                <button className="btn blue" onClick={() => {
                                    console.log(card);
                                    console.log(storeQueue[queueIndex]);
                                    if (card !== storeQueue[queueIndex]) {     // Don't remove currently playing audio
                                        queue.splice(index, 1);
                                        dispatch(replaceQueue(queue));
                                    }
                                }}>
                                    <i className="material-icons">remove</i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="center grey-text text-darken 2">There is currently no queue</div>
            )}
        </div>
    )
}

export default Queue