goog.provide('levels');

levels.level01 = 
  {
    "height":1000,
    "width":1000,
    "player": { "start":[600,-100] },
    "planets":
      [
        {"pos":[700,0], "radius":75}, 
        {"pos":[0,-800], "radius":100}, 
        {"pos":[1400,-200], "radius":100}, 
        {"pos":[-1500,500], "radius":100}, 
        {"pos":[5000,0], "radius":300}, 
        {"pos":[-3000,0], "radius":150} 
      ]
  }

levels.level02 =
  {
    "height":1000,
    "width":1000,
    "player": { "start":[-50, -75] },
    "planets":
      [
        {"pos":[0,0], "radius":75} 
      ]
  }
