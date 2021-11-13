import { SET_ACTIVE_CHAT_HISTORY } from "./types"

export const setChatHistory=(chatHistory)=>{
    return{
        type:SET_ACTIVE_CHAT_HISTORY,
        payload:chatHistory
    }
}