import {io} from 'socket.io-client';
import { setConnectedUser } from '../actions/setConnectedUser';
import { setRoomId } from '../actions/setRoomId';
import { setSocketId } from '../actions/setSocketId';
import { editor } from '../components/room/editorSection/Editor';
import { handleSignalingData, prepareNewPeerConnection,removePeerConnection } from './webRtcHandler';
import { setModeChanged, setLang, setOutput} from '../actions/setEditor';
import store from '../store';
import { setChatHistory } from '../actions/setChatHistory';
import { serverApi } from './api';
let socket=null;

export const connectWithServer=(dispatch)=>{
    socket=io(`${serverApi}/`);
    socket.on('connect',()=>{
        // console.log("connected");
        dispatch(setSocketId(socket.id));
        // console.log(socket.id);
    });
     //socket io listners
    socket.on('roomId',(data)=>{
        dispatch(setRoomId(data.roomId));
    });

    socket.on("conn-prepare", (data) => {
        const { connUserSocketId } = data;
    
        prepareNewPeerConnection(connUserSocketId, false);
    
        // inform the user which just join the room that we have prepared for incoming connection
        socket.emit("conn-init", { connUserSocketId: connUserSocketId });
    });


    
    socket.on("conn-signal", (data) => {
        handleSignalingData(data);
    });
    
    socket.on("conn-init", (data) => {
        const { connUserSocketId } = data;
        prepareNewPeerConnection(connUserSocketId, true);
    });
    //on user leaving

    socket.on('user-disconnected',(data)=>{
        removePeerConnection(data);
    })

    socket.on('room-update',(data)=>{
        dispatch(setConnectedUser(data.connectedUsers));
    });

    socket.on("direct-message",(data)=>{
        // console.log(data);
        appendNewMessageToChatHistory(data,dispatch);
    });

    //editor
    socket.on("code-change",(data)=>{
        editor.setValue(data);
    })

    socket.on("mode-changed",(data)=>{
        // console.log("in mode changed");
        dispatch(setLang(data));
        editor.setOption("mode",data);
    })

    socket.on("output-changed",(data)=>{
        dispatch(setOutput(data));
    })

    socket.on("drawing",(data)=>{
        draw(data);
    })
}
export const signalPeerData = (data) => {
    socket.emit("conn-signal", data);
};  
export const createRoom=(identity,onlyAudio)=>{
    const data={
        identity,
        onlyAudio
    };
    socket.emit('create-new-room',data);
}
export const joinRoom=(roomId,identity,onlyAudio)=>{
    const data={
        identity,
        roomId,
        onlyAudio
    };
    socket.emit('join-room',data);
}


//direct chat 

export const sendDirectMessage=(data)=>{
    // console.log("in wss");
    socket.emit("direct-message",data);
}

export const handleCodeChange=(data)=>{
    socket.emit('code-change',data);
}

const appendNewMessageToChatHistory=(data,dispatch)=>{

    const {isAuthor,receiverSocketId,authorSocketId}=data;
    const tmp=store.getState().tmp.activeChatHistory;
    // console.log(tmp);

    if(isAuthor)
    {
        const chatHistory=[...tmp];
        const userChatHistory=chatHistory.find(h=>h.socketId===receiverSocketId)
        if(userChatHistory)
        {

            const newMessage={
                isAuthor:true,
                messageContent:data.messageContent,
                identity:data.identity
            }
            const newUserChatHistory={
                ...userChatHistory,
                chatHistory:[...userChatHistory.chatHistory,newMessage]
            }
            const newChatHistory=[...chatHistory.filter(h=>h.socketId!==receiverSocketId),newUserChatHistory];
            dispatch(setChatHistory(newChatHistory));
        }
        else{
            const newUserChatHistory={
                socketId:receiverSocketId,
                chatHistory:[{
                    isAuthor:true,
                    messageContent:data.messageContent,
                    identity:data.identity
                }]   
            }
            // console.log(newUserChatHistory);
            const newChatHistory=[...chatHistory,newUserChatHistory];
            dispatch(setChatHistory(newChatHistory));
        }

    }
    else{

        const chatHistory=[...tmp];
        const userChatHistory=chatHistory.find(h=>h.socketId===authorSocketId)
        if(userChatHistory)
        {
            const newMessage={
                isAuthor:false,
                messageContent:data.messageContent,
                identity:data.identity
            }
            const newUserChatHistory={
                ...userChatHistory,
                chatHistory:[...userChatHistory.chatHistory,newMessage]
            }
            const newChatHistory=[...chatHistory.filter(h=>h.socketId!==authorSocketId),newUserChatHistory];
            dispatch(setChatHistory(newChatHistory));
        }
        else{

            const newUserChatHistory={
                socketId:authorSocketId,
                chatHistory:[{
                    isAuthor:false,
                    messageContent:data.messageContent,
                    identity:data.identity
                }]   
            }
            const newChatHistory=[...chatHistory,newUserChatHistory];
            dispatch(setChatHistory(newChatHistory));
        }

    }
}

//editor functions

export const handleModeChanged=(data)=>{
    // console.log("in hadle mode changed");
    socket.emit("mode-changed",(data));
}

export const handleOutputChanged=(data)=>{
    socket.emit("output-changed",data);
}

//whiteboard functions

export const hadnleDrawingChange=(data)=>{
    socket.emit("drawing",data);
    
}

const draw=(data)=>{
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const x0=data.x0 * w;
    const y0=data.y0 * h;
    const x1=data.x1 * w;
    const y1=data.y1 * h;
    const color=data.color;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = data.size;
    context.stroke();
    context.closePath();
}
