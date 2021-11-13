import React from 'react'
import { ParticipantSection } from './participantSection/ParticipantSection';
import { ChatSection } from './chatSection/ChatSection';
import { VideoSection } from './videoSection/VideoSection';
import './Room.css';
import { RoomLabel } from './RoomLabel';
import { getLocalPreviewAndInitLocalConnection } from '../../util/webRtcHandler';
import {useSelector,useDispatch} from 'react-redux';
import { useEffect } from 'react';
import { Loader } from './Loader';
import { useHistory } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
import { Editor } from './editorSection/Editor';
import { Container } from './whiteBoardSection/Container';
export const Room = () => {
    const state = useSelector(state => state.tmp);
    const dispatch = useDispatch();
    const history=useHistory();
    useEffect(() => {
       
        if(state.identity.length==0)
        {
            const siteUrl=window.location.origin;
            window.location.href=siteUrl;
        }
        else{
            getLocalPreviewAndInitLocalConnection(state.isRoomHost,state.identity,state.roomId,dispatch,state.onlyAudio);
        } 
    }, []);
    return (
        <div className="room_container">
            <ParticipantSection/>
            <Editor/>
            <Container/>
            <VideoSection/>
            <ChatSection/>
            <RoomLabel roomId={state.roomId}/>
            {state.isLoading && <Loader/>}
        </div>
    )
}
