goog.provide("planet");

function Planet (planetDef) {
  var size = planetDef.radius;
  var posVec = b.vector(planetDef.pos[0] / physics.SCALE, 
                        planetDef.pos[1] / physics.SCALE)
  var pos = physics.pos(posVec);

  var visualLayer = l.circle(size * 2);
  visualLayer.setPosition(pos); 
  physics.planetLayer.appendChild(visualLayer);
  this.visible = visualLayer;
  this.visible.circle.setStroke(new lime.fill.Stroke(.5, [0,0,256]));

  this.physical =
    b.circle(size/physics.SCALE, 0, pos, 2, 4);

  this._gravityDistance = 0;
  this._gravityWeight = 0;
  this.time = 0;
  this.zoom = false;
  this.zoomPos = pos;

  this.physical.originalPos = b.vector(pos.x, pos.y);

  this.gravityWeight = size * size * 0.01;
}

Planet.prototype.getGravityDistance = function () {
  if (this._gravityDistance == 0) {
    this._gravityDistance = this.physical.radius * 3;
  }
  return this._gravityDistance;
};

//Planet.prototype.getGravityWeight = function () {
//  if (this._gravityWeight == 0) {
//    this._gravityWeight = (this.physical.radius * this.physical.radius) * .01;
//  }
//  return this._gravityWeight;
//}

Planet.prototype.getCameraPosition = function (distance, playerPos) {

  var pPos = this.physical.GetCenterPosition().clone(); 
  this.zoom = false;
  var zoomDistanceThresh = this.physical.radius * 2;
  if (distance < zoomDistanceThresh) {
    dbg = "1: " + pPos.toString();
    pPos = m.point(pPos, m.angle(pPos,playerPos), distance - (zoomDistanceThresh));  
    this.zoom = true;
    this.zoomPos = b.vector(pPos.x, pPos.y);
  }
  
  if (distance < this.getGravityDistance()) {
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
  var stitched = this.physical.GetCenterPosition().subtract(stitchVect);
//  this.physical.SetCenterPosition(stitched);
//  c.d("new pos: " + this.physical.GetCenterPosition() + " stitchVect: " + stitchVect + " frozen: " + this.physical.IsFrozen());
}
