/**
 * Script responsible for basic game mechanics.
 *
 * Author: Tomas Mudrunka
 */

define(["player", "shoot", "enemyGenerator"], function (Player, Shoot, EnemyGenerator) {
	// background image pattern
	var bgImg = new Image();
	bgImg.src = 'img/game/9.jpeg';

	/** The Game object. */
	function Game() {
		this.playground = $('#playground');

		var width = $(window).width() - 10;
		var height = $(window).height() - 51;

		this.stage = new Kinetic.Stage({
			container: 'playground',
			width: width,
			height: height
		});

		// Optimize canvas performance for frequent readback operations
		var canvases = this.playground.find('canvas');
		for (var i = 0; i < canvases.length; i++) {
			var canvas = canvases[i];
			var ctx = canvas.getContext('2d');
			if (ctx && ctx.canvas) {
				try {
					// Set willReadFrequently attribute for better performance
					ctx.canvas.willReadFrequently = true;
				} catch (e) {
					// Ignore if not supported
				}
			}
		}

		// Background will be created after image loads
		this.background = null;
		this.foreground = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: 'black',
			opacity: 0.5
		});

		this.firstLayer = new Kinetic.Layer();
		this.mainLayer = new Kinetic.Layer();
		this.lastLayer = new Kinetic.Layer();

		this.text = new Kinetic.Text({
			x: 10,
			y: 10,
			fontSize: 30,
			fontStyle: 'bold',
			fill: '#357735',
			shadowColor: 'gray'
		});

		this.killText = new Kinetic.Text({
			x: 10,
			y: 45,
			fontSize: 30,
			fontStyle: 'bold',
			fill: '#dc3545',
			shadowColor: 'gray'
		});

		this.playerGroup = new Kinetic.Group();
		this.player = new Player();
		this.playerHP = 0;

		this.shootGroup = new Kinetic.Group();
		this.shoot = new Shoot();

		this.enemyGroup = new Kinetic.Group();
		this.enemyGenerator = new EnemyGenerator();

		this.playerSpeed = 8;
		this.difficulty = 1;

		// Audio elements
		this.gameStartSound = new Audio('audio/game-start.ogg');
		this.damageSound = new Audio('audio/damage-sound.wav');

		this.gameTime = null;
		this.gamePauseTime = null;
		this.gameOverCallback = null;
	}

	/**
	 * The Game initialization.
	 */
	Game.prototype.init = function () {
		var self = this;
		var player = this.player;
		var shoot = this.shoot;
		var generator = this.enemyGenerator;

		// bind all layers
		// Background will be added after image loads
		this.mainLayer.add(this.shootGroup);
		this.mainLayer.add(this.enemyGroup);
		this.mainLayer.add(this.playerGroup);
		this.mainLayer.add(this.text);
		this.mainLayer.add(this.killText);
		this.lastLayer.add(this.foreground);

		var E1 = 0.05; // epsilon for angle comparison
		var E2 = 5.0; // epsilon for position comparison

		// create callback for shooting
		player.shootCallback = function (points) {
			shoot.renderShoot(points);

			var enemies = generator.getEnemies();

			var x = points[2], y = points[3];
			var p = player.getPosition();

			var angle = Math.atan((y - p.y) / (x - p.x));
			if (x >= p.x) {
				angle = -angle;
			}

			// iterate over all enemies
			for (var i = 0; i < enemies.length; i++) {
				var e = enemies[i].getPosition();
				var a = Math.atan((e.y - p.y) / (e.x - p.x));
				if (e.x >= p.x) {
					a = -a;
				}
				if (angle - E1 < a && a < angle + E1) {
					generator.handleEnemyHit(i);
				}
			}
		};
		player.init(this.mainLayer, this.playerGroup, this.foreground, this.playground);

		shoot.init(this.shootGroup, this.foreground);

		// create callbacks for enemy generator
		var attackCallback = function (x, y) {
			// Don't process attacks if player is already dead
			if (self.playerHP <= 0) {
				return;
			}

			var p = player.getPosition();
			if (x - E2 < p.x && p.x < x + E2 && y - E2 < p.y && p.y < y + E2) {
				player.showDamage();
				self.playerHP--;
				
				// Play damage sound when player loses HP
				self.damageSound.currentTime = 0; // Reset to beginning
				self.damageSound.play().catch(function(error) {
					console.log('Could not play damage sound:', error);
				});
				
				if (self.playerHP <= 0) {
					self.playerHP = 0; // Ensure HP doesn't go below 0
					self.endGame();
				}
				self.refreshText();
			}
		};
		var goToCallback = function () {
			this.goTo(player.getPosition());
		};
		var killCallback = function () {
			self.refreshText();
		};
		generator.init(this.mainLayer, this.enemyGroup, this.foreground, attackCallback, goToCallback, killCallback);

		// add layers to the stage
		this.stage.add(this.firstLayer);
		this.stage.add(this.mainLayer);
		this.stage.add(this.lastLayer);

		// Optimize canvas performance after layers are added
		setTimeout(function () {
			var canvases = self.playground.find('canvas');
			canvases.each(function () {
				var ctx = this.getContext('2d');
				if (ctx) {
					try {
						// Set willReadFrequently for better performance
						var originalGetContext = this.getContext;
						this.getContext = function (type, attributes) {
							attributes = attributes || {};
							if (type === '2d') {
								attributes.willReadFrequently = true;
							}
							return originalGetContext.call(this, type, attributes);
						};
					} catch (e) {
						// Ignore if not supported
					}
				}
			});
		}, 0);

		bgImg.onload = function () {
			var width = self.stage.getWidth();
			var height = self.stage.getHeight();

			// Create background with properly scaled image
			self.background = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: width,
				height: height,
				stroke: 'black',
				strokeWidth: 4,
				fillPatternImage: bgImg,
				fillPatternScaleX: width / bgImg.width,
				fillPatternScaleY: height / bgImg.height
			});

			self.firstLayer.add(self.background);
			self.firstLayer.draw();
		};
	};

	/**
	 * Begins new game (also re-start).
	 */
	Game.prototype.beginNewGame = function () {
		// Play game start sound
		this.gameStartSound.currentTime = 0; // Reset to beginning
		this.gameStartSound.play().catch(function(error) {
			console.log('Could not play game start sound:', error);
		});

		// clean-up before start
		this.playerHP = 5; // 5 hearts instead of 50 HP
		this.player.setSpeed(this.playerSpeed);
		this.enemyGenerator.clean();
		this.enemyGenerator.setDifficulty(this.difficulty);
		this.refreshText();

		// start new game
		this.player.gameBegin();
		this.enemyGenerator.start();
		this.gameTime = new Date().getTime();
		this.gamePauseTime = null;

		this.foreground.setOpacity(0.0);
		this.lastLayer.draw();
	};

	/**
	 * Ends current game, terminates the Player.
	 */
	Game.prototype.endGame = function () {
		this.player.gameOver();
		if (this.gameOverCallback) {
			var self = this;
			var result = {
				speed: this.player.speed,
				difficulty: this.enemyGenerator.difficulty,
				time: new Date().getTime() - this.gameTime,
				kills: this.enemyGenerator.killCount
			};
			setTimeout(function () {
				self.pause();
				self.gameOverCallback(result);
			}, 3000);
		}
	};

	/**
	 * Will play/resume the game.
	 */
	Game.prototype.play = function () {
		this.player.start();
		this.enemyGenerator.start();

		if (this.gamePauseTime) {
			this.gameTime += new Date().getTime() - this.gamePauseTime;
			this.gamePauseTime = null;
		}

		this.foreground.setOpacity(0.0);
		this.lastLayer.draw();
	};

	/**
	 * Will pause the game.
	 */
	Game.prototype.pause = function () {
		this.player.stop();
		this.enemyGenerator.stop();

		this.gamePauseTime = new Date().getTime();

		this.foreground.setOpacity(0.5);
		this.lastLayer.draw();
	};

	/**
	 * Generates heart display for HP.
	 * @returns {string} Heart symbols representing current HP
	 */
	Game.prototype.getHeartDisplay = function () {
		var hearts = '';
		var maxHearts = 5;

		// Add filled hearts for current HP
		for (var i = 0; i < this.playerHP && i < maxHearts; i++) {
			hearts += '♥ ';
		}

		// Add empty hearts for lost HP
		for (var i = this.playerHP; i < maxHearts; i++) {
			hearts += '♡ ';
		}

		return hearts.trim();
	};

	/**
	 * Renders up-to-date text with HP title, hearts, and kill count.
	 */
	Game.prototype.refreshText = function () {
		this.text.setText('HP: ' + this.getHeartDisplay());
		this.killText.setText('Kills: ' + this.enemyGenerator.killCount);
		this.mainLayer.draw();
	};

	/**
	 * Sets moving speed of the Player.
	 * @param speed number > 0
	 */
	Game.prototype.setPlayerSpeed = function (speed) {
		this.playerSpeed = speed;
	};

	/**
	 * Sets initial difficulty of enemies.
	 * @param difficulty number > 0
	 */
	Game.prototype.setDifficulty = function (difficulty) {
		this.difficulty = difficulty
	};

	/**
	 * Resize the playground.
	 * @param width new width
	 * @param height new height
	 */
	Game.prototype.resizePlayground = function (width, height) {
		this.stage.setWidth(width);
		this.stage.setHeight(height);

		if (this.background) {
			this.background.setWidth(width);
			this.background.setHeight(height);
			// Update the scale to fit new dimensions
			this.background.fillPatternScaleX(width / bgImg.width);
			this.background.fillPatternScaleY(height / bgImg.height);
		}

		this.foreground.setWidth(width);
		this.foreground.setHeight(height);
		this.stage.draw();
	};

	return Game;
});
