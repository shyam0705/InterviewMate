import { SET_ROOM_HOST } from "./types"

export const setHost=(isHost)=>{
    return {
        type:SET_ROOM_HOST,
        payload:isHost
    }
}