import React from 'react'
import {useHistory} from 'react-router-dom';
import leave from "../../../resources/images/end-call.png";
export const Leave = () => {
    const history=useHistory();
    const hadleLeave=()=>{
        const siteUrl=window.location.origin;
        window.location.href=siteUrl;
    }
    return (
        <div className="video_button_container">
            <img
                src={leave}
                onClick={hadleLeave}
                className="video_button_image"
            />
        </div>
    )
}
