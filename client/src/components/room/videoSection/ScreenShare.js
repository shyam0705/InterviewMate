import React from 'react'
import switchToScreenSharing from '../../../resources/images/switchToScreenSharing.svg';
import { useState } from 'react';
import { LocalScreenSharingPreview } from './LocalScreenSharingPreview';
import { toggleScreenShare } from '../../../util/webRtcHandler';
export const ScreenShare = () => {
    const [ScreenShare, setScreenShare] = useState(false);
    const [screenSharingStream, setScreenSharingStream] = useState(null);

    const handleClick=async ()=>{
        if(!screenSharingStream)
        {
            let stream=null;
            try {
                stream=await navigator.mediaDevices.getDisplayMedia({
                    audio:false,
                    video:true
                });
                if(stream)
                {
                    setScreenSharingStream(stream);
                    //execute fuction to switch
                    toggleScreenShare(false,stream);
                    setScreenShare(true);
                    
                }
            } catch (error) {
                // console.log(error);
            } 
        }
        else{

            //switch back to video
            toggleScreenShare(true);
            setScreenShare(false);
            //stop screen sharing
            screenSharingStream.getTracks().forEach((t)=>t.stop());
            setScreenSharingStream(null);
        }
    }
    return (
        <>
            <div className="video_button_container">
                <img
                    src={switchToScreenSharing}
                    onClick={handleClick}
                    className="video_button_image"
                />
            </div>
            {ScreenShare && <LocalScreenSharingPreview stream={screenSharingStream}/>}
        </>
    )
}
