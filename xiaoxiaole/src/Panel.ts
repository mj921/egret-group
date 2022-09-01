class Panel extends egret.DisplayObjectContainer {
  blockFactory: BlockFactory;
  cellList: Block[] = [];
  preparationCellList: Block[] = [];
  tagBlock: Block;
  n = 0;
  
  constructor(public row = 20, public col = 20, public blockSize = 20) {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, e => {
      this.blockSize = this.stage.stageWidth / this.col;
      this.init();
    }, this);
    
  }

  async init() {
    this.blockFactory = new BlockFactory(this.blockSize);
    for (let i = 0; i < this.col; i++) {
      const block = this.blockFactory.createRandomBlock(i % this.col * this.blockSize + this.blockSize / 2, -this.blockSize / 2);
      this.preparationCellList.push(block);
      block.visible = false;
      block.draw();
      this.addChild(block);
    }
    for (let i = 0, len = this.row * this.col; i < len; i++) {
      const block = this.blockFactory.createRandomBlock(i % this.col * this.blockSize + this.blockSize / 2, Math.floor(i / this.col) * this.blockSize + this.blockSize / 2);
      this.addChild(block);
      this.cellList.push(block);
      block.draw();
    }
    
    this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, e => {
      const x = Math.floor(e.stageX / this.blockSize);
      const y = Math.floor(e.stageY / this.blockSize);
      const tagBlock = this.cellList[y * this.col + x];
      console.log(tagBlock);
      if (this.tagBlock) {
        this.tagBlock.clearDraw();
        this.tagBlock.draw();
        if (Math.abs(tagBlock.x - this.tagBlock.x) + Math.abs(tagBlock.y - this.tagBlock.y) === this.blockSize) {
          const currIndex = this.cellList.indexOf(tagBlock);
          const beforeIndex = this.cellList.indexOf(this.tagBlock);
          let { x: blockTempX, y: blockTempY } = tagBlock;
          tagBlock.x = this.tagBlock.x;
          tagBlock.y = this.tagBlock.y;
          this.tagBlock.x = blockTempX;
          this.tagBlock.y = blockTempY;
          this.cellList[currIndex] = this.tagBlock;
          this.cellList[beforeIndex] = tagBlock;
          this.tagBlock = null;
          this.checkHandle();
        } else {
          tagBlock.drawTag();
          this.tagBlock = tagBlock;
        }
      } else {
        tagBlock.drawTag();
        this.tagBlock = tagBlock;
      }
    }, this);
    this.checkHandle().then(() => {
      console.log(this.n);
      
    });

    document.body.addEventListener('keyup', async (e) => {
      // if (e.code === 'Space') {
      //   this.removeCheckTag();
      //   await this.cellMove();
      //   await this.checkHandle();
      // }
      
    })
  }

  async checkHandle() {
    if (this.check()) {
      // await Util.sleep(2000);
      this.removeCheckTag();
      await this.cellMove();
      await this.checkHandle();
    } else {
      return false;
    }
  }

  check() {
    for (let i = 0, len = this.cellList.length; i < len; i++) {
      if (!this.cellList[i]) continue;
      const x = i % this.col;
      const y = Math.floor(i / this.col);
      const block = this.cellList[i];
      let rightBlock: Block;
      let bottomBlock: Block;
      if (x < this.col - 1) {
        rightBlock = this.cellList[i + 1];
        if (block.y !== rightBlock.y) {
          console.log('rbrbrbrb');
        }
      }
      if (y < this.row - 1) {
        bottomBlock = this.cellList[i + this.col];
      }
      if (rightBlock && rightBlock.type === block.type) {
        if (block.horizontalBlockList.indexOf(block) === -1) {
          block.horizontalBlockList.push(block);
        }
        if (block.horizontalBlockList.indexOf(rightBlock) === -1) {
          block.horizontalBlockList.push(rightBlock);
        }
        rightBlock.horizontalBlockList = block.horizontalBlockList;
      }
      if (bottomBlock && bottomBlock.type === block.type) {
        if (block.verticalBlockList.indexOf(block) === -1) {
          block.verticalBlockList.push(block);
        }
        if (block.verticalBlockList.indexOf(bottomBlock) === -1) {
          block.verticalBlockList.push(bottomBlock);
        }
        bottomBlock.verticalBlockList = block.verticalBlockList;
      }
    }
    let flag = false;
    for (let i = 0, len = this.cellList.length; i < len; i++) {
      if (this.cellList[i] && (this.cellList[i].horizontalBlockList.length > 2 || this.cellList[i].verticalBlockList.length > 2)) {
        this.cellList[i].drawTag();
        flag = true;
      }
    }
    return flag;
  }

  removeCheckTag() {
    this.cellList.forEach((block, i) => {
      if (block && (block.horizontalBlockList.length > 2 || block.verticalBlockList.length > 2)) {
        this.cellList[i] = null;
        this.blockFactory.destroyBlock(block);
        this.n++;
      }
      block.horizontalBlockList = [];
      block.verticalBlockList = [];
    })
  }

  async cellMove() {
    let flag = false;
    const promises = [];
    for (let i = this.cellList.length - 1; i >= 0; i--) {
      if (!this.cellList[i]) {
        if (i >= this.col) {
          const topBlock = this.cellList[i - this.col];
          if (topBlock) {
            this.cellList[i] = topBlock;
            this.cellList[i - this.col] = null;
            promises.push(topBlock.move());
            flag = true;
          }
        } else {
          const topBlock = this.blockFactory.createRandomBlock(i % this.col * this.blockSize + this.blockSize / 2, -this.blockSize / 2);
          this.addChild(topBlock);
          topBlock.draw();
          this.cellList[i] = topBlock;
          promises.push(topBlock.move());
          flag = true;
        }
      }
    }
    if (flag) {
      await Promise.all(promises);
      await this.cellMove();
    }
  }
}