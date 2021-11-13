import { SET_LANG,SET_OUTPUT} from "./types"

export const setLang=(lang)=>{
    return{
        type:SET_LANG,
        payload:lang
    }
}

export const setOutput=(output)=>{
    return{
        type:SET_OUTPUT,
        payload:output
    }
}
