goog.provide('physics');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.JointDef');
goog.require('box2d.MouseJointDef');
goog.require('box2d.World');

goog.require('lime');
goog.require('lime.Circle');
goog.require('lime.CoverNode');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.fill.LinearGradient');
goog.require('lime.animation.ScaleTo');

goog.require('goog.events.KeyCodes');

//goog.require('levels');

physics.start = function() {

  var physicsDOM = document.getElementById("physicsDOM");
  physics.WIDTH = window.innerWidth; 
  physics.HEIGHT = window.innerHeight; 
  physics.CENTER = new box2d.Vec2(physics.WIDTH/2, physics.HEIGHT/2); 
  c.l(physics.CENTER);

  //director
  //physics.director = new lime.Director(physicsDOM, physics.WIDTH, physics.HEIGHT);
  physics.director = new lime.Director(document.body); 
  physics.director.makeMobileWebAppCapable();

  var gamescene = new lime.Scene();

  var layer = new lime.Layer;
  layer.setPosition(0, 0);
  gamescene.appendChild(layer);

  physics.gamescene = gamescene;
  physics.planetLayer = layer;

  // set active scene
  physics.director.replaceScene(gamescene);

  var gravity = new box2d.Vec2(0, 0);
  var bounds = new box2d.AABB();
  bounds.minVertex.Set(-physics.WIDTH, -physics.HEIGHT);
  bounds.maxVertex.Set(2*physics.WIDTH,2*physics.HEIGHT);
  var world = new box2d.World(bounds, gravity, false);
  physics.world = world;

  level = new Level(levels.level01);
  player = new Player(level.player); 

  lime.scheduleManager.schedule(function(dt) {
    engine.tick(dt, player, level);
  },this);

  goog.events.listen(document, ['keydown'], function(e) { 
    if (e.keyCode == goog.events.KeyCodes.LEFT) { 
      player.moveLeft(); 
    } 
    if (e.keyCode == goog.events.KeyCodes.UP) { 
      player.moveUp(); 
    } 
    if (e.keyCode == goog.events.KeyCodes.RIGHT) { 
      player.moveRight(); 
    } 
    if (e.keyCode == goog.events.KeyCodes.DOWN) { 
      player.moveDown(); 
    } 
  }); 
};

physics.pos = function (position) {
  var x = physics.CENTER.x + position.x;
  var y = physics.CENTER.y + position.y;
  return b.vector(x,y);
};

goog.exportSymbol('physics.start', physics.start);
