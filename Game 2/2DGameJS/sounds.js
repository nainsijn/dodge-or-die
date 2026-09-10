export class Sound {
  constructor() {
    this.attack = new Audio("./sounds/attack.wav");
    this.hit = new Audio("./sounds/hit.wav");
    this.powerBoom = new Audio("./sounds/boom.wav");
    this.win = new Audio("./sounds/won.wav");
    this.fail = new Audio("./sounds/lose.wav");
    this.bark = new Audio("./sounds/dogBark.wav");
    this.congratulations = new Audio("./sounds/voice/congratulations.wav");
    this.you_win = new Audio("./sounds/voice/you_win.wav");
    this.gameOver = new Audio("./sounds/voice/game_over.wav");
    this.you_lose = new Audio("./sounds/voice/you_lose.wav");
    this.ready = new Audio("./sounds/voice/ready.wav");
    this.go = new Audio("./sounds/voice/go.wav");
  }
  attackSound() {
    this.attack.play();
  }
  gethitSound() {
    this.hit.play();
  }
  boomSound() {
    this.powerBoom.play();
  }
  winSound() {
    this.win.play();
    this.win.addEventListener("ended", () => {
      this.congratulations.play();
      this.congratulations.addEventListener("ended", () => {
        this.you_win.play();
      });
    });
  }
  failSound() {
    this.fail.play();
    this.fail.addEventListener("ended", () => {
      this.gameOver.play();
      this.gameOver.addEventListener("ended", () => {
        this.you_lose.play();
      });
    });
  }
  startSound() {
    this.ready.play();
    this.ready.addEventListener("ended", () => {
      this.go.play();
      this.go.addEventListener("ended", () => {
        this.bark.play();
      });
    });
  }
}
