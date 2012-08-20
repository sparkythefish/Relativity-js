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

m.point = function (pos, angle, dist) {
  var x = pos.x + dist*Math.cos(angle);
  var y = pos.y + dist*Math.sin(angle);
  return b.vector(x,y);
}

m.trunc = function (num, dec) {
  var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  return result;
}
