import { useEffect, useRef, useState } from "react";

export const Receiver = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "receiver" }));
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "createoffer") {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            ws.send(
              JSON.stringify({
                type: "icecandidate",
                candidate: e.candidate
              })
            );
          }
        };

pc.ontrack = (event) => {
  if (videoRef.current) {
    videoRef.current.srcObject = event.streams[0];
  }
};


        await pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ws.send(
          JSON.stringify({
            type: "createanswer",
            sdp: pc.localDescription
          })
        );
      }

      if (message.type === "icecandidate") {
        await pcRef.current?.addIceCandidate(message.candidate);
      }
    };

    setSocket(ws);
  }, []);

  return <video
  ref={videoRef}
  autoPlay
  muted
  playsInline
  style={{ width: "400px" }}
/>

};
