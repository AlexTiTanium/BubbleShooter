import ui.View as View;

exports = Class(View, function(supr) {

    this.name = "UserInputListener";
    this.tag = "UserInputListener";
    this.id = "UserInputListener";

    /**
     * init
     */
    this.init = function(opts) {

        opts.blockEvents = false;

        opts = merge(opts, {
            x: 0,
            y: 0,
            superview: opts.superview,
            width: GC.app.baseWidth,
            height: GC.app.baseHeight,
            zIndex: 30
        });

        this.event_id = null;

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
        if (this.event_id === null) {
            this.event_id = event.id;
            point = this.translateToBoardViewCoordianates(point);
            this.emit('target:update', point);
            this.emit('input:start', point);
        }
    }

    /**
     * On mouse move
     **/
    this.onInputMove = function(event, point) {
        if (this.event_id !== null && this.event_id == event.id) {
            point = this.translateToBoardViewCoordianates(point);
            this.emit('target:update', point);
        }
    }

    /**
     * On mouse key up
     **/
    this.onInputSelect = function(event, point) {
        if (this.event_id !== null && this.event_id == event.id) {
            point = this.translateToBoardViewCoordianates(point);
            this.emit('target:update', point);
            this.emit('input:stop', point);
            this.event_id = null;
        }
    }

});
