import { SET_MESSAGES } from "./types"

export const setMessages=(message)=>{
    return{
        type:SET_MESSAGES,
        payload:message
    }
}