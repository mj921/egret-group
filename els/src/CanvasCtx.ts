class CanvasCtx extends egret.Sprite {
  constructor() {
    super();
  }
  
  strokeRect(x: number, y: number, w: number, h: number, color: number = 0x000000, lineWidth: number = 1) {
    this.graphics.lineStyle(lineWidth, color);
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x + w, y);
    this.graphics.lineTo(x + w, y + h);
    this.graphics.lineTo(x, y + h);
    this.graphics.lineTo(x, y);
    this.graphics.endFill();
  }
  strokeLine(x: number, y: number, x1: number, y1: number, color: number = 0x000000, lineWidth: number = 1) {
    this.graphics.lineStyle(lineWidth, color);
    this.graphics.moveTo(x, y);
    this.graphics.lineTo(x1, y1);class Cell extends CanvasCtx {
      constructor(
        public isEmpty = true,
        public color?: number,
        public size = 30
      ) {
        super();
        this.width = size;
        this.height = size;
      }
    
      draw() {
        this.graphics.clear();
        if (this.isEmpty) return;
        this.strokeRect(0, 0, this.size, this.size, 0xffffff);
        this.fillRect(0, 0, this.size, this.size, this.color);
      }
    }
    this.graphics.endFill();
  }
  fillRect(x: number, y: number, w: number, h: number, color: number) {
    this.graphics.beginFill(color);
    this.graphics.drawRect(x, y, w, h);
    this.graphics.endFill();
  }
}