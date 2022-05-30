class SceneManager {
  private static _manager: SceneManager;
  public static get Instance() {
    if (!SceneManager._manager) {
      SceneManager._manager = new SceneManager();
    }
    console.log(SceneManager._manager);
    
    return SceneManager._manager;
  }
  public rootStage;
  private currentScene: Scene;
  public constructor() {}
  public changeScene(scene: Scene) {
    if (this.currentScene) {
      this.rootStage.removeChild(this.currentScene);
      this.currentScene = null;
    }
    this.currentScene = scene;
    this.rootStage.addChild(this.currentScene);
  }
}