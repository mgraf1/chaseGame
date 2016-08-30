class MyModel {
    constructor(collisionDetector, badGuyFactory, width, height, player, drawables) {
        this.collisionDetector = collisionDetector;
        this.badGuyFactory = badGuyFactory;
        this.badGuys = [];
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

        this.collisionDetector.detectCollisions(this.drawables);

        this.currTimeSeconds = currTime / 1000;
        this.updateBadGuys();
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

    updateBadGuys() {
        this.badGuys.forEach(bg => bg.updatePosition());
    }

    spawnBadGuy() {
        var badGuy = this.badGuyFactory.createBadGuy("CHASE_BAD_GUY", this.width, this.height);
        this.badGuys.push(badGuy);
        this.drawables.push(badGuy);
    }
}
MyModel. BAD_GUY_SPAWN_TIMER = 5000;

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

        let normalizedVector = Util.normalize(this.dX, this.dY);
        if (normalizedVector) {
            let vX = normalizedVector.x * this.speed;
            let vY = normalizedVector.y * this.speed;
            this.x += vX;
            this.y += vY;
        }
    }
}

class CircularSprite extends Sprite {
    constructor(x, y, speed, radius, color) {
        super(x, y, speed);
        this.radius = radius;
        this.color = color;
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
        } else if (drawable2 instanceof Player) {
            player = drawable2;
            other = drawable1;
        } else {
            let vecX = drawable1.sprite.x - drawable2.sprite.x;
            let vecY = drawable1.sprite.y - drawable2.sprite.y;

            let  normalizedVector = Util.normalize(vecX, vecY);
            if (normalizedVector) {
                drawable1.sprite.x += normalizedVector.x;
                drawable1.sprite.y += normalizedVector.y;
            }
        }

        if (player != null) {
            player.die();
        }
    }
}