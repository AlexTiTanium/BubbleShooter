import ui.View;
import src.Config as Config;

exports = Class(ui.View, function(supr) {

    /**
     * Just container for balls
     */
    this.init = function(superview) {

        opts = {
            width: superview.style.width,
            height: superview.style.height,
            superview: superview,
            zIndex: 1
        };

        supr(this, 'init', [opts]);
    };

});
