class MainLoadingScene extends Scene implements RES.PromiseTaskReporter {
  constructor() {
    super();
  }
  private loadBar: egret.Bitmap;
  private titleScreen: egret.Bitmap;
  private loadBarDirt: egret.Bitmap;
  private loadBarGrass: egret.Bitmap;
  private sodRollCap: egret.Bitmap;
  private textField: egret.TextField;
  private startButton: eui.Button;
  public static START_GAME: "开始游戏";

  protected createScene() {
    return new Promise((resolve, reject) => {
      this.loadResource().then(() => {
        this.titleScreen.x = 0;
        this.titleScreen.y = 0;
        this.loadBar.x = 233;
        this.loadBar.y = 500;
        this.loadBarDirt.x = 243;
        this.loadBarDirt.y = 523;
        const rect = new egret.Rectangle(0, 0, 0, 33);
        this.loadBarGrass.mask = rect;
        this.loadBarGrass.x = 243;
        this.loadBarGrass.y = 500;
        this.sodRollCap.x = 210;
        this.sodRollCap.y = 452;
        this.addChild(this.titleScreen);
        this.addChild(this.loadBarDirt);
        this.addChild(this.loadBarGrass);
        this.addChild(this.sodRollCap);
        this.textField = new egret.TextField();
        resolve(true);
      }).catch(reject);
    })
  }
  protected onComplete() {}
  private async loadResource() {
    try {
      await RES.loadConfig("resource/default.res.json", "resource/");
      await RES.loadGroup("loading", 99);
      this.loadBar = Util.createBitmapByName("interface_loadBar_png");
      this.titleScreen = Util.createBitmapByName("interface_titlescreen_jpg");
      this.loadBarDirt = Util.createBitmapByName("interface_loadBar_dirt_png");
      this.loadBarGrass = Util.createBitmapByName("interface_loadBar_grass_png");
      this.sodRollCap = Util.createBitmapByName("interface_sodrollcap_png");
    }
    catch (e) {
      console.error(e);
    }
  }
  private startGame() {
    this.dispatchEvent(new egret.Event(MainLoadingScene.START_GAME));
  }
  public onProgress(current: number, total: number) {
    if (this.loadBarGrass) {
      this.sodRollCap.rotation = 314 * current / total / 226;
      this.sodRollCap.x = 300 * current / total + 210;
      const rect = new egret.Rectangle(0, 0, 314 * current / total, 330);
      this.loadBarGrass.mask = rect;
      if (current === total) {
        // this.removeChild(this.loadBarDirt);
        // this.removeChild(this.loadBarGrass);
        this.removeChild(this.sodRollCap);
        // this.addChild(this.loadBar);
        Util.setText({ textField: this.textField, x: 243, y: 530, text: "点击开始", width: 314, textAlign: egret.HorizontalAlign.CENTER, size: 16, textColor: 0xffff00 })
        this.addChild(this.textField);
        this.startButton = new eui.Button();
        this.startButton.label = "111";
        this.loadBarDirt.touchEnabled = true;
        this.addChild(this.startButton);
        this.loadBarDirt.addEventListener("touchTap", this.startGame, this)
      }
    }
  }
}