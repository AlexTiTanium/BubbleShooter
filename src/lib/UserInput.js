import ui.View as View;

exports = Class(View, function(supr) {

    this.id = "UserInputListener";

    /**
     * init
     */
    this.init = function(appView) {

        opts = {
            superview: appView,
            width: GC.app.baseWidth,
            height: GC.app.baseHeight,
            zIndex: 20,
            blockEvents: false
        };

        this.event_id = null;
        this.pause = false;

        supr(this, 'init', [opts]);
    };

    /**
     * Be carful user input translate coordinates to board space
     */
    this.translateToBoardViewCoordianates = function(point) {
        return {
            x: (point.x - GC.app.borderWidth / 2) / GC.app.boardScale,
            y: point.y / GC.app.boardScale
        };
    };

    /**
     * On mouse key down
     **/
    this.onInputStart = function(event, point) {

        //console.log(event);
        this.emit('ui:input:start', event, point);

        if (this.pause) return;
        if (this.event_id === null) {
            this.event_id = event.id;
            point = this.translateToBoardViewCoordianates(point);
            this.emit('target:update', point, event);
            this.emit('input:start', point, event);
        }
    }

    /**
     * On mouse move
     **/
    this.onInputMove = function(event, point) {

        this.emit('ui:input:move', event, point);

        if (this.pause) return;
        if (this.event_id !== null && this.event_id == event.id) {
            point = this.translateToBoardViewCoordianates(point);
            this.emit('target:update', point, event);
        }
    }

    /**
     * On mouse key up
     **/
    this.onInputSelect = function(event, point) {

        this.emit('ui:input:stop', event, point);

        if (this.pause) return;
        if (this.event_id !== null && this.event_id == event.id) {
            point = this.translateToBoardViewCoordianates(point);
            this.emit('target:update', point, event);
            this.emit('input:stop', point, event);
            this.event_id = null;
        }
    }

});
