class Point extends egret.Point {
  constructor(x: number, y: number) {
    super(x, y);
  }
  static toPoint(point: egret.Point) {
    return new Point(point.x, point.y);
  }
  getAngle() {
    if (this.x === 0) {
      if (this.y > 0) {
        return 90;
      } else if (this.y < 0) {
        return 270;
      } else {
        return 0;
      }
    } else {
      if (this.y === 0) {
        if (this.x < 0) {
          return 180;
        } else {
          return 0;
        }
      }
      return Math.atan(this.y / this.x) / Math.PI * 180;
    }
  }
}