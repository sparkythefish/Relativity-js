goog.provide("planet");

function Planet (planetDef) {
  var size = planetDef.radius *2;
  var posVec = b.vector(planetDef.pos[0], planetDef.pos[1])
  var pos = physics.pos(posVec);

  var visualLayer = l.circle(size);
  visualLayer.setPosition(pos); 
  physics.planetLayer.appendChild(visualLayer);
  this.visible = visualLayer;

  this.physical =
    b.circle(size/2, 0, pos, 2, 4);

  this._gravityDistance = 0;
  this._gravityWeight = 0;
  this.time = 0;
  this.zoom = false;
  this.zoomPos = pos;

  this.physical.originalPos = b.vector(pos.x, pos.y);
}

Planet.prototype.getGravityDistance = function () {
  if (this._gravityDistance == 0) {
    this._gravityDistance = this.physical.radius * 3;
  }
  return this._gravityDistance;
};

Planet.prototype.getGravityWeight = function () {
  if (this._gravityWeight == 0) {
    this._gravityWeight = (this.physical.radius * this.physical.radius) * .01;
  }
  return this._gravityWeight;
}

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
      this.time *= 1.2;
      // this one works OK:
      //this.time += 0.08;
    }
  } else if (this.time > 0) {
    this.time *= 0.95; // easing number, how fast we remove the old planet
    //this.time -= 0.1; // rounding to be < 0 is a small decimal to, else divide forever.
  }

  if (this.zoom) {
    //c.c(dbg + " 2: " + pPos + " time: " + this.time);
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
