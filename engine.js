goog.provide('engine');

debug = {}

engine.tick = function (dt, player, level) {

    var cPos = player.physical.GetCenterPosition().clone();

    //var sum = b.vector(cPos.x, cPos.y);
    var sum = b.vector(0,0);
    var divisor = 1; // 1 for the initial player position
  
    for (x in level.planets) {
      var planet = level.planets[x];
      var pPos = planet.physical.GetCenterPosition().clone(); 
      var distance = m.dist(cPos, pPos); 

      player.applyForce(planet, distance, cPos, pPos);
      var cameraPos = planet.getCameraPosition(distance);

      sum.add(cameraPos);
      divisor += planet.time;

      planet.visible.setPosition(pPos);
    }

    // TODO: Can't divide by 3 - need to divide by the number of time multipliers
    // as well, in order to normalize the weights.
    // Think:
    // two numbers, 10 and 5. You want to weight 10 by 3 times the amount of the weight of
    // 5:
    // (10 * 3) + (5 * 1) / 2 (number of objects) = 17.5! which is not between 10 and 5.
    // What to do:
    // (10 * 3) + (5 * 1) / 4 (number of multipliers) = 35/4 = 8.75, which is what we want.
    var playerPos = b.vector(cPos.x, cPos.y);//physics.pos(cPos);
    sum = sum.add(playerPos);
    var avgPlanet = sum.scale(1/(divisor));
    //sum = playerPos.add(avgPlanet);
    //var avg = divisor > 1 ? sum.scale(1/2) : sum;

    //c.d("avg: " + avg + " sum: " + sum + " divisor: " + divisor);
    c.d(" sum: " + sum + " divisor: " + divisor);
    //if (!debug.avg) {
    //  debug.avg = new Planet({'pos':[avg.x, avg.y], 'radius':20});
    //}
    //debug.avg.visible.setPosition(avg);
    if (!debug.avgPlanet) {
      debug.avgPlanet = new Planet({'pos':[avgPlanet.x, avgPlanet.y], 'radius':10});
    }
    debug.avgPlanet.visible.setPosition(avgPlanet);



      
    // Map the physical to visible world 
    player.visible.setPosition(cPos);
    physics.world.Step(dt / 1000, 3);

    //c.c("cPos: " + cPos.x);
}

