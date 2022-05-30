class Circle extends egret.Shape {
  public centerPoint: Point;
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: number
  ) {
    super();
    this.centerPoint = new Point(x, y);
  }

  draw() {
    this.graphics.beginFill(this.color);
    this.graphics.drawCircle(0, 0, this.radius);
  }

  hitPoint(point: Point) {
    return Point.distance(this.centerPoint, point) <= this.radius;
  }

  hitCircle(circle: Circle) {
    return Point.distance(this.centerPoint, circle.centerPoint) <= this.radius + circle.radius;
  }
}