goog.provide("planet");

function Planet (planetDef) {
  this.size = planetDef.radius;
  var posVec = b.vector(planetDef.pos[0], planetDef.pos[1]);
  var pos = physics.pos(posVec);

  var visualLayer = l.circle(this.size * 2);
  visualLayer.setPosition(pos); 
  physics.planetLayer.appendChild(visualLayer);
  this.visible = visualLayer;
  this.visible.circle.setStroke(new lime.fill.Stroke(.5, [0,0,256]));

  this.addPhysical(pos);

  this.time = 0;
  this.zoom = false;
  this.zoomPos = pos;

  this.originalPos = b.vector(pos.x, pos.y);

  this.gravityWeight = this.size * this.size * 0.01;
  this.gravityDistance = this.physical.radius * 3;
  this.active = true;
  this.totalStitch = b.vector(0,0);
}

Planet.prototype.addPhysical = function (pos) {
  this.physical = b.circle(this.size, 0, pos, 2, 4);
}

Planet.prototype.getCameraPosition = function (distance, playerPos) {
  var pPos = this.visible.getPosition().clone();
  this.zoom = false;
  var zoomDistanceThresh = this.physical.radius * 2;
  if (distance < zoomDistanceThresh) {
    dbg = "1: " + pPos.toString();
    pPos = m.point(pPos, m.angle(pPos,playerPos), distance - (zoomDistanceThresh));  
    this.zoom = true;
    this.zoomPos = b.vector(pPos.x, pPos.y);
  }
  
  if (distance < this.gravityDistance) {
    if (this.time < 10) {
      // TODO: Forever fiddle with this
      this.time += 0.01;
      this.time *= 1.08;
      // this one works OK:
      //this.time += 0.08;
    }
  } else if (this.time > 0) {
    this.time *= 0.96; // easing number, how fast we remove the old planet
    //this.time -= 0.1; // rounding to be < 0 is a small decimal to, else divide forever.
  }

  var cameraPos;
  if (this.time > 0.005) {
    cameraPos = pPos.scale(this.time);
  } else {
    this.time = 0; // make sure its 0
    cameraPos = b.vector(0,0);
  }

  return cameraPos;
}

Planet.prototype.stitch = function (stitchVect) {
  this.physical.SetCenterPosition(this.originalPos.clone().subtract(stitchVect), 0);
}
