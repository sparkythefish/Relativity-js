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

  //level = physics.generateLevel(levels.level01, null);
  //player = physics.createPlayer(level, null);
  
  l = level.build(levels.level01);
  //frank = physics.createPlayer(l, null);
  frank = new Player(l.player); 

  lime.scheduleManager.schedule(function(dt) {
    //frank.tick();
    engine.tick(dt, frank, l);
  },this);

  goog.events.listen(document, ['keydown'], function(e) { 
    if (e.keyCode == goog.events.KeyCodes.LEFT) { 
      player.moveLeft = true; 
    } 
    if (e.keyCode == goog.events.KeyCodes.UP) { 
      player.moveUp = true; 
    } 
  }); 
};

physics.createPlayer = function (level, generatedLevel) {
  c.o(level.player, 'start');

  var radius = 50;
  var start = b.vector(level.player.start[0], level.player.start[1]);
  var pos = physics.pos(start);

  c.l("player pos: " + pos);

  // limeCircle, for visual display
  var limeCircle = (new lime.Circle)
      .setStroke(new lime.fill.Stroke())
      .setFill(0,0,0,.5)
      .setSize(radius, radius);
  //physics.planetLayer.appendChild(limeCircle);
  physics.gamescene.appendChild(limeCircle);

  var limeCircleExpander = (new lime.Circle)
      //.setStroke(new lime.fill.Stroke())
      //.setFill(0,0,0,.5)
      .setSize(radius+20, radius+20);
  //physics.planetLayer.appendChild(limeCircle);
  physics.gamescene.appendChild(limeCircleExpander);

  var cbodyDef = new box2d.BodyDef;
  cbodyDef.position.Set(pos.x, pos.y);

  // b2Circle, for physical interaction
  var b2Circle = new box2d.CircleDef;
  b2Circle.radius = limeCircle.getSize().width/2;
  b2Circle.density = 1;

  cbodyDef.AddShape(b2Circle);

  var b2CircleBody = physics.world.CreateBody(cbodyDef);
  //b2CircleBody.SetLinearVelocity(b.vector(-100,10));

  var player = {}

  player.firstTick = true;
  player.generatedLevel = generatedLevel;
  var printOnce = true;
  var maxPower = 3000;

  player.tick = function(dt) {

    var cPos = b2CircleBody.GetCenterPosition().clone();

    for (x in level.planets) {
      var planet = level.planets[x];
      var pPos = planet.physical.GetCenterPosition().clone(); 
      pPos = physics.pos(pPos);

      var maxDist = planet.physical.radius * 3;
      var distance = m.dist(cPos, pPos); 
      c.c("maxDist: " + maxDist + " distance: " + distance + " cPos: " + cPos);
      var distRatio = 0;
      if (distance <= maxDist) {
        distRatio = maxDist / (maxDist + distance); 

        var ang = m.angle(pPos,cPos);
        var radiusWeight = (planet.physical.radius * planet.physical.radius) * .01;
        c.c("rw: " + radiusWeight);
        var intensity = maxPower * distRatio * radiusWeight;
        var dir = b.vector(intensity * Math.cos(ang),
                           intensity * Math.sin(ang));
        //c.d("dir.x: " + dir.x + " dir.y: " + dir.y);
        b2CircleBody.ApplyForce(dir, pPos);
      }
    }
      
    // Map the physical to visible world 
    limeCircle.setPosition(cPos);
    limeCircleExpander.setPosition(cPos);
    physics.world.Step(dt / 1000, 3);

  };

//  var xAdjust = level.width / 2;
//  var yAdjust = level.height / 2;
//
//  function getGridEntry(pos) {
//
//    var debug = " pos.x: " + pos.x + " pos.y: " + pos.y;
//    //var diffX = physics.CENTER.x - centeredPos.x;
//    //var diffY = physics.CENTER.y - centeredPos.y;
//    var diffX = pos.x - physics.CENTER.x;
//    var diffY = pos.y - physics.CENTER.y;
//    var gridEntry = {};
//    debug += " diffX: " + diffX + " diffY: " + diffY;
//    var key = Math.round(diffX)+':'+Math.round(diffY);
//    c.d(debug + " " + key);
//    if (key in generatedLevel) {
//      gridEntry = generatedLevel[key];
//    }
//
//    return gridEntry;
//  }

  return player;
};

//physics.generateLevel = function (level, generatedLevel) {
//
//
//  for (x in level.planets) {
//    physics.createPlanet(level.planets[x]) 
//  }
//
//  return level;
//};

physics.createPlanet = function (planet) {
  c.l(planet)
  c.o(planet, 'pos');
  var size = planet.radius *2;
  var posVec = b.vector(planet.pos[0], planet.pos[1])
  // limeCircle, for visual display
  var limeCircle = (new lime.Circle)
      .setFill(new lime.fill.LinearGradient()
      .addColorStop(0.49,200,0,0)
      .addColorStop(.5,0,0,250))
      .setPosition(physics.pos(posVec))
      .setSize(size, size);
  physics.planetLayer.appendChild(limeCircle);
};

physics.pos = function (position) {
  var x = physics.CENTER.x + position.x;
  var y = physics.CENTER.y + position.y;
  return b.vector(x,y);
};

//  // limeCircle, for visual display
//  var limeCircle = (new lime.Circle)
//      .setFill(new lime.fill.LinearGradient()
//      .addColorStop(0.49,200,0,0)
//      .addColorStop(.5,0,0,250))
//      .setSize(100, 100);
//  layer.appendChild(limeCircle);
//
//  var cbodyDef = new box2d.BodyDef;
//  cbodyDef.position.Set(200, 80);
//  cbodyDef.angularDamping = .001;
//
//  // b2Circle, for physical interaction
//  var b2Circle = new box2d.CircleDef;
//  b2Circle.radius = limeCircle.getSize().width/2;
//  b2Circle.density = 1;
//  b2Circle.restitution =.8;
//  b2Circle.friction = 1;
//
//  cbodyDef.AddShape(b2Circle);
//
//  var b2CircleBody = world.CreateBody(cbodyDef);
//
//  var limePlanet = (new lime.Circle)
//      .setFill(new lime.fill.LinearGradient()
//      .addColorStop(0.49,200,0,0)
//      .addColorStop(.5,0,0,250))
//      .setSize(100, 100);
//  
//  layer.appendChild(limePlanet);
//
//  var planet = new box2d.CircleDef;
//  planet.radius = limePlanet.getSize().width/2;
//  planet.restitution = .9
//  planet.density = 0;
//  planet.friction = 1;
//    
//  var planetDef = new box2d.BodyDef;
//  planetDef.position.Set(physics.WIDTH/2 - planet.radius*2, physics.HEIGHT/2);
//  planetDef.rotation = 0.05;
//  planetDef.AddShape(planet);
//  var planetBody = world.CreateBody(planetDef);
//
//  goog.events.listen(limeCircle, ['mousedown', 'touchstart'],function(e){ 
//    var pos = layer.screenToLocal(e.screenPosition);
//    //create mouse Joint 
//    var force = new box2d.Vec2(100,100);
//    b2CircleBody.ApplyForce(force, b2CircleBody.GetCenterPosition());
//    var mouseJointDef = new box2d.MouseJointDef(); 
//    mouseJointDef.body1 = world.GetGroundBody(); 
//    mouseJointDef.body2 = b2CircleBody; 
//    mouseJointDef.target.Set(pos.x, pos.y); 
//    mouseJointDef.maxForce = 5000 * b2CircleBody.m_mass; 
//    mouseJointDef.collideConnected = true; 
//    mouseJointDef.dampingRatio = 0; 
//    mouseJointDef.frequencyHz = 100; 
//    //Add the mouseJoint to the world. 
//    var mouseJoint = world.CreateJoint(mouseJointDef); 
//    e.swallow(['mouseup', 'touchend'],function(e){
//        world.DestroyJoint(mouseJoint); 
//    });
//    e.swallow(['mousemove', 'touchmove'],function(e){
//        var pos = layer.screenToLocal(e.screenPosition);
//        mouseJoint.SetTarget(new box2d.Vec2(pos.x, pos.y));
//    });
//  });
//
//  var basePower = 10000;
//  physics.power = basePower;
//  physics.mouseDown = false;
//
//  goog.events.listen(limePlanet, ['mousedown', 'touchstart'],function(e){ 
//    physics.mouseDown = true;
//    e.swallow(['mouseup', 'touchend'],function(e){
//      physics.mouseDown = false;
//    });
//  });
//
//  lime.scheduleManager.schedule(function(dt) {
//    var cPos = b2CircleBody.GetCenterPosition().clone();
//    var pPos = planetBody.GetCenterPosition().clone();
//
//    var angleCircle = Math.atan2(cPos.x, cPos.y);
//    var anglePlanet = Math.atan2(pPos.x, pPos.y);
//
//    var force = new box2d.Vec2((pPos.x - cPos.x) * physics.power, 
//                               (pPos.y - cPos.y) * physics.power);
//    //var force = new box2d.Vec2(100,5000);
//    //console.log("force: " + force);
//    b2CircleBody.ApplyForce(force, planetBody.GetCenterPosition().clone());
//
//    // Map the physical to visible world 
//    world.Step(dt / 1000, 3);
//    var pos = b2CircleBody.GetCenterPosition().clone();
//    var rot = b2CircleBody.GetRotation();
//    limeCircle.setRotation(-rot/Math.PI*180);
//    limeCircle.setPosition(pos);
//    var pos = planetBody.GetCenterPosition().clone();
//    var rot = planetBody.GetRotation();
//    limePlanet.setRotation(-rot/Math.PI*180);
//    limePlanet.setPosition(pos);
//
//    var distance = Math.sqrt(Math.pow((cPos.x - pPos.x), 2) + Math.pow((cPos.y - pPos.y), 2));
//    var compareDistance = 500;
//    //distance = Math.max(distance, compareDistance)
//    var scaler = compareDistance/distance; 
//
//    //var scaleWorld = new lime.animation.ScaleTo(scaler).setDuration(0);
//    //layer.runAction(scaleWorld);
//
//
//    if (!physics.mouseDown && physics.power > basePower) {
//      physics.power -= 1;
//    } else if (physics.mouseDown) {
//      physics.power += 1;
//    }
//
//  },this);
//};

goog.exportSymbol('physics.start', physics.start);
