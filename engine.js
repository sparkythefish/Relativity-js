goog.provide('engine');

function Engine() {
  this.totalFps = 0;
  this.totalTicks = 1;
}

Engine.prototype.tick = function (dt, player, level) {

  var cPos = player.physical.GetCenterPosition().clone();

  var sum = b.vector(cPos.x, cPos.y);
  var divisor = 1; // 1 for the initial player position
  var closestDistance = -1;

  for (x in level.planets) {
    var planet = level.planets[x];
    var pPos = planet.physical.GetCenterPosition().clone(); 
    var distance = m.dist(cPos, pPos); 

    player.applyForce(planet, distance, cPos, pPos);
    var cameraPos = planet.getCameraPosition(distance, cPos);

    sum.add(cameraPos);
    divisor += planet.time;

    planet.visible.setPosition(pPos);

    if (planet.zoom) {
      distance = m.dist(cPos, planet.zoomPos);
    }

    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
    }
  }

  var camera = engine.updateCamera(sum, divisor, cPos, closestDistance);

  var scale = camera.scale;
  player.updateVisual(cPos, scale);

  // TODO: fiddle with this forever
  var timeShiftBase = 1000;
  var timeShift = (scale * 100);
  var playerScaleShift = Math.max(1, scale);

  //player.movePower = player.movePowerBase * (scale / physics.SCALE);
  //player.physical.density = player.densityBase / (scale / physics.SCALE);
  
  physics.world.Step(dt / 1000, 1);
  //physics.world.Step(dt / (timeShiftBase + timeShift), 1);
}

Engine.prototype.updateCamera = function (sum, divisor, playerPos, closestDistance, zoom, closestPos) {
  var avgPlanet = sum.scale(1/(divisor));
  // TODO: this is good for debugging, but can be eliminated for performance
  var tempCpy = b.vector(avgPlanet.x, avgPlanet.y).add(b.vector(playerPos.x, playerPos.y));
  var cameraAvg = tempCpy.scale(.5);

  var cameraScale = (physics.CENTER.y * 1.1) / (closestDistance); 

  var playerVelocity = player.physical.GetLinearVelocity();
  if (Math.abs(playerVelocity.x) + Math.abs(playerVelocity.y) > 100 / physics.SCALE) {
    playerVelocity.scale(.8);
  }

  var cameraPoint = cameraAvg;
  var cameraPosition = b.vector(-((cameraPoint.x * cameraScale) - (physics.CENTER.x)), 
                                -((cameraPoint.y * cameraScale) - (physics.CENTER.y)));
  
  physics.planetLayer.setScale(cameraScale);
  physics.planetLayer.setPosition(cameraPosition);

  var camera = {}
  camera.scale = cameraScale;
  camera.position = cameraAvg;
  return camera;
}
