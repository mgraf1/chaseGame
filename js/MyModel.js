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