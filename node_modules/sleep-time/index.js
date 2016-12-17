
function sleepTime(ms) {
  if (isNaN(parseInt(ms)) || !isFinite(ms)) {
    return;
  }
  var arrival = new Date().getTime() + (ms);
  while (new Date().getTime() <= arrival) {
    ;
  }
}

module.exports = sleepTime;