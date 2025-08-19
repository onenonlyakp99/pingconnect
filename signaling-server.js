const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const peers = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, from, to, payload } = data;

      if (type === 'register') {
        peers.set(from, ws);
        ws.send(JSON.stringify({ type: 'status', from: 'server', payload: 'registered' }));
      } else if (type === 'ping') {
        const online = peers.has(to);
        ws.send(JSON.stringify({ type: 'ping-response', from: 'server', payload: online }));
      } else if (peers.has(to)) {
        peers.get(to).send(JSON.stringify({ type, from, payload }));
      }
    } catch (err) {
      console.error('Invalid message:', err);
    }
  });

  ws.on('close', () => {
    for (let [id, socket] of peers.entries()) {
      if (socket === ws) peers.delete(id);
    }
  });
});