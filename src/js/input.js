export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.touchStartX = null;
        this.touchStartY = null;
        this.lastMoveTime = 0;
        this.moveDelay = 100;
        
        this.setupKeyboardControls();
        this.setupTouchControls();
        this.setupButtonControls();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.game.gameOver) return;
            
            this.keys[e.key] = true;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.handleMove(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.handleMove(1, 0);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.game.rotatePiece();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.game.movePiece(0, 1);
                    break;
                case ' ':
                    e.preventDefault();
                    this.game.hardDrop();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    setupTouchControls() {
        const canvas = document.getElementById('tetris-board');
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.touchStartX || !this.touchStartY) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;

            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleMove(1, 0);
                } else {
                    this.handleMove(-1, 0);
                }
                this.touchStartX = touch.clientX;
            }

            if (deltaY > 50) {
                this.game.movePiece(0, 1);
                this.touchStartY = touch.clientY;
            }
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - this.touchStartX);
            const deltaY = Math.abs(touch.clientY - this.touchStartY);

            if (deltaX < 10 && deltaY < 10) {
                this.game.rotatePiece();
            }

            this.touchStartX = null;
            this.touchStartY = null;
        });

        let touchTimer;
        canvas.addEventListener('touchstart', (e) => {
            touchTimer = setTimeout(() => {
                this.game.hardDrop();
            }, 500);
        });

        canvas.addEventListener('touchend', () => {
            clearTimeout(touchTimer);
        });
    }

    setupButtonControls() {
        const startButton = document.getElementById('start-button');
        const pauseButton = document.getElementById('pause-button');
        const resetButton = document.getElementById('reset-button');

        startButton.addEventListener('click', () => {
            if (this.game.gameOver) {
                this.game.init();
            }
        });

        pauseButton.addEventListener('click', () => {
            this.togglePause();
        });

        resetButton.addEventListener('click', () => {
            this.game.init();
        });
    }

    handleMove(dx, dy) {
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime > this.moveDelay) {
            this.game.movePiece(dx, dy);
            this.lastMoveTime = currentTime;
        }
    }

    togglePause() {
        this.game.paused = !this.game.paused;
        const pauseButton = document.getElementById('pause-button');
        pauseButton.textContent = this.game.paused ? '再開' : '一時停止';
    }

    update() {
        const currentTime = Date.now();
        
        if (this.keys['ArrowLeft'] && currentTime - this.lastMoveTime > this.moveDelay) {
            this.game.movePiece(-1, 0);
            this.lastMoveTime = currentTime;
        }
        
        if (this.keys['ArrowRight'] && currentTime - this.lastMoveTime > this.moveDelay) {
            this.game.movePiece(1, 0);
            this.lastMoveTime = currentTime;
        }
        
        if (this.keys['ArrowDown']) {
            this.game.dropTime = 50;
        } else {
            this.game.dropTime = Math.max(100, 1000 - (this.game.level - 1) * 100);
        }
    }
}