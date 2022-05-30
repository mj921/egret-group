class SATPolygon extends egret.Shape {
  vertices: SATPoint[] = [];

  constructor(public x = 0, public y = 0, public numOfSides = 3, public radius = 100, public rotation = 0, public scale = 1, public color = 0x000000) {
    super();
    const rotangle = Math.PI * 2 / numOfSides;
    let angle = 0;
    for (let i = 0; i < numOfSides; i++) {
      angle = i * rotangle + (Math.PI - rotangle) * 0.5;
      let point = new SATPoint(Math.cos(angle) * radius, Math.sin(angle) * radius);
      this.vertices.push(point);
    }
  }

  static createPolygon(numOfSides = 3, radius = 100) {
    const poly = new SATPolygon();
    const rotangle = Math.PI * 2 / numOfSides;
    let angle = 0;

    for (let i = 0; i < numOfSides; i++) {
      angle = i * rotangle + (Math.PI - rotangle) * 0.5;
      let point = new SATPoint(Math.cos(angle) * radius, Math.sin(angle) * radius);
      poly.vertices.push(point);
    }
    return poly;
  }

  draw() {
    if (this.numOfSides === 2) {
      this.graphics.lineStyle(3);
    }
    this.graphics.beginFill(this.color);
    this.graphics.moveTo(this.vertices[this.vertices.length - 1].x, this.vertices[this.vertices.length - 1].y);
    this.vertices.forEach(vertex => {
      this.graphics.lineTo(vertex.x, vertex.y);
    })
    this.graphics.endFill();
  }

  clone() {
    let clone = new SATPolygon(this.x, this.y, this.numOfSides, this.radius, this.rotation, this.scale, this.color);
    clone.vertices = this.vertices.map(x => x.clone());
    return clone;
  }

  getTransformedVertices() {
    return this.vertices.map(point => {
      const newPoint = point.clone();
      if (this.rotation !== 0) {
        let hyp = point.magnitude;
        let angle = point.angle;
        angle += this.rotation * (Math.PI / 180);
        
        newPoint.x = Math.cos(angle) * hyp;
        newPoint.y = Math.sin(angle) * hyp;
      }
      if (this.scale !== 0) {
        newPoint.x *= this.scale;
        newPoint.y *= this.scale;
      }
      return newPoint;
    })
  }

}