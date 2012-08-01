goog.provide("level");

level.planets = [];
level.start;

level.build = function(levelDef){
  for (i in levelDef.planets) {
    var p = new Planet(levelDef.planets[i]);
    c.l("planet: " + p.physical);

    level.planets.push(p);
  }

  level.player = levelDef.player;

  return level;
}


