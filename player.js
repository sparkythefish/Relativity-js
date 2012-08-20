goog.provide('player');

function Player (playerDef) {

  var physicalRadius = .25;
  var start = b.vector(playerDef.start[0] / physics.SCALE, 
                       playerDef.start[1] / physics.SCALE);
  var pos = physics.pos(start);

  this.haloRadius = 50;
  this.initialRadius = 50;
  this.initialScale = physicalRadius / this.initialRadius;
  var playerLayer = l.circle(this.initialRadius);
  playerLayer.circle.setScale(1/((this.initialRadius / physicalRadius) * physics.SCALE));

  var haloLayer = l.circle(this.haloRadius);
  haloLayer.circle.setStroke(new lime.fill.Stroke(2, new lime.fill.Color([200,0,0,.4])))
  haloLayer.circle.setFill(0,0,0,0);      

  physics.playerLayer.appendChild(haloLayer);
  physics.playerLayer.appendChild(playerLayer);

  this.maxPower = 3;

  this.movePowerBase = 100 / physics.SCALE;
  this.movePower = this.movePowerBase;

  var densityMultiplier = physicalRadius < 1 ? 1/Math.exp(physicalRadius,100) : 2/physicalRadius;

  this.densityBase = densityMultiplier * physics.SCALE * physics.SCALE * physics.SCALE;
  this.densityBase = 1000;

  this.visible = playerLayer;
  this.halo = haloLayer.circle;

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

Player.prototype.move = function (dir) {
  this.physical.ApplyImpulse(dir, this.physical.GetCenterPosition());
}

Player.prototype.updateVisual = function (updatedPos, scale) { 

  this.visible.setScale(scale);

  var physPos = this.physical.GetCenterPosition().clone();
  var localPos = physics.planetLayer.localToScreen(physPos);
  physics.playerLayer.setPosition(localPos);

  var visibleCircleSize = this.visible.circle.getSize().width*scale * this.initialScale * 10;
  var ratio = 1 - (visibleCircleSize / this.haloRadius);
  var alpha = Math.max(0, ratio);
  this.halo.setStroke(2, new lime.fill.Color([256,256,256,alpha]));
}
