class SimpleAnimate extends egret.Sprite {
  public constructor(resName: string, width: number, height: number, time: number) {
    super();
    this.width = width;
    this.height = height;
    this.img = Util.createBitmapByName(resName);
    this.time = time;
    this.frequency = this.img.measuredWidth / width;
    this.duration = time / this.frequency;
    this.frames = 1000 / this.duration;

    const rect = new egret.Rectangle(0, 0, width, height);
    this.mask = rect;
    this.addChild(this.img);
  }
  /** 动画完成 */
  public static ANIMATE_FINISH = "动画完成";
  private time: number;
  private timer;
  private frequency: number;
  private frames: number;
  private duration: number;
  private img: egret.Bitmap;
  private _play(frequency: number) {
    clearTimeout(this.timer);
    this.img.x -= this.width;
    if (frequency < this.frequency - 1) {
      this.timer = setTimeout(() => {
        this._play(frequency + 1);
      }, this.duration);
    } else {
      this.dispatchEvent(new egret.Event(SimpleAnimate.ANIMATE_FINISH));
    }
  }
  public play() {
    this.timer = setTimeout(() => {
      this._play(1);
    }, this.duration);
  }
}