import { TetrisGame } from './tetris.js';
import { UI } from './ui.js';
import { InputHandler } from './input.js';
import { saveToLocalStorage, loadFromLocalStorage } from './utils.js';

class Game {
    constructor() {
        this.tetrisGame = new TetrisGame();
        this.ui = new UI(this.tetrisGame, this);
        this.inputHandler = new InputHandler(this.tetrisGame);
        this.animationId = null;
        this.highScore = loadFromLocalStorage('tetris-highscore') || 0;
        this.gameStarted = false;
    }

    init() {
        this.setupEventListeners();
        this.ui.render();
        this.ui.showStartScreen();
    }
    
    setupEventListeners() {
        const handleCanvasClick = (e) => {
            e.preventDefault();
            const rect = this.ui.boardCanvas.getBoundingClientRect();
            
            let x, y;
            if (e.touches) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            
            // Calculate the actual button position based on canvas dimensions
            const cellSize = this.ui.cellSize;
            const canvasLogicalWidth = this.tetrisGame.boardWidth * cellSize;
            const canvasLogicalHeight = this.tetrisGame.boardHeight * cellSize;
            
            // Scale click coordinates to logical canvas size
            const scaleX = canvasLogicalWidth / rect.width;
            const scaleY = canvasLogicalHeight / rect.height;
            const logicalX = x * scaleX;
            const logicalY = y * scaleY;
            
            // Check if click is on button area
            const buttonWidth = 120;
            const buttonHeight = 40;
            const buttonX = (canvasLogicalWidth - buttonWidth) / 2;
            const buttonY = canvasLogicalHeight / 2 + 20;
            
            if (logicalX >= buttonX && logicalX <= buttonX + buttonWidth &&
                logicalY >= buttonY && logicalY <= buttonY + buttonHeight) {
                if (!this.gameStarted || this.tetrisGame.gameOver) {
                    this.startNewGame();
                }
            }
        };
        
        this.ui.boardCanvas.addEventListener('click', handleCanvasClick);
        this.ui.boardCanvas.addEventListener('touchstart', handleCanvasClick, { passive: false });
    }
    
    startNewGame() {
        this.gameStarted = true;
        this.tetrisGame.init();
        this.ui.boardCanvas.classList.remove('clickable');
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
        if (!this.tetrisGame.isPaused) {
            this.inputHandler.update();
            this.tetrisGame.update(currentTime);
        }
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

// DOMContentLoaded を使用して、要素が存在することを保証
document.addEventListener('DOMContentLoaded', () => {
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');
    
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            if (game.gameStarted && !game.tetrisGame.gameOver) {
                game.tetrisGame.togglePause();
                const pauseIcon = pauseButton.querySelector('svg');
                if (game.tetrisGame.isPaused) {
                    pauseIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
                } else {
                    pauseIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
                }
            }
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (game.gameStarted) {
                game.startNewGame();
            }
        });
    }
    
    game.init();
});