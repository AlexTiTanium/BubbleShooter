import ui.View;
import animate;
import math.util as util;
import math.geom.Vec2D as Vec2D;
import math.geom.Point as Point;
import math.geom.Rect as Rect;
import ui.TextView as TextView;
import math.geom.intersect as intersect;
import ui.GestureView as GestureView;
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
        this.shootDelay = config.shootDelay;
        this.shootDelayDelta = config.shootDelay;
        this.aimingStart = false;
        this.counter = 50; // balls counter

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
            y: this.style.height - cannon.base.height - bottomOffset,

        }));

        this.ballsCounterView = new ImageView(merge(Config.ui.balls_counter, {
            superview: this,
            x: this.style.width - Config.ui.next_ball.width - 8,
            y: this.style.height - Config.ui.next_ball.height - 52
        }));

        this.nextBallView = new ImageView(merge(Config.ui.next_ball, {
            superview: this,
            x: this.style.width - Config.ui.next_ball.width - 10,
            y: this.style.height - Config.ui.next_ball.height - 25
        }));

        this.ballsCounter = new TextView({
            superview: this.ballsCounterView,
            layout: 'box',
            color: 'black',
            y: -3,
            fontFamily: 'angeline',
            text: this.counter,
            size: 50,
            wrap: true
        });

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
            x: this.nextBallView.style.x + this.nextBallView.style.width / 2,
            y: this.nextBallView.style.y + this.nextBallView.style.width / 2
        };

        // Current and next ball property
        this.currentBall = null;
        this.nexBall = null;

        this.charge();
    };

    /**
     * Count down balls counter
     */
    this.decrementBallsCounter = function() {

        if (this.counter == 0) return;
        this.counter -= 1;
        var self = this;

        if (this.counterAnimation) {
            this.counterAnimation.commit();
        }
        this.counterAnimation = animate(this.ballsCounterView)
            .now({
                y: this.ballsCounterView.style.y + 20
            }, 200, animate.easeInQuad)
            .then(function() {
                self.ballsCounter.setText(self.counter);
            })
            .then({
                y: this.ballsCounterView.style.y
            }, 200, animate.easeOutQuad);
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

        this.currentBall.placeTo(this.cannonBallWindow);
        this.nexBall.placeTo(this.nextBallWindow);
    };

    /**
     * User tap/click on screen and move mouse/finger
     */
    this.updateTarget = function(point) {

        if (!this.aimingStart) return;

        this.target.x = point.x;
        this.target.y = point.y;
    };

    /**
     * Check if user presed switcj btn
     */
    this.checkIfSwitchPresed = function(point) {
        var next = this.nextBallView.style;
        if (intersect.pointAndRect(new Point(point), new Rect(next.x, next.y, next.width, next.height))) {
            return true;
        }
    };

    /**
     * Exchange current and next ball
     */
    this.switchCurrentBall = function() {

        this.nexBall.style.anchorY = this.currentBall.style.anchorY;
        this.nexBall.style.anchorX = this.currentBall.style.anchorX;
        this.nexBall.style.r = this.currentBall.style.r;

        var tmp = this.currentBall;
        this.currentBall = this.nexBall;
        this.nexBall = tmp;

        this.nexBall.style.anchorY = 0;
        this.nexBall.style.anchorX = 0;
        this.nexBall.style.r = 0;

        this.currentBall.placeTo(this.cannonBallWindow);
        this.nexBall.placeTo(this.nextBallWindow);
    };

    /**
     * User put finger or pres down mouse btn
     */
    this.aiming = function(point) {

        if (this.checkIfSwitchPresed(point)) {
            this.switchCurrentBall();
            return;
        }

        this.aimingStart = true;
        this.updateTarget(point);
    };

    /**
     * Mouse/finger up, cannon will shoot
     */
    this.shot = function(point) {

        if (!this.aimingStart) return;
        this.updateTarget(point);
        this.aimingStart = false;

        if (this.shootDelayDelta < this.shootDelay) return;

        this.shootDelayDelta = 0;

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

        this.decrementBallsCounter();
    };

    /**
     * Rotate cannon to target point
     */
    this.update = function(dt) {

        this.shootDelayDelta = Math.min(this.shootDelayDelta + dt, this.shootDelay);

        var targetVector = new Vec2D(this.target).minus(new Vec2D(this.position));
        var angle = Math.atan2(targetVector.y, targetVector.x) - Math.atan2(this.upVector.y, this.upVector.x);

        if (angle > 1 || angle < -1) { // ~65 defrees limit
            return;
        }

        this.shootingDirection = targetVector;
        this.barrel.style.r = angle;

        if (this.currentBall) this.currentBall.style.r = angle;
    };

});
