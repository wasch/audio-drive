import React from 'react'
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { replaceQueue } from '../../redux/slices/queueSlice'

import { Draggable } from 'react-beautiful-dnd';

import shuffler from '../../functions/shuffler'
import QueueAudio from './QueueAudio'

const Queue = () => {

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const storeQueue = useSelector((state) => state.queue.value);

    // Removes audio from queue
    const setQueueFromButtonClick = (removedAudio) => {
        dispatch(replaceQueue(storeQueue.filter(audio => audio !== removedAudio)));
    }

    // Shuffles the remaining queue (begins after current audio)
    const handleQueueShuffle = () => {
        if (queueIndex >= storeQueue.length - 1) return;    // Don't shuffle if only 0 or 1 audios left in the queue
        let tempQueue = storeQueue.slice();
        let shuffledArray = tempQueue.slice(queueIndex + 1);

        shuffledArray = shuffler(shuffledArray);
        
        tempQueue.splice(queueIndex + 1);
        let resArray = tempQueue.concat(shuffledArray);
        dispatch(replaceQueue(resArray));
    }

    return (
        <div className="flex flex-col justify-center bg-[#2c2c31] p-5 rounded-md shadow-md">
            {storeQueue.length > 0 ? (
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
                        <div className="flex flex-row">
                            <h4 className="text-3xl mt-4 mb-4">Now playing:</h4>
                            <button className="ml-auto -mb-3" title="Shuffle" onClick={handleQueueShuffle}>
                                <i className="material-icons text-3xl">shuffle</i>
                            </button>
                        </div>
                        <QueueAudio
                            card={card}
                            index={index}
                            setQueueFromButtonClick={setQueueFromButtonClick}
                        />
                        <hr className="border-2 rounded-md my-6" />
                    </div>
                ))
            ) : (
                <p className="text-lg self-center">There is currently no queue</p>
            )}
        </div>
    )
}

export default Queue