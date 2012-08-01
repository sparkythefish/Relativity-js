goog.provide('engine');

engine.maxPower = 3000;

engine.tick = function (dt, player, level) {

    var cPos = player.physical.GetCenterPosition().clone();
    c.c(cPos);
  
    for (x in level.planets) {
      var planet = level.planets[x];
      var pPos = planet.physical.GetCenterPosition().clone(); 
      var distance = m.dist(cPos, pPos); 

      player.applyForce(planet, distance, cPos, pPos);
      // TODO:
      // sum += planet.getCameraPosition()

      planet.visible.setPosition(pPos);
    }
      
    // Map the physical to visible world 
    player.visible.setPosition(cPos);
    physics.world.Step(dt / 1000, 3);

    //c.c("cPos: " + cPos.x);
}

