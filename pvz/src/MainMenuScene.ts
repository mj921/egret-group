class MainMenuScene extends Scene {
  public constructor() {
    super();
  }
  private bg: egret.Bitmap;
  protected createScene(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bg = Util.createBitmapByName("interface_surface_png");
      this.bg.x = 0;
      this.bg.y = -50;
      this.addChild(this.bg);
    });
  }
  protected onComplete() {}
  private start() {
    const hand = new SimpleAnimate("interface_zombiehand_png", 330, 330, 1000);
    this.addChild(hand);
    hand.play();
  }
}