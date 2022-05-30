//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
  }

  private onAddToStage(event: egret.Event) {

    egret.lifecycle.addLifecycleListener((context) => {
      // custom lifecycle plugin

      context.onUpdate = () => {

      }
    })

    egret.lifecycle.onPause = () => {
      egret.ticker.pause();
    }

    egret.lifecycle.onResume = () => {
      egret.ticker.resume();
    }

    this.runGame().catch(e => {
      console.log(e);
    })



  }

  private async runGame() {
    // await this.loadResource()
    // this.createGameScene();
    // const result = await RES.getResAsync("description_json")
    // this.startAnimation(result);
    // await platform.login();
    // const userInfo = await platform.getUserInfo();
    // console.log(userInfo);

    // const rect = new Rect(200, 300, 200, 10, 30);
    // rect.draw();
    // this.addChild(rect);
    
    
    
    // const rect1 = new Rect(200, 600, 200, 10, 0, 0xff0000);
    // rect1.draw();
    // // this.addChild(rect1);
    // const rect2 = new Rect(0, 800, 2000, 10, 0);
    // rect2.draw();
    // // this.addChild(rect2);
    // const ball = new Ball(240, 850);
    // this.addChild(ball);
    // // const p = rect.getHorizontalPoint(ball.centerPoint);
    // // console.log(p);
    // // const ball1 = new Ball(p.x, p.y);
    // // this.addChild(ball1);
    
    // const timer = new egret.Timer(20, 0);
    // timer.addEventListener(egret.TimerEvent.TIMER, e => {
    //   if (rect.hitCircle(ball.updateSimulation(10))) {
    //     // ball.velocityY = -ball.velocityY;
    //     // const angle = (ball.angle - rect.rotation) / 180 * Math.PI;
    //     // const vx = ball.velocity * Math.cos(angle);
    //     // const vy = -ball.velocity * Math.cos(angle);
    //     // ball.velocity = Math.pow(vx * vx + vy * vy, 0.5);
    //     ball.velocity *= 0.9
    //     ball.setAngle((rect.rotation * 2 - ball.angle) % 360)
    //     ball.update(20);
    //   } else {
    //     ball.update(20);
    //   }
    // }, this);
    // timer.start();

    const rect = new SATPolygon(280, 800, 4, 200, 20);
    rect.draw();
    // this.addChild(rect);

    const lineTop = new SATPolygon(320, 100, 2, 270, 0);
    lineTop.draw();
    this.addChild(lineTop);
    const lineLeft = new SATPolygon(50, 500, 2, 400, 90);
    lineLeft.draw();
    this.addChild(lineLeft);
    const lineRight = new SATPolygon(590, 500, 2, 400, 90);
    lineRight.draw();
    this.addChild(lineRight);
    
    const lineBottomLeft = new SATPolygon(170, 900, 2, 120, 0);
    lineBottomLeft.draw();
    this.addChild(lineBottomLeft);

    const lineBottomRight = new SATPolygon(470, 900, 2, 120, 0);
    lineBottomRight.draw();
    this.addChild(lineBottomRight);

    const lineList = [lineTop, lineLeft, lineRight, lineBottomLeft, lineBottomRight];

    const rectList = [];

    for (let i = 0, n = 0; i < 10 && n < 100; n++) {
      const r1 = new SATPolygon(Math.floor(Math.random() * 300 + 180), Math.floor(Math.random() * 500 + 300), Math.floor(Math.random() * 2 + 3), 50, Math.floor(Math.random() * 360));
      let flag = false;
      for (let j = 0; j < rectList.length; j++) {
        if (SAT.collisionShape(rectList[j], r1)) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        r1.draw();
        this.addChild(r1);
        rectList.push(r1);
        i++;
      }
    }

    const ball = new Ball(240, 150, 100, 90);
    this.addChild(ball);
    
    
    const timer = new egret.Timer(18, 0);
    timer.addEventListener(egret.TimerEvent.TIMER, e => {
      const simulation = ball.updateSimulation(9);
      for (let i = 0; i < lineList.length; i++) {
        const collisionInfo = SAT.collisionShape(simulation, lineList[i]);
        if (collisionInfo) {
          ball.setAngle((collisionInfo.vector.angle / Math.PI * 180 + 180) * 2 - ball.angle - 180)
          // timer.stop();
          ball.update(18);
          return;
        }
      }
      for (let i = 0; i < rectList.length; i++) {
        const collisionInfo = SAT.collisionShape(simulation, rectList[i]);
        if (collisionInfo) {
          ball.velocity *= 1
          ball.setAngle((collisionInfo.vector.angle / Math.PI * 180 + 180) * 2 - ball.angle - 180)
          // timer.stop();
          ball.update(18);
          return;
        }
      }
      ball.update(18);
    }, this);
    timer.start();
    
    
    // const shp = new egret.Shape();
    // shp.x = 25;
    // shp.y = 25;
    // shp.graphics.beginFill(0x0000ff);
    // shp.graphics.drawRect(0, 0, 100, 100);
    // this.addChild(shp);
    // const shp1 = new egret.Shape();
    // shp1.x = 25;
    // shp1.y = 25;
    // shp1.graphics.beginFill(0x00ffff);
    // shp1.graphics.drawCircle(0, 0, 50);
    // this.addChild(shp1);

  }

  private async loadResource() {
    try {
      const loadingView = new LoadingUI();
      this.stage.addChild(loadingView);
      await RES.loadConfig("resource/default.res.json", "resource/");
      await RES.loadGroup("preload", 0, loadingView);
      this.stage.removeChild(loadingView);
    }
    catch (e) {
      console.error(e);
    }
  }

  private textfield: egret.TextField;

  /**
   * 创建游戏场景
   * Create a game scene
   */
  private createGameScene() {
    let sky = this.createBitmapByName("bg_jpg");
    this.addChild(sky);
    let stageW = this.stage.stageWidth;
    let stageH = this.stage.stageHeight;
    sky.width = stageW;
    sky.height = stageH;

    let topMask = new egret.Shape();
    topMask.graphics.beginFill(0x000000, 0.5);
    topMask.graphics.drawRect(0, 0, stageW, 172);
    topMask.graphics.endFill();
    topMask.y = 33;
    this.addChild(topMask);

    let icon = this.createBitmapByName("egret_icon_png");
    this.addChild(icon);
    icon.x = 26;
    icon.y = 33;

    let line = new egret.Shape();
    line.graphics.lineStyle(2, 0xffffff);
    line.graphics.moveTo(0, 0);
    line.graphics.lineTo(0, 117);
    line.graphics.endFill();
    line.x = 172;
    line.y = 61;
    this.addChild(line);


    let colorLabel = new egret.TextField();
    colorLabel.textColor = 0xffffff;
    colorLabel.width = stageW - 172;
    colorLabel.textAlign = "center";
    colorLabel.text = "Hello Egret";
    colorLabel.size = 24;
    colorLabel.x = 172;
    colorLabel.y = 80;
    this.addChild(colorLabel);

    let textfield = new egret.TextField();
    this.addChild(textfield);
    textfield.alpha = 0;
    textfield.width = stageW - 172;
    textfield.textAlign = egret.HorizontalAlign.CENTER;
    textfield.size = 24;
    textfield.textColor = 0xffffff;
    textfield.x = 172;
    textfield.y = 135;
    this.textfield = textfield;


  }

  /**
   * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
   * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
   */
  private createBitmapByName(name: string) {
    let result = new egret.Bitmap();
    let texture: egret.Texture = RES.getRes(name);
    result.texture = texture;
    return result;
  }

  /**
   * 描述文件加载成功，开始播放动画
   * Description file loading is successful, start to play the animation
   */
  private startAnimation(result: string[]) {
    let parser = new egret.HtmlTextParser();

    let textflowArr = result.map(text => parser.parse(text));
    let textfield = this.textfield;
    let count = -1;
    let change = () => {
      count++;
      if (count >= textflowArr.length) {
        count = 0;
      }
      let textFlow = textflowArr[count];

      // 切换描述内容
      // Switch to described content
      textfield.textFlow = textFlow;
      let tw = egret.Tween.get(textfield);
      tw.to({ "alpha": 1 }, 200);
      tw.wait(2000);
      tw.to({ "alpha": 0 }, 200);
      tw.call(change, this);
    };

    change();
  }
}