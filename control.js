const control = {
  targetDistance: 100,
  lastMove: Date.now(),
  averageSpeed: 0,
  updateCount: 0,
  overallDistance: 0,
  currentDistance: 0,
  currentStart: Date.now(),
};

control.move = function (speed) {
  console.log(speed);
  let now = Date.now();
  let timePass = (now - control.lastMove) / 1000;
  let updatedDistance = speed * timePass;
  control.currentDistance += updatedDistance;
  control.lastMove = now;
  let distanceDiff = control.currentDistance - control.targetDistance;
  if (distanceDiff >= 0) {
    // Swipe

  }

};

module.exports = control;
