class Cell extends CanvasCtx {
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