import ui.View;
import ui.TextView as TextView;

exports = Class(ui.View, function(supr) {

    /**
     * init
     */
    this.init = function(hexGrid, opts) {

        this.hexGrid = hexGrid;

        opts = merge(opts, {
            width: opts.superview.width,
            height: opts.superview.height
        });

        supr(this, 'init', [opts]);
    };

    /**
     * Prepare game view
     */
    this.render = function(ctx) {

        ctx.save();

        for (var i = 0; i < this.hexGrid.hexes.length; i++) {
            this.drawHex(ctx, this.hexGrid.hexes[i]);
        }

        ctx.restore();
    };

    this.drawHex = function(ctx, hex) {

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(hex.vertices[0].x, hex.vertices[0].y);
        ctx.lineTo(hex.vertices[1].x, hex.vertices[1].y);
        ctx.lineTo(hex.vertices[2].x, hex.vertices[2].y);
        ctx.lineTo(hex.vertices[3].x, hex.vertices[3].y);
        ctx.lineTo(hex.vertices[4].x, hex.vertices[4].y);
        ctx.lineTo(hex.vertices[5].x, hex.vertices[5].y);

        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        ctx.font = "8px";
        ctx.fillStyle = "#000";
        ctx.fillText("(" + hex.col + "," + hex.row + ")", hex.center.x, hex.center.y);
    };
});
