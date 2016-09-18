class GameEngine {
    constructor() {
        this.requestAnimId = 0;
    }

    startGame(app) {

        var self = this;

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

        app.clearView();
        app.handleControls();
        app.update();
        app.render();

        // request new frame
        var self = this;
        this.requestAnimId = requestAnimFrame(function () {
            self.gameLoop(app);
        });
    }
}

class EventHandler {
    constructor(action) {
        this.action = action;
    }

    handleEvent() {
        this.action();
    }
}

class MyApp {
    constructor(gameStateFactory, gameStateManager) {
        this.gameStateFactory = gameStateFactory;
        this.gameStateManager = gameStateManager;
        this.transitionMap = {};
        this.currTime = 0;
        this.startTime = 0;
    }

    begin() {
        this.startTime = (new Date()).getTime();
        let playGameState = this.gameStateFactory.createState(GameStateConstants.PLAY_STATE, this);
        this.gameStateManager.setState(playGameState);
    }

    handleControls() {
        this.gameStateManager.handleControls();
    }

    update() {
        this.currTime = (((new Date()).getTime()) - this.startTime) / 1000;
        this.gameStateManager.update(this.currTime);
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


