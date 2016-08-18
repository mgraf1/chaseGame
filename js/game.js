class GameEngine {
    startGame(app) {

        var self = this;
        this.startTime = (new Date()).getTime();

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
        var currTime = lastTime - this.startTime;

        app.clearView();
        app.handleControls();
        app.update(currTime);
        app.render();

        // request new frame
        var self = this;
        requestAnimFrame(function () {
            var currTime = (new Date()).getTime();
            self.gameLoop(app, currTime);
        });
    }
}

class MyApp {
    constructor(model, view, controller) {
        this.model = model;
        this.view = view;
        this.controller = controller;
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

main();

function main() {

    // Starting parameters.
    var PLAYER_START_X = 10;
    var PLAYER_START_Y = 50;
    var PLAYER_RADIUS = 10;
    var PLAYER_START_SPEED = 2
    var GAME_WIDTH = 640;
    var GAME_HEIGHT = 480;

    // Game controller;
    var controller = new MyController();

    // Game model.
    var collisionHandler = new CollisionHandler();
    var collisionDetector = new CollisionDetector(collisionHandler);
    var playerSprite = new CircularSprite(PLAYER_START_X, PLAYER_START_Y, PLAYER_START_SPEED, PLAYER_RADIUS);
    var player = new Player(playerSprite);
    var drawables = [player];
    var model = new MyModel(collisionDetector, GAME_WIDTH, GAME_HEIGHT, player, drawables);

    // Game view.
    var view = new MyView(GAME_WIDTH, GAME_HEIGHT);

    // The app to run inside the engine.
    var app = new MyApp(model, view, controller);

    // Start the game engine.
    var engine = new GameEngine();
    engine.startGame(app);
}


