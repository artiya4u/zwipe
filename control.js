const control = {
  likeThreshold: 0.2,
  superLikeThreshold: 0.3,
  targetDistance: 100,
  lastMove: Date.now(),
  sumSpeed: 0,
  averageSpeed: 0,
  updateCount: 0,
  overallDistance: 0,
  currentDistance: 0,
  currentStart: Date.now(),
};

control.move = function (speed) {
  let speedKPH = speed * 3600 / 1000;
  console.log(speed, speedKPH);
  control.sumSpeed += speed;
  control.updateCount += 1;
  control.averageSpeed = control.sumSpeed / control.updateCount;

  let now = Date.now();
  let timePass = (now - control.lastMove) / 1000;
  let updatedDistance = speed * timePass;

  control.currentDistance += updatedDistance;
  control.lastMove = now;
  console.log('currentDistance', control.currentDistance);
  let distanceDiff = control.currentDistance - control.targetDistance;
  if (distanceDiff >= 0 && control.averageSpeed > 0) {
    control.currentDistance = distanceDiff;
    // Swipe
    if (speed >= control.averageSpeed * control.superLikeThreshold) {
      // Sprint >> Super like
      console.log('Super Like', speedKPH);
    } else if (speed >= control.averageSpeed * control.likeThreshold) {
      // Attack >> Like
      console.log('Like', speedKPH);
    } else {
      // Pass
      console.log('Pass', speedKPH);
    }
  }
};

module.exports = control;
