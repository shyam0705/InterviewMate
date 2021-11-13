import { SET_CONNECTED_USER } from "./types"

export const setConnectedUser=(data)=>{
    return {
        type:SET_CONNECTED_USER,
        payload:data
    }
}