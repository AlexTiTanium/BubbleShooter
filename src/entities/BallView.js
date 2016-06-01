import ui.ImageView;
import animate;
import math.geom.Vec2D as Vec2D;

exports = Class(ui.ImageView, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        opts = merge(opts, {});

        this.speed = 0.3;
        this.move = false;
        this.remove = false; // If true view can be released

        supr(this, 'init', [opts]);
    };

    /**
     * Set ball skin, plase to correct position and conect to hex grid
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
            hex.ball = this;
        }
    };

    /**
     * Release view for reuse
     */
    this.release = function() {
        this.remove = true;
        this.velocityVector = null;
        this.move = false;
        this.dropped = false;
        this.style.visible = false;
    };

    /**
     * Place ball to specific coordinates, makes ball visuble
     */
    this.placeTo = function(point) {
        this.move = false;
        this.updateOpts({
            x: point.x - this.style.width / 2,
            y: point.y - this.style.height / 2,
            visible: true
        });
    };

    /**
     * Place ball to specific coordinates with animation
     */
    this.animateTo = function(point) {

        this.move = false;

        animate(this).now({
            x: point.x - this.style.width / 2,
            y: point.y - this.style.height / 2
        }, 400, animate.easeInQuad);
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
     * Drop down ball
     */
    this.drop = function() {

        this.velocityVector = new Vec2D({
            x: 0,
            y: 1
        });

        this.move = true;
        this.dropped = true;
    };

    /**
     * On colllsion event, ball colided with others balls, correct ball position detected
     */
    this.onCollison = function(targetHex) {
        this.placeTo(targetHex.center);
    };

    /**
     * Move ball
     */
    this.update = function(dt) {

        // Release ball after drop down
        if (this.dropped && this.style.y > GC.app.boardViewHeight) {
            return this.release();
        }

        if (!this.move) return;

        var center = this.style.x + this.style.width / 2;

        // reflect left
        if (center - this.style.width / 2 <= 0) {
            this.style.x = 0;
            this.velocityVector.x = -this.velocityVector.x;
        }

        // reflect right
        if (center + this.style.width / 2 >= GC.app.boardViewWidth) {
            var penetrationDepth = (center + this.style.width / 2) - GC.app.boardViewWidth;
            this.style.x -= penetrationDepth / 2;
            this.velocityVector.x = -this.velocityVector.x;
        }

        // Move by velocityVector
        this.style.x += dt * this.speed * this.velocityVector.x;
        this.style.y += dt * this.speed * this.velocityVector.y;

        // Out of view check
        if (this.style.y < 0) {
            return this.release();
        }

        // Emit collison check
        if (!this.dropped) {
            GC.app.emit('collision:check', this);
        }
    };

});
