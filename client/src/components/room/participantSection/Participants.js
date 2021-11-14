import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setActiveConversation } from '../../../actions/setActiveConvesation';
export const Participants = () => {
    const state = useSelector(state => state.tmp);
    // console.log(state.connectedUsers);
    const dispatch = useDispatch();
    const handleActiveConversationChange=(participant)=>{
        if(participant.socketId!=state.socketId)
        {
            dispatch(setActiveConversation(participant));
        }
    }
    return (
        <div className="participants_container">
            {
                state.connectedUsers.map((participant,index)=>{
                    // console.log(participant);
                    return(
                        <>
                            <p className="participants_paragraph"
                                onClick={()=> handleActiveConversationChange(participant)}
                            >
                                {participant.identity}
                            </p>
                            {!(state.connectedUsers.length-1===index) && <span className="participants_separator_line"></span>}
                        </>
                    );
                })
            }
        </div>
    )
}
