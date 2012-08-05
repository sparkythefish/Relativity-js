goog.provide('player');

function Player (playerDef) {

  var radius = 50;
  var start = b.vector(playerDef.start[0], playerDef.start[1]);
  var pos = physics.pos(start);

  var playerLayer = l.circle(radius);
  physics.planetLayer.appendChild(playerLayer);

  this.maxPower = 3000;

  this.movePower = 200;

  this.visible = playerLayer;
  this.physical = 
    b.circle(radius/2, 1, pos);
}

Player.prototype.applyForce = function(planet, distance, playerPos, planetPos) {
  var maxDist = planet.getGravityDistance();
  var distRatio = 0;
  c.c("dist: " + distance + " maxDist: " + maxDist);
  if (distance <= maxDist) {
    distRatio = maxDist / (maxDist + distance); 
    c.c(" distRatio: " + distRatio);

    var ang = m.angle(planetPos,playerPos);
    var radiusWeight = planet.getGravityWeight();
    var intensity = this.maxPower * distRatio * radiusWeight;
    c.c("ang: " + ang + " radW: " + radiusWeight + " int: " + intensity);
    var dir = b.vector(intensity * Math.cos(ang),
                       intensity * Math.sin(ang));
    //c.d("angle: " + ang + " cPos: " + cPos + " pPos: " + pPos);
    //c.d("dir.x: " + dir.x + " dir.y: " + dir.y);

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
  this.physical.SetLinearVelocity(dir);
}
