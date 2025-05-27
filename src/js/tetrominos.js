export const TETROMINO_TYPES = {
    I: {
        name: 'I',
        color: '#00f0f0',
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    O: {
        name: 'O',
        color: '#f0f000',
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    T: {
        name: 'T',
        color: '#a000f0',
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    S: {
        name: 'S',
        color: '#00f000',
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    },
    Z: {
        name: 'Z',
        color: '#f00000',
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    },
    J: {
        name: 'J',
        color: '#0000f0',
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    L: {
        name: 'L',
        color: '#f0a000',
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]
    }
};

export class Tetromino {
    constructor(type) {
        this.type = type;
        this.color = TETROMINO_TYPES[type].color;
        this.shape = TETROMINO_TYPES[type].shape;
        this.x = 3;
        this.y = 0;
    }

    rotate() {
        const n = this.shape.length;
        const rotated = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                rotated[j][n - 1 - i] = this.shape[i][j];
            }
        }
        
        return rotated;
    }

    getRotated() {
        const tetromino = new Tetromino(this.type);
        tetromino.shape = this.rotate();
        tetromino.x = this.x;
        tetromino.y = this.y;
        return tetromino;
    }
}

export function getRandomTetromino() {
    const types = Object.keys(TETROMINO_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(randomType);
}