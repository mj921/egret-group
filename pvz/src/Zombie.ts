interface ZombieData {
  name: string;
  dragonBoneSkeJson: string;
  dragonBoneTexJson: string;
  dragonBoneTexPng: string;
  hp: number;
  speed: number;
  otherHp: number;
  type: number;
  damage: number;
}

enum ZombieStatus {
  Stand = "stand",
  Move = "move",
  Attack = "attack",
  Die = "die"
}
/** 僵尸类型 */
enum ZombieType {
  /** 普通的僵尸 */
  Normal = 1,
  /** 头上佩戴防具的僵尸 */
  HeadWear = 2,
  /** 手持物品的僵尸 */
  HandHold = 3
}

class Zombie extends egret.Sprite {
  public constructor(name: string) {
    super();
    // this.moveImg = Util.createBitmapByName(resName);
    const zombiesConfig = RES.getRes("config_data_zombies_json");
    this.zombieData = zombiesConfig[name];
    
    this.hp = this.zombieData.hp;
    this.currentHp = this.zombieData.hp;
    this.otherHp = this.zombieData.otherHp;
    this.currentOtherHp = this.zombieData.otherHp;
    this.damage = this.zombieData.damage;
    this.speed = this.zombieData.speed;
    this.status = Zombie.ZombieStatus.Stand;
    this.type = this.zombieData.type;
    this.createDragonBones();
  }
  private static ZombieStatus = ZombieStatus;
  private static ZombieType = ZombieType;
  private zombieData: ZombieData;
  /** 血量 */
  private hp: number;
  /** 当前血量 */
  private currentHp: number;
  /** 额外血量 */
  private otherHp: number;
  /** 当前额外血量 */
  private currentOtherHp: number;
  /** 每秒啃咬伤害 */
  private damage: number;
  /** 移动速度 */
  private speed: number;
  /** 僵尸类型 */
  private type: ZombieType;
  private zombieDragonBones: dragonBones.EgretArmatureDisplay;
  /** 状态 */
  private status: string;
  private createDragonBones() {
    let ske = RES.getRes(this.zombieData.dragonBoneSkeJson);
    let texJson = RES.getRes(this.zombieData.dragonBoneTexJson);
    let tex = RES.getRes(this.zombieData.dragonBoneTexPng);

    var factory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
    factory.parseDragonBonesData(ske);
    factory.parseTextureAtlasData(texJson, tex);
    
    this.zombieDragonBones = factory.buildArmatureDisplay(this.zombieData.name);
    this.zombieDragonBones.anchorOffsetY = this.zombieDragonBones.height / 2;
    this.addChild(this.zombieDragonBones);
  }
  private playAnimate(status: string) {
    if (status !== this.status) {
      this.status = status;
      this.zombieDragonBones.animation.play(status);
    }
  }
  public move() {
    this.playAnimate(Zombie.ZombieStatus.Move);
    this.x -= this.speed;
  }
}