"use strict";

const puppeteer = require("puppeteer");

function printCode(code) {
  // See http://tools.ietf.org/html/rfc6455#section-7.4.1
  switch (code) {
    case 1000:
      return "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    case 1001:
      return 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
    case 1002:
      return "An endpoint is terminating the connection due to a protocol error";
    case 1003:
      return "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
    case 1004:
      return "Reserved. The specific meaning might be defined in the future.";
    case 1005:
      return "No status code was actually present.";
    case 1006:
      return "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    case 1007:
      return "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
    case 1008:
      return "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
    case 1009:
      return "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
    case 1010:
      return "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ";
    case 1011:
      return "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
    case 1015:
      return "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    default:
      return "Unknown reason";
  }
}

function parseResult(testName, result) {
  switch (result.name) {
    case "onopen":
      console.log(testName, "WebSocket connection is open.");
      break;
    case "onclose":
      console.warn(testName, "WebSocket connection failed to open.");
      console.warn(printCode(result.code));
      break;
    default:
      console.error(testName, "Unknown result", result);
  }
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const resultPositive = await page.evaluate(async () => {
    return await new Promise(resolve => {
      const socket = new WebSocket("ws://localhost:3000", undefined); // <-- notice the 2 args

      socket.onopen = () => resolve({ name: "onopen" });
      socket.onclose = evt =>
        resolve({
          name: "onclose",
          code: evt.code
        });
    });
  });
  parseResult("Should pass", resultPositive);

  const resultNegative = await page.evaluate(async () => {
    return await new Promise(resolve => {
      const socket = new WebSocket("ws://localhost:3000", undefined, {}); // <-- notice the 3 args

      socket.onopen = () => resolve({ name: "onopen" });
      socket.onclose = evt =>
        resolve({
          name: "onclose",
          code: evt.code
        });
    });
  });
  parseResult("Should fail", resultNegative);

  await browser.close();
})();
