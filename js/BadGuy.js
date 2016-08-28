class BadGuyFactory {
    constructor(player) {
        this.player = player;
    }
    createBadGuy(badGuyType, maxWidth, maxHeight) {
    if (badGuyType === "CHASE_BAD_GUY") {

            // Starting stats.
            var x = Math.random() * maxWidth;
            var y = Math.random() * maxHeight;
            var speed = 2;
            var radius = 10;

            // Sprite.
            var sprite = new CircularSprite(x, y, speed, radius);

            // Movement behavior (AI).
            var movementBehavior = new ChaseMovementBehavior(sprite, this.player);

            var badGuy = new ChaseBadGuy(sprite, movementBehavior);
            return badGuy;
        }
    }
}

class ChaseBadGuy {
    constructor(sprite, movementBehavior) {
        this.sprite = sprite;
        this.movementBehavior = movementBehavior;
    }  

    updatePosition() {
        this.movementBehavior.updatePosition();
    }
}

class BadGuyMovementBehavior {
    updatePosition() { }
}

class ChaseMovementBehavior extends BadGuyMovementBehavior {
    constructor(sprite, player) {
        super();
        this.sprite = sprite;
        this.player = player;
    }
    
    updatePosition() {
        let vecX = this.player.sprite.x - this.sprite.x;
        let vecY = this.player.sprite.y - this.sprite.y;

        let sqrt = Math.sqrt((vecX * vecX) + (vecY * vecY));

        this.sprite.dX = vecX / sqrt;
        this.sprite.dY = vecY / sqrt;
        this.sprite.update();
    }
}