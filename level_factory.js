goog.provide("planet");

planet.build = function(planetDef) {
  var size = planetDef.radius *2;
  var posVec = b.vector(planetDef.pos[0], planetDef.pos[1])
  // limeCircle, for visual display
  var limeCircle = (new lime.Circle)
      .setFill(new lime.fill.LinearGradient()
      .addColorStop(0.49,200,0,0)
      .addColorStop(.5,0,0,250))
      .setPosition(physics.pos(posVec))
      .setSize(size, size);
  physics.planetLayer.appendChild(limeCircle);
}
