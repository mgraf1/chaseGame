class MyModel {
    constructor(collisionDetector, width, height, player, drawables) {
        this.collisionDetector = collisionDetector;
        this.player = player;
        this.width = width;
        this.height = height;
        this.drawables = drawables;
        this.currTimeSeconds = 0;
        this.recentlySpawned = true;
        this.endGameAction = null;
    }

    updateControls(left, up, right, down) {
        this.player.setDirecton(left, up, right, down);
    }

    registerPlayerIsDeadEvent(eventHandler) {
        this.player.isDeadListeners.push(eventHandler);
    }

    update(currTime) {

        if (currTime % MyModel.BAD_GUY_SPAWN_TIMER < 100 && !this.recentlySpawned) {
            this.spawnBadGuy();
            this.recentlySpawned = true;
        }
        else if (currTime % MyModel.BAD_GUY_SPAWN_TIMER > 4000) {
            this.recentlySpawned = false;
        }

        this.currTimeSeconds = currTime / 1000;
        this.player.update();

        this.collisionDetector.detectCollisions(this.drawables);

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

    spawnBadGuy() {
        var x = Math.random() * this.width;
        var y = Math.random() * this.height;
        var speed = 2;
        var radius = 10;

        var sprite = new CircularSprite(x, y, speed, radius);
        var badGuy = new BadGuy(sprite);
        this.drawables.push(badGuy);
    }
}
Object.defineProperty(MyModel, 'BAD_GUY_SPAWN_TIMER', {
    value: 5000,
    writable: false,
    enumerable: true,
    configurable: false
});

class BadGuy {
    constructor(sprite) {
        this.sprite = sprite;
    }  
}

class Player {
    constructor(sprite) {
        this.sprite = sprite;
        this.isDead = false;
        this.isDeadListeners = [];
    }

    setDirecton(left, up, right, down) {
        this.sprite.setDirection(left, up, right, down);
    }

    update() {
        this.sprite.update();
    }

    die() {
        this.isDeadListeners.forEach(l => l.handleEvent());
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

class CollisionDetector {
    constructor(collisionHandler) {
        this.collisionHandler = collisionHandler;
    }

    detectCollisions(drawables) {
        var len = drawables.length;
        for (var i = 0; i < len; i++) {

            var currSprite = drawables[i].sprite;
            for (var j = 0; j < len; j++) {

                var otherSprite = drawables[j].sprite;
                if (currSprite !== otherSprite) {
                    var distance = this.getDistance(currSprite.x, currSprite.y, otherSprite.x, otherSprite.y);
                    if (distance < (currSprite.radius + otherSprite.radius)) {
                        this.collisionHandler.handleCollision(drawables[i], drawables[j]);
                    }
                }
            }
        }
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}

class CollisionHandler {
    handleCollision(drawable1, drawable2) {
        var player = null;
        var other = null;
        if (drawable1 instanceof Player) {
            player = drawable1;
            other = drawable2;
        }
        else if (drawable2 instanceof Player) {
            player = drawable2;
            other = drawable1;
        }

        if (player != null) {
            player.die();
        }
    }
}