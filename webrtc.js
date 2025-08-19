let localStream, remoteStream;
let peerConnection;
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

async function startVideoCall() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById("localVideo").srcObject = localStream;
  setupPeerConnection();
}

async function startVoiceCall() {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  setupPeerConnection();
}

function setupPeerConnection() {
  peerConnection = new RTCPeerConnection(servers);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    document.getElementById("remoteVideo").srcObject = remoteStream;
  };

  // Simulate signaling (in real app, use WebSocket or similar)
  peerConnection.createOffer().then(offer => {
    peerConnection.setLocalDescription(offer);
    // Simulate remote peer accepting offer
    peerConnection.setRemoteDescription(offer);
  });
}