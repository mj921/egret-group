class SATPoint {
  constructor(public x = 0, public y = 0) {}

  normalize() {
    this.magnitude = 1;
  }

  set magnitude(val) {
    const len = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    if (len === 0) return;
    const ratio = val / len;
    this.x *= ratio;
    this.y *= ratio;
  }

  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  get angle() {
    return Math.atan2(this.y, this.x)
  }

  clone() {
    return new SATPoint(this.x, this.y);
  }

  multiply(multiplier: number) {
    return new SATPoint(this.x * multiplier, this.y * multiplier);
  }
}