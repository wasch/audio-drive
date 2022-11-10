import React from 'react'
import Head from 'next/head'

import Layout from '../components/Layout'
import WaveformVisualizer from '../components/mixer/WaveformVisualizer'
import Panner from '../components/mixer/Panner'

import { useDispatch, useSelector } from 'react-redux'
import { replaceQueue } from '../redux/slices/queueSlice'

import { DragDropContext } from 'react-beautiful-dnd'

import QueueContainer from '../components/queue/QueueContainer'
import MixerContainer from '../components/mixer/MixerContainer'
import { useState } from 'react'

export default function Mixer() {

  // Redux
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.queueIndex.value);
  const storeQueue = useSelector((state) => state.queue.value);
  const isExpanded = useSelector((state) => state.layout.value);

  // Handles reordering of the queue on drag and drop
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    let newQueue = storeQueue.slice();
    newQueue.splice(source.index + queueIndex, 1);
    newQueue.splice(destination.index + queueIndex, 0, storeQueue[source.index + queueIndex]);
    dispatch(replaceQueue(newQueue));
  }

  return (
    <div className={`${isExpanded ? "" : "max-w-5xl m-auto"} flex flex-row justify-center`}>
      <div className={`flex flex-col items-center ${isExpanded ? "" : "hidden"}`}>
        <DragDropContext
          //onDragStart={ }
          //onDragUpdate
          onDragEnd={onDragEnd}
        >
          <QueueContainer />
        </DragDropContext>
      </div>
      <div className={`flex flex-col md:mx-2 ${isExpanded ? "" : "md:min-w-full"}`}>
        <MixerContainer
          isExpanded={isExpanded}
        />
      </div>
    </div>
  )
}

Mixer.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}