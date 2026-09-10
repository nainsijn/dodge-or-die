export class Mobile {
  constructor(game) {
    this.game = game;
    this.restartImgWidth = 50;
    this.restartImgHeight = 50;
    this.arrowKeysWidth = 300;
    this.arrowKeysHeight = 200;
    this.restartImage = restart;
    this.arrowKeys = arrowKeys;
  }
  
  restartLogo(context) {
    context.drawImage(
      this.restartImage,
      this.game.width - 70,
      20,
      this.restartImgWidth,
      this.restartImgHeight
    );
  }
  
  powerButton(context) {
    context.save();
    context.globalAlpha = 0.5;
    context.lineWidth = 10;
    context.beginPath();
    context.arc(100, this.game.height - 100, 50, 0, 2 * Math.PI);
    context.stroke();
    context.restore();
  }
  
  arrowKeysButton(context) {
    context.save();
    context.globalAlpha = 0.5;
    context.drawImage(
      this.arrowKeys,
      this.game.width - 380,
      this.game.height - 200,
      this.arrowKeysWidth,
      this.arrowKeysHeight
    );
    context.restore();
  }
}
