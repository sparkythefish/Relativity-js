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
goog.require('lime.events.Event');
goog.require('lime.fill.LinearGradient');
goog.require('lime.animation.ScaleTo');

goog.require('goog.events.KeyCodes');

physics.start = function() {

  var physicsDOM = document.getElementById("physicsDOM");
  physics.WIDTH = window.innerWidth; 
  physics.HEIGHT = window.innerHeight; 
  physics.CENTER = b.vector(physics.WIDTH/2, physics.HEIGHT/2); 
  physics.SCALE = 1;

  physics.director = new lime.Director(document.body); 
  physics.director.makeMobileWebAppCapable();

  var gamescene = new lime.Scene();

  var layer = new lime.Layer;
  layer.setPosition(0, 0);
  layer.setRenderer(lime.Renderer.DOM);
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
  //bounds.minVertex.Set(-boundSize*physics.WIDTH, -boundSize*physics.HEIGHT);
  //bounds.maxVertex.Set(2*boundSize*physics.WIDTH, 2*boundSize*physics.HEIGHT);
  var staticSize = 10000;
  bounds.minVertex.Set(-staticSize, -staticSize);
  bounds.maxVertex.Set(2*staticSize,2*staticSize);
  var world = new box2d.World(bounds, gravity, false);
  physics.world = world;

  level = new Level(levels.level01);
  player = new Player(level.player); 
  engine = new Engine();

  //lime.scheduleManager.setDisplayRate(1000/60);

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

  goog.events.listen(document,['mousedown','touchstart'],function(e){
    var eventPos = physics.getEventRelativePlayer(event, player);
    player.dragPos = eventPos;
    //player.impulse(eventPos.scale(.5/physics.SCALE));
    player.impulse();
  });

  goog.events.listen(document,['mousemove','touchmove'],function(e){
    var eventPos = physics.getEventRelativePlayer(event, player);
    if (player.dragPos) {
      player.dragPos = eventPos;
    }
  });

  goog.events.listen(document,['mouseup','touchend'],function(e){
    player.dragPos = false;
  });
};

physics.getEventPosition = function (e) {
  var pos = b.vector(0,0);
  if (e.touches) {
    var touch = e.touches[0];
    pos.x = touch.pageX;
    pos.y = touch.pageY;
  } else {
    pos.x = e.pageX;
    pos.y = e.pageY;
  }
  return pos;
}

physics.getEventRelativePlayer = function (e, player) {
  var eventPos = this.getEventPosition(e)
  var mousePos = physics.convertMousePos(eventPos, player);
  return mousePos;
}


physics.pos = function (position) {
  var x = (physics.CENTER.x * physics.SCALE) + position.x;
  var y = (physics.CENTER.y * physics.SCALE) + position.y;
  return b.vector(x,y);
};

physics.convertMousePos = function (pos, player) {
  var physPos = player.physical.GetCenterPosition().clone();
  var localPos = physics.planetLayer.localToScreen(physPos);
  var x = pos.x - localPos.x;
  var y = pos.y - localPos.y;
  var mousePos = b.vector(x,y);
  return mousePos;
}

goog.exportSymbol('physics.start', physics.start);
