import ui.View;
import ui.ImageView as ImageView;
import src.lib.HexGrid as HexGrid;
import src.lib.GameLogic as GameLogic;
import src.utils.HexGridDebugView as HexGridDebugView;
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
     * Bild main game area
     */
    this.build = function(config) {

        // Here will leave balls
        this.gridView = new GridView(this);

        this.grid = new HexGrid(config);

        this.balls = new BallPool(Config.ballPool, this.gridView);
        this.cannon = new CannonView(Config.cannon, this);

        // This will controll global logic aspects of the game
        this.game = new GameLogic(this.grid, this.balls, this.cannon);

        // Comment this for release
        //this.enableDebugDraw();
    };

    /**
     * Draws debug hexagon grid
     */
    this.enableDebugDraw = function() {
        new HexGridDebugView(this.grid, {
            superview: this.gridView,
            zindex: 10
        });
    };

    /**
     * Restart board
     */
    this.reload = function() {
        this.grid.buildGrid();
        this.balls.reload();
        this.cannon.reload();
        this.game.reload();
    };

    /**
     * Move board objects
     */
    this.update = function(dt) {
        this.cannon.update(dt);
        this.balls.update(dt);
    };

});
