import React from 'react'
import { useDispatch } from 'react-redux'
import { resetAll } from '../../redux/slices/filtersSlice'

import Highpass from './filters/highpass'
import Lowpass from './filters/lowpass'
import Highshelf from './filters/highshelf'
import Lowshelf from './filters/lowshelf'

const Filters = () => {

    // Redux
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col bg-zinc-700 shadow-md rounded-md px-5 pt-5 pb-10 md:p-5 w-full">
            <p onClick={() => dispatch(resetAll())} title="Reset filters" className="text-2xl mb-3 hover:cursor-pointer">Filters</p>
            <div className="md:flex md:flex-row flex-grow justify-center">
                <div className="flex flex-row">
                    <div className="bg-[#2c2c31] border-2 border-zinc-600 rounded-md shadow-md py-2 h-56 m-2">
                        <Highpass />
                    </div>
                    <div className="bg-[#2c2c31] border-2 border-zinc-600 rounded-md shadow-md py-2 h-56 m-2">
                        <Lowpass />
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="bg-[#2c2c31] border-2 border-zinc-600 rounded-md shadow-md py-2 h-56 m-2">
                        <Highshelf />
                    </div>
                    <div className="bg-[#2c2c31] border-2 border-zinc-600 rounded-md shadow-md py-2 h-56 m-2">
                        <Lowshelf />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filters