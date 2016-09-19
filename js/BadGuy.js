class BadGuySpawner {
    constructor(badGuyFactory, width, height) {
        this.badGuyFactory = badGuyFactory;
        this.recentlySpawned = true;
        this.width = width;
        this.height = height;
    }

    canSpawn(currTime) {
        let timeUntilSpawn = currTime % BadGuySpawner.BAD_GUY_SPAWN_TIMER;
        if (timeUntilSpawn < .1 && !this.recentlySpawned) {
            return true;
        }
        else if (timeUntilSpawn > MyModel.BAD_GUY_SPAWN_TIMER - 1) {
            this.recentlySpawned = false;
        }
    }

    spawnBadGuy() {
        let badGuy = this.badGuyFactory.createBadGuy("CHASE_BAD_GUY", this.width, this.height);
        this.recentlySpawned = true;
        return badGuy;
    }
}
BadGuySpawner.BAD_GUY_SPAWN_TIMER = 3;

class BadGuyFactory {
    constructor(player) {
        this.player = player;
    }
    createBadGuy(badGuyType, maxWidth, maxHeight) {
    if (badGuyType === "CHASE_BAD_GUY") {

            // Starting stats.
            var x = Math.random() * maxWidth;
            var y = Math.random() * maxHeight;
            var speed = Math.random() * BadGuyFactory.CHASE_MAX_SPEED;
            var radius = 10;

            // Sprite.
            let spriteColor;
            if (speed < 1) {
                spriteColor = 'gray';
            } else if (speed < 1.5) {
                spriteColor = 'pink';
            }
            else {
                spriteColor = 'red';
            }
            var sprite = new CircularSprite(x, y, speed, radius, spriteColor);

            // Movement behavior (AI).
            var movementBehavior = new ChaseMovementBehavior(sprite, this.player);

            var badGuy = new ChaseBadGuy(sprite, movementBehavior);
            return badGuy;
        }
    }
}
BadGuyFactory.CHASE_MAX_SPEED = 1.9;

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

        this.sprite.dX = vecX;
        this.sprite.dY = vecY;
        this.sprite.update();
    }
}