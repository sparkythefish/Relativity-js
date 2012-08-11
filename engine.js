goog.provide('engine');

debug = {}

function Engine() {
  this.totalFps = 0;
  this.totalTicks = 1;
}

Engine.prototype.tick = function (dt, player, level) {

  var cPos = player.physical.GetCenterPosition().clone();

  var sum = b.vector(cPos.x, cPos.y);
  var divisor = 1; // 1 for the initial player position
  var closestDistance = -1;
  var zoom = false;

  for (x in level.planets) {
    var planet = level.planets[x];
    var pPos = planet.physical.GetCenterPosition().clone(); 
    var distance = m.dist(cPos, pPos); 

    player.applyForce(planet, distance, cPos, pPos);
    var cameraPos = planet.getCameraPosition(distance, cPos);

    sum.add(cameraPos);
    divisor += planet.time;

    planet.visible.setPosition(pPos);

    if (!zoom && planet.zoom) {
      zoom = true;
    }

    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
    }
  }

  var scale = engine.updateCamera(sum, divisor, cPos, closestDistance, zoom);
  // Map the physical to visible world P
  player.visible.setPosition(cPos);
  // TODO: fiddle with this forever
  //physics.world.Step(dt / 1000, 3);
  var timeShiftBase = 1000;
  var timeShift = (scale * 100);
  var playerScaleShift = Math.max(1, scale);

  player.movePower = player.movePowerBase * scale;
  player.physical.density = player.densityBase / scale;
  
  physics.world.Step(dt / (timeShiftBase + timeShift), 1);
}


Engine.prototype.updateCamera = function (sum, divisor, playerPos, closestDistance, zoom) {
  var avgPlanet = sum.scale(1/(divisor));
  // TODO: this is good for debugging, but can be eliminated for performance
  var tempCpy = b.vector(avgPlanet.x, avgPlanet.y).add(b.vector(playerPos.x, playerPos.y));
  var cameraAvg = tempCpy.scale(.5);

  if (zoom) {
    c.c("engine.avgPlanet: " + avgPlanet + " divisor: " + divisor);
    var zoomDistance = m.dist(avgPlanet, playerPos);
    var maxZoom = 2;
    dbg = "1: " + closestDistance.toString();
    closestDistance = zoomDistance > maxZoom ? zoomDistance : maxZoom;
    c.c(dbg + " 2: " + closestDistance);
  }
  
  if (!debug.avgPlanet) {
    debug.avgPlanet = new Planet({'pos':[avgPlanet.x, avgPlanet.y], 'radius':5});
  }
  debug.avgPlanet.visible.setPosition(avgPlanet);

  if (!debug.avg) {
    debug.avg = new Planet({'pos':[cameraAvg.x, cameraAvg.y], 'radius':10});
  }
  debug.avg.visible.setPosition(cameraAvg);
  
  var fps = physics.director.fps;
  if (!this.totalFps) {
    this.totalFps = fps;
  } else {
    this.totalFps += fps; 
  }
  this.totalTicks++;

  var avgFps = this.totalFps / this.totalTicks;

  var cameraScale = (physics.CENTER.y * 1.1) / (closestDistance); 
  //c.d("avg fps:" + avgFps + " sum: " + sum + " divisor: " + divisor + " closestD: " + closestDistance + " cameraScale: " + cameraScale);

  var playerVelocity = player.physical.GetLinearVelocity();
  if (Math.abs(playerVelocity.x) + Math.abs(playerVelocity.y) > 100) {
    playerVelocity.scale(.8);
  }
  c.d("velocity: " + playerVelocity);

  physics.planetLayer.setScale(cameraScale);

  var prevLayerPos = physics.planetLayer.getPosition();
  var cameraPoint = cameraAvg;
  physics.planetLayer.setPosition(-((cameraPoint.x * cameraScale) - (physics.CENTER.x)), 
                                   -((cameraPoint.y * cameraScale) - (physics.CENTER.y)));

  return cameraScale;
}
