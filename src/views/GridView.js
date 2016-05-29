import ui.View;
import src.utils.HexGridDebugView as HexGridDebugView;
import src.Config as Config;

exports = Class(ui.View, function(supr) {

    /**
     * init
     */
    this.init = function(superview) {

        opts = {
            width: superview.style.width,
            height: superview.style.height,
            superview: superview
        };

        supr(this, 'init', [opts]);

        this.grid = superview.grid;
        this.balls = superview.balls;

        this.build();
    };

    /**
     * Buld hex grid
     */
    this.build = function() {

        this.debug = new HexGridDebugView(this.grid, {
            superview: this,
            zindex: 10
        });
    };

    /**
     * Init new layout
     */
    this.fillGrid = function(grid) {

        for (var i = 0; i < this.grid.hexes.length; i++) {

            var hex = this.grid.hexes[i];

            if (!grid[hex.row]) continue;
            if (!grid[hex.row][hex.col]) continue;

            var ballType = grid[hex.row][hex.col];

            this.balls.create(ballType, hex);
        }
    };

});
