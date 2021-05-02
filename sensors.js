const Ant = require('ant-plus');
const stick = new Ant.GarminStick2(); // Most common stick

const sensors = {
  wheelCircumference: 2.105,
  started: false,
};

sensors.listeners = [];
sensors.listener = function (data) {
  let userData = {};
  if (data.CalculatedSpeed !== undefined) {
    userData.type = 'speed';
    userData.value = data.CalculatedSpeed; // To M/S
    userData.raw = data;
  } else if (data.ComputedHeartRate !== undefined) {
    userData.type = 'heartrate';
    userData.value = data.ComputedHeartRate;
    userData.raw = data;
  } else if (data.CalculatedCadence !== undefined) {
    userData.type = 'cadence';
    userData.value = data.CalculatedCadence;
    userData.raw = data;
  } else {
    console.log(data);
  }

  // Call all listener
  for (let listener of sensors.listeners) {
    listener(userData);
  }
};

sensors.scanAll = function () {
  try {
    sensors.speedScanner.scan();
  } catch (e) {
  }
  try {
    sensors.speedCadenceScanner.scan();
  } catch (e) {
  }
  try {
    sensors.cadenceScanner.scan();
  } catch (e) {
  }
  try {
    sensors.hrScanner.scan();
  } catch (e) {
  }
};

sensors.onStart = function (callback) {
  sensors.onStartCallBack = callback;
}

sensors.addSensorsListener = function (listener) {
  sensors.listeners.push(listener);
};

sensors.setWheelCircumference = function (wheelCircumference) {
  if (wheelCircumference < 0.935 || wheelCircumference > 2.326) { // Check against wheel standard
    return;
  }
  sensors.wheelCircumference = wheelCircumference;
  if (sensors.speedCadenceScanner !== undefined) {
    sensors.speedCadenceScanner.setWheelCircumference(sensors.wheelCircumference);
  }
  if (sensors.speedScanner !== undefined) {
    sensors.speedScanner.setWheelCircumference(sensors.wheelCircumference);
  }
};

sensors.start = function () {
  if (sensors.started) { // Start once
    return;
  }
  sensors.hrScanner = new Ant.HeartRateScanner(stick);
  sensors.hrScanner.on('attached', () => {
    sensors.scanAll();
  });
  sensors.hrScanner.on('hbData', data => {
    sensors.listener(data);
  });

  sensors.speedCadenceScanner = new Ant.SpeedCadenceScanner(stick);
  sensors.speedCadenceScanner.setWheelCircumference(sensors.wheelCircumference);
  sensors.speedCadenceScanner.on('attached', () => {
    sensors.scanAll();
  });
  sensors.speedCadenceScanner.on('speedData', data => {
    sensors.listener(data);
  });

  sensors.speedCadenceScanner.on('cadenceData', data => {
    sensors.listener(data);
  });

  sensors.speedScanner = new Ant.SpeedScanner(stick);
  sensors.speedScanner.setWheelCircumference(sensors.wheelCircumference);
  sensors.speedScanner.on('attached', () => {
    sensors.scanAll();
  });
  sensors.speedScanner.on('speedData', data => {
    sensors.listener(data);
  });

  sensors.cadenceScanner = new Ant.CadenceScanner(stick);
  sensors.cadenceScanner.on('attached', () => {
    sensors.scanAll();
  });
  sensors.cadenceScanner.on('cadenceData', data => {
    sensors.listener(data);
  });

  stick.on('startup', function () {
    console.log('sensors startup');
    sensors.speedScanner.scan();
    if (sensors.onStartCallBack !== null) {
      sensors.onStartCallBack();
    }
  });

  if (!stick.open()) {
    console.log('Stick not found!');
    console.log('Please use GarminStick2 compatible ANT+ USB stick.');
    console.log('More information on https://github.com/Loghorn/ant-plus');
  }
  sensors.started = true;
};

module.exports = sensors;
