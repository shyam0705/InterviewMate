import { setIsLoading } from "../actions/setIsLoading";
import { createRoom, joinRoom } from "./wss";
import {signalPeerData} from './wss';
import Peer from "simple-peer";
import  store  from '../store.js';
import { setMessages } from "../actions/setMessages";
import { fetchTurnCredentials } from "./turn";
import { getTurnCredentials } from "./turn";
const defaultConstrain={
    audio:true,
    video: {
        width: "480",
        height: "360",
    },
}

const onlyAudioConstrain={
  audio:true,
  video:false
}
let localStream;
export const getLocalPreviewAndInitLocalConnection=async (isRoomHost,identity,roomId=null,dispatch,onlyAudio)=>{
    const constrain=onlyAudio?onlyAudioConstrain:defaultConstrain
    await fetchTurnCredentials();
    navigator.mediaDevices.getUserMedia(constrain)
        .then((stream)=>{
            // console.log("success");
            localStream=stream;
            showLocalVideoPreview(localStream);
            dispatch(setIsLoading(false));
            isRoomHost?createRoom(identity,onlyAudio):joinRoom(roomId,identity,onlyAudio);
        })
        .catch((err)=>{
            // console.log("error occur during getting stream"+err);
        });
}

//preparing for connection
const getConfiguration = () => {
    const turnIceServers=getTurnCredentials();
    if(turnIceServers)
    {
      // console.log("turn server crendtial is:-",turnIceServers);
      return{
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          ...turnIceServers
        ],
      }
    }
    else{
      // console.log("only stun");
      return {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      };
  }
};
let peers=[];
let streams=[];
//const dataChannel='dataChannel';
//preaparing simple peer connection will also write connection handler on that
export const prepareNewPeerConnection = (connUserSocketId, isInitiator) => {
    const configuration = getConfiguration();
  
    peers[connUserSocketId] = new Peer({
      initiator: isInitiator,
      config: configuration,
      stream: localStream,
      //channelName:dataChannel
    });
  
    peers[connUserSocketId].on("signal", (data) => {
      // webRTC offer, webRTC Answer (SDP informations), ice candidates
  
      const signalData = {
        signal: data,
        connUserSocketId: connUserSocketId,
      };
  
      signalPeerData(signalData);
    });
  
    peers[connUserSocketId].on("stream", (stream) => {
      // console.log("new stream came");
  
      addStream(stream, connUserSocketId);
      streams = [...streams, stream];
    });

    peers[connUserSocketId].on("data",(data)=>{
        const message=JSON.parse(data);
        appendNewMessage(message);
    });
  };
  
export const handleSignalingData = (data) => {
    //add signaling data to peer connection
    peers[data.connUserSocketId].signal(data.signal);
};


//managing ui
const showLocalVideoPreview = (stream) => {
    const videosContainer = document.getElementById("videos_portal");
    videosContainer.classList.add("videos_portal_styles");
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video_track_container");
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.srcObject = stream;
  
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  
    videoContainer.appendChild(videoElement);
    const onlyAudio=store.getState().tmp.onlyAudio;
    if(onlyAudio)
    {
      videoContainer.appendChild(getAudioOnlyLabel());
    }
    videosContainer.appendChild(videoContainer);
};
  
const addStream = (stream, connUserSocketId) => {
    //display incoming stream
    const videosContainer = document.getElementById("videos_portal");
    const videoContainer = document.createElement("div");
    videoContainer.id = connUserSocketId;
  
    videoContainer.classList.add("video_track_container");
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.srcObject = stream;
    videoElement.id = `${connUserSocketId}-video`;
  
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  
    videoElement.addEventListener("click", () => {
      if (videoElement.classList.contains("full_screen")) {
        videoElement.classList.remove("full_screen");
      } else {
        videoElement.classList.add("full_screen");
      }
    });
    videoContainer.appendChild(videoElement);
    

    //check if other user connected only with audio
    const participants=store.getState().tmp.connectedUsers;
    const participant=participants.find((p)=>p.socketId===connUserSocketId);
    // console.log(participant);
    if(videoContainer!=null && participant?.onlyAudio)
    {
      videoContainer.appendChild(getAudioOnlyLabel());
    }
    else{
      videoContainer.style.position='static';
    }
    videosContainer.appendChild(videoContainer);

};

const getAudioOnlyLabel=()=>{
  const labelContainer=document.createElement("div");
  labelContainer.classList.add("label_only_audio_container");

  const label=document.createElement("p");
  label.classList.add("label_only_audio_text");
  label.innerHTML='Only Audio';
  labelContainer.appendChild(label);
  return labelContainer;
}

export const removePeerConnection=(data)=>{
  const {socketId}=data;
  const videoContainer=document.getElementById(socketId);
  const videoEl=document.getElementById(`${socketId}-video`);
  //to destroy video container
  if(videoContainer && videoEl)
  {
    const tracks=videoEl.srcObject.getTracks();
    tracks.forEach((t)=>t.stop());
    videoEl.srcObject=null;
    videoContainer.removeChild(videoEl);
    videoContainer.parentNode.removeChild(videoContainer);
  }

  //to remove connection object from peers array

  if(peers[socketId])
  {
    peers[socketId].destroy();
  }
  delete peers[socketId];
  
}

//buttons logic
export const toogleMic=(isMuted)=>{
    if(isMuted)
    {
        localStream.getAudioTracks()[0].enabled=true;
    }
    else
    {
      localStream.getAudioTracks()[0].enabled=false;
    }
}

export const toogleCamera=(isDisabled)=>{

  localStream.getVideoTracks()[0].enabled=isDisabled?true:false;
}

export const toggleScreenShare = (
  isScreenSharingActive,
  screenSharingStream = null
) => {
  if (isScreenSharingActive) {
    switchVideoTracks(localStream);
  } else {
    switchVideoTracks(screenSharingStream);
  }
};

const switchVideoTracks = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
          break;
        }
      }
    }
  }
};
//messages
const appendNewMessage=(message)=>{
    store.dispatch(setMessages(message));
}

export const sendMessageToOther=(message,identity)=>{
    const localMessageData={
        identity:identity,
        content:message,
        messageByMe:true
    }
    appendNewMessage(localMessageData);
    const sendMessageData={
        identity:identity,
        content:message,
        messageByMe:false
    }
    const dataToSend=JSON.stringify(sendMessageData);
    for(let socketId in peers)
    {
       peers[socketId].send(dataToSend);
    }
}
