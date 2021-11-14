import React from 'react';
import './JoinRoom.css';
import { useLocation,useHistory } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { setHost } from '../../actions/setRoomHost';
import {useSelector,useDispatch} from 'react-redux';
import { setOnlyAudio } from '../../actions/setOnlyAudio';
import { setIdentity } from '../../actions/setIdentity';
import { setRoomId } from '../../actions/setRoomId';
import { ErrorMessage } from './ErrorMessage';
import axios from 'axios';
import { serverApi } from '../../util/api';
export const JoinRoom = (props) => {

    const [errMsg, seterrMsg] = useState(null);
    const search=useLocation().search;
    const dispatch = useDispatch();
    const history=useHistory();
    const state = useSelector(state => state.tmp);
    const text=state.isRoomHost?"CREATE":"JOIN";

    //logic for form
    const [formData, setFormData] = useState({
        meetingId:"",
        name:""
    });
    const handleChange=(event)=>{
        setFormData({...formData,[event.target.name]:event.target.value});
    }


    //logic for handling only audio
    const [checked, setChecked] = useState(false);
    const handleChecked=()=>{
        dispatch(setOnlyAudio(!checked));
        setChecked(!checked);
    }

    //use effect call
    useEffect(() => {
        if(state.identity!="")
        {
            window.location.reload();
        }
        const isRoomHost=new URLSearchParams(search).get("host");
        if(isRoomHost)
        {
            dispatch(setHost(true));
            // console.log("user is host");
        }
    }, []);
    

    //redirecrting to room
    const hadleCreateOrJoin=()=>{
        dispatch(setIdentity(formData.name));
        if(state.isRoomHost)
        {
            handleCreate();
        }
        else{

            handleJoin();
        }
    }
    const handleCreate=()=>{
        history.push('/room');
    }
    const handleJoin=async ()=>{ 
        try {

            const data={id:formData.meetingId}
            const res=await axios.post(`${serverApi}/checkRoomAvailable`,data);
            if(res.data.err!=null)
            {
                seterrMsg(res.data.err);
            }
            else{
                seterrMsg(null);
                dispatch(setRoomId(formData.meetingId));
                history.push('/room');
            }
           
        } 
        catch (error) {
            // console.log(error);
        }
    }

    
    //rendering logic
    return (
        <div className="join_room_page_container">
        
            <div className="join_room_page_panel">
                {
                    state.isRoomHost?<p className="join_room_title">Create Meeting</p>:
                    <p className="join_room_title">Join Meeting</p>
                }
                 {!state.isRoomHost && errMsg && <ErrorMessage err={errMsg}/>}
                <div className="join_room_inputs_container">
                    {
                    !state.isRoomHost && <input
                        placeholder="Meeting Id"
                        value={formData.meetingId}
                        onChange={(e)=>handleChange(e)}
                        className="join_room_input"
                        name="meetingId"
                        required
                    />
                    }
                    <input
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e)=>handleChange(e)}
                        className="join_room_input"
                        name="name"
                        required
                    />
                    <label className="label">
                        <input type="checkbox"
                            defaultChecked={checked}
                            onChange={handleChecked}
                        />
                        Only with Audio
                    </label>
                </div>
                <div className="join_room_buttons_container">
                    <button className="join_room_success_button" onClick={()=>hadleCreateOrJoin()}>
                        {text}
                    </button>
                    <button className="join_room_cancel_button"
                        onClick={()=>history.push("/")}
                    >
                        CANCEL
                    </button>
                </div>  
            </div> 
        </div>
    )
}
