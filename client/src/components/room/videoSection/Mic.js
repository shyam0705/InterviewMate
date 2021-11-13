import React from 'react'
import mic from "../../../resources/images/mic.svg";
import micOff from"../../../resources/images/micOff.svg";
import { useState } from 'react';
import { toogleMic } from '../../../util/webRtcHandler';
export const Mic = () => {
    const [micOn, setMicOn] = useState(true)
    const handleClick=()=>{
        toogleMic(!micOn);
        setMicOn(!micOn);
    }
    return (
        <div className="video_button_container">
            <img
                src={micOn?mic:micOff}
                onClick={handleClick}
                className="video_button_image"
            />
        </div>
    )
}
