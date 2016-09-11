class MyView {
    constructor(width, height) {
        this.canvas = document.getElementById("myCanvas");
        this.canvas.style.background = 'black';
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    }

    clearModel(model) {
        var len = model.drawables.length;
        for (var i = 0; i < len; i++) {
            var currSprite = model.drawables[i].sprite;

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
        this.renderTimer(model);
        
        var len = model.drawables.length;
        for (var i = 0; i < len; i++) {
            var currSprite = model.drawables[i].sprite;

            if (currSprite instanceof CircularSprite) {
                this.drawCircularSprite(currSprite);
            }
        }
    }

    renderTimer(model) {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.font = MyView.TIMER_FONT;
        this.context.fillText(model.currTimeSeconds, MyView.TIMER_LOCATION.x, MyView.TIMER_LOCATION.y);
        this.context.closePath();
    }

    drawCircularSprite(circularSprite) {
        this.context.beginPath();
        this.context.fillStyle = circularSprite.color;
        this.context.arc(circularSprite.x, circularSprite.y, circularSprite.radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }

    clearCircularSprite(circularSprite) {
        this.context.clearRect(circularSprite.x - circularSprite.radius - 1, circularSprite.y - circularSprite.radius - 1,
          circularSprite.radius * 2 + 2, circularSprite.radius * 2 + 2);
    }
}
MyView.TIMER_LOCATION = { x:10, y:30 };
MyView.TIMER_FONT = "30px Arial";

class GameOverView {
    constructor(width, height, currentTime) {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.style.background = 'red';
        this.width = width;
        this.height = height;
        this.currentTime = currentTime;
        this.restartButtonX = (GameStateFactory.GAME_WIDTH / 2) - (GameOverView.BUTTON_DIM.w / 2);
        this.restartButtonY = (GameStateFactory.GAME_HEIGHT / 2) - (GameOverView.BUTTON_DIM.h / 2);
    }

    render() {
        this.renderRestartButton();
        this.renderScore();
    }

    clear() {
        this.clearRestartButton();
    }

    renderRestartButton() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.rect(
            this.restartButtonX, 
            this.restartButtonY, 
            GameOverView.BUTTON_DIM.w, 
            GameOverView.BUTTON_DIM.h);
        this.context.fill();
        this.context.closePath();
    }

    renderScore() {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.font = GameOverView.FONT;
        this.context.fillText("Score: " + this.currentTime,
            this.restartButtonX,
            this.restartButtonY);
        this.context.closePath();
    }

    clearRestartButton() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
GameOverView.FONT = "30px Arial";
GameOverView.BUTTON_DIM = { w: 300, h: 150 };