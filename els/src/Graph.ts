enum GraphType {
  I = 1,
  O = 2,
  T = 3,
  Z = 4,
  S = 5,
  L = 6,
  L1 = 7, // 反L
}

class Graph extends CanvasCtx {
  points: egret.Point[];
  centerPoint: egret.Point;
  type: GraphType;
  color: number;
  state: number;
  scellSize: number;
  offsetX: number;
  offsetY: number;

  constructor(type: GraphType, x: number, y: number, state: number, scellSize = 30, offsetX = 3, offsetY = 3) {
    super();
    this.type = type;//类型
    this.points = new Array<egret.Point>();
    this.centerPoint = new egret.Point(x, y); //中心点
    this.scellSize = scellSize;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.setCenter();
    this.color = 0x000000;
    this.state = state;//旋转状态
    switch (type) {//生成各方块坐标
      case GraphType.I:
        this.points[0] = new egret.Point(-1, 0);
        this.points[1] = new egret.Point(0, 0);
        this.points[2] = new egret.Point(1, 0);
        this.points[3] = new egret.Point(2, 0);
        this.color = 0x000000;
        break;
      case GraphType.O:
        this.points[0] = new egret.Point(0, -1);
        this.points[1] = new egret.Point(1, -1);
        this.points[2] = new egret.Point(0, 0);
        this.points[3] = new egret.Point(1, 0);
        this.color = 0x770000;
        break;
      case GraphType.T:
        this.points[0] = new egret.Point(0, -1);
        this.points[1] = new egret.Point(-1, 0);
        this.points[2] = new egret.Point(0, 0);
        this.points[3] = new egret.Point(1, 0);
        this.color = 0xdd0000;
        break;
      case GraphType.Z:
        this.points[0] = new egret.Point(-1, -1);
        this.points[1] = new egret.Point(0, -1);
        this.points[2] = new egret.Point(0, 0);
        this.points[3] = new egret.Point(1, 0);
        this.color = 0x007700;
        break;
      case GraphType.S:
        this.points[0] = new egret.Point(-1, 0);
        this.points[1] = new egret.Point(0, -1);
        this.points[2] = new egret.Point(0, 0);
        this.points[3] = new egret.Point(1, -1);
        this.color = 0x00dd00;
        break;
      case GraphType.L:
        this.points[0] = new egret.Point(-1, 0);
        this.points[1] = new egret.Point(0, 0);
        this.points[2] = new egret.Point(1, 0);
        this.points[3] = new egret.Point(1, -1);
        this.color = 0x000077;
        break;
      case GraphType.L1:
        this.points[0] = new egret.Point(-1, -1);
        this.points[1] = new egret.Point(-1, 0);
        this.points[2] = new egret.Point(0, 0);
        this.points[3] = new egret.Point(1, 0);
        this.color = 0x0000dd;
        break;
    }
    for (var i = 1; i < this.state; i++) {
      this.rotate();
    }
  }

  //设置中心点
  setCenter(x?: number, y?: number) {
    if (typeof x === 'number') {
      this.centerPoint.x = x;
    }
    if (typeof y === 'number') {
      this.centerPoint.y = y;
    }
    this.x = this.centerPoint.x * this.scellSize;
    this.y = this.centerPoint.y * this.scellSize;
    // switch (this.type) {
    //   case GraphType.I:
    //     this.x = (this.centerPoint.x) * this.scellSize;
    //     this.y = (this.centerPoint.y) * this.scellSize;
    //     break;
    //   case GraphType.O:
    //     this.x = (this.centerPoint.x + 1) * this.scellSize;
    //     this.y = this.centerPoint.y * this.scellSize;
    //     break;
    // }
  }

  rotate() {
    this.clears();
    this.rotate0();
    this.draw();
  }
  // 清除
  clears() {
    this.graphics.clear();
  }
  draw() {//绘制图形
    for (var i = 0; i < this.points.length; i++) {
      this.strokeRect(this.points[i].x * this.scellSize + this.offsetX, this.points[i].y * this.scellSize + this.offsetY, this.scellSize, this.scellSize, 0xffffff);
      this.fillRect(this.points[i].x * this.scellSize + this.offsetX, this.points[i].y * this.scellSize + this.offsetY, this.scellSize, this.scellSize, this.color);
    }
  }
  rotateL() {//逆时针旋转
    for (var i = 0; i < this.points.length; i++) {
      const x = this.points[i].x;
      const y = this.points[i].y;
      this.points[i].x = -1 * y;
      this.points[i].y = x;
    }
  }
  rotateR() {//顺指针旋转
    for (var i = 0; i < this.points.length; i++) {
      const x = this.points[i].x;
      const y = this.points[i].y;
      this.points[i].x = y;
      this.points[i].y = -1 * x;
    }
  }
  rotate0() {//旋转
    if (this.type == 1 || this.type == 4 || this.type == 5) {
      if (this.state == 1 || this.state == 3) {
        this.rotateL();
        this.state++;
      } else {
        this.rotateR();
        if (this.state == 4) {
          this.state = 1;
        } else {
          this.state++;
        }
      }
    } else {
      this.rotateL();
    }
  }
  rotate1() {//判断是否能旋转时 旋转
    if (this.type == 1 || this.type == 4 || this.type == 5) {
      if (this.state == 1 || this.state == 3) {
        this.rotateL();
      } else {
        this.rotateR();
      }
    } else {
      this.rotateL();
    }
  }
  rotate2() {//判断是否能旋转时 回转
    if (this.type == 1 || this.type == 4 || this.type == 5) {
      if (this.state == 1 || this.state == 3) {
        this.rotateR();

      } else {
        this.rotateL();
      }
    } else {
      this.rotateR();
    }
  }
  //下落
  drop() {
    this.centerPoint.y++;
    this.y += this.scellSize;
  }
  //左移
  moveleft() {
    this.centerPoint.x--;
    this.setCenter();
  }
  //右移
  moveRight() {
    this.centerPoint.x++;
    this.setCenter();
  }
}