import React from 'react'
import { useState } from 'react';
import boardImage from "../../../resources/images/board.png";
export const ShowBoard = () => {
    const [boardOn, setBoardOn] = useState(false)
    const handleClick=()=>{
        if(boardOn)
        {
            document.getElementById("videos_portal").style.visibility="visible";
            document.getElementById("participants_section_container").style.visibility="visible";
            document.getElementById("chat_section_container").style.visibility="visible";
            document.getElementById("editor").style.visibility="hidden"; 
            document.getElementById("container").style.visibility="hidden";
            
        }
        else{
            document.getElementById("videos_portal").style.visibility="hidden";
            document.getElementById("editor").style.visibility="hidden";
            document.getElementById("participants_section_container").style.visibility="hidden";
            document.getElementById("chat_section_container").style.visibility="hidden";
            document.getElementById("container").style.visibility="visible";

        }
        setBoardOn(!boardOn);
    }
    const text=!boardOn?"Show Board":"Hide Board";
    return (
        <div className="video_button_container">
           <img
                src={boardImage}
                onClick={handleClick}
                className="video_button_image"
            />
        </div>
    );
}
