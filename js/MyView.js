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