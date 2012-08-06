goog.provide('b');

b.vector = function (x,y) {
  var vec = new box2d.Vec2(x,y);
  return vec; 
};

b.circle = function (radius, density, pos, category, mask) {

  var cbodyDef = new box2d.BodyDef;
  cbodyDef.position.Set(pos.x, pos.y);

  // b2Circle, for physical interaction
  var b2Circle = new box2d.CircleDef;
  b2Circle.radius = radius;
  b2Circle.friction = 100;
  b2Circle.density = density;
  b2Circle.categoryBits = category;
  b2Circle.maskBits = mask;

  cbodyDef.AddShape(b2Circle);

  var physical = physics.world.CreateBody(cbodyDef);

  physical.radius = radius;
  physical.density = density;

  return physical;
}

box2d.Body.prototype.UnFreeze = function() {
  this.m_flags &= ~box2d.Body.Flags.frozenFlag;
};


