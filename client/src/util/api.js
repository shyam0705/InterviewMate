import axios from "axios";

export const serverApi='';

export const getTurnCredential=async ()=>{
    try {
        const res=await axios.get(`${serverApi}/get-turn-credentials/`)
        return res.data;
    } catch (error) {
        // console.log(error);
        return null;
    }
}