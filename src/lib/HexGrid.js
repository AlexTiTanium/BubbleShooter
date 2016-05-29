import src.lib.HexCeil as HexCeil;

exports = Class(function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        this.columns = opts.columns;
        this.rows = opts.rows;
        this.radius = opts.radius;

        this.hexes = [];
        this.ceils = this.createGrid(this.columns, this.rows, this.radius);
    };

    /**
     * Generate hexagen grid
     */
    this.createGrid = function(columns, rows, radius) {

        var board = [];

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {

                var hex = new HexCeil(x, y, radius);

                board[x] = board[x] || [];
                board[x][y] = hex;

                this.hexes.push(hex);
            }
        }

        return board;
    };

});
