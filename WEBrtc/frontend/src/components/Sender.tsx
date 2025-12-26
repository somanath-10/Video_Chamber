import { useEffect, useState } from "react";

export const Sender = ()=>{
    const[socket,setSocket] = useState<WebSocket|null>(null);
        useEffect(()=>{
            const ws = new WebSocket('ws://localhost:8080');
            ws.onopen=()=>{
                ws.send(JSON.stringify({type:"sender"}))
            }
            setSocket(ws)
        },[])

        
    async function Startvideo(){
        if(!socket)return;
        const pc = new RTCPeerConnection();

        pc.onnegotiationneeded=async()=>{
            console.log("on negotiated needed")
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({type:"createoffer",sdp:pc.localDescription}))
        }
    

        pc.onicecandidate = (event)=>{
            console.log("event candidate",event.candidate);

            if(event.candidate){
                socket?.send(JSON.stringify({type:"icecandidate",candidate:event.candidate}))
            }
        }

        socket.onmessage=async(event)=>{
            const message = JSON.parse(event.data);
            if(message.type === "createanswer"){
                await pc.setRemoteDescription(message.sdp);   
            }
            else if(message.type === "icecandidate"){
                pc.addIceCandidate(message.candidate)
            }
        }
    const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
});

stream.getTracks().forEach(track => pc.addTrack(track, stream));

    }

    return(
        <>  

            <button onClick={Startvideo}>
                send
            </button>
        </>
    )
}