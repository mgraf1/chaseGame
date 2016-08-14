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