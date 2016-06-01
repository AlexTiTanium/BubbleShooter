import device;
import ui.View as View;
import ui.ImageView as ImageView;
import src.Config as Config;
import ui.TextView as TextView;

exports = Class(View, function(supr) {

    /**
     * init
     */
    this.init = function(config, superview) {

        supr(this, 'init', [{
            superview: superview,
            width: GC.app.baseWidth,
            height: GC.app.baseHeight
        }]);

        this.scoreCounter = 0;

        GC.app.on('score:update', this.updateScore.bind(this));
        GC.app.on('score:add', this.addScore.bind(this));
        GC.app.on('level:update', this.updateLevel.bind(this));

        this.build(config);
    };

    /**
     * Change level ui
     */
    this.updateLevel = function(level) {
        this.level.setText('Level: ' + level);
    };

    /**
     * Update score
     */
    this.updateScore = function(score) {
        this.scoreCounter = 0;
        this.score.setText(score);
    };

    /**
     * Add score to current counter
     */
    this.addScore = function(score) {
        this.scoreCounter += score;
        this.score.setText(this.scoreCounter);
    };

    /**
     * Add adaptive background
     */
    this.build = function(opts) {

        this.leftCorner = new ImageView(merge(Config.ui.bg_left, {
            superview: this,
            offsetX: -Config.ui.bg_left.width / 2 * GC.app.backgroundAspect + GC.app.borderWidth / 2,
            zIndex: 1,
            scale: GC.app.backgroundAspect,
            y: this.style.height - Config.ui.bg_left.height * GC.app.backgroundAspect
        }));

        this.rightCorner = new ImageView(merge(Config.ui.bg_right, {
            superview: this,
            offsetX: GC.app.baseWidth - Config.ui.bg_left.width / 2 * GC.app.backgroundAspect - GC.app.borderWidth / 2,
            zIndex: 1,
            scale: GC.app.backgroundAspect,
            y: this.style.height - Config.ui.bg_left.height * GC.app.backgroundAspect
        }));

        this.head = new ImageView(merge(Config.ui.head, {
            superview: this.getSuperview(),
            scale: GC.app.backgroundAspect,
            zIndex: 1
        }));

        this.background = new ImageView(merge(Config.ui.background, {
            superview: this,
            zIndex: 0,
            offsetX: Config.width / 2 - Config.ui.background.width / 2 * GC.app.backgroundAspect,
            scale: GC.app.backgroundAspect,
            superview: this
        }));

        this.buildScoreVews();
    };

    /**
     * Build top ui screen
     */
    this.buildScoreVews = function() {

        this.topUI = new View({
            superview: this.head,
            offsetX: GC.app.baseWidth / 2 - GC.app.gridWidth / 2 * GC.app.boardScale,
        });

        this.levelBg = new ImageView(merge(Config.ui.level, {
            superview: this.topUI,
            offsetX: -100
        }));

        this.level = new TextView({
            superview: this.levelBg,
            layout: 'box',
            color: 'black',
            fontFamily: 'goonies',
            text: "Level: 1",
            size: 30,
            wrap: true
        });

        this.scoreTextBg = new ImageView(merge(Config.ui.score, {
            superview: this.topUI,
            layout: 'box',
            y: 12,
            x: this.style.width - Config.ui.score.width * 1.3,
        }));

        this.scoreText = new TextView({
            superview: this.scoreTextBg,
            layout: 'box',
            color: 'black',
            fontFamily: 'goonies',
            text: "Score:",
            size: 30,
            offsetX: -40,
            wrap: true
        });

        this.scoreBg = new ImageView(merge(Config.ui.score, {
            superview: this.scoreTextBg,
            layout: 'box',
            offsetX: Config.ui.score.width / 2,
        }));

        this.score = new TextView({
            superview: this.scoreBg,
            layout: 'box',
            color: 'black',
            fontFamily: 'angeline',
            text: "0",
            size: 50,
            wrap: true
        });
    };

});
