class SATCircle extends egret.Shape {

  scale = 1;
  rotation = 0;

  constructor(public x = 0, public y = 0, public radius = 100, public color = 0x000000) {
    super();
  }

  draw() {
    this.graphics.beginFill(this.color);
    this.graphics.drawCircle(0, 0, this.radius);
  }

  clone() {
    let clone = new SATCircle(this.x, this.y, this.radius, this.color);
    clone.scale = this.scale;
    clone.rotation = this.rotation;
    return clone;
  }

  getTransformedRadius() {
    return this.radius * this.scale;
  }
}