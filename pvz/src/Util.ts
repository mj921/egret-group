interface SetTextType {
  textField: egret.TextField;
  text: string;
  x?: number;
  y?: number;
  size?: number;
  width: number;
  textAlign: string;
  textColor?: number;
}
class Util {
  public static createBitmapByName(name: string): egret.Bitmap {
    let result = new egret.Bitmap();
    let texture: egret.Texture = RES.getRes(name);
    result.texture = texture;
    return result;
  }
  public static setText(options: SetTextType) {
    const { textField, text, x = 0, y = 0, size = 16, width, textAlign, textColor = 0x000000 } = options;
    textField.text = text;
    textField.x = x;
    textField.y = y + size / 2;
    textField.size = size;
    textField.width = width;
    textField.textAlign = textAlign;
    textField.textColor = textColor;
    textField.verticalAlign = egret.VerticalAlign.MIDDLE;
  }
}