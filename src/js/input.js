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
        this.setupMobileControls();
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
        // ボタンのイベントリスナーはgame.jsで管理するため、ここでは設定しない
    }

    handleMove(dx, dy) {
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime > this.moveDelay) {
            this.game.movePiece(dx, dy);
            this.lastMoveTime = currentTime;
        }
    }

    togglePause() {
        if (this.game.togglePause) {
            this.game.togglePause();
        }
    }

    setupMobileControls() {
        // モバイル用の方向ボタン
        const mobileLeft = document.getElementById('mobile-left');
        const mobileRight = document.getElementById('mobile-right');
        const mobileDown = document.getElementById('mobile-down');
        const mobileRotate = document.getElementById('mobile-rotate');
        const mobileDrop = document.getElementById('mobile-drop');

        // 左ボタン
        if (mobileLeft) {
            let leftInterval;
            mobileLeft.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.game.movePiece(-1, 0);
                leftInterval = setInterval(() => {
                    this.game.movePiece(-1, 0);
                }, this.moveDelay);
            });
            
            mobileLeft.addEventListener('touchend', (e) => {
                e.preventDefault();
                clearInterval(leftInterval);
            });
            
            mobileLeft.addEventListener('touchcancel', () => {
                clearInterval(leftInterval);
            });
        }

        // 右ボタン
        if (mobileRight) {
            let rightInterval;
            mobileRight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.game.movePiece(1, 0);
                rightInterval = setInterval(() => {
                    this.game.movePiece(1, 0);
                }, this.moveDelay);
            });
            
            mobileRight.addEventListener('touchend', (e) => {
                e.preventDefault();
                clearInterval(rightInterval);
            });
            
            mobileRight.addEventListener('touchcancel', () => {
                clearInterval(rightInterval);
            });
        }

        // 下ボタン
        if (mobileDown) {
            let downInterval;
            mobileDown.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.game.movePiece(0, 1);
                downInterval = setInterval(() => {
                    this.game.movePiece(0, 1);
                }, 50);
            });
            
            mobileDown.addEventListener('touchend', (e) => {
                e.preventDefault();
                clearInterval(downInterval);
            });
            
            mobileDown.addEventListener('touchcancel', () => {
                clearInterval(downInterval);
            });
        }

        // 回転ボタン
        if (mobileRotate) {
            mobileRotate.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.game.rotatePiece();
            });
        }

        // ハードドロップボタン
        if (mobileDrop) {
            mobileDrop.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.game.hardDrop();
            });
        }
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