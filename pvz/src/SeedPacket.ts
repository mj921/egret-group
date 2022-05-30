
class SeedPacket extends egret.Sprite {
  public constructor(name: string) {
    super();
    this.plantName = name;
    this.width = 50;
    this.height = 70;
    this.bgImg = Util.createBitmapByName("interface_seedPacketLarger_png");
    this.bgImg.scaleX = 0.5;
    this.bgImg.scaleY = 0.5;
    this.addChild(this.bgImg);
    this.bgImg.touchEnabled = true;
    this.touchEnabled = true;
    this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, e => {
      this.bgImg.visible = false;
    }, this.bgImg);
    this.addEventListener(egret.TouchEvent.TOUCH_END, e => {
      this.bgImg.visible = true;
    }, this.bgImg);
    this.plant = new Plant(name);
    this.plant.scaleX = 0.5;
    this.plant.scaleY = 0.5;
    this.addChild(this.plant);
  }
  private bgImg: egret.Bitmap;
  private plant: Plant;
  private plantName: String;
}