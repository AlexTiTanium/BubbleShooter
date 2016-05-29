import ui.View;
import math.util as util;
import math.geom.Vec2D as Vec2D;
import math.geom.Point as Point;

import ui.SpriteView as SpriteView;
import ui.ImageView as ImageView;

import src.Config as Config;

exports = Class(ui.View, function(supr) {

    /**
     * init
     */
    this.init = function(config, superview) {

        opts = merge(config, {
            superview: superview,
            width: superview.style.width,
            height: superview.style.height,
        });

        supr(this, 'init', [opts]);

        this.balls = superview.balls;

        this.build(config);

        // Listen user input
        GC.app.input.on('target:update', this.updateTarget.bind(this));
        GC.app.input.on('input:start', this.aiming.bind(this));
        GC.app.input.on('input:stop', this.shot.bind(this));
    };

    /**
     * Build cannon sub views
     */
    this.build = function(cannon) {

        var bottomOffset = 10;

        this.base = new ImageView(merge(cannon.base, {
            superview: this,
            x: this.style.width / 2 - cannon.base.width / 2,
            y: this.style.height - cannon.base.height - bottomOffset
        }));

        this.barrel = new SpriteView(merge(cannon.barrel, {
            superview: this,
            anchorX: cannon.barrel.width / 2,
            anchorY: cannon.barrel.height,
            x: this.style.width / 2 - cannon.barrel.width / 2,
            y: this.style.height - cannon.barrel.height - cannon.base.height / 2 - bottomOffset
        }));

        // Rotation anchor point, up vector start point
        this.position = new Point({
            x: this.barrel.style.x + this.barrel.style.anchorX,
            y: this.barrel.style.y + this.barrel.style.anchorY
        });

        // Up vector
        this.upVector = new Vec2D({
            x: this.position.x,
            y: this.position.y - 100 // Just up vector magnitude
        }).minus(new Vec2D(this.position));

        // Target point, will changes on user input
        this.target = new Point({
            x: this.position.x,
            y: this.position.y - 100 // Just up vector magnitude
        });

        this.shootingDirection = new Vec2D(this.target).minus(new Vec2D(this.position));

        this.cannonBallWindow = {
            x: this.position.x,
            y: this.position.y - cannon.ballWindowYoffset
        };

        this.nextBallWindow = {
            x: this.position.x + 100,
            y: this.position.y
        };

        // Current and next ball property
        this.currentBall = null;
        this.nexBall = null;

        this.charge();
    };

    /**
     * Charge cannon and prepare next ball
     */
    this.charge = function() {

        if (this.nexBall) {
            this.currentBall = this.nexBall;
            this.nexBall = this.balls.create('any');
        } else {
            this.nexBall = this.balls.create('any');
            return this.charge();
        }

        // Need for rotation
        this.currentBall.style.anchorY = this.currentBall.style.width / 2 + Config.cannon.ballWindowYoffset;
        this.currentBall.style.anchorX = this.currentBall.style.width / 2;
        this.currentBall.style.r = this.barrel.style.r;

        this.currentBall.placeTo(this.cannonBallWindow, this.barrel);
        this.nexBall.placeTo(this.nextBallWindow);
    };

    /**
     * User tap/click on screen and move mouse/finger
     */
    this.updateTarget = function(point) {
        this.target.x = point.x;
        this.target.y = point.y;
    };

    /**
     * User put finger or pres down mouse btn
     */
    this.aiming = function(point) {
        this.updateTarget(point);
    };

    /**
     * Mouse/finger up, cannon will shoot
     */
    this.shot = function(point) {
        this.updateTarget(point);

        this.currentBall.style.anchorY = 0;
        this.currentBall.style.anchorX = 0;
        this.currentBall.style.r = 0;

        var startPoint = this.shootingDirection.getUnitVector();
        startPoint.x *= 80;
        startPoint.y *= 80;
        startPoint = new Vec2D(startPoint).add(new Vec2D(this.position));

        this.currentBall.moveTo(this.shootingDirection, {
            x: startPoint.x,
            y: startPoint.y
        });

        this.charge();
    };

    /**
     * Rotate cannon to target point
     */
    this.update = function(dt) {

        var targetVector = new Vec2D(this.target).minus(new Vec2D(this.position));
        var angle = Math.atan2(targetVector.y, targetVector.x) - Math.atan2(this.upVector.y, this.upVector.x);


        if (angle > 1 || angle < -1) { // ~65 defrees limit
            return;
        }

        this.shootingDirection = targetVector;
        this.barrel.style.r = angle;
        if (this.currentBall) this.currentBall.style.r = angle;
    };

    /**
     * Debug draw
     */
    this.render = function(ctx) {

        ctx.save();

        ctx.beginPath();

        var upVector = this.upVector.add(new Vec2D(this.position));

        ctx.arc(GC.app.boardViewWidth, 200, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(upVector.x, upVector.y);
        ctx.stroke();

        var targetVector = new Vec2D(this.target).minus(new Vec2D(this.position));
        targetVector = targetVector.getUnitVector();
        targetVector.x *= 80;
        targetVector.y *= 80;

        targetVector = new Vec2D(targetVector).add(new Vec2D(this.position));

        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(targetVector.x, targetVector.y);
        ctx.stroke();

        ctx.restore();
    };

});
