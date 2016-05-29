import ui.ImageView;

exports = Class(ui.ImageView, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        opts = merge(opts, {});

        this.speed = 0.4;
        this.move = false;
        this.remove = false; // If true view can be released

        supr(this, 'init', [opts]);
    };

    /**
     * Set ball skin, plase to right position and conect to hex grid
     */
    this.setup = function(type, config, hex) {

        this.type = type;
        this.score = config.score;
        this.remove = false;

        this.updateOpts({
            image: config.image
        });

        if (hex) {
            this.updateOpts({
                x: hex.center.x - this.style.width / 2,
                y: hex.center.y - this.style.height / 2,
                visible: true
            });

            this.hex = hex;
            hex.ball = type;
        }
    };

    /**
     * Release view for reuse
     */
    this.release = function() {
        this.remove = true;
        this.move = false;
        this.style.visible = false;
        this.hex = null;
    };

    /**
     * Place ball to specific coordinates, makes ball visuble
     */
    this.placeTo = function(point) {

        this.updateOpts({
            x: point.x - this.style.width / 2,
            y: point.y - this.style.height / 2,
            visible: true
        });
    };

    /**
     * Move ball from specific point to specific direction
     */
    this.moveTo = function(direction, fromPoint) {

        this.velocityVector = direction.getUnitVector();
        this.placeTo(fromPoint);

        this.move = true;
    };

    /**
     * Move ball
     */
    this.update = function(dt) {

        if (!this.move) return;

        var center = this.style.x + this.style.width / 2;

        if (center - this.style.width / 2 < 0) {
            this.velocityVector.x = -this.velocityVector.x + 0.4;
        }

        if (center + this.style.width / 2 > GC.app.boardViewWidth) {
            this.velocityVector.x = -this.velocityVector.x - 0.4;
        }

        this.style.x += dt * this.speed * this.velocityVector.x;
        this.style.y += dt * this.speed * this.velocityVector.y;

        if (this.style.y < 0) {
            this.release();
        }
    };

});
