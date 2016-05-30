import ui.ImageView;
import math.geom.Vec2D as Vec2D;
import src.utils.Utils as Utils;

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
     * Set ball skin, plase to right position and conect to hex grid
     */
    this.setup = function(type, config, grid, hex) {

        this.type = type;
        this.score = config.score;
        this.remove = false;
        this.grid = grid;

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
     * Move ball from specific point to specific direction
     */
    this.moveTo = function(direction, fromPoint) {

        this.velocityVector = direction.getUnitVector();
        this.placeTo(fromPoint);

        this.move = true;
    };

    /**
     *
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
     * Check grid
     */
    this.checkCollisions = function() {

        // Center of current ball
        var center = {
            x: this.style.x + this.style.width / 2,
            y: this.style.y + this.style.height / 2
        };

        var radius = this.style.width / 2;

        var targetHex = this.grid.getHexByPoint(center);
        if (!targetHex) return;

        if (!targetHex.ball) {
            this.previousHex = targetHex;
        }

        // If both front hexes is empty allow pass throw
        var frontHex = this.grid.getFrontNeighbors(targetHex);
        if (frontHex[0] && frontHex[1] && !frontHex[0].ball && !frontHex[1].ball) {
            return;
        }

        var checkCollisions = this.grid.getNeighborsWithBalls(targetHex);

        if (targetHex.ball) {
            checkCollisions.push(targetHex);
        }

        if (!this.previousHex) return;

        for (var i = 0; i < checkCollisions.length; i++) {
            var hex = checkCollisions[i];

            if (!hex.ball) continue;

            if (Utils.circleCircleCollision(hex.center, center, this.style.width / 2)) {
                this.previousHex.ball = this;
                this.placeTo(this.previousHex.center);
                this.grid.colorCheck(this.previousHex);
                this.previousHex = null; // avoid memory leeak
                break;
            }
        }
    };

    /**
     * Move ball
     */
    this.update = function(dt) {

        if (this.dropped && this.style.y > GC.app.boardViewHeight) {
            return this.release();
        }

        if (!this.move) return;

        var center = this.style.x + this.style.width / 2;

        // reflect
        if (center - this.style.width / 2 < 0) {
            this.velocityVector.x = -this.velocityVector.x + 0.4;
        }

        if (center + this.style.width / 2 > GC.app.boardViewWidth) {
            this.velocityVector.x = -this.velocityVector.x - 0.4;
        }

        this.style.x += dt * this.speed * this.velocityVector.x;
        this.style.y += dt * this.speed * this.velocityVector.y;

        if (this.style.y < 0) {
            return this.release();
        }

        if (!this.dropped) {
            this.checkCollisions();
        }
    };

});
