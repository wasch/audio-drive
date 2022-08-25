import React from 'react'

import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import QueueContainer from '../components/QueueContainer'

const queue = () => {

  const onDragEnd = (result) => {

  }

  return (
    <>
      <DragDropContext
        //onDragStart={ }
        //onDragUpdate
        onDragEnd={onDragEnd()}
      >
        <QueueContainer />
      </DragDropContext>
    </>
  )
}

export default queue