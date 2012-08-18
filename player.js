goog.provide('player');

function Player (playerDef) {

  var physicalRadius = 2;
  var start = b.vector(playerDef.start[0] / physics.SCALE, 
                       playerDef.start[1] / physics.SCALE);
  var pos = physics.pos(start);

  this.haloRadius = 50;
  this.initialRadius = 50;
  this.initialScale = physicalRadius / this.initialRadius;
  var playerLayer = l.circle(this.initialRadius);
  playerLayer.setScale(1/(25 * physics.SCALE));
  var haloLayer = l.circle(this.haloRadius);
  physics.planetLayer.appendChild(haloLayer);
  physics.planetLayer.appendChild(playerLayer);

  this.maxPower = 3000;

  this.movePowerBase = 100000 / physics.SCALE;
  this.movePower = this.movePowerBase;

  //this.densityBase = 1000 * physics.SCALE * physics.SCALE;
  this.densityBase = 100;

  this.visible = playerLayer;
  this.halo = haloLayer;

  this.physical = 
    b.circle((physicalRadius/2)/physics.SCALE, this.densityBase, pos, 4, 2);
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
  this.physical.ApplyForce(dir, b.vector(0,0));
}

Player.prototype.updateVisual = function (updatedPos, scale) { 

  this.visible.setPosition(updatedPos);
  this.halo.setPosition(updatedPos);
  this.halo.setScale(1/scale);

  var visibleCircleSize = this.visible.circle.getSize().width*scale * this.initialScale;
  var ratio = 1 - (visibleCircleSize / this.haloRadius);
  var alpha = Math.max(0, ratio);
  this.halo.circle.setFill(100,100,100, alpha);
}
