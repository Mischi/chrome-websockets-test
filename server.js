const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 3000,
  handleProtocols: protocols => {
    console.log('New connection: handleProtocols: Sec-WebSocket-Protocol request header was', protocols);
    return false;
  }
});

wss.on('connection', () => {
  console.log('New connection established.');
});