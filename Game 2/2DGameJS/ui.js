export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    // this.fontFamily = "Bangers";
    this.livesImage = lives;
  }
  draw(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "white";
    context.shadowBlur = 0;
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    // Score
    context.fillText("Score: " + this.game.score, 20, 50);
    // Target
    context.fillText("Target: " + this.game.winnigScore, 150, 50);
    // Timer
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText(
      "Time: " +
        Math.floor(
          (this.game.maxTime * 0.001).toFixed(1) -
            (this.game.time * 0.001).toFixed(1)
        ),
      20,
      80
    );
    // Energy
    this.presentage = Math.round(
      (this.game.energy.toFixed(0) / this.game.maxEnergy) * 100
    );
    context.fillText("Energy: ", 20, 110);
    if (this.presentage <= 20) context.fillStyle = "red";
    else if (this.presentage <= 50) context.fillStyle = "yellow";
    else context.fillStyle = "lightGreen";

    for (let i = 0; i < this.game.energy.toFixed(0); i++) {
      context.fillText("|", 50 * i * 0.2 + 100, 110);
    }
    // Lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 120, 25, 25);
    }
    // Game over messages
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = this.fontSize * 3 + "px " + this.fontFamily;
      if (this.game.score >= this.game.winnigScore) {
        context.fillStyle = "blue";
        context.fillText(
          "Boo-yah",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 1 + "px " + this.fontFamily;
        context.fillText(
          "What are creatures of the night afraid of? YOU!!!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
        context.fillStyle = "black";
        context.fillText(
          "Press 'Enter' to restart",
          this.game.width * 0.5,
          this.game.height * 0.5 + 200
        );
      } else {
        context.fillStyle = "red";
        context.fillText(
          "Love at first bite?",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = this.fontSize * 1 + "px " + this.fontFamily;
        context.fillText(
          "Nope, Better luck next time!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
        context.fillStyle = "black";
        context.fillText(
          "Press 'Enter' to restart",
          this.game.width * 0.5,
          this.game.height * 0.5 + 200
        );
      }
    }
    context.restore();
  }
}
