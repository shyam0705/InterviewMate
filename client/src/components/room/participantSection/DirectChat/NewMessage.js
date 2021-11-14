import React from 'react'
import { useState } from 'react';
import sendMessageButton from '../../../../resources/images/sendMessageButton.svg';
import { sendDirectMessage } from '../../../../util/wss';
export const NewMessage = ({activeConversation,identity}) => {
    const [message, setmessage] = useState("");
    const handleChange=(event)=>{
        setmessage(event.target.value);
    }
    const handleKeyPressed=(event)=>{
        if(event.key=='Enter')
        {
            handleSubmit();
        }
    }
    const handleSubmit=()=>{
        // console.log("in submit");
        sendDirectMessage({
            receiverSocketId:activeConversation.socketId,
            message:message,
            identity:identity
        });
        setmessage("");
    }
    return (
        <div className="new_message_container new_message_direct_border">
            <input
                type="text"
                className="new_message_input"
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyPressed}
            />
            <img
                className="new_message_button"
                src={sendMessageButton}
                onClick={handleSubmit}
            />
        </div>
    )
}
