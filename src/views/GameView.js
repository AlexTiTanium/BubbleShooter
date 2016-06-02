import ui.View as View;
import src.views.InterfaceView as GameUI;
import src.views.BoardView as BoardView;
import src.views.GameOverView as GameOverView;
import src.lib.LevelManager as LevelManager;
import src.lib.Particles as Particles;
import src.Config as Config;

exports = Class(View, function(supr) {

    /**
     * init
     */
    this.init = function() {

        opts = {
            width: GC.app.baseWidth,
            height: GC.app.baseHeight
        };

        supr(this, 'init', [opts]);

        this.pause = true;

        this.build();
    };

    /**
     * Prepare game view
     */
    this.build = function() {

        this.ui = new GameUI(Config.ui, this);
        this.board = new BoardView(Config.board, this);
        this.level = new LevelManager(Config.levels);
        this.particles = new Particles(Config.particles, this.board);
        this.gameover = new GameOverView(this);

        GC.app.on('game:gameover', this.showGameover.bind(this));
        GC.app.on('game:reload', this.restartLevel.bind(this));
        GC.app.on('game:nextlevel', this.loadNextLevel.bind(this));
    };

    /**
     * Load currennt level
     */
    this.loadLevel = function() {

        var level = this.level.getCurrent();
        this.board.game.fillGrid(level.grid);

        GC.app.emit('level:update', level.level);
        GC.app.emit('score:update', 0);

        setTimeout(function() {
            GC.app.audio.play('start');
        }, 500);
    };

    /**
     * Restart current level
     */
    this.restartLevel = function() {

        this.board.reload();
        this.loadLevel();
        this.gameover.hide();

        this.pause = false;
        GC.app.input.pause = false;
    };

    /**
     * Load next level
     */
    this.loadNextLevel = function() {
        this.level.next();
        this.restartLevel();
    };

    /**
     * Show gameover popup
     */
    this.showGameover = function() {
        this.pauseGame();
        this.gameover.show(this.level.getCurrent().goal, this.ui.scoreCounter);
    };

    /**
     * Start spawn enemies
     */
    this.run = function() {
        this.resumeGame();
        this.loadLevel();
    };

    /**
     * Pause game
     */
    this.pauseGame = function() {
        this.pause = true;
        GC.app.input.pause = true;
    };

    /**
     * Continue game
     */
    this.resumeGame = function() {
        this.pause = false;
        GC.app.input.pause = false;
    };

    /**
     * Game loop, ~60 ticks per second
     */
    this.tick = function(dt) {

        this.particles.update(dt);
        dt = Math.min(dt, Config.max_delta);

        if (this.pause) return;
        this.board.update(dt);
    };

});
