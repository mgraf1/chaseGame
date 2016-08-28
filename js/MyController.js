class KeyConstants {
}
KeyConstants.LEFT_KEY = 37;
KeyConstants.UP_KEY = 38;
KeyConstants.RIGHT_KEY = 39;
KeyConstants.DOWN_KEY = 40;

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