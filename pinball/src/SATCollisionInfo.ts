class SATCollisionInfo<T, P> {
  shapeA: T = null;						// the first shape
  shapeB: P = null;						// the second shape
  distance = 0;					    // how much overlap there is
  vector = new SATPoint();			    // the direction you need to move - unit vector
  shapeAContained = false;		    // is object A contained in object B
  shapeBContained = false;		    // is object B contained in object A
  separation = new SATPoint();           // how far to separate
}