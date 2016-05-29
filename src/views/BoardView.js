import ui.View;
import ui.ImageView as ImageView;
import src.lib.HexGrid as HexGrid;
import src.entities.BallPool as BallPool;
import src.entities.CannonView as CannonView;
import src.views.GridView as GridView;
import src.Config as Config;

exports = Class(ui.View, function(supr) {

    /**
     * init
     */
    this.init = function(config, superview) {

        opts = {
            width: GC.app.boardViewWidth,
            height: GC.app.boardViewHeight,
            offsetX: GC.app.baseWidth / 2 - GC.app.gridWidth / 2 * GC.app.boardScale,
            superview: superview,
            scale: GC.app.boardScale
        };

        supr(this, 'init', [opts]);

        this.build(config);
    };

    /**
     *
     */
    this.build = function(config) {

        this.grid = new HexGrid(config);
        this.balls = new BallPool(Config.ballPool, this);
        this.gridView = new GridView(this);

        this.cannon = new CannonView(Config.cannon, this);
    };

    /**
     * Move board objects
     */
    this.update = function(dt) {
        this.cannon.update(dt);
        this.balls.update(dt);
    };

});
