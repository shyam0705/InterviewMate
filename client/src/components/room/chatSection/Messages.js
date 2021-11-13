import React from 'react';
import {useSelector} from 'react-redux';
export const Messages = () => {
    const state = useSelector(state => state.tmp)
    return (
        <div className="messages_container">
            {
                state.messages.map((message,index)=>{
                    const sameAuthor=(index>0 && message.identity===state.messages[index-1].identity)?true:false;
                    return(
                        <Message
                            key={`${message.content}${index}`}
                            author={message.identity}
                            content={message.content}
                            sameAuthor={sameAuthor}
                            messageByMe={message.messageByMe}
                        />  
                    );
                })
            }
        </div>
    )
}

const Message=({key,author,content,sameAuthor,messageByMe})=>{
    const alignClass=messageByMe?"message_align_right":"message_align_left";
    const authorText=messageByMe?"You":author;

    const color=messageByMe?"message_right_styles":"message_left_styles";
    return(
        <div className={`message_container ${alignClass}`} >
            {!sameAuthor && <p className="message_title">{authorText}</p>}
            {<p className={`message_content ${color}`} id="message">{content}</p>}
        </div>
    );
}
