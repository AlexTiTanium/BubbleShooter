import device;
import ui.View as View;
import ui.ImageView as ImageView;
import src.Config as Config;

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

        this.build(config);
    };

    /**
     * Add adaptive background
     */
    this.build = function(opts) {

        this.leftCorner = new ImageView(merge(Config.bg_left, {
            superview: this,
            offsetX: -Config.bg_left.width / 2 * GC.app.backgroundAspect + GC.app.borderWidth / 2,
            zIndex: 1,
            scale: GC.app.backgroundAspect,
            y: this.style.height - Config.bg_left.height * GC.app.backgroundAspect
        }));

        this.rightCorner = new ImageView(merge(Config.bg_right, {
            superview: this,
            offsetX: GC.app.baseWidth - Config.bg_left.width / 2 * GC.app.backgroundAspect - GC.app.borderWidth / 2,
            zIndex: 1,
            scale: GC.app.backgroundAspect,
            y: this.style.height - Config.bg_left.height * GC.app.backgroundAspect
        }));

        // this.head = new ImageView(merge(Config.head, {
        //     superview: this.getSuperview(),
        //     scale: GC.app.backgroundAspect,
        //     zIndex: 1
        // }));

        this.background = new ImageView(merge(Config.background, {
            superview: this,
            zIndex: 0,
            offsetX: Config.width / 2 - opts.width / 2 * GC.app.backgroundAspect,
            scale: GC.app.backgroundAspect,
            superview: this
        }));

    };

});
