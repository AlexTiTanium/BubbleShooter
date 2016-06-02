import animate;
import math.geom.intersect as intersect;
import math.geom.Rect as Rect;
import ui.widget.ButtonView as ButtonView;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import src.Config as Config;

exports = Class(View, function(supr) {

    /**
     * Just container for balls
     */
    this.init = function(superview) {

        opts = {
            superview: superview,
            width: GC.app.baseWidth,
            height: GC.app.baseHeight,
            zIndex: 100
        };

        // I can't get user input event works, in some reason UserInput block all events
        // Here I will handel input manualy
        GC.app.input.on('ui:input:start', this.listenInput.bind(this));
        GC.app.input.on('ui:input:stop', this.listenInput.bind(this));

        supr(this, 'init', [opts]);
    };

    /**
     * Show gameover popup
     */
    this.hide = function() {

        if (this.overlay) {
            this.removeSubview(this.overlay);
            this.overlay = null;
        }

        if (this.popup) {
            this.removeSubview(this.popup);
            this.popup = null;
        }
    };

    /*
     * Build view
     */
    this.show = function(goal, score) {

        this.overlay = new View({
            id: 'overlay',
            width: GC.app.baseWidth,
            height: GC.app.baseHeight,
            opacity: 0,
            backgroundColor: '#000000'
        });

        this.popup = new ImageView(merge(Config.ui.popup, {
            layout: 'box',
            x: GC.app.baseWidth / 2 - Config.ui.popup.width / 2,
            //y: GC.app.baseHeight / 2 - Config.ui.popup.height / 2
            y: -Config.ui.popup.height
        }));

        var title = 'Win!'
        var message = 'Your score is:'
        var numbers = score;

        if (goal > score) {
            var title = 'Failed!'
            var message = 'Your goal is:'
            var numbers = goal;
            GC.app.audio.play('fail');
        } else {
            GC.app.audio.play('win');
        }

        new TextView({
            superview: this.popup,
            layout: 'box',
            color: 'white',
            fontFamily: 'goonies',
            verticalAlign: 'top',
            text: title,
            offsetY: 60,
            size: 100,
            wrap: true
        });

        new TextView({
            superview: this.popup,
            layout: 'box',
            color: 'white',
            offsetY: -60,
            fontFamily: 'goonies',
            text: message,
            size: 40,
            wrap: true
        });

        new TextView({
            superview: this.popup,
            layout: 'box',
            color: 'white',
            fontFamily: 'geko',
            offsetY: 10,
            text: numbers,
            size: 70,
            wrap: true
        });

        // add pop up to view
        this.addSubview(this.overlay);
        this.addSubview(this.popup);

        // Anamate overlay and popup
        animate(this.overlay).now({
            opacity: 0.8
        });

        animate(this.popup).now({
            y: GC.app.baseHeight / 2 - Config.ui.popup.height / 2
        })
    };

    this.listenInput = function(evt, pt) {

        if (!this.popup) return;

        var reloadX = 45;
        var reloadY = Config.ui.popup.height - Config.ui.return_btn.height - 65

        var playX = Config.ui.popup.width - Config.ui.play_btn.width - 35;
        var playY = Config.ui.popup.height - Config.ui.play_btn.height - 65;

        var popupY = GC.app.baseHeight / 2 - Config.ui.popup.height / 2;
        var rectReload = new Rect(this.popup.style.x + reloadX, popupY + reloadY, Config.ui.return_btn.width, Config.ui.return_btn.height);
        var rectNext = new Rect(this.popup.style.x + playX, popupY + playY, Config.ui.play_btn.width, Config.ui.play_btn.height);

        if (intersect.pointAndRect(pt, rectNext)) {
            if (evt.type == 1) { // Event input has started.
                GC.app.audio.play('rebound');
            }

            if (evt.type == 3) { // selected
                GC.app.emit('game:nextlevel');
            }
        }

        if (intersect.pointAndRect(pt, rectReload)) {
            if (evt.type == 1) { // Event input has started.
                GC.app.audio.play('rebound');
            }

            if (evt.type == 3) { // selected
                GC.app.emit('game:reload');
            }
        }
    }

});
