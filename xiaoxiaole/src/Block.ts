class BlockFactory {
  blockList: Block[] = [];
  constructor(public size = 20) {}
  
  createBlock(x: number, y: number, type: BlockType) {
    const block = new Block();
    block.x = x;
    block.y = y;
    block.size = this.size;
    block.type = type;
    this.blockList.push(block);
    return block;
  }

  createRandomBlock(x: number, y: number) {
    const types: BlockType[] = Object.keys(BlockType).reduce((arr, key) => {
      if (typeof BlockType[key] === 'number') {
        return arr.concat([BlockType[key]]);
      }
      return arr;
    }, []);
    const type = types[Math.floor(Math.random() * types.length)];
    return this.createBlock(x, y, type);
  }

  destroyBlock(block: Block) {
    block.destroyed();
    const index = this.blockList.indexOf(block);
    if (index > -1) {
      this.blockList.splice(index, 1);
    }
  }
  setSize(size: number) {
    if (this.size !== size) {
      this.size = size;
      this.blockList.forEach(block => {
        block.size = size;
      })
    }
  }
}

enum BlockType {
  OBSTACLE = 1,
  RED = 2,
  BLUE = 3,
  GREEN = 4,
  ORANGE = 5,
  YELLOW = 6,
}

class Block extends egret.Shape {
  size: number;
  type: BlockType;
  horizontalBlockList: Block[] = [];
  verticalBlockList: Block[] = [];

  static Color = {
    [BlockType.OBSTACLE]: 0xffffff,
    [BlockType.RED]: 0xff0000,
    [BlockType.BLUE]: 0x0000ff,
    [BlockType.GREEN]: 0x00ff00,
    [BlockType.ORANGE]: 0xffa500,
    [BlockType.YELLOW]: 0xffff00,
  }

  get speed() {
    return this.size / 10;
  }

  move() {
    return new Promise(resolve => {
      const y = this.y;
      const timer: egret.Timer = new egret.Timer(16, 10);
      timer.addEventListener(egret.TimerEvent.TIMER, (t) => {
        this.y += this.speed;
        
      }, this);
      timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
        this.y = y + this.size;
        resolve(this.y);
      }, this);
      timer.start();
    })
  }

  clearDraw() {
    this.graphics.clear();
  }

  draw() {
    this.graphics.beginFill(Block.Color[this.type]);
    this.graphics.drawRoundRect(-this.size / 2 * 0.9, -this.size / 2 * 0.9, this.size * 0.9, this.size * 0.9, 20);
    this.graphics.endFill();
  }

  drawTag(color = 0x000000, lineWidth = 4) {
    this.graphics.lineStyle(lineWidth, color);
    this.graphics.drawRoundRect(-this.size / 2 * 0.9 + lineWidth / 2, -this.size / 2 * 0.9 + lineWidth / 2, this.size * 0.9 - lineWidth, this.size * 0.9 - lineWidth, 20);
  }

  destroyed() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}