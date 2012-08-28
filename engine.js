goog.provide('engine');

function Engine() {
  this.totalFps = 0;
  this.totalTicks = 1;
  this.closeIsh = false;
}

Engine.prototype.tick = function (dt, player, level) {

  var cPos = player.physical.GetCenterPosition().clone();

  var sum = b.vector(cPos.x, cPos.y);
  var divisor = 1; // 1 for the initial player position
  var closestDistance = -1;
  var stitchVect;
  if (!this.closeIsh) {
    stitchVect = cPos.clone().subtract(player.prevPos);

    c.d("stiching! prev: " + player.prevPos + " cur: " + cPos);
    //stitchVect = player.physical.GetLinearVelocity().clone();
    player.stitch(stitchVect);
    player.prevPos = player.physical.GetCenterPosition().clone();
    //cPos = player.physical.GetCenterPosition().clone();
  } else {
//    c.d("not stitching! cur: " + cPos);
  }
  
  //this.closeIsh = false;

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

    if (!this.closeIsh) {
//      c.d("stitching: " + stitchVect + " closest: " + closestDistance + " planet: " + planet.physical.GetCenterPosition());
      planet.stitch(stitchVect);
    } else {
      c.d("not stitching! planet: " + planet.physical.GetCenterPosition() + " player: " + player.physical.GetCenterPosition() + " closest: " + closestDistance + " planet rad: " + planet.physical.radius);
    }
    if (this.scale && 
          distance <= planet.physical.radius + player.physical.radius) {
      c.l("Collide!!!!");
    //  player.physical.SetLinearVelocity(b.vector(0,0));
    }
  }
  
  this.closeIsh = divisor > 1;
  
  var camera = engine.updateCamera(sum, divisor, cPos, closestDistance);

  var scale = camera.scale;
  this.scale = scale;
  player.updateVisual(cPos, scale);

  // TODO: fiddle with this forever
  var timeShiftBase = 1000;
  var timeShift = (scale * 100);
  var playerScaleShift = Math.max(1, scale);

  //player.movePower = player.movePowerBase * (scale / physics.SCALE);
  //player.physical.density = player.densityBase / (scale / physics.SCALE);

  player.tick(scale); 

  var shift = 300 + Math.sqrt(scale) * 50;
  //c.d("scale: " + scale + " shift: " + shift + " velocityLength: " + velocityLength + " playerVelocity: " + playerVelocity);
  //c.d("scale: " + scale + " shift: " + shift); 
  
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
