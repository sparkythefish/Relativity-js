goog.provide("level");

function Level (levelDef) {

  this.planets = [];

  for (i in levelDef.planets) {
    var p = new Planet(levelDef.planets[i]);
    this.planets.push(p);
  }

  this.player = new Player(levelDef.player);
  this.dynamicCamera = false;
}

Level.prototype.tick = function (dt) {

  var cPos = this.player.currentPos().clone();
  var sum = b.vector(cPos.x, cPos.y);
  var divisor = 1; // 1 for the initial this.player position
  var closestDistance = -1;
  var stitchVect;
  if (!this.dynamicCamera) {
    stitchVect = this.player.stitch();
  } 

  c.debug.active = [];

  for (x in this.planets) {
    var planet = this.planets[x];
    var pPos = planet.visible.getPosition().clone(); 
    var distance = m.dist(cPos, pPos); 

    var debugPlanet = {};

    this.player.applyForce(planet, distance, cPos, pPos);
    var cameraPos = planet.getCameraPosition(distance, cPos);

    sum.add(cameraPos);
    divisor += planet.time;

    if (planet.zoom) {
      distance = m.dist(cPos, planet.zoomPos);
    }

    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
    }

    if (!this.dynamicCamera) {
      planet.stitch(this.player.totalStitchPos);
    } 

    if (distance > physics.WIDTH) {
      if (!planet.physical.IsFrozen()) {
        planet.physical.Freeze();
      }
    } else if (planet.physical.IsFrozen()) {
      planet.addPhysical(planet.originalPos.subtract(planet.totalStitch));
    }

    debugPlanet.frozen = planet.physical.IsFrozen();
    debugPlanet.pos = planet.physical.GetCenterPosition();

    c.debug.active.push(debugPlanet);
  }
  
  var camera = this.updateCamera(sum, divisor, this.player.currentPos().clone(), closestDistance);

  var scale = camera.scale;
  
  this.dynamicCamera = divisor > 1;

  this.scale = scale;
  this.player.updateVisual(cPos, scale);

  // TODO: fiddle with this forever
  var timeShiftBase = 1000;
  var timeShift = (scale * 100);
  var playerScaleShift = Math.max(1, scale);

  //this.player.movePower = this.player.movePowerBase * scale;
  //this.player.physical.density = this.player.densityBase / scale;

  this.player.tick(scale); 

  var shift = 300 + Math.sqrt(scale) * 50;
  
  physics.world.Step(dt / shift, 1);
  //physics.world.Step(dt / (timeShiftBase + timeShift), 1);
}

Level.prototype.updateCamera = function (sum, divisor, playerPos, closestDistance) {
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
