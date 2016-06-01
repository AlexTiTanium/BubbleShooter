import ui.ViewPool;
import src.utils.Random as Random;
import src.entities.BallView as BallView;
import src.Config as Config;

exports = Class(ui.ViewPool, function(supr) {

    /**
     * init
     */
    this.init = function(config, superview) {

        opts = merge(config, {
            superview: superview,
            ctor: BallView,
            initOpts: merge(config.initOpts, {
                superview: superview,
                zIndex: 11
            })
        });

        this.types = config.types;
        this.balls = [];

        supr(this, 'init', [opts]);
    };

    /**
     * Create one ball and return it, if set hex it will be created at hex position
     */
    this.create = function(ballType, hex) {

        var ball = this.obtainView();
        var type = ballType;

        if (type == 'any') {
            type = Random.choose(this.types);
        }

        if (type === null) {
            return null;
        }

        var ballConfig = Config.balls[type];

        ball.setup(type, ballConfig, hex);
        this.balls.push(ball);

        return ball;
    };

    /*
     * Move balls in pool
     */
    this.update = function(dt) {
        for (var i = this.balls.length; i--;) {

            var ball = this.balls[i];
            ball.update(dt);

            if (ball.remove) {
                this.releaseView(ball);
                this.balls.splice(i, 1);
            }
        }
    };
});
