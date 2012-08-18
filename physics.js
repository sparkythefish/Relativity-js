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
  physics.CENTER = b.vector(physics.WIDTH/2, physics.HEIGHT/2); 
  physics.SCALE = 10;

  //director
  //physics.director = new lime.Director(physicsDOM, physics.WIDTH, physics.HEIGHT);
  physics.director = new lime.Director(document.body); 
  physics.director.makeMobileWebAppCapable();

  var gamescene = new lime.Scene();

  var layer = new lime.Layer;
  layer.setPosition(0, 0);
  var playerLayer = new lime.Layer;
  playerLayer.setPosition(0,0);
  // TODO: this can kinda look cool
  //layer.setQuality(.1);
  //layer.setQuality(.7);
  gamescene.appendChild(layer);
  gamescene.appendChild(playerLayer);

  physics.gamescene = gamescene;
  physics.planetLayer = layer;
  physics.playerLayer = playerLayer;

  // set active scene
  physics.director.replaceScene(gamescene);

  physics.contact = false;
  physics.contactCount = 0;

  var gravity = b.vector(0, 0);
  var bounds = new box2d.AABB();
  var boundSize = 10;
  bounds.minVertex.Set(-boundSize*physics.WIDTH, -boundSize*physics.HEIGHT);
  bounds.maxVertex.Set(2*boundSize*physics.WIDTH, 2*boundSize*physics.HEIGHT);
  var world = new box2d.World(bounds, gravity, false);
  physics.world = world;

  level = new Level(levels.level01);
  player = new Player(level.player); 
  engine = new Engine();
  
  physics.frozen = false;

  lime.scheduleManager.schedule(function(dt) {
    if (!physics.frozen) {
      engine.tick(dt, player, level);
    }
    //if (physics.contactCount < physics.world.m_contactCount) {
    //  physics.contact = true;
    //  //physics.frozen = true;
    //  //physics.contactCount = physics.world.m_contactCount;
    //  physics.contactCount++; 
    //  c.l("contact!!");
    //} else {
    //  physics.contact = false;
    //}
    var contact = physics.world.GetContactList();
    if(contact) { 
      //var circle1 = contact.GetShape1().GetBody();
      //var circle2 = contact.GetShape2().GetBody();
      if (contact.postFinished) {
        c.l("colliding!!!");
      }
    }
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
  var x = (physics.CENTER.x * physics.SCALE) + position.x;
  var y = (physics.CENTER.y * physics.SCALE) + position.y;
  return b.vector(x,y);
};

goog.exportSymbol('physics.start', physics.start);
