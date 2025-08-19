const socket = new WebSocket('ws://localhost:8080');
const peer = new RTCPeerConnection();
let myId = '', targetId = '', aesKey = '';

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    document.getElementById('localVideo').srcObject = stream;
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
  });

socket.onmessage = async (event) => {
  const { type, from, payload } = JSON.parse(event.data);

  if (type === 'ping-response') {
    if (payload === true) {
      peer.createOffer().then(offer => {
        peer.setLocalDescription(offer);
        send('offer', targetId, offer);
      });
    } else {
      alert('User is offline');
    }
  } else if (type === 'offer') {
    const offer = decrypt(payload, aesKey);
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    send('answer', from, answer);
  } else if (type === 'answer') {
    const answer = decrypt(payload, aesKey);
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  } else if (type === 'ice') {
    const candidate = decrypt(payload, aesKey);
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  } else if (type === 'chat') {
    const message = decrypt(payload, aesKey);
    alert(`Message from ${from}: ${message}`);
  }
};

peer.onicecandidate = (event) => {
  if (event.candidate) send('ice', targetId, event.candidate);
};

peer.ontrack = (event) => {
  document.getElementById('remoteVideo').srcObject = event.streams[0];
};

function register() {
  myId = document.getElementById('myId').value;
  aesKey = document.getElementById('aesKey').value;
  socket.send(JSON.stringify({ type: 'register', from: myId }));
  localStorage.setItem('pingconnect_id', myId);
  localStorage.setItem('pingconnect_key', aesKey);
}

function pingUser() {
  targetId = document.getElementById('targetId').value;
  socket.send(JSON.stringify({ type: 'ping', from: myId, to: targetId }));
}

function send(type, to, payload) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), aesKey).toString();
  socket.send(JSON.stringify({ type, from: myId, to, payload: encrypted }));
}

function sendChat() {
  const msg = document.getElementById('chatBox').value;
  send('chat', targetId, msg);
}