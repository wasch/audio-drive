import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { setQueueIndex } from '../../redux/slices/queueIndexSlice'

const QueueAudioSimple = (props) => {

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const loopInfo = useSelector((state) => state.loopInfo.value)

    const handleGoToQueueIndex = () => {
        dispatch(setQueueIndex(loopInfo.loopStart + props.index));
    }

    return (
        <div onClick={handleGoToQueueIndex} className={`${queueIndex - loopInfo.loopStart === props.index ? "text-yellow-300" : ""} bg-zinc-700 px-2 py-2 my-1 shadow-md rounded-md cursor-pointer`}>
            <div className="flex items-center">
                <div className="text-lg">
                    {props.item.name}
                </div>
                <div className="text-md text-zinc-400 ml-auto pl-2 md:mr-3 md:pl-5">
                    {props.item.audioDuration}
                </div>
            </div>
        </div>
    )
}

export default QueueAudioSimple