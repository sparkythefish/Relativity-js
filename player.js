goog.provide('player');

function Player (playerDef) {

  var radius = 2;
  var start = b.vector(playerDef.start[0], playerDef.start[1]);
  var pos = physics.pos(start);

  var playerLayer = l.circle(radius);
  physics.planetLayer.appendChild(playerLayer);

  this.maxPower = 3000;

  this.movePowerBase = 100000;
  this.movePower = this.movePowerBase;

  this.densityBase = 1000;

  this.visible = playerLayer;
  this.physical = 
    b.circle(radius/2, this.densityBase, pos, 4, 2);
}

Player.prototype.applyForce = function(planet, distance, playerPos, planetPos) {
  var maxDist = planet.getGravityDistance();
  var minDist = planet.physical.radius * 1.2;
  var distRatio = 0;
  if (distance <= maxDist && distance > minDist) {
    distRatio = maxDist / (maxDist + distance); 
    var ang = m.angle(planetPos,playerPos);
    var radiusWeight = planet.getGravityWeight();
    var intensity = this.maxPower * distRatio * radiusWeight;
    var dir = m.point(b.vector(0,0), ang, intensity);
    this.physical.ApplyForce(dir, planetPos);
  }
}

Player.prototype.moveUp = function () {
  this.move(b.vector(0,-this.movePower));
}

Player.prototype.moveLeft = function () {
  this.move(b.vector(-this.movePower,0));
}

Player.prototype.moveRight = function () {
  this.move(b.vector(this.movePower,0));
}

Player.prototype.moveDown = function () {
  this.move(b.vector(0,this.movePower));
}

Player.prototype.move = function (dir) {
  physics.frozen = false;
  this.physical.ApplyForce(dir);
}
