const yargs = require('yargs');
const WebSocket = require('ws');

const control = require('./control');
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

const argv = yargs.option('wheel', {
  alias: 'w',
  describe: 'Wheel circumference in metre',
  type: 'number',
}).help()
  .alias('help', 'h')
  .argv;

if (argv.wheel !== undefined && !isNaN(argv.wheel)) {
  sensors.wheelCircumference = argv.wheel;
}
console.log('minMoveSpeed:', control.minMoveSpeed);
console.log('wheelCircumference:', sensors.wheelCircumference);
sensors.addSensorsListener(function (data) {
  if (data.type === 'speed') { // Move from speed
    control.move(data.value);
  }
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
        } else if (message.type === 'target') {
          // Update meters target to swipe
          control.targetDistance = message.value;
        }
      }
    } catch (e) {
    }
  });

  control.webSocketClient = ws;

  sensors.addSensorsListener(function (data) {
    // Send data to extension.
    ws.send(JSON.stringify(data));
  });
});