import React from 'react'
import { useState } from 'react';
import sendMessageButton from '../../../resources/images/sendMessageButton.svg';
import { sendMessageToOther } from '../../../util/webRtcHandler';
import { useSelector } from 'react-redux';
export const NewMessage = () => {
    const [message, setMessage] = useState("");
    const state = useSelector(state => state.tmp);
    const handleChange=(event)=>{
        setMessage(event.target.value);
    }
    const hadleKeyPress=(event)=>{
        if(event.key==="Enter")
        {
            handleSubmit();
        }

    }
    const handleSubmit=()=>{
        sendMessageToOther(message,state.identity);
        setMessage("");
    }
    return (
        <div className="new_message_container">
            <input
                className="new_message_input"
                value={message}
                placeholder="enter message"
                type="text"
                onChange={handleChange}
                onKeyDown={hadleKeyPress}
            />
            <img
                className="new_message_button"
                src={sendMessageButton}
                onClick={handleSubmit}
            />
        </div>
    )
}
