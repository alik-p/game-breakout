import { GameStatus } from './game-status.js';


const Actions = Object.freeze({
    RIGHT: 'ArrowRight',
    LEFT: 'ArrowLeft',
});


export default class GameView {
    canvas;
    context;
    movePaddle;
    pressedKeys = new Set();
    viewModel;

    constructor(canvas) {
        this.init(canvas);
    }


    get paddle() {
        return this.viewModel.paddle;
    }


    bindMovePaddle(handler) {
        this.movePaddle = handler;
    }


    clearCanvas() {
        this.canvas.width = this.canvas.width;
    }


    draw() {
        const viewModel = this.viewModel;
        this.clearCanvas();
        this.drawBricks(viewModel.bricks);
        this.drawPaddle(viewModel.paddle);
        this.drawBall(viewModel.ball);
        this.drawScore(viewModel.results.score);
        this.drawLives(viewModel.results.lives);
    }


    drawBall(ball) {
        const context = this.context;
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
    }


    drawBricks(bricks) {
        const context = this.context;
        bricks.forEach(brick => {
            if (brick.status !== 1) return;
            context.beginPath();
            context.rect(brick.x, brick.y, brick.width, brick.height);
            context.fillStyle = '#0095DD';
            context.fill();
            context.closePath();
        })
    }


    drawGameEnd(status) {
        const text = status === GameStatus.OVER ? 'Game Over' : 'You Win!'
        const canvas = this.canvas;
        const context = this.context;
        context.font = '36pt Impact';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
    }


    drawLives(lives) {
        const canvas = this.canvas;
        const context = this.context;
        context.font = '16px Arial';
        context.fillStyle = '#0095DD';
        context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
    }


    drawPaddle(paddle) {
        const canvas = this.canvas;
        const context = this.context;
        context.beginPath();
        context.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
    }


    drawScore(score) {
        const context = this.context;
        context.font = '16px Arial';
        context.fillStyle = '#0095DD';
        context.fillText(`Score: ${score}`, 8, 20);
    }


    handleActions() {
        const {paddle} = this.viewModel;
        if (this.pressedKeys.has(Actions.RIGHT) && paddle.x < this.canvas.width - paddle.width) {
            this.movePaddle(paddle.x + 7);
        } else if (this.pressedKeys.has(Actions.LEFT) && paddle.x > 0) {
            this.movePaddle(paddle.x - 7);
        }
    }


    init(canvas) {
        this.initCanvas(canvas);
        this.initEventListeners();
    }


    initCanvas(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }


    initEventListeners() {
        const keyDown = (event) => {
            this.onKeyDown(event)
        }
        const keyUp = (event) => {
            this.onKeyUp(event)
        }
        const mouseMove = (event) => {
            this.onMouseMove(event)
        }
        document.addEventListener('keydown', keyDown, false);
        document.addEventListener('keyup', keyUp, false);
        document.addEventListener('mousemove', mouseMove, false);
    }


    onKeyDown(event) {
        console.log('onKeyDown: ', event.key)
        if (Object.values(Actions).includes(event.key)) {
            this.pressedKeys.add(event.key);
        }
    }


    onKeyUp(event) {
        if (Object.values(Actions).includes(event.key)) {
            this.pressedKeys.delete(event.key);
        }
    }


    onMouseMove(event) {
        const relativeX = event.clientX - this.canvas.offsetLeft;
        const correction = this.paddle.width / 2;
        if (relativeX > correction && relativeX < this.canvas.width - correction) {
            this.movePaddle(relativeX - correction);
        }
    }


    process() {
        const viewModel = this.viewModel;
        this.draw();
        this.handleActions();

        const requestID = requestAnimationFrame(() => {
            this.process()
        });

        if (GameStatus.PROGRESS !== viewModel.results.status) {
            cancelAnimationFrame(requestID);
            this.drawGameEnd(viewModel.results.status);
        }
    }


    render(viewModel) {
        this.viewModel = viewModel;
        this.process();
    }


}
