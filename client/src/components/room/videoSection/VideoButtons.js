import React from 'react'
import { AddParticipant } from './AddParticipant'
import { Camera } from './Camera'
import { Leave } from './Leave'
import { Mic } from './Mic'
import { ScreenShare } from './ScreenShare'
import { useSelector } from 'react-redux'
import { ShowEditor } from './ShowEditor'
import { ShowBoard } from './ShowBoard';
export const VideoButtons = (props) => {
    const state = useSelector(state => state.tmp);
    return (
        <div className="video_buttons_container">
            <ShowBoard/>
            <ShowEditor/>
            <Mic/>
            {!state.onlyAudio && <Camera/>}
            <Leave/>
           {!state.onlyAudio && <ScreenShare/>} 
            {state.isRoomHost && <AddParticipant/>}
        </div>
    )
}
