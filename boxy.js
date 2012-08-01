goog.provide('b');

b.vector = function (x,y) {
  return new box2d.Vec2(x,y);
};

b.circle = function (radius, density, pos, bits) {

  var cbodyDef = new box2d.BodyDef;
  cbodyDef.position.Set(pos.x, pos.y);

  // b2Circle, for physical interaction
  var b2Circle = new box2d.CircleDef;
  b2Circle.radius = radius
  b2Circle.density = density;
  b2Circle.categoryBits = bits;

  cbodyDef.AddShape(b2Circle);

  var physical = physics.world.CreateBody(cbodyDef);

  physical.radius = radius;
  physical.density = density;

  return physical;

}

