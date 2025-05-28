export class UI {
    constructor(game, gameController) {
        this.game = game;
        this.gameController = gameController;
        this.boardCanvas = document.getElementById('tetris-board');
        this.boardCtx = this.boardCanvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-piece');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.cellSize = 30;
        
        this.setupCanvas();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        
        this.boardCanvas.width = this.game.boardWidth * this.cellSize * dpr;
        this.boardCanvas.height = this.game.boardHeight * this.cellSize * dpr;
        this.boardCanvas.style.width = `${this.game.boardWidth * this.cellSize}px`;
        this.boardCanvas.style.height = `${this.game.boardHeight * this.cellSize}px`;
        this.boardCtx.scale(dpr, dpr);
        
        this.nextCanvas.width = 4 * this.cellSize * dpr;
        this.nextCanvas.height = 4 * this.cellSize * dpr;
        this.nextCanvas.style.width = `${4 * this.cellSize}px`;
        this.nextCanvas.style.height = `${4 * this.cellSize}px`;
        this.nextCtx.scale(dpr, dpr);
    }

    drawCell(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
        );
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            this.cellSize - 1,
            2
        );
        ctx.fillRect(
            x * this.cellSize,
            y * this.cellSize,
            2,
            this.cellSize - 1
        );
    }

    drawBoard() {
        this.boardCtx.fillStyle = '#16213e';
        this.boardCtx.fillRect(0, 0, 
            this.game.boardWidth * this.cellSize,
            this.game.boardHeight * this.cellSize
        );
        
        for (let y = 0; y < this.game.boardHeight; y++) {
            for (let x = 0; x < this.game.boardWidth; x++) {
                if (this.game.board[y][x]) {
                    this.drawCell(this.boardCtx, x, y, this.game.board[y][x]);
                }
            }
        }
        
        this.boardCtx.strokeStyle = '#2a2a4e';
        this.boardCtx.lineWidth = 1;
        for (let x = 0; x <= this.game.boardWidth; x++) {
            this.boardCtx.beginPath();
            this.boardCtx.moveTo(x * this.cellSize, 0);
            this.boardCtx.lineTo(x * this.cellSize, this.game.boardHeight * this.cellSize);
            this.boardCtx.stroke();
        }
        for (let y = 0; y <= this.game.boardHeight; y++) {
            this.boardCtx.beginPath();
            this.boardCtx.moveTo(0, y * this.cellSize);
            this.boardCtx.lineTo(this.game.boardWidth * this.cellSize, y * this.cellSize);
            this.boardCtx.stroke();
        }
    }

    drawPiece(piece, ghost = false) {
        const color = ghost ? 'rgba(255, 255, 255, 0.2)' : piece.color;
        const y = ghost ? this.game.getGhostPieceY() : piece.y;
        
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    if (ghost) {
                        this.boardCtx.strokeStyle = piece.color;
                        this.boardCtx.lineWidth = 2;
                        this.boardCtx.strokeRect(
                            (piece.x + col) * this.cellSize,
                            (y + row) * this.cellSize,
                            this.cellSize - 1,
                            this.cellSize - 1
                        );
                    } else {
                        this.drawCell(this.boardCtx, piece.x + col, y + row, color);
                    }
                }
            }
        }
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = '#16213e';
        this.nextCtx.fillRect(0, 0, 4 * this.cellSize, 4 * this.cellSize);
        
        if (this.game.nextPiece) {
            const offsetX = (4 - this.game.nextPiece.shape[0].length) / 2;
            const offsetY = (4 - this.game.nextPiece.shape.length) / 2;
            
            for (let y = 0; y < this.game.nextPiece.shape.length; y++) {
                for (let x = 0; x < this.game.nextPiece.shape[y].length; x++) {
                    if (this.game.nextPiece.shape[y][x]) {
                        this.drawCell(this.nextCtx, offsetX + x, offsetY + y, this.game.nextPiece.color);
                    }
                }
            }
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.game.score;
        this.scoreElement.classList.add('updated');
        setTimeout(() => this.scoreElement.classList.remove('updated'), 300);
    }

    updateLevel() {
        this.levelElement.textContent = this.game.level;
        this.levelElement.classList.add('updated');
        setTimeout(() => this.levelElement.classList.remove('updated'), 300);
    }

    updateLines() {
        this.linesElement.textContent = this.game.lines;
        this.linesElement.classList.add('updated');
        setTimeout(() => this.linesElement.classList.remove('updated'), 300);
    }

    render() {
        this.drawBoard();
        
        if (this.game.currentPiece) {
            this.drawPiece(this.game.currentPiece, true);
            this.drawPiece(this.game.currentPiece);
        }
        
        this.drawNextPiece();
        this.updateScore();
        this.updateLevel();
        this.updateLines();
    }

    showGameOver() {
        this.boardCanvas.classList.add('game-over');
        this.boardCanvas.classList.add('clickable');
        
        this.boardCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.boardCtx.fillRect(0, 0, 
            this.game.boardWidth * this.cellSize,
            this.game.boardHeight * this.cellSize
        );
        
        this.boardCtx.fillStyle = '#fff';
        this.boardCtx.font = 'bold 30px Arial';
        this.boardCtx.textAlign = 'center';
        this.boardCtx.textBaseline = 'middle';
        this.boardCtx.fillText(
            'GAME OVER',
            this.game.boardWidth * this.cellSize / 2,
            this.game.boardHeight * this.cellSize / 2 - 40
        );
        
        this.drawButton('Restart', this.game.boardHeight * this.cellSize / 2 + 20);
    }
    
    showStartScreen() {
        this.boardCanvas.classList.add('clickable');
        
        this.boardCtx.fillStyle = '#16213e';
        this.boardCtx.fillRect(0, 0, 
            this.game.boardWidth * this.cellSize,
            this.game.boardHeight * this.cellSize
        );
        
        this.boardCtx.fillStyle = '#fff';
        this.boardCtx.font = 'bold 40px Arial';
        this.boardCtx.textAlign = 'center';
        this.boardCtx.textBaseline = 'middle';
        this.boardCtx.fillText(
            'TETRIS',
            this.game.boardWidth * this.cellSize / 2,
            this.game.boardHeight * this.cellSize / 2 - 60
        );
        
        this.drawButton('Start', this.game.boardHeight * this.cellSize / 2 + 20);
    }
    
    drawButton(text, y) {
        const buttonWidth = 120;
        const buttonHeight = 40;
        const x = (this.game.boardWidth * this.cellSize - buttonWidth) / 2;
        
        // Button background
        this.boardCtx.fillStyle = '#0084ff';
        this.boardCtx.fillRect(x, y, buttonWidth, buttonHeight);
        
        // Button border
        this.boardCtx.strokeStyle = '#fff';
        this.boardCtx.lineWidth = 2;
        this.boardCtx.strokeRect(x, y, buttonWidth, buttonHeight);
        
        // Button text
        this.boardCtx.fillStyle = '#fff';
        this.boardCtx.font = 'bold 20px Arial';
        this.boardCtx.textAlign = 'center';
        this.boardCtx.textBaseline = 'middle';
        this.boardCtx.fillText(
            text,
            this.game.boardWidth * this.cellSize / 2,
            y + buttonHeight / 2
        );
    }
}