import React from 'react'
import { useEffect,useRef} from 'react';
export const LocalScreenSharingPreview = ({stream}) => {
    const localPrev=useRef();
    useEffect(() => {
        const video=localPrev.current;
        video.srcObject=stream;
        video.onloadedmetadata=()=>{
            video.play();
        }
    }, [stream])
    return (
        <div className="local_screen_share_preview">
            <video muted autoPlay ref={localPrev}></video>
        </div>
    )
}
