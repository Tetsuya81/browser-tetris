import { getRandomTetromino } from './tetrominos.js';

export class TetrisGame {
    constructor(boardWidth = 10, boardHeight = 20) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.isPaused = false;
        this.dropTime = 1000;
        this.lastDropTime = 0;
    }

    createBoard() {
        return Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
    }

    init() {
        this.board = this.createBoard();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.isPaused = false;
        this.dropTime = 1000;
        this.currentPiece = getRandomTetromino();
        this.nextPiece = getRandomTetromino();
    }

    isValidMove(piece, dx = 0, dy = 0) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x + dx;
                    const newY = piece.y + y + dy;

                    if (newX < 0 || newX >= this.boardWidth || 
                        newY >= this.boardHeight ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    movePiece(dx, dy) {
        if (this.isValidMove(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        }
        return false;
    }

    rotatePiece() {
        const rotated = this.currentPiece.getRotated();
        if (this.isValidMove(rotated)) {
            this.currentPiece = rotated;
            return true;
        }
        return false;
    }

    hardDrop() {
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.lockPiece();
    }

    lockPiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }

        this.clearLines();
        this.spawnNewPiece();
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.updateScore(linesCleared);
            this.updateLevel();
        }
    }

    updateScore(linesCleared) {
        const basePoints = [0, 40, 100, 300, 1200];
        this.score += basePoints[linesCleared] * this.level;
    }

    updateLevel() {
        this.level = Math.floor(this.lines / 10) + 1;
        this.dropTime = Math.max(100, 1000 - (this.level - 1) * 100);
    }

    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = getRandomTetromino();

        if (!this.isValidMove(this.currentPiece)) {
            this.gameOver = true;
        }
    }

    update(currentTime) {
        if (this.gameOver || this.isPaused) return;

        if (currentTime - this.lastDropTime > this.dropTime) {
            if (!this.movePiece(0, 1)) {
                this.lockPiece();
            }
            this.lastDropTime = currentTime;
        }
    }

    getGhostPieceY() {
        let ghostY = this.currentPiece.y;
        while (this.isValidMove(this.currentPiece, 0, ghostY - this.currentPiece.y + 1)) {
            ghostY++;
        }
        return ghostY;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
}