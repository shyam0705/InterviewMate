import { SET_ACTIVE_CHAT_CONVERSATION, SET_ACTIVE_CHAT_HISTORY, SET_CONNECTED_USER, SET_IDENTITY, SET_IS_LOADING, SET_MESSAGES, SET_ONLY_AUDIO, SET_ROOM_HOST, SET_ROOM_ID, SET_SOCKET_ID,SET_LANG, SET_OUTPUT} from "../actions/types";

const intialState={
    identity:'',
    isRoomHost:false,
    onlyAudio:false,
    roomId:null,
    isLoading:true,
    connectedUsers:[],
    messages:[],
    activeConversation:null,
    activeChatHistory:[],
    socketId:null,
    lang:"text/x-csrc",
    output:[]
}
export const tmp=(state=intialState,action)=>{
    switch(action.type){
        case SET_ROOM_HOST:
            return {...state,isRoomHost:action.payload}
        case SET_ONLY_AUDIO:
            return {...state,onlyAudio:action.payload}
        case SET_IS_LOADING:
            return {...state,isLoading:action.payload}  
        case SET_ROOM_ID:
            return {...state,roomId:action.payload}  
        case SET_IDENTITY:
            return {...state,identity:action.payload}     
        case SET_CONNECTED_USER:
            return {...state,connectedUsers:action.payload}
        case SET_MESSAGES:
            return {...state,messages: [...state.messages,action.payload]}    
        case SET_SOCKET_ID:
            return {...state,socketId:action.payload}
        case SET_ACTIVE_CHAT_HISTORY:
            return {...state,activeChatHistory:action.payload}
        case SET_ACTIVE_CHAT_CONVERSATION:
            return {...state,activeConversation:action.payload}  
        case SET_LANG:
            return {...state,lang:action.payload} 
        case SET_OUTPUT:
            return {...state,output:action.payload}                    
        default:
            return state;
    }
};

