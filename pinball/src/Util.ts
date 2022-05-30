class Util {
  static getPointAngle(point1: Point, point2: Point) {
    const x = point2.x - point1.x;
    const y = point2.y - point1.y;
    
    if (x === 0) {
      if (y > 0) {
        return 90;
      } else if (y < 0) {
        return 270;
      } else {
        return 0;
      }
    } else {
      if (y === 0) {
        if (x < 0) {
          return 180;
        } else {
          return 0;
        }
      }
      return Math.atan(y / x) / Math.PI * 180;
    }
  }
}