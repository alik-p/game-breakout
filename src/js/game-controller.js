export default class GameController {
    gameModel;
    gameView;

    constructor(gameModel, gameView) {
        this.gameModel = gameModel;
        this.gameView = gameView;
        gameView.bindMovePaddle(this.movePaddle.bind(this))
    }


    getViewModel() {
        const {ball, board, bricks, paddle, results} = this.gameModel;
        return {ball, board, bricks, paddle, results};
    }


    movePaddle(position) {
        this.gameModel.movePaddle(position);
    }


    startGame() {
        this.gameModel.startGame();
        this.gameView.render(this.getViewModel());
    }


}
