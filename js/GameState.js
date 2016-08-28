class GameOverState {
    constructor(view) {
        this.view = view;
    }

    handleControls() { }
    update(currTime) { }

    render() {

    }

    clearView() {

    }
}

class PlayGameState {
    constructor(model, view, controller) {
        this.model = model;
        this.view = view;
        this.controller = controller;
        this.endGameFunction = null;
    }

    setEndGameFunction(endGameFunction) {
        this.endGameFunction = endGameFunction;
        this.model.registerPlayerIsDeadEvent(new EventHandler(endGameFunction));
    }

    handleControls() {
        this.controller.handleControls();
    }

    update(currTime) {
        this.controller.updateModel(this.model);
        this.model.update(currTime);
    }

    render() {
        this.view.renderModel(this.model);
    }

    clearView() {
        this.view.clearModel(this.model);
    }
}

class GameState { }
GameState.PLAY_STATE = 1;
GameState.GAME_OVER_STATE = 2;

class GameStateFactory {
    createState(state) {
        if (state === GameState.PLAY_STATE) {

            // Starting parameters.
            var PLAYER_START_X = 10;
            var PLAYER_START_Y = 50;
            var PLAYER_RADIUS = 10;
            var PLAYER_START_SPEED = 2
            var GAME_WIDTH = 640;
            var GAME_HEIGHT = 480;
            var PLAYER_COLOR = 'white';

            // Game controller;
            var controller = new MyController();

            // Game model.
            var collisionHandler = new CollisionHandler();
            var collisionDetector = new CollisionDetector(collisionHandler);
            var playerSprite = new CircularSprite(PLAYER_START_X, PLAYER_START_Y, PLAYER_START_SPEED, PLAYER_RADIUS, PLAYER_COLOR);
            var player = new Player(playerSprite);
            var drawables = [player];
            var badGuyFactory = new BadGuyFactory(player);
            var model = new MyModel(collisionDetector, badGuyFactory, GAME_WIDTH, GAME_HEIGHT, player, drawables);

            // Game view.
            var view = new MyView(GAME_WIDTH, GAME_HEIGHT);

            return new PlayGameState(model, view, controller);

        } else if (state === GameState.GAME_OVER_STATE) {

            var view = new GameOverView();

            return new GameOverState(view);
        }
    }
}

class GameStateManager {
    constructor() {
        this.gameStates = [];
    }

    setState(state) {
        this.gameStates.push(state);
    }

    removeState() {
        this.gameStates.pop();
    }

    handleControls() {
        this.gameStates.slice(-1)[0].handleControls();
    }

    update(currTime) {
        this.gameStates.slice(-1)[0].update(currTime);
    }

    render() {
        this.gameStates.slice(-1)[0].render();
    }

    clearView() {
        this.gameStates.slice(-1)[0].clearView();
    }
}
