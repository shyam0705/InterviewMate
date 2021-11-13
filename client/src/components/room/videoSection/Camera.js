import React from 'react'
import camera from "../../../resources/images/camera.svg";
import cameraOff from"../../../resources/images/cameraOff.svg";
import { useState } from 'react';
import { toogleCamera } from '../../../util/webRtcHandler';
export const Camera = () => {
    const [cameraOn, setCameraOn] = useState(true)
    const handleClick=()=>{
        toogleCamera(!cameraOn);
        setCameraOn(!cameraOn);
    }
    return (
        <div className="video_button_container">
            <img
                src={cameraOn?camera:cameraOff}
                onClick={handleClick}
                className="video_button_image"
            />
        </div>
    )
}
