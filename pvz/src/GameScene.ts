class GameScene extends Scene {
  public constructor() {
    super();
  }
  private seedBankImg: egret.Bitmap;
  private seedPacketLargerList: SeedPacket[];
  private packetNum: number;
  private gameMap: GameMap;
  private dragX: number;
  private dragY: number;
  private currTouchIndex: number;
  private adsorbentPlant: egret.Bitmap;
  protected createScene() {
    return new Promise((resolve, reject) => {
      this.packetNum = 8;
      this.seedBankImg = Util.createBitmapByName("interface_seedBank_png");
      this.seedPacketLargerList = [];
      this.gameMap = new GameMap();
      this.addChild(this.gameMap);
      const grid9Rect = new egret.Rectangle(230, 44, 80, 43);
      this.seedBankImg.scale9Grid = grid9Rect;
      this.seedBankImg.width = 80 + 52 * this.packetNum + 11;
      this.addChild(this.seedBankImg);
      this.touchEnabled = true;
      for (let i = 0; i < this.packetNum; i++) {
        // const seedPacketLarger = Util.createBitmapByName("interface_seedPacketLarger_png");
        const seedPacketLarger = new SeedPacket('Peashooter');
        seedPacketLarger.x = 52 * i + 80;
        seedPacketLarger.y = 8;
        seedPacketLarger.addEventListener(egret.TouchEvent.TOUCH_BEGIN, e => {
          this.dragX = e.localX / 2;
          this.dragY = e.localY / 2;
          this.currTouchIndex = i;
          this.adsorbentPlant
        }, seedPacketLarger);
        this.seedPacketLargerList.push(seedPacketLarger)
        this.addChild(this.seedPacketLargerList[i]);
      }
      this.addEventListener(egret.TouchEvent.TOUCH_MOVE, e => {
        this.seedPacketLargerList[this.currTouchIndex].x = e.stageX - this.dragX;
        this.seedPacketLargerList[this.currTouchIndex].y = e.stageY - this.dragY;
      }, this);
      this.addEventListener(egret.TouchEvent.TOUCH_END, e => {
        console.log(this.seedPacketLargerList, this.currTouchIndex);
        console.log(this.seedPacketLargerList[this.currTouchIndex]);
        this.seedPacketLargerList[this.currTouchIndex].x = 52 * this.currTouchIndex + 80;
        this.seedPacketLargerList[this.currTouchIndex].y = 8;
      }, this);
      this.gameMap.changeType(GameMap.MapType.MAIN);
    });
  }
  protected onComplete() {

  }
}