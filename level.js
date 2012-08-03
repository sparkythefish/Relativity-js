goog.provide("level");

function Level (levelDef) {

  this.planets = [];

  for (i in levelDef.planets) {
    var p = new Planet(levelDef.planets[i]);
    c.l("planet: " + p.physical);

    this.planets.push(p);
  }

  this.player = levelDef.player;
}
