import React from 'react'

import { Droppable } from 'react-beautiful-dnd'

import Queue from './Queue'

const QueueContainer = () => {
    return (
        <div>
            <Droppable droppableId="queueContainer">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <Queue>
                            {provided.placeholder}
                        </Queue>
                    </div>
                )}
            </Droppable>
        </div>
    )
}

export default QueueContainer