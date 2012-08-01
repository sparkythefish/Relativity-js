goog.provide('m');

m.dist = function(a,b) {
  var deltaX = a.x - b.x;
  var deltaY = a.y - b.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
}

m.angle = function (a,b) {
  var deltaX = a.x - b.x;
  var deltaY = a.y - b.y;
  return Math.atan2(deltaY, deltaX);
}

