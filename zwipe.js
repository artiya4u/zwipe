const WebSocket = require('ws');
const sensors = require('./sensors');

const wsPort = 48008;
const wss = new WebSocket.Server({
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
        }
      }
    } catch (e) {
    }
  });

  sensors.addSensorsListener(function (data) {
    // Send data to extension.
    ws.send(JSON.stringify(data));
  });
});
