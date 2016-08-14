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

class KeyConstants {
}
Object.defineProperty(KeyConstants, 'LEFT_KEY', {
    value: 37,
    writable: false,
    enumerable: true,
    configurable: false
});
Object.defineProperty(KeyConstants, 'UP_KEY', {
    value: 38,
    writable: false,
    enumerable: true,
    configurable: false
});
Object.defineProperty(KeyConstants, 'RIGHT_KEY', {
    value: 39,
    writable: false,
    enumerable: true,
    configurable: false
});
Object.defineProperty(KeyConstants, 'DOWN_KEY', {
    value: 40,
    writable: false,
    enumerable: true,
    configurable: false
});

class MyController {

    constructor() {
        var self = this;
        this.trackedKeys = this.initializeTrackedKeys();
     
        window.addEventListener("keydown", function (event) {
            if (event.keyCode in self.trackedKeys) {
                self.trackedKeys[event.keyCode] = true;
            }
        });

        window.addEventListener("keyup", function (event) {
            if (event.keyCode in self.trackedKeys) {
                self.trackedKeys[event.keyCode] = false;
            }
        });
    }

    handleControls() {}

    updateModel(model) {
        var left = 0;
        var up = 0;
        var right = 0;
        var down = 0;

        if (this.trackedKeys[KeyConstants.LEFT_KEY]) {
            left = 1;
        }
        if (this.trackedKeys[KeyConstants.UP_KEY]) {
            up = 1;
        }
        if (this.trackedKeys[KeyConstants.RIGHT_KEY]) {
            right = 1;
        }
        if (this.trackedKeys[KeyConstants.DOWN_KEY]) {
            down = 1;
        }

        model.updateControls(left, up, right, down);
    }

    initializeTrackedKeys() {
        var trackedKeys = {};
        trackedKeys[KeyConstants.LEFT_KEY] = false;
        trackedKeys[KeyConstants.UP_KEY] = false;
        trackedKeys[KeyConstants.RIGHT_KEY] = false;
        trackedKeys[KeyConstants.DOWN_KEY] = false;
        return trackedKeys
    }
}

class MyModel {
    constructor(width, height, player, sprites) {
        this.player = player;
        this.width = width;
        this.height = height;
        this.sprites = sprites;
        this.currTimeSeconds = 0;
    }

    updateControls(left, up, right, down) {
        this.player.setDirecton(left, up, right, down);
    }

    update(currTime) {
        this.currTimeSeconds = currTime / 1000;
        this.player.update();

        var playerSprite = this.player.sprite;
        if (playerSprite.x <= 0 + playerSprite.radius) {
            playerSprite.x = 0 + playerSprite.radius;
        }

        if (playerSprite.y <= 0 + playerSprite.radius) {
            playerSprite.y = 0 + playerSprite.radius;
        }

        if (playerSprite.x >= this.width - playerSprite.radius) {
            playerSprite.x = this.width - playerSprite.radius;
        }

        if (playerSprite.y >= this.height - playerSprite.radius) {
            playerSprite.y = this.height - playerSprite.radius;
        }
    }
}

class Sprite {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.dX = 0;
        this.dY = 0;
        this.speed = speed;
    }

    setDirection(left, up, right, down) {
        this.dX = right - left;
        this.dY = down - up;
    }

    update() {
        var vX = this.dX * this.speed;
        var vY = this.dY * this.speed;

        this.x += vX;
        this.y += vY;
    }
}

class CircularSprite extends Sprite {
    constructor(x, y, speed, radius) {
        super(x, y, speed);
        this.radius = radius;
    }
}

class MyView {
    constructor(width, height) {
        this.canvas = document.getElementById("myCanvas");
        this.canvas.style.background = 'black';
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    }

    clearModel(model) {
        var len = model.sprites.length;
        for (var i = 0; i < len; i++) {
            var currSprite = model.sprites[i];

            if (currSprite instanceof CircularSprite) {
                this.clearCircularSprite(currSprite);
            }
        }
        
        var textHeight = parseInt(MyView.TIMER_FONT);
        this.context.clearRect(MyView.TIMER_LOCATION.x,
                               MyView.TIMER_LOCATION.y - textHeight,
                               200,
                               textHeight);
    }

    renderModel(model) {
        var len = model.sprites.length;
        for (var i = 0; i < len; i++) {
            var currSprite = model.sprites[i];

            if (currSprite instanceof CircularSprite) {
                this.drawCircularSprite(currSprite);
            }
        }

        this.context.font = MyView.TIMER_FONT;
        this.context.fillText(model.currTimeSeconds, MyView.TIMER_LOCATION.x, MyView.TIMER_LOCATION.y);
    }

    drawCircularSprite(circularSprite) {
        this.context.fillStyle = 'white';
        this.context.beginPath();
        this.context.arc(circularSprite.x, circularSprite.y, circularSprite.radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    clearCircularSprite(circularSprite) {
        this.context.clearRect(circularSprite.x - circularSprite.radius - 1, circularSprite.y - circularSprite.radius - 1,
          circularSprite.radius * 2 + 2, circularSprite.radius * 2 + 2);
    }

    getTextWidth(text, font) {
        this.context.font = font;
        return this.context.measureText(text).width;
    }
}
Object.defineProperty(MyView, 'TIMER_LOCATION', {
    value: { x:10, y:30 },
    writable: false,
    enumerable: true,
    configurable: false
});
Object.defineProperty(MyView, 'TIMER_FONT', {
    value: "30px Arial",
    writable: false,
    enumerable: true,
    configurable: false
});

class Player {
    constructor(sprite) {
        this.sprite = sprite;
    }

    setDirecton(left, up, right, down) {
        this.sprite.setDirection(left, up, right, down);
    }

    update() {
        this.sprite.update();
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
    var playerSprite = new CircularSprite(PLAYER_START_X, PLAYER_START_Y, PLAYER_START_SPEED, PLAYER_RADIUS);
    var player = new Player(playerSprite);
    sprites = [player.sprite];
    var model = new MyModel(GAME_WIDTH, GAME_HEIGHT, player, sprites);

    // Game view.
    var view = new MyView(GAME_WIDTH, GAME_HEIGHT);

    // The app to run inside the engine.
    var app = new MyApp(model, view, controller);

    // Start the game engine.
    var engine = new GameEngine();
    engine.startGame(app);
}


