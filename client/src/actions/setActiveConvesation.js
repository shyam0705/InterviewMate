import { SET_ACTIVE_CHAT_CONVERSATION } from "./types"

export const setActiveConversation=(activeConversation)=>{
    return{
        type:SET_ACTIVE_CHAT_CONVERSATION,
        payload:activeConversation
    }
}