import React from 'react'
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { replaceQueue } from '../../redux/slices/queueSlice'
import { setIsLooping, setLoopStart, setLoopEnd } from '../../redux/slices/loopSlice'

import { Draggable } from 'react-beautiful-dnd';

import shuffler from '../../functions/shuffler'
import QueueAudio from './QueueAudio'
import QueueAudioSimple from './QueueAudioSimple'
import { faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Queue = () => {

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const storeQueue = useSelector((state) => state.queue.value);
    const loopInfo = useSelector((state) => state.loopInfo.value);

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

    const handleToggleLooping = () => {
        if (loopInfo.isLooping) {
            dispatch(setIsLooping(false));
            dispatch(setLoopStart(null));
        } else {
            dispatch(setIsLooping(true));
            dispatch(setLoopStart(queueIndex));
        }
    }

    return (
        <div className="flex flex-col md:flex-row justify-center">
            <div className={`${loopInfo.isLooping && storeQueue.length > 0 ? "flex flex-col mb-5 my-5 md:mx-2" : "hidden"}`}>
                <div className="flex flex-col rounded-md shadow-md bg-[#2c2c31] p-5">
                    {
                        loopInfo.isLooping && storeQueue.length > 0 ? (
                            storeQueue.slice(loopInfo.loopStart).map((item, index) => index !== 0 ? (
                                <div key={index} className="">
                                    <QueueAudioSimple
                                        item={item}
                                        index={index}
                                    />
                                </div>
                            ) : (
                                <div key={index}>
                                    <div className="flex flex-row items-center">
                                        <h4 className="text-3xl mt-4 mb-4">Looping:</h4>
                                    </div>
                                    <QueueAudioSimple
                                        item={item}
                                        index={index}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="hidden"></div>
                        )
                    }
                </div>
            </div>

            <div className="flex flex-col">
                <div className="bg-[#2c2c31] p-5 my-5 md:mx-2 rounded-md shadow-md">
                    {storeQueue.length > 0 ? (
                        storeQueue.slice(queueIndex).map((item, index) => index !== 0 ? (
                            <Draggable draggableId={index + item.name} key={index} index={index}>
                                {(provided) => (
                                    <div
                                        className="mb-3"
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        <QueueAudio
                                            item={item}
                                            index={index}
                                            setQueueFromButtonClick={setQueueFromButtonClick}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ) : (
                            <div key={index}>
                                <div className="flex flex-row items-center">
                                    <p className="text-3xl mt-4 mb-4 pr-4">Now playing:</p>
                                    <div className="ml-auto flex">
                                        <button className={`${loopInfo.isLooping ? "text-yellow-300" : ""}`} title="Loop" onClick={() => dispatch(handleToggleLooping)}>
                                            <FontAwesomeIcon className="text-3xl" icon={faRepeat} />
                                        </button>
                                        <button className="ml-4" title="Shuffle" onClick={handleQueueShuffle}>
                                            <FontAwesomeIcon className="text-3xl" icon={faShuffle} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <QueueAudio
                                        item={item}
                                        index={index}
                                        setQueueFromButtonClick={setQueueFromButtonClick}
                                    />
                                </div>
                                <hr className="border-2 rounded-md my-6" />
                            </div>
                        ))
                    ) : (
                        <p className="text-lg self-center">There is currently no queue</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Queue