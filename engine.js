goog.provide('engine');

function Engine() {
  this.totalFps = 0;
  this.totalTicks = 1;
  this.closeIsh = false;
}

Engine.prototype.tick = function (dt, player, level) {

  var cPos = player.currentPos().clone();
  var sum = b.vector(cPos.x, cPos.y);
  var divisor = 1; // 1 for the initial player position
  var closestDistance = -1;
  var stitchVect;
  if (!this.closeIsh) {
    stitchVect = player.stitch();
  } 
  

  for (x in level.planets) {
    var planet = level.planets[x];
    var pPos = planet.visible.getPosition().clone(); 
    var distance = m.dist(cPos, pPos); 
    player.applyForce(planet, distance, cPos, pPos);
    var cameraPos = planet.getCameraPosition(distance, cPos);

    sum.add(cameraPos);
    divisor += planet.time;

    if (planet.zoom) {
      distance = m.dist(cPos, planet.zoomPos);
    }

    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
    }

    if (!this.closeIsh) {
      planet.stitch(stitchVect);
    } 
  }
  
  var camera = engine.updateCamera(sum, divisor, player.currentPos().clone(), closestDistance);

  var scale = camera.scale;
  
  this.closeIsh = divisor > 1;

  this.scale = scale;
  player.updateVisual(cPos, scale);

  // TODO: fiddle with this forever
  var timeShiftBase = 1000;
  var timeShift = (scale * 100);
  var playerScaleShift = Math.max(1, scale);

  //player.movePower = player.movePowerBase * scale;
  //player.physical.density = player.densityBase / scale;

  player.tick(scale); 

  var shift = 300 + Math.sqrt(scale) * 50;
  
  physics.world.Step(dt / shift, 1);
  //physics.world.Step(dt / (timeShiftBase + timeShift), 1);
}

Engine.prototype.updateCamera = function (sum, divisor, playerPos, closestDistance) {
  var avgPlanet = sum.scale(1/(divisor));
  // TODO: this is good for debugging, but can be eliminated for performance
  var tempCpy = b.vector(avgPlanet.x, avgPlanet.y).add(b.vector(playerPos.x, playerPos.y));
  var cameraAvg = tempCpy.scale(.5);

  var cameraScale = (physics.CENTER.y * 1) / (closestDistance); 
  var cameraPosition = b.vector(-((cameraAvg.x * cameraScale) - (physics.CENTER.x)), 
                                -((cameraAvg.y * cameraScale) - (physics.CENTER.y)));
  
  physics.planetLayer.setScale(cameraScale);
  physics.planetLayer.setPosition(cameraPosition);

  var camera = {}
  camera.scale = cameraScale;
  camera.position = cameraAvg;
  return camera;
}
