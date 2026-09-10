import { Background } from "./background.js";
import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from "./enemies.js";
import InputHandler from "./input.js";
import { Mobile } from "./mobile.js";
import { Player } from "./player.js";
import { Sound } from "./sounds.js";
import { UI } from "./ui.js";

window.addEventListener("load", function () {
  loading.style.display = "none";
  const canvas = document.getElementById("canvas1");
  canvas.style.visibility = "visible";
  const ctx = canvas.getContext("2d");
  canvas.width = 1000;
  canvas.height = 500;
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 40; // City: 80 Wild: 40
      this.speed = 0;
      this.maxSpeed = 5;
      this.isMobileDevice = window.matchMedia(
        "only screen and (max-width: 1000px)"
      ).matches;
      this.boundingBox = canvas.getBoundingClientRect();
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.sound = new Sound();
      this.mobile = new Mobile(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 75;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.time = 0;
      this.maxTime = 40000; // maxTime
      this.winnigScore = 30; // maxTotal
      this.gameOver = false;
      this.lives = 5;
      this.maxEnergy = 20;
      this.energy = Math.round((this.maxEnergy / 100) * 10);
      this.energyMin = 1;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.sound.startSound();
    }
    update(deltaTime) {
      // Game over check
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;
      if (this.score >= this.winnigScore) this.gameOver = true;
      // player and background update
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      // handle Enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });
      // handle messages
      this.floatingMessages.forEach((message) => {
        message.update(deltaTime);
      });
      // handle Particles
      this.particles.forEach((particle, index) => {
        particle.update();
      });
      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }
      // handle collision sprites
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
      });
      // Remove offeset items
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      this.collisions = this.collisions.filter(
        (collision) => !collision.markedForDeletion
      );
      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );
      // GameOver sound
      if (this.gameOver) {
        if (this.score >= this.winnigScore) this.sound.winSound();
        else this.sound.failSound();
      }
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      if (this.isMobileDevice) {
        this.mobile.restartLogo(context);
        this.mobile.powerButton(context);
        this.mobile.arrowKeysButton(context);
      }
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.floatingMessages.forEach((message) => {
        message.draw(context);
      });
      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
  }
  animate(0);
});
