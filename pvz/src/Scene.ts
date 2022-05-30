abstract class Scene extends egret.DisplayObjectContainer {
  public constructor() {
    super();
    this.createScene().then(() => {
      this.onComplete();
    });
  }
  protected abstract createScene(): Promise<any>;
  protected abstract onComplete();
}