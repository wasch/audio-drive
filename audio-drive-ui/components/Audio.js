import React from 'react'

const Audio = (props) => {

    const { title, url, user } = props;

    const handleClick = () => {
        props.passAudioToParent({title, url});
    }

    return (
        <div>
            <button onClick={() => handleClick()}>
                Play
            </button>
            {title}
        </div>
    )
}

export default Audio