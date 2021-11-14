import React from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { serverApi } from '../../../util/api';
export const AddParticipant = () => {
    const state = useSelector(state => state.tmp);
    const [email, setemail] = useState("");
    const addParticipant=async ()=>{
        // console.log(email);
        try{
            const res=await axios.post(`${serverApi}/sendEmail`,{
    
                    to:email,
                    id:state.roomId,
                    from:state.identity
                });
            // console.log("email sent"); 
        }
        catch(err){
            // console.log("email not sent");
        }
        setemail("");
    }
    const handleChange=(e)=>{
        setemail(e.target.value);
    }
    return (
        <div className="video_button_container">
            <input value={email} onChange={handleChange}></input>
            <button onClick={addParticipant}><i class="fa fa-user-plus"></i>Add Participant</button>
        </div>
    )
}
