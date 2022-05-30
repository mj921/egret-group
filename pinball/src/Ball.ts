class Ball extends SATCircle {
  velocityX: number;
  velocityY: number;
  constructor(x = 0, y = 0, public velocity = 0, public angle = 0) {
    super(x, y, 10, 0x000000);
    this.velocityX = Math.cos(angle / 180 * Math.PI) * velocity;
    this.velocityY = Math.sin(angle / 180 * Math.PI) * velocity;
    this.init();
  }

  init() {
    this.draw();
  }

  // update(time: number) {
  //   this.x += time / 90 * this.velocityX;
  //   this.y += this.velocityY * time / 90 + 10 * Math.pow(time / 90, 2) / 2;
  //   this.velocityY += 10 * time / 90;
  //   this.velocity = Math.pow(this.velocityX * this.velocityX + this.velocityY * this.velocityY, 0.5);
  //   this.calculationAngle();
  // }

  update(time: number) {
    this.x += time / 90 * this.velocityX;
    this.y += time / 90 * this.velocityY;
  }

  calculationAngle() {
    if (this.velocityX === 0) {
      if (this.velocityY > 0) {
        this.angle = 90;
      } else if (this.velocityY < 0) {
        this.angle = 270;
      } else {
        this.angle = 0;
      }
    } else {
      if (this.velocityY === 0) {
        if (this.velocityX < 0) {
          this.angle = 180;
        } else {
          this.angle = 0;
        }
      } else {
        this.angle = Math.atan(this.velocityY / this.velocityX) / Math.PI * 180 + (this.velocityX > 0 ? 0 : 180);
      }
    }
  }

  updateSimulation(time: number) {
    const clone = this.clone();
    clone.update(time);
    return clone;
  }

  setAngle(angle: number) {
    this.angle = angle;
    this.velocityX = Math.cos(angle / 180 * Math.PI) * this.velocity;
    this.velocityY = Math.sin(angle / 180 * Math.PI) * this.velocity;
  }

  clone() {
    return new Ball(this.x, this.y, this.velocity, this.angle);
  }

  
}