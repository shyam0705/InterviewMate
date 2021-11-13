import { SET_IDENTITY } from "./types"

export const setIdentity=(identity)=>{
    return({
        type:SET_IDENTITY,
        payload:identity
    })
}