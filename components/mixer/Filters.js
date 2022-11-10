import React, { useState, useEffect } from 'react'
import style from '../../styles/filters.module.css'

const Filters = () => {

    return (
        <div className="flex flex-col bg-zinc-700 shadow-md rounded-md px-5 pt-5 pb-10 md:p-5 w-full">
            <p className="text-2xl mb-4">Filters</p>
            <div className="flex flex-row flex-grow justify-evenly">

                {/* High-pass filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-4 px-3 py-1 shadow-md rounded-md transition ease-in-out hover:scale-105 hover:brightness-125 bg-zinc-600 text-lg">High-pass</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                    </div>
                </div>

                {/* Low-pass filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-4 px-3 py-1 shadow-md rounded-md transition ease-in-out hover:scale-105 hover:brightness-125 bg-zinc-600 text-lg">Low-pass</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                    </div>
                </div>

                {/* High-shelf filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-4 px-3 py-1 shadow-md rounded-md transition ease-in-out hover:scale-105 hover:brightness-125 bg-zinc-600 text-lg">High-shelf</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                    </div>
                </div>

                {/* Low-shelf filter */}
                <div className="flex flex-col items-center">
                    <button className="mx-2 mb-4 px-3 py-1 shadow-md rounded-md transition ease-in-out hover:scale-105 hover:brightness-125 bg-zinc-600 text-lg">Low-shelf</button>
                    <div className="flex flex-row w-full -mb-5 justify-evenly">
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                        <div className="flex flex-col items-center justify-evenly">
                            <input orient="vertical" className={style.vertSlider} type="range" />
                            <p className="mt-2 text-xl hover:cursor-pointer">0</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Filters