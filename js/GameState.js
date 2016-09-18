class GameState {
    constructor(app){ 
        this.app = app;
    }
}

class GameOverState extends GameState {
    constructor(controller, view, app) {
        super(app);
        this.controller = controller;
        this.view = view;
    }

    handleControls() { 
        if (this.controller.mouseUp && this.view.isInsideButton(this.controller.mouseLocation)) {
            this.app.begin();
        }
    }

    update(currTime) { }

    render() {
        this.view.render();
    }

    clearView() {
        this.view.clear();
    }
}

class PlayGameState extends GameState {
    constructor(model, view, controller, app) {
        super(app);
        this.model = model;
        this.view = view;
        this.controller = controller;
        this.model.registerPlayerIsDeadEvent(new EventHandler(this.app.endGame.bind(this.app)));
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

class GameStateConstants {}
GameStateConstants.PLAY_STATE = 1;
GameStateConstants.GAME_OVER_STATE = 2;

class GameStateFactory {
    createState(state, app, time) {
        if (state === GameStateConstants.PLAY_STATE) {

            // Starting parameters.
            var PLAYER_START_X = 10;
            var PLAYER_START_Y = 50;
            var PLAYER_RADIUS = 10;
            var PLAYER_START_SPEED = 2
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
            var model = new MyModel(collisionDetector, badGuyFactory, 
                GameStateFactory.GAME_WIDTH, GameStateFactory.GAME_HEIGHT, 
                player, drawables);

            // Game view.
            var view = new MyView(GameStateFactory.GAME_WIDTH, GameStateFactory.GAME_HEIGHT);

            return new PlayGameState(model, view, controller, app);

        } else if (state === GameStateConstants.GAME_OVER_STATE) {

            var view = new GameOverView(GameStateFactory.GAME_WIDTH, GameStateFactory.GAME_HEIGHT, time);

            var controller = new GameOverController();

            return new GameOverState(controller, view, app);
        }
    }
}
GameStateFactory.GAME_WIDTH = 640;
GameStateFactory.GAME_HEIGHT = 480;

class GameStateManager {
    constructor() {
        this.gameStates = [];
    }

    setState(state) {
        this.gameStates.pop();
        this.gameStates.push(state);
    }

    setStateOnTop(state) {
        this.gameStates.push(state);
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
