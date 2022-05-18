class Score extends CanvasCtx {
  constructor(private score = 0) {
    super();
  }

  draw() {
    this.graphics.clear();
    // this.graphics.font="16px 楷书";
    // this.graphics.fillText("分数：",10+(this.col+1)*this.cellSize,10+this.cellSize);
    // this.graphics.fillStyle="#f00";
    // this.graphics.fillText(this.score,10+(this.col+2.5)*this.cellSize,10+this.cellSize);
    // this.graphics.fillStyle="#000";
  }

  addScore(chengeScore: number) {
    this.score += chengeScore;
  }
}