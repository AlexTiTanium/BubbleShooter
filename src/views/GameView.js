import ui.View as View;
import src.views.BackgroundView as BackgroundView;
import src.views.BoardView as BoardView;
import src.entities.LevelManager as LevelManager;
import src.Config as Config;

exports = Class(View, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        opts = merge(opts, {
            width: GC.app.baseWidth,
            height: GC.app.baseHeight
        });

        supr(this, 'init', [opts]);

        this.pause = false;

        this.build();
    };

    /**
     * Prepare game view
     */
    this.build = function() {

        this.background = new BackgroundView(Config.background, this);

        this.board = new BoardView(Config.board, this);

        this.level = new LevelManager(Config.levels);
    };

    /**
     * Load currennt level
     */
    this.loadLevel = function() {

        var level = this.level.getCurrent();

        this.board.gridView.fillGrid(level.grid);
    };

    /**
     * Start spawn enemies
     */
    this.run = function() {
        this.pause = false;
        this.loadLevel();
    };

    /**
     * Game loop, ~60 ticks per second
     */
    this.tick = function(dt) {

        if (this.pause) return;

        dt = Math.min(dt, Config.max_delta);

        this.board.update(dt);
    };

});
