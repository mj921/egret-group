class Panel extends CanvasCtx {
  col: number; //列数
  row: number; //行数
  score: number; //分数
  cellSize: number; //格子大小
  cells: Cell[][]; //格子状态集合
  nowG: Graph; //当前方块
  nextG: Graph;
  scoreTextField: egret.TextField = new egret.TextField();
  constructor(col: number, row: number, cellSize = 30) {
    super();
    this.col = col;
    this.row = row;
    this.score = 0;
    this.cellSize = 30;
    this.width = (col + 7) * cellSize + 8;
    this.cells = new Array<any>();
  }

  init() {//面板初始化
    this.scoreTextField.x = 10 + (this.col + 1) * this.cellSize;
    this.scoreTextField.y = this.cellSize;
    this.addChild(this.scoreTextField);
    this.initCells();//格子状态初始化
    this.draw();//绘制面板
    this.drawScore();//绘制初始化分数
    this.nowG = this.drawNow();//当前图形
    this.nextG = this.drawNext();//下一个图形
  }

  draw() {//绘制主体面板
    this.strokeRect(0, 0, (this.col + 7) * this.cellSize, this.row * this.cellSize, 0x000000, 3);
    this.strokeLine(this.col * this.cellSize + 5, 0, this.col * this.cellSize + 5, this.row * this.cellSize, 0x000000, 2)
    this.graphics.lineStyle(1, 0x000000);
  }
  drawScore() {//绘制分数
    this.scoreTextField.text = `分数：${this.score}`;
  }
  initCells() {//获取面板格子状态
    this.cells = [];
    for (let i = 0; i < this.col; i++) {
      let cs = new Array();
      for (let j = 0; j < this.row; j++) {
        cs[j] = new Cell();
        cs[j].x = i * this.cellSize + 3;
        cs[j].y = j * this.cellSize + 3;
        this.addChild(cs[j])
      }
      this.cells[i] = cs;
    }
  }
  drawNext() {//绘制下一个图形
    const type = Math.floor(Math.random() * 7) + 1;
    let g = new Graph(type, 13, 4, 1);
    this.addChild(g);
    g.draw();
    return g;
  }
  drawNow() {//绘制当前图形
    const type = Math.floor(Math.random() * 7) + 1;
    let g = new Graph(type, 4, 1, 1);
    this.addChild(g);
    g.draw();
    return g;
  }
  isDrop() {//判断面板内图形是否能下移
    const x = this.nowG.centerPoint.x;
    const y = this.nowG.centerPoint.y + 1;
    for (let i = 0; i < this.nowG.points.length; i++) {
      if (this.nowG.points[i].y + y >= this.row || !this.cells[this.nowG.points[i].x + x][this.nowG.points[i].y + y].isEmpty) {
        return false;
      }
    }
    return true;
  }
  isMoveleft() {//判断面板内图形是否能左移
    const x = this.nowG.centerPoint.x - 1;
    const y = this.nowG.centerPoint.y;
    for (let i = 0; i < this.nowG.points.length; i++) {
      if (this.nowG.points[i].x + x < 0 || !this.cells[this.nowG.points[i].x + x][this.nowG.points[i].y + y].isEmpty) {
        return false;
      }
    }
    return true;
  }
  isMoveRight() {//判断面板内图形是否能右移
    const x = this.nowG.centerPoint.x + 1;
    const y = this.nowG.centerPoint.y;
    for (let i = 0; i < this.nowG.points.length; i++) {
      if (this.nowG.points[i].x + x >= this.col || !this.cells[this.nowG.points[i].x + x][this.nowG.points[i].y + y].isEmpty) {
        return false;
      }
    }
    return true;
  }
  //判断面板内图形是否能旋转
  isRotate() {
    let ggg = this.nowG;
    ggg.rotate1();
    const x = ggg.centerPoint.x;
    const y = ggg.centerPoint.y;
    for (let i = 0; i < this.nowG.points.length; i++) {
      if (this.nowG.points[i].x + x < 0 || this.nowG.points[i].x + x >= this.col || this.nowG.points[i].y + y < 0 || this.nowG.points[i].y + y >= this.row || !this.cells[ggg.points[i].x + x][ggg.points[i].y + y].isEmpty) {
        ggg.rotate2();
        return false;
      }
    }
    ggg.rotate2();
    return true;
  }
  land() {//面板内图形着陆
    const x = this.nowG.centerPoint.x;
    const y = this.nowG.centerPoint.y;
    for (let i = 0; i < this.nowG.points.length; i++) {
      const cell = this.cells[this.nowG.points[i].x + x][this.nowG.points[i].y + y];
      cell.isEmpty = false;
      cell.color = this.nowG.color;
      cell.draw();
    }
    this.removeChild(this.nowG);
    this.checkRow();
  }
  rotate() {//面板内图形旋转
    if (this.isRotate()) {
      this.nowG.rotate();
    }
  }
  moveleft() {//面板内图形左移
    if (this.isMoveleft()) {
      this.nowG.moveleft();

    }
  }
  moveRight() {//面板内图形右移
    if (this.isMoveRight()) {
      this.nowG.moveRight();
    }
  }
  checkRow() {
    type removeObj = {
      removeFlag: boolean;
      moveNum: number;
    }
    let rowMoveNumArr = new Array<removeObj>();
    let moveNum = 0;
    for (let i = this.row - 1; i >= 0; i--) {
      let n = 0;
      for (let j = this.col - 1; j >= 0; j--) {
        if (this.cells[j][i].isEmpty) {
          break;
        } else {
          n++;
        }
      }
      let obj = {
        removeFlag: false,
        moveNum: 0,
      }
      if (n === this.col) {
        obj.removeFlag = true;
      }
      obj.moveNum = moveNum;
      rowMoveNumArr[i] = obj;
      if (n === this.col) {
        moveNum++;
      }
    }
    this.score += moveNum;
    this.drawScore();
    for (let i = this.row - 1; i >= 0; i--) {
      if (rowMoveNumArr[i].moveNum > 0) {
        for (let j = 0; j < this.col; j++) {
          if (!rowMoveNumArr[i].removeFlag) {
            this.cells[j][i + rowMoveNumArr[i].moveNum].isEmpty = this.cells[j][i].isEmpty;
            this.cells[j][i + rowMoveNumArr[i].moveNum].color = this.cells[j][i].color;
            this.cells[j][i + rowMoveNumArr[i].moveNum].draw();
          }
          this.cells[j][i].isEmpty = true;
          this.cells[j][i].draw();
        }
      }
    }
  }
  drop() {//面板内图形下落
    if (this.isDrop()) {
      this.nowG.drop();
    } else {
      this.land();
      this.nowG = this.nextG;
      this.nowG.setCenter(4, 1);
      this.nextG = this.drawNext();
    }
  }
}