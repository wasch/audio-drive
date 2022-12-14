import React, { useState, useEffect, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import { useDispatch, useSelector } from 'react-redux'
import { addAudioToEndOfList, addAudioToStartOfList } from '../../redux/slices/queueSlice'
import { next } from '../../redux/slices/queueIndexSlice'

import { Dialog } from '@headlessui/react'

const Audio = (props) => {

    // Props
    const { id, title, url, duration, user, handleRemoveAudio } = props;

    // Redux
    const dispatch = useDispatch();
    const queueIndex = useSelector((state) => state.queueIndex.value);
    const queue = useSelector((state) => state.queue.value);
    const playlists = useSelector((state) => state.playlists.value);

    // State
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dialog State
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setCurrentIndex(queueIndex);
    }, [queueIndex]);

    return (
        <div className="bg-zinc-700 flex flex-row items-center my-3 px-2 shadow-md">
            <div className="mr-2">
                <button className="flex hover:brightness-110" onClick={() => {
                    let audioObj = {
                        name: title,
                        audioSource: url,
                        audioDuration: duration,
                        user: user,
                        currentIndex: currentIndex
                    };
                    if (queue[0]) { // If audio already exists in the queue
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
            <div className="flex flex-grow items-center py-3">
                <div className="text-lg mr-4">
                    {title}
                </div>
                <div className="text-md text-zinc-400 ml-auto mr-3">
                    {duration}
                </div>
            </div>
            <div className="flex ml-auto">
                <button className="flex" title="Add to queue" onClick={() => {
                    dispatch(addAudioToEndOfList({
                        name: title,
                        audioSource: url,
                        audioDuration: duration,
                        user: user
                    }));
                    setIsOpen(true);    // Triggers dialog
                    setTimeout(() => setIsOpen(false), 3000); // Dismisses dialog after 3 seconds
                }}>
                    <i className="material-icons">add</i>
                </button>
                <Menu as="div" className="relative inline-block">
                    <div>
                        <Menu.Button className="flex" title="Menu">
                            <i className="material-icons">more_vert</i>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute bg-slate-600 shadow-md rounded-sm z-50">
                            <div className="flex flex-col">
                                <Menu.Item className="px-4 py-2 hover:backdrop-brightness-110">
                                    {({ active }) => (
                                        <button
                                            onClick={() => handleRemoveAudio(id)}
                                            className={`${active && 'bg-blue-500'}`}
                                            href="#"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

            <Transition
                show={isOpen}
                enter="transition duration-100 ease-in-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog className="z-50 absolute bottom-44 left-1/2 transform -translate-x-1/2 p-3 rounded shadow-md bg-slate-600" onClose={() => setIsOpen(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Added {title} to queue</Dialog.Title>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </div>
    )
}

export default Audio