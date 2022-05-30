class GameMap extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.creaeMap();
  }
  public static MapType = {
    MAIN: 1,
    CHOOSE: 2,
    DIE: 3
  }
  public static MAIN_LEFT_X = 220;
  private bgImg: egret.Bitmap;
  private zombies: Zombie[];
  private loopTimer;
  private colWidths: number[];
  private row: number;
  private cellWidth: number;
  private cellHeight: number;
  private cellLeftStart: number;
  private cellTopStart: number;
  private cells;
  private creaeMap() {
    this.row = 5;
    this.cellHeight = 100;
    this.cellWidth = 83;
    this.cellLeftStart = 30;
    this.cellTopStart = 80;
    this.colWidths = [83, 80, 83, 83, 83, 81, 80, 82, 92];
    this.bgImg = Util.createBitmapByName("interface_background1_jpg");
    this.addChild(this.bgImg);
    this.zombies = [];
    this.addZombie(2);
    this.createGrid();
    this.start();
  }
  private createGrid() {
    let widthTotal = 0;
    this.cells = [];
    for (let j = 0; j < this.row; j++) {
      this.cells.push([]);
    }
    for (let i = 0; i < this.colWidths.length; i++) {
      for (let j = 0; j < this.row; j++) {
        this.gridCell(100000 * i, widthTotal, this.cellHeight * j, this.colWidths[i]);
        this.cells[j].push({
          j,
          i,
          x: widthTotal,
          y: this.cellHeight * j,
          plant: null,
          width: this.colWidths[i],
          height: this.cellHeight
        })
      }
      widthTotal += this.colWidths[i];
    }
  }
  private gridCell(color: number, x: number, y: number, width: number) {
    const shp = new egret.Shape();
    shp.graphics.lineStyle(1, 0xff0000);
    shp.graphics.beginFill(color, 0);
    shp.graphics.drawRect(0, 0, width, this.cellHeight);
    shp.graphics.endFill();
    shp.x = GameMap.MAIN_LEFT_X + this.cellLeftStart + x;
    shp.y = this.cellTopStart + y;
    this.addChild(shp);
  }
  public changeType(type) {
    switch(type) {
      case GameMap.MapType.MAIN:
        this.x = -GameMap.MAIN_LEFT_X;
        break;
      case GameMap.MapType.CHOOSE:
        this.x = -600;
        break;
      case GameMap.MapType.DIE:
        this.x = 0;
        break;
    }
  }
  private addZombie(rowIndex) {
    const zombie = new Zombie("Zombie");
    this.zombies.push(zombie);
    zombie.x = GameMap.MAIN_LEFT_X + 800 + zombie.width;
    zombie.y = 150 + rowIndex * 100;
    this.addChild(zombie);
  }
  private loop() {
    this.zombies.forEach(Zombie => {
      Zombie.move();
    })
    this.loopTimer = setTimeout(() => {
      this.loop();
    }, 16);
  }
  public start() {
    this.loop()
  }
}