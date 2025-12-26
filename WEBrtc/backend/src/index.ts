import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port:8080});

let senderSocket :any=null;
let receiverSocket:any=null;

wss.on("connection",function message(ws){
    ws.on("message",function msg(data:any){
        const message = JSON.parse(data);
        if(message.type === "sender"){
            console.log("sender")
            senderSocket = ws
        }
        else if(message.type==="receiver"){
            console.log("receiver")
            receiverSocket = ws;
        }
        else if(message.type === "createoffer"){
            console.log("createoffer")
            receiverSocket.send(JSON.stringify({type:"createoffer",sdp:message.sdp}))
        }
        else if(message.type === "createanswer"){
            console.log("createanswer")
            senderSocket.send(JSON.stringify({type:"createanswer",sdp:message.sdp}))
        }
        else if(message.type === "icecandidate"){
            if(ws === senderSocket){
                receiverSocket.send(JSON.stringify({type:"icecandidate",candidate:message.candidate}));
            }
            else{
                senderSocket.send(JSON.stringify({type:"icecandidate",candidate:message.candidate}))
            }
        }
        console.log(message);
    })

})