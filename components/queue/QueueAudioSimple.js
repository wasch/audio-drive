import React from 'react'

import { useSelector } from 'react-redux'

const QueueAudioSimple = (props) => {

    // Redux
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const loopInfo = useSelector((state) => state.loopInfo.value)

    return (
        <div className={`${queueIndex - loopInfo.loopStart === props.index ? "text-yellow-300" : ""} bg-zinc-700 px-2 py-2 my-1 shadow-md rounded-md`}>
            <div className="flex items-center">
                <div className="text-lg">
                    {props.item.name}
                </div>
                <div className="text-md text-zinc-400 ml-auto mr-3">
                    {props.item.audioDuration}
                </div>
            </div>
        </div>
    )
}

export default QueueAudioSimple