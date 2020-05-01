{
    const canvas = document.getElementById('gameBoard');
    const context = canvas.getContext('2d');

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let deltaX = 2;
    let deltaY = -2;
    const ballRadius = 10;
    let rightPressed = false;
    let leftPressed = false;
    let score = 0;
    let lives = 3;

    const bricksConfig = {
        rows: 3,
        cols: 5,
        width: 75,
        height: 20,
        padding: 10,
        offset: {top: 30, left: 30}
    }

    const paddle = {
        height: 10,
        width: 75,
        x: null,
    }
    paddle.x = (canvas.width - paddle.width) / 2;

    const bricks = Array
        .from({length: bricksConfig.rows})
        .map(() =>
            Array.from(
                {length: bricksConfig.cols},
                () => ({x: 0, y: 0, status: 1})
            )
        );


    const collisionDetection = function collisionDetection() {
        bricks.forEach(row =>
            row.forEach(brick => {
                if (brick.status !== 1) return;
                if (
                    x > brick.x && x < brick.x + bricksConfig.width
                    && y > brick.y && y < brick.y + bricksConfig.height
                ) {
                    deltaY = -deltaY;
                    brick.status = 0;
                    score++;
                    if (score === bricksConfig.rows * bricksConfig.cols) {
                        alert('YOU WIN!');
                        document.location.reload();
                    }
                }
            })
        )
    }


    const draw = function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        if (x + deltaX > (canvas.width - ballRadius) || x + deltaX < ballRadius) {
            deltaX = -deltaX;
        }

        if (y + deltaY < ballRadius) {
            deltaY = -deltaY;
        } else if (y + deltaY > canvas.height - ballRadius) {
            if (x > paddle.x && x < paddle.x + paddle.width) {
                deltaX += 0.5;
                deltaY += 0.5;
                deltaY = -deltaY;
            } else {
                lives--;
                if (!lives) {
                    alert('GAME OVER');
                    document.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    deltaX = 2;
                    deltaY = -2;
                    paddle.x = (canvas.width - paddle.width) / 2;
                }

            }
        }

        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += 7;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= 7;
        }

        x += deltaX;
        y += deltaY;

        requestAnimationFrame(draw);
    }


    const drawBall = function drawBall() {
        context.beginPath();
        context.arc(x, y, ballRadius, 0, Math.PI * 2);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
    }


    const drawBricks = function drawBricks() {
        bricks.forEach((row, rowIndex) =>
            row.forEach((brick, colIndex) => {
                if (brick.status !== 1) return;
                const x = colIndex * (bricksConfig.width + bricksConfig.padding) + bricksConfig.offset.left;
                const y = rowIndex * (bricksConfig.height + bricksConfig.padding) + bricksConfig.offset.top;
                brick.x = x;
                brick.y = y;
                context.beginPath();
                context.rect(x, y, bricksConfig.width, bricksConfig.height);
                context.fillStyle = '#0095DD';
                context.fill();
                context.closePath();
            })
        )
    }


    const drawLives = function drawLives() {
        context.font = '16px Arial';
        context.fillStyle = '#0095DD';
        context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
    }


    const drawPaddle = function drawPaddle() {
        context.beginPath();
        context.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
    }


    const drawScore = function drawScore() {
        context.font = '16px Arial';
        context.fillStyle = '#0095DD';
        context.fillText(`Score: ${score}`, 8, 20);
    }


    const keyDownHandler = function keyDownHandler(event) {
        if (event.key === 'ArrowRight') {
            rightPressed = true;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = true;
        }
    }


    const keyUpHandler = function keyUpHandler(event) {
        if (event.key === 'ArrowRight') {
            rightPressed = false;
        } else if (event.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }


    const mouseMoveHandler = function mouseMoveHandler(event) {
        const relativeX = event.clientX - canvas.offsetLeft;
        const correction = paddle.width / 2;
        if (relativeX > correction && relativeX < canvas.width - correction) {
            paddle.x = relativeX - correction;
        }
    }


    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);

    draw();

}
