import {GameStatus} from './game-status.js'

/**
 * Game Configuration
 */
class Config {
    config;
    brick;

    constructor(config) {
        this.config = config;
        this.brick = this.initBrick();
    }

    get ball() {
        return this.config.ball;
    }

    get board() {
        return this.config.board;
    }

    get paddle() {
        return this.config.paddle;
    }

    get wall() {
        const offset = (this.board.width - this.config.wall.width) / 2;
        return {...this.config.wall, offset};
    }

    initBrick() {
        const wall = this.wall;
        const height = (2 * wall.height) / (3 * wall.rows);
        const padding = height / 2;
        const width = (wall.width - padding * (wall.cols - 1)) / wall.cols;
        return {width, height, padding};
    }

}


export default class GameModel {
    config;
    ball;
    bricks = [];
    delta = {x: null, y: null};
    intervalId;
    paddle;
    results = {lives: 3, score: 0, status: GameStatus.PROGRESS}

    constructor(config) {
        this.config = new Config(config);
        this.init();
    }


    get board() {
        return this.config?.board;
    }


    collisionDetection() {
        this.collisionDetectionBorders();
        this.collisionDetectionBricks();
    }


    collisionDetectionBorders() {
        const ball = this.ball;
        const board = this.board;
        const paddle = this.paddle;
        const delta = this.delta;

        // Side Borders:
        if (
            ball.x + delta.x > board.width - ball.radius                    // right border
            || ball.x + delta.x < ball.radius                               // left border
        ) {
            delta.x = -delta.x;
        }

        // Top/Bottom Borders and Paddle:
        if (ball.y + delta.y < ball.radius) {                               // top border
            delta.y = -delta.y;
        } else if (ball.y + delta.y > board.height - ball.radius) {         // bottom border
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {    // paddle
                // Increase speed:
                delta.x += 1;
                delta.y += 1;
                delta.y = -delta.y;
            } else {                                                        // lose live
                this.results.lives--;
                if (this.results.lives) {
                    this.setStartPosition();
                }
            }
        }
    }


    collisionDetectionBricks() {
        const ball = this.ball;
        this.bricks.forEach(brick => {
            if (brick.status !== 1) return;
            if (
                ball.x > brick.x && ball.x < brick.x + brick.width
                && ball.y > brick.y && ball.y < brick.y + brick.height
            ) {
                this.delta.y = -this.delta.y;
                brick.status = 0;
                this.results.score++;
            }
        });
    }


    handleFinish() {
        // Game over:
        if (!this.results.lives) {
            this.results.status = GameStatus.OVER;
            this.stopGame();
        }
        // Win:
        if (!this.bricks.find(brick => brick.status === 1)) {
            this.results.status = GameStatus.WIN;
            this.stopGame();
        }
    }


    init() {
        this.initPaddle();
        this.initBall();
        this.initBricks();
    }


    initBall() {
        const radius = this.config.ball.radius;
        this.ball = {x: null, y: null, radius}
    }


    initBricks() {
        const {rows, cols, offset} = this.config.wall;
        const {width, height, padding} = this.config.brick;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * (width + padding) + offset;
                const y = row * (height + padding) + offset;
                this.bricks.push({status: 1, x, y, row, col, width, height});
            }
        }
    }


    initPaddle() {
        this.paddle = {...this.config.paddle, x: null}
    }


    movePaddle(x) {
        this.paddle.x = x;
    }


    process() {
        this.collisionDetection();
        this.handleFinish();
        this.ball.x += this.delta.x;
        this.ball.y += this.delta.y;
    }


    setStartPosition() {
        const {board, paddle} = this.config;
        this.ball.x = board.width / 2;
        this.ball.y = board.height - this.ball.radius * 2 - paddle.height;
        this.paddle.x = (board.width - paddle.width) / 2;
        this.delta.x = 2;
        this.delta.y = -2;
    }


    startGame() {
        this.setStartPosition();
        this.intervalId = setInterval(() => {
            this.process();
        }, 30);
    }


    stopGame() {
        clearInterval(this.intervalId);
    }


}
