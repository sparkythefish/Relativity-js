goog.provide("level");

function Level (levelDef) {

  this.planets = [];

  for (i in levelDef.planets) {
    var p = new Planet(levelDef.planets[i]);
    this.planets.push(p);
  }

  this.player = levelDef.player;
}
