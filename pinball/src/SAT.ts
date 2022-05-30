type PolyRange = {
  min: number;
  max: number;
}

class SAT {
  /** 两个形状的碰撞检测 */
  static collisionShape(shapeA: SATCircle | SATPolygon, shapeB: SATCircle | SATPolygon) {
    if (shapeA instanceof SATCircle && shapeB instanceof SATCircle) {
      return this.collisionCircleCircle(shapeA, shapeB);
    }
    if (shapeA instanceof SATPolygon && shapeB instanceof SATPolygon) {
      let testAB = this.collisionPolygonPolygon(shapeA, shapeB);
      if (!testAB) return null;

      let testBA = this.collisionPolygonPolygon(shapeA, shapeB, true);
      if (!testBA) return null;

      let resultInfo = Math.abs(testAB.distance) < Math.abs(testBA.distance) ? testAB : testBA;

      resultInfo.shapeAContained = testAB.shapeAContained && testBA.shapeAContained;
      resultInfo.shapeBContained = testAB.shapeBContained && testBA.shapeBContained;

      return resultInfo;
    }

    if ((shapeA instanceof SATCircle && shapeB instanceof SATPolygon) || (shapeB instanceof SATCircle && shapeA instanceof SATPolygon)) {
      let shapeAisCircle = shapeA instanceof SATCircle;
      return this.collisionCirclePolygon(
        (shapeAisCircle ? shapeA : shapeB) as SATCircle,
        (shapeAisCircle ? shapeB : shapeA) as SATPolygon,
        !shapeAisCircle
      )
    }
  }

  /** 两个圆形碰撞检测 */
  static collisionCircleCircle(circleA: SATCircle, circleB: SATCircle) {
    const radA = circleA.getTransformedRadius();
    const radB = circleB.getTransformedRadius();
    const radiusTotal = radA + radB;
    const distanceBetween = Math.sqrt(Math.pow(circleB.x - circleA.x, 2) + Math.pow(circleB.y - circleA.y, 2));
    if (distanceBetween > radiusTotal) return null;

    const resultInfo = new SATCollisionInfo<SATCircle, SATCircle>();
    resultInfo.shapeA = circleA;
    resultInfo.shapeB = circleB;

    resultInfo.vector = new SATPoint(circleB.x - circleA.x, circleB.y - circleA.y);
    resultInfo.vector.normalize();

    resultInfo.distance = distanceBetween;

    resultInfo.separation = resultInfo.vector.multiply(radiusTotal - distanceBetween);
' '
    resultInfo.shapeAContained = radA <= radB && distanceBetween <= radB - radA;
    resultInfo.shapeBContained = radB <= radA && distanceBetween <= radA - radB;

    return resultInfo;
  }

  /**
   * 两个多边形碰撞检测
   * @param flipResultPositions 是否翻转结果位置 默认false
   * */
  static collisionPolygonPolygon(polygonA: SATPolygon, polygonB: SATPolygon, flipResultPositions = false) {
    let shortestDist = Number.MAX_VALUE;

    const resultInfo = new SATCollisionInfo<SATPolygon, SATPolygon>();
    resultInfo.shapeA = flipResultPositions ? polygonB : polygonA;
    resultInfo.shapeB = flipResultPositions ? polygonA : polygonB;
    resultInfo.shapeAContained = true;
    resultInfo.shapeBContained = true;

    const verticesA = polygonA.getTransformedVertices();
    const verticesB = polygonB.getTransformedVertices();

    this.patchLineVertices(verticesA);
    this.patchLineVertices(verticesB);

    let vOffset = new SATPoint(polygonA.x - polygonB.x, polygonA.y - polygonB.y);
    // 遍历verticesA的所有边 检查垂直轴
    for (let i = 0; i < verticesA.length; i++) {
      let axis = this.getPerpendicularAxis(verticesA, i);
      // 将每个点投影到轴上
      let polyARange = this.projectVerticesForMinMax(axis, verticesA);
      let polyBRange = this.projectVerticesForMinMax(axis, verticesB);

      // 在第一个多边形的min max 加上两个多边形之间的偏移量
      const scalerOffset = this.vectorDotProduct(axis, vOffset);
      polyARange.min += scalerOffset;
      polyARange.max += scalerOffset;

      // 检查多边形最小值和最大值之间的间隙
      if ((polyARange.min - polyBRange.max > 0) || (polyBRange.min - polyARange.max > 0)) return null;

      this.checkRangesForContainment(polyARange, polyBRange, resultInfo, flipResultPositions);

      // calc the separation and store if this is the shortest
      let distMin = (polyBRange.max - polyARange.min) * -1;
      if (flipResultPositions) distMin *= -1;

      let distMinAbs = Math.abs(distMin);
      if (distMinAbs < shortestDist) {
        shortestDist = distMinAbs;

        resultInfo.distance = distMin;
        resultInfo.vector = axis;
      }
    }

    resultInfo.separation = new SATPoint(resultInfo.vector.x * resultInfo.distance, resultInfo.vector.y * resultInfo.distance);
    return resultInfo;
  }

  /**
   * 圆形与多边形碰撞检测
   * @param flipResultPositions 是否翻转结果位置 默认false
   * */
  static collisionCirclePolygon(circle: SATCircle, polygon: SATPolygon, flipResultPositions = false) {
    let shortestDist = Number.MAX_VALUE;

    const resultInfo = new SATCollisionInfo<SATCircle | SATPolygon, SATCircle | SATPolygon>();
    resultInfo.shapeA = flipResultPositions ? polygon : circle;
    resultInfo.shapeB = flipResultPositions ? circle : polygon;
    resultInfo.shapeAContained = true;
    resultInfo.shapeBContained = true;

    let vertices = polygon.getTransformedVertices();

    this.patchLineVertices(vertices);

    let vOffset = new SATPoint(polygon.x - circle.x, polygon.y - circle.y);

    let closeestVertex = new SATPoint();
    for (let vertex of vertices) {
      let dist = Math.pow(circle.x - (polygon.x + vertex.x), 2) + Math.pow(circle.y - (polygon.y + vertex.y), 2);
      if (dist < shortestDist) {
        shortestDist = dist;
        closeestVertex.x = polygon.x + vertex.x;
        closeestVertex.y = polygon.y + vertex.y;
      }
    }

    let axis = new SATPoint(closeestVertex.x - circle.x, closeestVertex.y - circle.y);
    axis.normalize();

    let polyRange = this.projectVerticesForMinMax(axis, vertices);

    const scalerOffset = this.vectorDotProduct(axis, vOffset);
    polyRange.min += scalerOffset;
    polyRange.max += scalerOffset;

    let circleRange = this.projectCircleForMinMax(axis, circle);

    if ((polyRange.min - circleRange.max > 0) || (circleRange.min - polyRange.max) > 0) return null;

    let distMin = circleRange.max - polyRange.min;
    if (flipResultPositions) distMin *= -1;

    shortestDist = Math.abs(distMin);

    resultInfo.distance = distMin;
    resultInfo.vector = axis;

    this.checkRangesForContainment(polyRange, circleRange, resultInfo, flipResultPositions);

    for (let i = 0; i < vertices.length; i++) {
      axis = this.getPerpendicularAxis(vertices, i);
      polyRange = this.projectVerticesForMinMax(axis, vertices);

      const scalerOffset = this.vectorDotProduct(axis, vOffset);
      polyRange.min += scalerOffset;
      polyRange.max += scalerOffset;

      circleRange = this.projectCircleForMinMax(axis, circle);

      if ( (polyRange.min - circleRange.max > 0) || (circleRange.min - polyRange.max > 0)  ) {
        return null;
      }

      this.checkRangesForContainment(polyRange, circleRange, resultInfo, flipResultPositions);
      
      let distMin = circleRange.max - polyRange.min;
      if (flipResultPositions) distMin *= -1;
      
      let distMinAbs = Math.abs(distMin);
      if (distMinAbs < shortestDist) {
        shortestDist = distMinAbs;
        resultInfo.distance = distMin;
        resultInfo.vector = axis;
      }
    }

    resultInfo.separation = new SATPoint(resultInfo.vector.x * resultInfo.distance, resultInfo.vector.y * resultInfo.distance);
    return resultInfo;
  }

  /** 如果多边形是一条直线，则添加第三个点使其成为一个三角形 */
  static patchLineVertices(vertices: SATPoint[]) {
    if (vertices.length === 2) {
      let [p1, p2] = vertices;
      const pt = new SATPoint(-(p2.y - p1.y), p2.x - p1.x);
      pt.magnitude = 0.000001;
      vertices.push(pt);
    }
  }
  /** 查看多边形的顶点并返回指定边的垂直轴 */
  static getPerpendicularAxis(vertices: SATPoint[], index: number) {
    let p1 = vertices[index];
    let p2 = index >= vertices.length - 1 ? vertices[0] : vertices[index + 1];

    let axis = new SATPoint(-(p2.y - p1.y), p2.x - p1.x);
    axis.normalize();
    return axis;
  }
  /** 遍历所有的顶点，将它们投影到指定轴上，并返回最大返回、最小范围 */
  static  projectVerticesForMinMax(axis: SATPoint, vertices: SATPoint[]) {
    let min = this.vectorDotProduct(axis, vertices[0]);
    let max = min;

    for (let j = 1; j < vertices.length; j++) {
      const temp = this.vectorDotProduct(axis, vertices[j]);
      if (temp < min) min = temp;
      if (temp > max) max = temp;
    }

    return {
      min,
      max,
    } as PolyRange;
  }

  /** 遍历所有的顶点，将它们投影到指定轴上，并返回最大返回、最小范围 */
  static projectCircleForMinMax(axis: SATPoint, circle: SATCircle) {
    let proj = this.vectorDotProduct(axis, new SATPoint(0, 0));
    return {
      min: proj - circle.getTransformedRadius(),
      max: proj + circle.getTransformedRadius(),
    } as PolyRange;
  }

  /** 计算两个向量的数量积 */
  static vectorDotProduct(point1: SATPoint, point2: SATPoint) {
    return point1.x * point2.x + point1.y * point2.y;
  }

  /** 比较两个范围并更新contained 参数标识 */
  static checkRangesForContainment<T, P>(rangeA: PolyRange, rangeB: PolyRange, collisionInfo: SATCollisionInfo<T, P>, flipResultPosition: boolean) {
    if (flipResultPosition) {
      if (rangeA.max < rangeB.max || rangeA.min > rangeB.min) collisionInfo.shapeAContained = false;
      if (rangeB.max < rangeA.max || rangeB.min > rangeA.min) collisionInfo.shapeAContained = false;
    } else {
      if (rangeA.max > rangeB.max || rangeA.min < rangeB.min) collisionInfo.shapeAContained = false;
      if (rangeB.max > rangeA.max || rangeB.min < rangeA.min) collisionInfo.shapeAContained = false;
    }
  }
}