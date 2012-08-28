goog.provide('player');

function Player (playerDef) {

  var physicalRadius = .25;
  var start = b.vector(playerDef.start[0] / physics.SCALE, 
                       playerDef.start[1] / physics.SCALE);
  var pos = physics.pos(start);
  this.prevPos = pos;

  this.haloRadius = 50;
  this.initialRadius = 50;
  this.initialScale = physicalRadius / this.initialRadius;
  var playerLayer = l.circle(this.initialRadius);
  playerLayer.circle.setScale(1/((this.initialRadius / physicalRadius) * physics.SCALE));

  var haloLayer = l.circle(this.haloRadius);
  haloLayer.circle.setStroke(new lime.fill.Stroke(2, new lime.fill.Color([200,0,0,.4])))
  haloLayer.circle.setFill(0,0,0,0);      
  haloLayer.setScale(1);

  physics.playerLayer.appendChild(haloLayer);
  physics.playerLayer.appendChild(playerLayer);

  this.maxPower = 3;

  //this.densityBase = densityMultiplier * physics.SCALE * physics.SCALE * physics.SCALE;
  //this.densityBase = 1000;
  this.densityBase = 1000 * physics.SCALE * physics.SCALE;

  this.visible = playerLayer;
  this.halo = haloLayer.circle;

  this.physical = 
    b.circle((physicalRadius/2)/physics.SCALE, this.densityBase, pos, 4, 2);

  // togles showing the debug circles 
  this.debug = {"debug":true};

  this.origin = b.vector(0,0);
  this.maxVelocity = 20 / Math.sqrt(physics.SCALE);
  this.fudgeVelocity = this.maxVelocity + 1;
  this.forceScale = 50;// / Math.sqrt(physics.SCALE);
}

Player.prototype.applyForce = function(planet, distance, playerPos, planetPos) {
  var maxDist = planet.getGravityDistance();
  var minDist = planet.physical.radius * 1.2;
  var distRatio = 0;
  if (distance <= maxDist && distance > minDist) {
    distRatio = maxDist / (maxDist + distance); 
    var ang = m.angle(planetPos,playerPos);
    var radiusWeight = planet.gravityWeight;
    var intensity = this.maxPower * distRatio * radiusWeight;
    var dir = m.point(b.vector(0,0), ang, intensity / physics.SCALE);
    this.physical.ApplyForce(dir, planetPos);
  }
}

Player.prototype.impulse = function () {
  var dir = player.getDirectionalVelocity(this.scale); 
  dir.scale(this.forceScale / Math.sqrt(this.scale));
  if (this.debug.debug) {
    //this.debug.impulseCircle = l.qCircle(this.debug.impulseCircle, [0,256,256], 5, physics.playerLayer, dir);
  }
  this.physical.ApplyImpulse(dir, this.physical.GetCenterPosition());
}

Player.prototype.force = function (dir) {
  this.physical.ApplyForce(dir, this.physical.GetCenterPosition());
}

Player.prototype.updateVisual = function (updatedPos, scale) { 

  this.visible.setScale(scale);

  var physPos = this.physical.GetCenterPosition().clone();
  var localPos = physics.planetLayer.localToScreen(physPos);
  physics.playerLayer.setPosition(localPos);

  var visibleCircleSize = this.visible.circle.getSize().width*scale * this.initialScale * 10;
  var ratio = 1 - (visibleCircleSize / this.haloRadius);
  var alpha = Math.max(0, ratio);
  if (!this.dragPos) {
    this.halo.setStroke(2, new lime.fill.Color([256,256,256,alpha]));
  } else {
    this.halo.setStroke(2, new lime.fill.Color([256,0,0,alpha]));
  }
}

Player.prototype.tick = function (scale) {
  this.scale = scale;
  if (this.dragPos) {
    var forceVelocity = this.getDirectionalVelocity(scale).scale(this.forceScale / Math.sqrt(scale));
    if (this.debug.debug) {
      this.debug.forceCircle = l.qCircle(this.debug.forceCircle, [0,256,0], 5, physics.playerLayer, forceVelocity);
    }
    this.force(forceVelocity);
  }
}

Player.prototype.getDirectionalVelocity = function scale() {
  var playerVelocity = player.physical.GetLinearVelocity();
  var velocityLength = m.dist(this.origin, playerVelocity);
  //c.d("SCALE: " + physics.SCALE + " velocityLength: " + velocityLength);

  var playerAngle = m.angle(playerVelocity, this.origin); 
  var normalVelocity = m.point(this.origin, playerAngle, Math.min(this.maxVelocity, velocityLength));

  var touchAngle = m.angle(this.dragPos, this.origin);
  var touchVelocity = m.point(this.origin, touchAngle, this.fudgeVelocity);

  var diffVelocity = touchVelocity.clone().subtract(normalVelocity);

  if (this.debug.debug) {
    this.debug.touchCircle = l.qCircle(this.debug.touchCircle, [245,0,0], 5, physics.playerLayer, touchVelocity);
    this.debug.currentCircle = l.qCircle(this.debug.currentCircle, [0,0,256], 5, physics.playerLayer, normalVelocity);
  }

  return diffVelocity;
}

Player.prototype.stitch = function (stitchVect) {

  c.d("player frozen? " + this.physical.IsFrozen());

  this.physical.GetCenterPosition().x = 0;
  this.physical.GetCenterPosition().y = 0;
//  this.physical.SetCenterPosition(b.vector(0,0));

  //c.d("player pos: " + this.physical.GetCenterPosition());

  //c.d("before: " + velocity + " after: " + after + " stitch: " + stitchVect);
}
