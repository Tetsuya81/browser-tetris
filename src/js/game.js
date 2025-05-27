import { TetrisGame } from './tetris.js';
import { UI } from './ui.js';
import { InputHandler } from './input.js';
import { saveToLocalStorage, loadFromLocalStorage } from './utils.js';

class Game {
    constructor() {
        this.tetrisGame = new TetrisGame();
        this.ui = new UI(this.tetrisGame);
        this.inputHandler = new InputHandler(this.tetrisGame);
        this.animationId = null;
        this.highScore = loadFromLocalStorage('tetris-highscore') || 0;
    }

    init() {
        this.tetrisGame.init();
        this.ui.render();
        this.start();
    }

    start() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        this.inputHandler.update();
        this.tetrisGame.update(currentTime);
        this.ui.render();

        if (this.tetrisGame.gameOver) {
            this.handleGameOver();
        } else {
            this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    handleGameOver() {
        this.ui.showGameOver();
        if (this.tetrisGame.score > this.highScore) {
            this.highScore = this.tetrisGame.score;
            saveToLocalStorage('tetris-highscore', this.highScore);
        }
        cancelAnimationFrame(this.animationId);
    }
}

const game = new Game();
game.init();