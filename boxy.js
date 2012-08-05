goog.provide('b');

b.vector = function (x,y) {
  var vec = new box2d.Vec2(x,y);
  return vec; 
};

b.circle = function (radius, density, pos, bits) {

  var cbodyDef = new box2d.BodyDef;
  cbodyDef.position.Set(pos.x, pos.y);

  // b2Circle, for physical interaction
  var b2Circle = new box2d.CircleDef;
  b2Circle.radius = radius
  b2Circle.density = density;
  // TODO: I put planets in a non-coliison categoryBit as the player.
  // This prevnts the player form colliding, while I play with the physics
  //
  // * Comment out this line to enable collisions and remove 'bits'
  //b2Circle.categoryBits = bits;

  cbodyDef.AddShape(b2Circle);

  var physical = physics.world.CreateBody(cbodyDef);

  physical.radius = radius;
  physical.density = density;

  return physical;
}

//b.mul = function (vector, multiplier) {
//  var vec = b.vector(vector.x*multiplier,vector.y*multiplier);
//  return vec;
//}
