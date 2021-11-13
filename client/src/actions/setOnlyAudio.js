import { SET_ONLY_AUDIO } from "./types"

export const setOnlyAudio=(onlyAudio)=>{
    return {
        type:SET_ONLY_AUDIO,
        payload:onlyAudio
    }
}