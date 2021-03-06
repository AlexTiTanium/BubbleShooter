import ui.ImageView;
import animate;
import src.utils.Random as Random;
import math.geom.Vec2D as Vec2D;
import src.Config as Config;

exports = Class(ui.ImageView, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        opts = merge(opts, {});

        this.speed = Config.ball.ballSpeed;
        this.move = false;
        this.remove = false; // If true view can be released

        this.collisionIteration = 8;

        supr(this, 'init', [opts]);
    };

    /**
     * Set ball skin, plase to correct position and conect to hex grid
     */
    this.setup = function(type, config, hex) {

        this.type = type;

        if (!config) {
            console.error('Type not found, check balls names', type);
            return;
        }

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
        this.style.r = 0;
        this.speed = Config.ball.ballSpeed;
        this.style.anchorY = 0;
        this.style.anchorX = 0;
        this.style.x = -5000;
        this.style.y = -5000;
    };

    /**
     * Explode this ball
     */
    this.burst = function(doubleScore) {

        GC.app.emit('score:add', doubleScore ? this.score * 2 : this.score);

        setTimeout(function() {
            GC.app.audio.play('pop');
        }, Random.integer(0, 150));

        GC.app.emit('particles:ball:destroy', this.type, this.style);
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
        }, 400, animate.easeInOutQuad);
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
        this.speed = Config.ball.dropSpeed; // drop speed
        GC.app.audio.play('dropdown');
    };

    /**
     * On colllsion event, ball colided with others balls, correct ball position detected
     */
    this.onCollison = function(targetHex) {
        this.placeTo(targetHex.center);
        GC.app.emit('particles:ball:colided', this.type, this.style);
        GC.app.audio.play('stick');
    };

    /**
     * Move ball
     */
    this.update = function(dt) {

        // Release ball after drop down
        if (this.dropped && this.style.y + this.style.height > GC.app.boardViewHeight) {
            GC.app.emit('particles:ball:drop_down_destroy', this.type, this.style);
            this.burst(true);
            return this.release();
        }

        if (this.dropped) {
            GC.app.emit('particles:ball:dropdown', this.type, this.style, this.velocityVector);
        }

        if (!this.move) return;

        var center = this.style.x + this.style.width / 2;

        // reflect left
        if (center - this.style.width / 2 <= 0) {
            this.style.x = 0;
            this.velocityVector.x = -this.velocityVector.x;
            GC.app.emit('particles:ball:reflect', this.type, this.style);
            GC.app.audio.play('reflect');
        }

        // reflect right
        if (center + this.style.width / 2 >= GC.app.boardViewWidth) {
            var penetrationDepth = (center + this.style.width / 2) - GC.app.boardViewWidth;
            this.style.x -= penetrationDepth / 2;
            this.velocityVector.x = -this.velocityVector.x;
            GC.app.emit('particles:ball:reflect', this.type, this.style);
            GC.app.audio.play('reflect');
        }

        // Move by velocityVector
        var collisionData = {
            position: {
                x: this.style.x,
                y: this.style.y
            },
            targetPosition: {
                x: this.style.x + dt * this.speed * this.velocityVector.x,
                y: this.style.y + dt * this.speed * this.velocityVector.y
            }
        }

        this.style.x += dt * this.speed * this.velocityVector.x;
        this.style.y += dt * this.speed * this.velocityVector.y;

        // Emit collison check
        if (!this.dropped) {
            GC.app.emit('collision:check', this, collisionData);
            GC.app.emit('particles:ball:movement', this.type, this.style, this.velocityVector);
        }

        // Out of view check
        if (this.style.y < 0) {
            return this.release();
        }
    };

});
