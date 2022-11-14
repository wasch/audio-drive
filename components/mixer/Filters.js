import React from 'react'

import Highpass from './filters/highpass'
import Lowpass from './filters/lowpass'
import Highshelf from './filters/highshelf'
import Lowshelf from './filters/lowshelf'

const Filters = () => {
    return (
        <div className="flex flex-col bg-zinc-700 shadow-md rounded-md px-5 pt-5 pb-10 md:p-5 w-full">
            <p className="text-2xl mb-1">Filters</p>
            <div className="flex flex-row flex-grow justify-evenly">

                {/* High-pass filter */}
                <div className="flex flex-col items-center">
                    <Highpass />
                </div>

                {/* Low-pass filter */}
                <div className="flex flex-col items-center">
                    <Lowpass />
                </div>

                {/* High-shelf filter */}
                <div className="flex flex-col items-center">
                    <Highshelf />
                </div>

                {/* Low-shelf filter */}
                <div className="flex flex-col items-center">
                    <Lowshelf />
                </div>

            </div>
        </div>
    )
}

export default Filters