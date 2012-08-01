goog.provide("planet");

function Planet (planetDef) {
  var size = planetDef.radius *2;
  var posVec = b.vector(planetDef.pos[0], planetDef.pos[1])
  var pos = physics.pos(posVec);
  // limeCircle, for visual display
  var limeCircle = (new lime.Circle)
      .setFill(new lime.fill.LinearGradient()
      .addColorStop(0.49,200,0,0)
      .addColorStop(.5,0,0,250))
      .setPosition(pos)
      .setSize(size, size);
  physics.planetLayer.appendChild(limeCircle);

  this.visible = limeCircle;

  // TODO: I put planets in a non-coliison categoryBit as the player.
  // This prevnts the player form colliding, while I play with the physics
  this.physical =
    b.circle(limeCircle.getSize().width/2, 0, pos, 1);

  this._gravityDistance = 0;
  this.getGravityDistance = function () {
    if (this._gravityDistance == 0) {
      this._gravityDistance = this.physical.radius * 3;
    }
    return this._gravityDistance;
  };

  this._gravityWeight = 0;
  this.getGravityWeight = function () {
    if (this._gravityWeight == 0) {
      this._gravityWeight = (this.physical.radius * this.physical.radius) * .01;
    }
    return this._gravityWeight;
  }
}

