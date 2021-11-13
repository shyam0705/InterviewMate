import { SET_SOCKET_ID } from "./types"

export const setSocketId=(socketId)=>{
    return{
        type:SET_SOCKET_ID,
        payload:socketId
    }
}