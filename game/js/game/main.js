/**
 * Main script (entry-point) for the Dodge or Die game.
 *
 * Author: Tomas Mudrunka
 */
require.config({
	baseUrl: "js/game"
});

require(["game"], function (Game) {

	var game = new Game();
	var running = false;
	game.init();
	game.playground.focus();
	game.gameOverCallback = function (result) {
		var time = Math.round(result.time / 100) / 10;
		running = false;
		$('#message-score').text("GAME OVER: You've killed " + result.kills + " enemies, in " + time + "s.");
		$('#game-menu').modal('show');
	};

	game.playground.on('keypress', function (event) {
		if (event.which == 0) { // ESC
			$('#game-menu').modal('show');
		}
	});

	$('#message-score').text("Ready to play!");

	var W = $(window);
	var getWidth = function () { return W.width() - 10; };
	var getHeight = function () { return W.height() - 51; };
	W.resize(function () {
		game.resizePlayground(getWidth(), getHeight());
	});

	$('#the-navbar').find('a').on('click', function (event) {
		event.preventDefault();
		game.playground.focus();
	});
	$('#game-menu, #settings, #about').on('hidden', function () {
		game.playground.focus();
	});

	$('#game-begin').on('click', function () {
		game.beginNewGame();
		running = true;
		$('#message-score').text('');
	});
	$('#game-end').on('click', function () {
		if (running) {
			game.endGame();
		}
	});
	$('#game-play').on('click', function () {
		if (running) {
			game.play();
		}
	});
	$('#game-pause').on('click', function () {
		if (running) {
			game.pause();
		}
	});

	$('#settings-save').on('click', function () {
		var playerSpeed = $('#player-speed').val();
		game.setPlayerSpeed(playerSpeed);
		var difficulty = $('#difficulty').val();
		game.setDifficulty(difficulty);
	});

	$('#game-menu').modal('show');
});
