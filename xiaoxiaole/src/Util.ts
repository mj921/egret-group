class Util {
  static sleep(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    })
  }
}