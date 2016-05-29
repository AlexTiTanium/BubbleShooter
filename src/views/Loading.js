import ui.View;
import ui.TextView as TextView;

exports = Class(ui.View, function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        opts = merge(opts, {
            width: GC.app.baseWidth,
            height: GC.app.baseHeight
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    /**
     * Prepare game view
     */
    this.build = function() {

        new TextView({
            superview: this,
            layout: 'box',
            color: 'white',
            //fontFamily: 'kenvector_future',
            text: "Loading...",
            size: 30,
            wrap: true
        });
    };
});
