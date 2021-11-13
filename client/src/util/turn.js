import { getTurnCredential } from "./api";

let TURNIceServers=null;

export const fetchTurnCredentials=async ()=>{
    const res=await getTurnCredential();
    if(res!=null && res.token!=null)
    {
        TURNIceServers=res.token.iceServers;
    }
}

export const getTurnCredentials=()=>{
    return TURNIceServers;
}