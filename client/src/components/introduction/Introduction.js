import React from 'react';
import logo from '../../resources/images/logo.png';
import './Introduction.css';
import {useHistory} from 'react-router-dom';
import { setHost } from '../../actions/setRoomHost';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
export const Introduction = () => {
    const dispatch = useDispatch();
    const history=useHistory();
    const pushToJoinRoom=()=>{
        history.push("/join-room");
    }
    const pushToJoinRoomAsHost=()=>{
        history.push("/join-room?host=true");
    }
    useEffect(() => {
        dispatch(setHost(false));
    }, [])
    return (
       <div className="introduction_page_container">
           <div className="introduction_page_panel">
               <img src={logo} alt="InterviewMate" className="introduction_page_image">
               </img>
               <div className="connecting_buttons_container">
                    <button className="join_room_button" onClick={(e)=>pushToJoinRoom(e)}>Join Room</button>
                    <button className="create_room_button" onClick={(e)=>pushToJoinRoomAsHost(e)}>Create Room</button>
                </div> 
           </div>
       </div>
    )
}
