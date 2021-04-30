const control = {
  likeThreshold: 1.20, // +20%
  superLikeThreshold: 1.30, // + 30%
  targetDistance: 100,
  lastMove: Date.now(),
  sumSpeed: 0,
  averageSpeed: 0,
  updateCount: 0,
  overallDistance: 0,
  currentDistance: 0,
  webSocketClient: null,
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
      console.log('💗 Super Like!');
      control.action('super-like');
    } else if (speed >= control.averageSpeed * control.likeThreshold) {
      // Attack >> Like
      console.log('👍 Like');
      control.action('like');
    } else {
      // Pass
      console.log('❌ Pass', control.averageSpeed * control.superLikeThreshold);
      control.action('pass');
    }
  }
};

control.action = function (action) {
  if (control.webSocketClient != null) {
    control.webSocketClient.send(JSON.stringify({type: 'action', value: action}));
  }
}

module.exports = control;
