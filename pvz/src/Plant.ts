interface PlantData {
  name: string;
  img: string;
  hp: number;
  speed: number;
  type: number;
  damage: number;
}

// enum PlantStatus {
//   Stand = "stand",
//   Move = "move",
//   Attack = "attack",
//   Die = "die"
// }
// /** 僵尸类型 */
// enum PlantType {
//   /** 普通的僵尸 */
//   Normal = 1,
//   /** 头上佩戴防具的僵尸 */
//   HeadWear = 2,
//   /** 手持物品的僵尸 */
//   HandHold = 3
// }

class Plant extends egret.Sprite {
  public constructor(name: string) {
    super();
    // this.moveImg = Util.createBitmapByName(resName);
    const plantsConfig = RES.getRes("config_data_plants_json");
    this.plantData = plantsConfig[name];
    
    this.hp = this.plantData.hp;
    this.currentHp = this.plantData.hp;
    this.damage = this.plantData.damage;
    this.speed = this.plantData.speed;
    // this.status = Plant.PlantStatus.Stand;
    // this.type = this.plantData.type;
    this.img = Util.createBitmapByName(this.plantData.img);
    this.addChild(this.img);
  }
  // private static PlantStatus = PlantStatus;
  // private static PlantType = PlantType;
  private plantData: PlantData;
  /** 血量 */
  private hp: number;
  /** 当前血量 */
  private currentHp: number;
  /** 每次攻击伤害 */
  private damage: number;
  /** 每次攻击间隔 */
  private speed: number;
  /** 植物类型 */
  // private type: PlantType;
  /** 状态 */
  private status: string;
  private img: egret.Bitmap;
  private playAnimate(status: string) {
    if (status !== this.status) {
      this.status = status;
    }
  }
}