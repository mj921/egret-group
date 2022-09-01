class Game extends egret.DisplayObjectContainer {
  panel: Panel;
  constructor() {
    super();
    this.panel = new Panel(16, 10);
    this.addChild(this.panel);
  }
}