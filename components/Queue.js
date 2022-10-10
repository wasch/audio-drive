import React from 'react'
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { replaceQueue } from '../redux/slices/queueSlice'

import { Draggable } from 'react-beautiful-dnd';

import QueueAudio from './QueueAudio'

import style from '../styles/queue.module.css'

const Queue = () => {

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const storeQueue = useSelector((state) => state.queue.value);

    // Removes audio from queue
    const setQueueFromButtonClick = (removedAudio) => {
        dispatch(replaceQueue(storeQueue.filter(audio => audio !== removedAudio)));
    }

    return (
        <div className={style.container}>
            {storeQueue ? (
                storeQueue.slice(queueIndex).map((card, index) => index !== 0 ? (
                    <Draggable draggableId={index + card.name} key={index} index={index}>
                        {(provided) => (
                            <div
                                className="mb-3"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                            >
                                <QueueAudio
                                    card={card}
                                    index={index}
                                    setQueueFromButtonClick={setQueueFromButtonClick}
                                />
                            </div>
                        )}
                    </Draggable>
                ) : (
                    <div key={index}>
                        <h4 className="text-3xl mt-8 mb-4">Now playing:</h4>
                        <QueueAudio
                            card={card}
                            index={index}
                            setQueueFromButtonClick={setQueueFromButtonClick}
                        />
                        <hr className={style.currentlyPlayingDivider} />
                    </div>
                ))
            ) : (
                <p>There is currently no queue</p>
            )}
        </div>
    )
}

export default Queue