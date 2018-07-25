# chrome-websockets-test

This repository reproduces a problem with the Chrome WebSocket 
constructor sending `Sec-WebSocket-Protocol: undefined` request 
headers even though the `protocols` argument is undefined.

## Problem

The following WebSocket call succeeds:
```js
new WebSocket('ws://localhost:3000', undefined);
```

All of the following WebSocket calls are failing:
```js
new WebSocket('ws://localhost:3000', undefined, {});
new WebSocket('ws://localhost:3000', undefined, true);
new WebSocket('ws://localhost:3000', undefined, undefined, {});
```

The error we get is:
```
WebSocket connection to 'ws://localhost:3000' failed: Error during WebSocket handshake: Sent non-empty 'Sec-WebSocket-Protocol' header but no response was received
```

## Analysis

Chrome sends a `Sec-WebSocket-Protocol: undefined` request header 
if the WebSocket constructor is called with more than two parameters 
of which at least one is undefined.

Chrome expects the server to acknowledge the protocol (which would be `undefined`) by providing 
the same header in the response. Some server implementations won't
send the `Sec-WebSocket-Protocol` and as a result, the 101 handshake 
fails with the error message mentioned above.

## Demo

```bash
npm run server

> chrome-websockets-test@1.0.0 server /home/mischi/p/chrome-websockets-test
> node ./server.js

New connection established.
New connection: handleProtocols: Sec-WebSocket-Protocol request header was [ 'undefined' ]
New connection established.
```

```bash
npm test

> chrome-websockets-test@1.0.0 test /home/mischi/p/chrome-websockets-test
> node ./test.js

Should pass WebSocket connection is open.
Should fail WebSocket connection failed to open.
The connection was closed abnormally, e.g., without sending or receiving a Close control frame

Process finished with exit code 0
```

## References

- https://www.w3.org/TR/websockets/#the-websocket-interface
