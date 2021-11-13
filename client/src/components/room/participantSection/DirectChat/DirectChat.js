import React from 'react'
import { useState } from 'react';
import { DirectChatHeader } from './DirectChartHeader';
import { NewMessage } from './NewMessage';
import { NoConversation } from './NoConversation';
import { useSelector } from 'react-redux';
import { Messages } from './Messages';
import { useEffect } from 'react';
export const DirectChat = ({}) => {
    const [directMessages, setDirectMessages] = useState([]);
    const state = useSelector(state => state.tmp);
    useEffect(() => {
        if(state.activeConversation==null)
        {
            setDirectMessages([]);
        }
        else{
            const socketId=state.activeConversation.socketId;
            const chatHistory=state.activeChatHistory.find(h=>h.socketId===socketId);
            if(chatHistory)
            {
                setDirectMessages(chatHistory.chatHistory);
            }
            else{
                setDirectMessages([]);
            }
        }
    },[state.activeConversation,state.activeChatHistory])
    return (
        <div className="direct_chat_container">
            <DirectChatHeader activeConversation={state.activeConversation==null?null:state.activeConversation.identity}/>
            <Messages messages={directMessages}/> 
            <NewMessage activeConversation={state.activeConversation} identity={state.identity}/>
            {!state.activeConversation && <NoConversation/>}
        </div>
    )
}
