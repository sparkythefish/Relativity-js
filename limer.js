goog.provide('l');

/** 
 * Why this?
 * 
 * Lime JS sucks with things in motion: when a circle moves fast
 * enough, you can see edgle form in the shape on the edge of the
 * direction of the movement. I don't know the actual cause, but my
 * guess is that the redraw region of a circle is exactly the size of
 * the circle, and the redraw can't keep up, so you get this edge.
 * 
 * Solution:
 * 
 * Create another circle that is a little bigger than th eone desired.
 * Wrap it in the same layer as the one desired.
 * Make this other circle clear. 
 * Lime JS has to exapnd its redraw region to the size of the outer circle
 * Outer circle gets the edge bug, but not the desired one. Everything
 * Ends up looking pretty smooth.
 */
l.circle = function (radius) {
  var circleLayer = new lime.Layer;
  var limeCircle = (new lime.Circle)
      .setStroke(new lime.fill.Stroke())
      .setFill(100,100,100,.5)
      .setSize(radius, radius);
  circleLayer.appendChild(limeCircle);

  var expando = 1.5;

  var limeCircleExpander = (new lime.Circle)
      .setSize(radius*expando, radius*expando);
  circleLayer.appendChild(limeCircleExpander);

  return circleLayer;
}
