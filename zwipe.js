const WebSocket = require('ws');
const opn = require('opn')

const sensors = require('./sensors');

const wsPort = 48008;
const wss = new WebSocket.Server({
  host: '127.0.0.1', // Bind only localhost for more security.
  port: wsPort,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed.
  },
});

const extensionLink = 'https://chrome.google.com/webstore/detail/jabljkdnepaogjhbdalleajldigoklkd';
const extensionReleaseLink = 'https://github.com/artiya4u/zwipe-extension/releases';
const tinderAppLink = 'https://tinder.com/app/recs';

sensors.onStart(function () {
  console.log(`Download Zwipe Extension at: ${extensionLink} or ${extensionReleaseLink}`);
  console.log(`Zwipe started. Opening Tinder ${tinderAppLink}`);
  opn(tinderAppLink, {app: 'chrome'}); // Open on Chrome
});
sensors.start();

wss.on('connection', function connection(ws) {
  ws.on('message', async function incoming(message) {
    try {
      message = JSON.parse(message);
      if (message.type !== undefined) {
        if (message.type === 'new') {
          // Reset session
        } else if (message.type === 'wheel') {
          // Update wheel circumference
          sensors.setWheelCircumference(message.value);
          console.log('Updated wheel circumference: ' + message.value);
        }
      }
    } catch (e) {
    }
  });

  console.log('Zwipe Extension connected');

  sensors.addSensorsListener(function (data) {
    // Send data to extension.
    ws.send(JSON.stringify(data));
  });
});
