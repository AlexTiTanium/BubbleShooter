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

        //this.drawHex(ctx, this.hexGrid.ceils[0][0]);
        //this.drawHex2(ctx, this.hexGrid.ceils[0][0]);

        for (var i = 0; i < this.hexGrid.hexes.length; i++) {
            //if (this.hexGrid.hexes[i].col != 9) continue;
            this.drawHex(ctx, this.hexGrid.hexes[i]);

        }

        ctx.restore();
    };


    this.drawHex = function(ctx, he) {

        // if (hex.ball) {
        //     return;
        // }

        var hex = this.hexGrid.pixelToHex(he.center);
        if (!hex) return;
        //console.log(hex);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(hex.vertices[0].x, hex.vertices[0].y);
        for (var i = 1; i < 6; i++) {
            ctx.lineTo(hex.vertices[i].x, hex.vertices[i].y);
        }

        if (hex.underBall) {
            ctx.fillStyle = 'orange';
            hex.underBall = false;
        } else {
            ctx.fillStyle = '#fff';
        }

        if (hex.neighborCheck) {
            ctx.fillStyle = 'green';
            hex.neighborCheck = false;
        }

        if (hex.checkColor) {
            ctx.fillStyle = 'red';
        }

        if (hex.checkDetach) {
            ctx.fillStyle = 'grey';
        }

        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        ctx.font = "2px";
        ctx.fillStyle = "#000";

        //console.log(hexx);
        //ctx.fillText("(" + hex.col + "," + hex.row + ")", hex.center.x - 12, hex.center.y + 3);
        // ctx.fillText("(" + Math.round(d.q) + "," + Math.round(d.r) + ")", hex.center.x - 12, hex.center.y + 3);

        //var c = this.hexGrid.hexToPixel(hex);
        //ctx.fillText("(" + c.x + "," + c.y + ")", hex.center.x - 12, hex.center.y + 3);

        //var d = this.hexGrid.pixelToHex(hex.center);
        //ctx.fillText("(" + d.col + "," + d.row + ")", hex.center.x - 12, hex.center.y + 3);

        ctx.fillText("(" + hex.col + "," + hex.row + ")", hex.center.x - 12, hex.center.y + 3);
    };
});
