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
        this.context.fillStyle = 'white';
        this.context.font = MyView.TIMER_FONT;
        this.context.fillText(model.currTimeSeconds, MyView.TIMER_LOCATION.x, MyView.TIMER_LOCATION.y);
    }

    drawCircularSprite(circularSprite) {
        this.context.fillStyle = circularSprite.color;
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

    showEndGameScreen() {
        this.canvas.style.background = 'red';
    }
}
MyView.TIMER_LOCATION = { x:10, y:30 };
MyView.TIMER_FONT = "30px Arial";

class GameOverView {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.style.background = 'red';
    }
}