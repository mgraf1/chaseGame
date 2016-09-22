class BadGuySpawner {
    constructor(badGuyFactory, width, height) {
        this.badGuyFactory = badGuyFactory;
        this.recentlySpawned = true;
        this.width = width;
        this.height = height;
        this.numSpawned = 0;
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
        let badGuy;
        if (this.numSpawned > 0 && this.numSpawned % 4 === 0) {
            badGuy = this.badGuyFactory.createBadGuy("TRACE_BAD_GUY", this.width, this.height);
        } else {
            badGuy = this.badGuyFactory.createBadGuy("CHASE_BAD_GUY", this.width, this.height);
        }
        this.recentlySpawned = true;
        this.numSpawned++;
        return badGuy;
    }
}
BadGuySpawner.BAD_GUY_SPAWN_TIMER = 3;

class BadGuyFactory {
    constructor(player) {
        this.player = player;
    }
    createBadGuy(badGuyType, maxWidth, maxHeight) {
        
        let x = Math.random() * maxWidth;
        let y = Math.random() * maxHeight;
        let baseSpeed = Math.random();
        let badGuy;

        if (badGuyType === "CHASE_BAD_GUY") {

            // Starting stats.
            let x = Math.random() * maxWidth;
            let y = Math.random() * maxHeight;
            let speed = baseSpeed * BadGuyFactory.CHASE_MAX_SPEED;
            let radius = 10;

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
            let sprite = new CircularSprite(x, y, speed, radius, spriteColor);

            // Movement behavior (AI).
            let movementBehavior = new ChaseMovementBehavior(sprite, this.player);

            badGuy = new BadGuy(sprite, movementBehavior);
        }
        else if (badGuyType === "TRACE_BAD_GUY") {
            
            let x2 = Math.random() * maxWidth;
            let y2 = Math.random() * maxHeight;
            let speed = baseSpeed * BadGuyFactory.TRACE_BONUS_SPEED;
            speed += BadGuyFactory.TRACE_BASE_SPEED;
            let spriteColor = 'yellow';
            let radius = 15;

            let sprite = new CircularSprite(x, y, speed, radius, spriteColor);
            let movementBehavior = new TraceMovementBehavior(sprite, x2, y2);

            badGuy = new BadGuy(sprite, movementBehavior);
        }

        return badGuy;
    }
}
BadGuyFactory.CHASE_MAX_SPEED = 1.9;
BadGuyFactory.TRACE_BONUS_SPEED = 4.0;
BadGuyFactory.TRACE_BASE_SPEED = 1.5;

class BadGuy {
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

class TraceMovementBehavior extends BadGuyMovementBehavior {
    constructor(sprite, endX, endY) {
        super();
        this.sprite = sprite;
        this.startX = sprite.x;
        this.startY = sprite.y;
        this.endX = endX;
        this.endY = endY;

        this.traceDist = Util.dist(this.startX, this.startY, this.endX, this.endY);
        this.headingTowardsEndpoint = true;
    }

    updatePosition() {

        let vecX = this.endX - this.startX;
        let vecY = this.endY - this.startY;
        
        if (this.headingTowardsEndpoint) {

            let currDist = Util.dist(this.sprite.x, this.sprite.y, this.endX, this.endY);
            if (currDist<= this.sprite.radius || currDist > this.traceDist) {
                this.headingTowardsEndpoint = false;
            } 

        } else {
            vecX *= -1;
            vecY *= -1;

            let currDist = Util.dist(this.sprite.x, this.sprite.y, this.startX, this.startY);
            if (currDist <= this.sprite.radius || currDist > this.traceDist) {
                this.headingTowardsEndpoint = true;
            }
        }
        

        this.sprite.dX = vecX;
        this.sprite.dY = vecY;
        this.sprite.update();
    }
}