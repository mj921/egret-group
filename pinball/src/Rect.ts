enum HitType {
  NONE = 0,
  POSITIVE = 1,
  SIDE = 2,
}
type HitResult = {
  isHit: boolean;
  hitType: HitType,
}

class Rect extends egret.Shape {
  public vertexs: Point[];
  public hitVertexs: Point[];
  public centerPoint: Point;
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public rotation: number,
    public color: number = 0x000000
  ) {
    super();
    const angle = rotation / 180 * Math.PI;
    this.vertexs = [
      new Point(this.x - this.width / 2 * Math.cos(angle), this.y - this.height / 2 * Math.sin(angle)),
      new Point(this.x + this.width / 2 * Math.cos(angle), this.y - this.height / 2 * Math.sin(angle)),
      new Point(this.x + this.width / 2 * Math.cos(angle), this.y + this.height / 2 * Math.sin(angle)),
      new Point(this.x - this.width / 2 * Math.cos(angle), this.y + this.height / 2 * Math.sin(angle)),
    ];
    this.hitVertexs = [
      new Point(this.x - this.width / 2, this.y - this.height / 2),
      new Point(this.x + this.width / 2, this.y - this.height / 2),
      new Point(this.x + this.width / 2, this.y + this.height / 2),
      new Point(this.x - this.width / 2, this.y + this.height / 2),
    ];
    this.centerPoint = new Point(x, y);
  }

  draw() {
    this.graphics.beginFill(this.color);
    this.graphics.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }

  hitRect(rect: Rect) {
    for (let i = 0; i < this.vertexs.length; i++) {
      if (rect.hitTestPoint(this.vertexs[i].x, this.vertexs[i].y)) {
        return true;
      }
    }
    for (let i = 0; i < rect.vertexs.length; i++) {
      if (this.hitTestPoint(rect.vertexs[i].x, rect.vertexs[i].y)) {
        return true;
      }
    }
    return false;
  }

  getHorizontalPoint(point: Point) {
    const p = Point.toPoint(this.centerPoint.subtract(point));
    const angle = p.getAngle() - this.rotation;
    const length = p.length;
    const x = length * Math.cos(angle / 180 * Math.PI) + this.centerPoint.x;
    const y = length * Math.sin(angle / 180 * Math.PI) + this.centerPoint.y; 
    
    return new Point(x, y);
  }

  hitCircle(circle: Circle) {
    const point = this.getHorizontalPoint(circle.centerPoint);
    const { x, y } = point;
    const hitResult: HitResult = {
      isHit: false,
      hitType: HitType.NONE,
    }
    
    if (this.hitTestPoint(x, y)) {
      hitResult.isHit = true;
      hitResult.hitType = HitType.POSITIVE;
      return hitResult;
    };
    if ((x >= this.x + this.width || x <= this.x) && (y <= this.y || y >= this.y + this.height)) {
      for (let i = 0; i < this.vertexs.length; i++) {
        if (circle.hitPoint(this.vertexs[i])) {
          hitResult.isHit = true;
          hitResult.hitType = HitType.POSITIVE;
          return true;
        }
      }
      
    } else if (Math.abs(this.centerPoint.x - x) <= this.width / 2 + circle.radius && Math.abs(this.centerPoint.y - circle.y) <= this.height / 2 + circle.radius) {
      hitResult.isHit = true;
      hitResult.hitType = HitType.POSITIVE;
      return hitResult
    };
    return hitResult;
  }
}