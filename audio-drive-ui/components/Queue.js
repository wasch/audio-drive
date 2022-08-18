import React from 'react'
import { useState } from 'react'

import style from '../styles/queue.module.css'

const Queue = () => {



    const swapQueue = (currentIndex, swapToIndex) => {
        if (currentIndex === 0 || swapToIndex === 0 || swapToIndex > queue.length - 1) return;
        let tempArray = [...queue];
        let temp = tempArray[swapToIndex];
        tempArray[swapToIndex] = tempArray[currentIndex];
        tempArray[currentIndex] = temp;
        setQueue(tempArray);
    }

    const queueList = queue.length ? (
        queue.map((card, index) => {
            return (
                <div className="post card" key={card.id}>
                    <div className="card-content">
                        <div className="valign-wrapper">
                            <div className="left">
                                <a target="_blank" href={card.url}>
                                    <img className="thumbnail" src={card.thumbnails.default.url} alt="video thumbnail" />
                                </a>
                            </div>

                            <div className="card-text">
                                <a target="_blank" href={card.url}><span className="card-title white-text">{card.title}</span></a>
                                <p className="grey-text text-darken-1">{card.description}</p>
                            </div>

                            <div className="right-icon">
                                <input className="arrow-up" type="image" src={arrow_up} onClick={() => { swapQueue(index, index - 1) }} />
                                <input className="arrow-down" type="image" src={arrow_down} onClick={() => { swapQueue(index, index + 1) }} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
    ) : (
        <div className="center grey-text text-darken 2">There is currently no queue</div>
    )
    return (
        <div className="container">
            <h4 className="center grey-text text-lighten-2">Queue</h4>
            {/*
            <form className="form" onSubmit={this.handleSubmit}>
                <label>Enter a command:</label>
                <input type="text" onChange={this.handleChange} />
            </form>
             */}
            {queueList}
        </div>
    )
}

export default Queue