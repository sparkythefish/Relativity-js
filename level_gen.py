#!/usr/bin/python
import sys, json, math
from pprint import pprint

def main():
  if len(sys.argv) < 2:
    print sys.argv[0] + ": <level_file.js>"
  else:
    level_file_name = sys.argv[1]
    print "file given: " + level_file_name
    level_file = open(level_file_name)
    # Read off some lines to get to the json
    level_file.readline()
    level_file.readline()
    level_file.readline()
    level_json = json.load(level_file)
    level = validate_json(level_json)
    level_gen = generate_level(level)
    level_gen_data = json.dumps(level_gen, separators=(',',':'))
    level_gen_var_name = level_file_name[:len(level_file_name) -3] + "_gen"
    level_gen_file_name = level_gen_var_name + ".js"
    level_gen_var_name = level_file_name.replace("levels/","").replace(".js","")
    level_gen_file = open(level_gen_file_name,'w')
    level_gen_file.write("goog.provide('levels.generated');\n");
    level_gen_file.write("levels.generated." + level_gen_var_name + " = \n");
    level_gen_file.write(level_gen_data)
    print "file written: " + level_gen_file_name
    level_gen_file.close()
    level_file.close()

def validate_json(json_data):
  pprint(json_data)
  properties = ['width', 'height', 'planets', 'start']
  for prop in properties:
    if prop not in json_data:
      print "missing: " + prop 
      return
  return Struct(**json_data)

def generate_level(level):
  xs = range(-level.width/2,level.width/2)
  ys = range(-level.height/2,level.height/2)
  level_grid = {}
  radius = 100
  triple_radius = 2 * radius
  radius_squared = radius * radius
  triple_radius_squared = triple_radius*triple_radius
  for x in xs:
    for y in ys:
      grid_entry = {}
      include_entry = False 
      for p in level.planets:
        pos = p['pos']
        pX = pos[0]
        pY = pos[1]
        radius_squared = p['radius'] * p['radius']
        collision = calc_collision(pX,pY,x,y,radius_squared)
        grid_entry['c'] = collision 
        force = calc_force(pX,pY,x,y,triple_radius_squared)
        grid_entry['f'] = force
        #force = []
        if collision == 1 or len(force) > 1:
          include_entry = True
      if include_entry:
        level_grid[str(x)+':'+str(y)] = grid_entry
  return level_grid

def calc_collision(x1,y1,x2,y2, planet_radius_squared):
  # hardcoded the radius of the player squared
  # right now its 30
  # r = 30
  # r = (r*2)^2
  # double t eradius then squar eit, because we do lookups in the table by the center
  # point. We need ot determine if the CENTER of the circle collides, not the edge.
  return 1 if within_distance(5000 + planet_radius_squared, x1, y1, x2, y2) else 0

def calc_force(x1,y1,x2,y2,radius):
  if within_distance(radius,x1,y1,x2,y2):
    deltaX = x2 - x1
    deltaY = y2 - y1
    angle = math.degrees(math.atan2(deltaX,deltaY))
    aX = round(x1 + (10*math.cos(angle)))
    aY = round(y1 + (10*math.sin(angle)))
    return [[aX,aY],1]
  else:
    return [] 

def within_distance(distance_sqr,x1,y1,x2,y2):
  return distance_squared(x1, y1, x2, y2) < distance_sqr

  

    
def distance_squared(x1,y1,x2,y2):
  d1 = x1-x2;
  d2 = y1-y2;
  return d1*d1 + d2*d2;

  
class Struct:
  def __init__(self, **entries): 
    self.__dict__.update(entries)


main()
