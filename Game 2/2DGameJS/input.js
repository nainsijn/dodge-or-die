export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.touchY = "";
    this.touchX = "";
    this.touchTreshold = 30;
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Control") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if (e.key === "d") this.game.debug = !this.game.debug;
      else if (e.key === "Enter") document.location.reload(true);
      // console.log(e.key, this.keys);
    });
    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Control"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
      // console.log(e.key, this.keys);
    });

    window.addEventListener("touchstart", (e) => {
      this.touchY = e.changedTouches[0].pageY;
      this.touchX = e.changedTouches[0].pageX;
      // Control
      if (
        e.changedTouches[0].pageX >= this.game.boundingBox.x &&
        e.changedTouches[0].pageX <= this.game.boundingBox.width / 4 &&
        e.changedTouches[0].pageY <=
          this.game.boundingBox.y + this.game.boundingBox.height &&
        e.changedTouches[0].pageY >=
          this.game.boundingBox.y + this.game.boundingBox.height * 0.5 &&
        this.keys.indexOf("Control") === -1
      ) {
        this.keys.push("Control");
      }
      // Enter
      if (
        e.changedTouches[0].pageX >=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 9 &&
        e.changedTouches[0].pageX <=
          this.game.boundingBox.x + this.game.boundingBox.width &&
        e.changedTouches[0].pageY >= this.game.boundingBox.y &&
        e.changedTouches[0].pageY <=
          this.game.boundingBox.y + this.game.boundingBox.height / 5
      ) {
        document.location.reload(true);
      }
      // Touch Press
      // Right
      if (
        e.changedTouches[0].pageX >=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 5.8 &&
        e.changedTouches[0].pageX <=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 10.5 &&
        e.changedTouches[0].pageY >=
          this.game.boundingBox.y +
            this.game.boundingBox.height -
            this.game.boundingBox.height / 5.4 &&
        e.changedTouches[0].pageY <=
          this.game.boundingBox.y + this.game.boundingBox.height &&
        this.keys.indexOf("ArrowRight") === -1
      ) {
        this.keys.push("ArrowRight");
      }
      // Down
      if (
        e.changedTouches[0].pageX >=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 3.7 &&
        e.changedTouches[0].pageX <=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 5.2 &&
        e.changedTouches[0].pageY >=
          this.game.boundingBox.y +
            this.game.boundingBox.height -
            this.game.boundingBox.height / 5.4 &&
        e.changedTouches[0].pageY <=
          this.game.boundingBox.y + this.game.boundingBox.height &&
        this.keys.indexOf("ArrowDown") === -1
      ) {
        this.keys.push("ArrowDown");
      }
      // Left
      if (
        e.changedTouches[0].pageX >=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 2.6 &&
        e.changedTouches[0].pageX <=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 3.4 &&
        e.changedTouches[0].pageY >=
          this.game.boundingBox.y +
            this.game.boundingBox.height -
            this.game.boundingBox.height / 5.4 &&
        e.changedTouches[0].pageY <=
          this.game.boundingBox.y + this.game.boundingBox.height &&
        this.keys.indexOf("ArrowLeft") === -1
      ) {
        this.keys.push("ArrowLeft");
      }
      // Up
      if (
        e.changedTouches[0].pageX >=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 3.7 &&
        e.changedTouches[0].pageX <=
          this.game.boundingBox.x +
            this.game.boundingBox.width -
            this.game.boundingBox.width / 5.2 &&
        e.changedTouches[0].pageY >=
          this.game.boundingBox.y +
            this.game.boundingBox.height -
            this.game.boundingBox.height / 2.5 &&
        e.changedTouches[0].pageY <=
          this.game.boundingBox.y +
            this.game.boundingBox.height -
            this.game.boundingBox.height / 4.3 &&
        this.keys.indexOf("ArrowUp") === -1
      ) {
        this.keys.push("ArrowUp");
      }
    });
    
    // Touch Swipe Contols
    /*
    window.addEventListener("touchmove", (e) => {
      const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;
      const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;
      if (
        swipeDistanceY < -this.touchTreshold &&
        this.keys.indexOf("ArrowUp") === -1
      )
        this.keys.push("ArrowUp");
      else if (
        swipeDistanceY > this.touchTreshold &&
        this.keys.indexOf("ArrowDown") === -1
      ) {
        this.keys.push("ArrowDown");
      } else if (
        swipeDistanceX < -this.touchTreshold &&
        this.keys.indexOf("ArrowLeft") === -1
      ) {
        this.keys.push("ArrowLeft");
      } else if (
        swipeDistanceX > this.touchTreshold &&
        this.keys.indexOf("ArrowRight") === -1
      ) {
        this.keys.push("ArrowRight");
      }
    });
    */
    
    window.addEventListener("touchend", (e) => {
      this.keys.splice(this.keys.indexOf("ArrowUp"), 1);
      this.keys.splice(this.keys.indexOf("ArrowDown"), 1);
      this.keys.splice(this.keys.indexOf("ArrowLeft"), 1);
      this.keys.splice(this.keys.indexOf("ArrowRight"), 1);
//       this.keys.splice(this.keys.indexOf("Control"), 1);
    });
  }
}
