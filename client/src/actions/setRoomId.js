import { SET_ROOM_ID } from "./types"

export const setRoomId=(roomId)=>{
    return{
        type:SET_ROOM_ID,
        payload:roomId
    }
}