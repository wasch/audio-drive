import { React, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { replaceQueue } from '../redux/slices/queueSlice'

import { DragDropContext } from 'react-beautiful-dnd'

import QueueContainer from '../components/QueueContainer'
import Layout from '../components/Layout'

export default function Queue() {

  // Redux
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.queueIndex.value);
  const storeQueue = useSelector((state) => state.queue.value);

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
    <>
      <DragDropContext
        //onDragStart={ }
        //onDragUpdate
        onDragEnd={onDragEnd}
      >
        <QueueContainer />
      </DragDropContext>
    </>
  )
}

Queue.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}