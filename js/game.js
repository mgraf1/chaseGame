class GameEngine {
    constructor() {
        this.requestAnimId = 0;
    }

    startGame(app) {

        var self = this;
        this.startTime = (new Date()).getTime();

        app.begin();

        window.requestAnimFrame = (function (callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
              function (callback) {
                  window.setTimeout(callback, 1000 / 60);
              };
        })();

        setTimeout(function () {
            self.gameLoop(app, self.startTime);
        }, 1000);
    }

    gameLoop(app, lastTime) {
        var currTime = (lastTime - this.startTime) / 1000;

        app.clearView();
        app.handleControls();
        app.update(currTime);
        app.render();

        // request new frame
        var self = this;
        this.requestAnimId = requestAnimFrame(function () {
            var currTime = (new Date()).getTime();
            self.gameLoop(app, currTime);
        });
    }
}

class EventHandler {
    constructor(action) {
        this.action = action;
    }

    handleEvent(time) {
        this.action(time);
    }
}

class MyApp {
    constructor(gameStateFactory, gameStateManager) {
        this.gameStateFactory = gameStateFactory;
        this.gameStateManager = gameStateManager;
        this.transitionMap = {};
        this.currTime = 0;
    }

    begin() {
        let playGameState = this.gameStateFactory.createState(GameStateConstants.PLAY_STATE, this);
        this.gameStateManager.setState(playGameState);
    }

    handleControls() {
        this.gameStateManager.handleControls();
    }

    update(currTime) {
        this.currTime = currTime;
        this.gameStateManager.update(currTime);
    }

    render() {
        this.gameStateManager.render();
    }

    clearView() {
        this.gameStateManager.clearView();
    }

    endGame() {
        let gameOverState = this.gameStateFactory.createState(GameStateConstants.GAME_OVER_STATE, this, this.currTime);
        this.gameStateManager.setState(gameOverState);
    }
}

main();

function main() {

    var gameStateFactory = new GameStateFactory();
    var gameStateManager = new GameStateManager();

    // The app to run inside the engine.
    var app = new MyApp(gameStateFactory, gameStateManager);

    // Start the game engine.
    var engine = new GameEngine();
    engine.startGame(app);
}


