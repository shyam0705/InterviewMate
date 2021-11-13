import React from 'react'
import { useState } from 'react';
import editorImage from "../../../resources/images/editor.jpg";
export const ShowEditor = () => {
    const [editorOn, setEditorOn] = useState(false)
    const handleClick=()=>{
        if(editorOn)
        {
            document.getElementById("videos_portal").style.visibility="visible";
            document.getElementById("editor").style.visibility="hidden"; 
        }
        else{
            document.getElementById("videos_portal").style.visibility="hidden";
            document.getElementById("participants_section_container").style.visibility="visible";
            document.getElementById("chat_section_container").style.visibility="visible";
            document.getElementById("editor").style.visibility="visible"; 
            document.getElementById("container").style.visibility="hidden";
        }
        setEditorOn(!editorOn);
    }
    const text=!editorOn?"Show Editor":"Hide Editor";
    return (
        <div className="video_button_container">
            <img
                src={editorImage}
                onClick={handleClick}
                className="video_button_image"
            />
        </div>
    );
}
