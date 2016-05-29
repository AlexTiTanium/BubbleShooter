import device;
import AudioManager;
import ui.StackView as StackView;
import ui.resource.loader as loader;

import src.views.UserInput as Input;
import src.views.Loading as Loading;
import src.views.GameView as GameView;

import src.Config as Config;

exports = Class(GC.Application, function() {

    /**
     * init
     */
    this.initUI = function() {

        this.setScale(Config.width, Config.height);

        // this.audio = new AudioManager({
        //     path: 'resources/sounds',
        //     files: Config.sound
        // });

        this.input = new Input({
            superview: this.view
        });

        this.stack = new StackView({
            superview: this,
            width: GC.app.baseWidth,
            height: GC.app.baseHeight,
            clip: true
        });

        this.game = new GameView({});
        this.loading = new Loading({});

        this.stack.push(this.loading);

        loader.preload(['resources/images', 'resources/sounds'], this.onAssetsReady.bind(this));
    };

    /**
     * Fire when assets is ready
     */
    this.onAssetsReady = function() {
        //this.audio.play('gameplay');
        this.stack.push(this.game);
        this.game.run();
    };

    /**
     * Scale app view
     */
    this.setScale = function(width, height) {

        this.baseWidth = width;
        this.baseHeight = device.screen.height * (width / device.screen.width);

        this.deviceAspect = device.screen.width / device.screen.height;
        this.virtualAspect = Config.width / Config.height;
        this.backgroundAspect = this.baseHeight / Config.background.height;

        this.scale = device.screen.width / this.baseWidth; // application scale

        this.gridCellHeight = Config.board.radius * 2;
        this.gridCellWidth = Math.sqrt(3) / 2 * this.gridCellHeight;

        this.gridWidth = this.gridCellWidth * Config.board.columns + this.gridCellWidth / 2;
        this.gridHeight = this.gridCellHeight * Config.board.rows;

        this.boardScale = this.baseWidth / this.gridWidth * this.backgroundAspect;

        this.boardViewWidth = this.gridWidth;
        this.boardViewHeight = this.baseHeight / this.boardScale;

        this.borderWidth = this.baseWidth - this.boardViewWidth * this.boardScale;

        this.view.style.scale = this.scale;
    };

    /**
     *
     */
    this.launchUI = function() {};
});
