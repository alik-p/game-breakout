import GameModel from './game-model.js';
import GameView from './game-view.js';
import GameController from './game-controller.js';

const config = {
    ball: {radius: 10},
    board: {height: 320, width: 480},
    paddle: {height: 10, width: 75},
    wall: {height: 100, width: 420, cols: 5, rows: 3},
}


{
    const canvas = document.getElementById('gameBoard')
    const gameModel = new GameModel(config);
    const gameView = new GameView(canvas);
    const gameController = new GameController(gameModel, gameView);


    gameController.startGame();

}


