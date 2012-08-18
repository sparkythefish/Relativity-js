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
  var closestPos = b.vector(0,0);
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
      c.c("pPos: " + pPos + " planet.zoomPos: " + planet.zoomPos);
      distance = m.dist(cPos, planet.zoomPos);
    }

    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
      closestPos = pPos;
    }
  }

  var camera = engine.updateCamera(sum, divisor, cPos, closestDistance, zoom, closestPos);

  var scale = camera.scale;
  player.updateVisual(cPos, scale);

  // TODO: fiddle with this forever
  var timeShiftBase = 1000;
  var timeShift = (scale * 100);
  var playerScaleShift = Math.max(1, scale);

  player.movePower = player.movePowerBase * (scale / physics.SCALE);
  player.physical.density = player.densityBase / (scale / physics.SCALE);
  
//  physics.world.Step(dt / 1000, 3);
  physics.world.Step(dt / (timeShiftBase + timeShift), 1);
}

Engine.prototype.updateCamera = function (sum, divisor, playerPos, closestDistance, zoom, closestPos) {
  var avgPlanet = sum.scale(1/(divisor));
  // TODO: this is good for debugging, but can be eliminated for performance
  var tempCpy = b.vector(avgPlanet.x, avgPlanet.y).add(b.vector(playerPos.x, playerPos.y));
  var cameraAvg = tempCpy.scale(.5);

  /* 
  if (!debug.avgPlanet) {
    debug.avgPlanet = new Planet({'pos':[avgPlanet.x, avgPlanet.y], 'radius':5});
  }
  debug.avgPlanet.visible.setPosition(avgPlanet);

  if (!debug.avg) {
    debug.avg = new Planet({'pos':[cameraAvg.x, cameraAvg.y], 'radius':10});
  }
  debug.avg.visible.setPosition(cameraAvg);
  */
  
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
  c.d("vel: " + playerVelocity);
  if (Math.abs(playerVelocity.x) + Math.abs(playerVelocity.y) > 100 / physics.SCALE) {
    playerVelocity.scale(.8);
  }

  physics.planetLayer.setScale(cameraScale);

  var prevLayerPos = physics.planetLayer.getPosition();
  var cameraPoint = cameraAvg;
  var cameraPosition = b.vector(-((cameraPoint.x * cameraScale) - (physics.CENTER.x)), 
                                -((cameraPoint.y * cameraScale) - (physics.CENTER.y)));
  
  physics.planetLayer.setPosition(cameraPosition);
  //physics.playerLayer.setPosition(cameraPosition);
  //physics.playerLayer.setScale(cameraScale);

  var camera = {}
  camera.scale = cameraScale;
  camera.position = cameraAvg;
  return camera;
}
