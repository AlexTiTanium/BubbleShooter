import src.lib.HexCeil as HexCeil;

exports = Class(function(supr) {

    /**
     * init
     */
    this.init = function(opts) {

        this.columns = opts.columns;
        this.rows = opts.rows;
        this.radius = opts.radius;
        this.angle = opts.angle;
        this.isEven = opts.isEven; // layout type
        this.width = Math.sqrt(3) / 2 * (this.radius * 2);

        this.hexes = [];
        this.ceils = this.buildGrid(this.columns, this.rows);
    };

    /**
     * Generate hexagon grid
     */
    this.buildGrid = function(columns, rows) {

        var grid = [];

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {

                var hex = new HexCeil(x, y, this.radius, this.angle, this.isEven);

                grid[x] = grid[x] || [];
                grid[x][y] = hex;

                this.hexes.push(hex);
            }
        }

        return grid;
    };

    /**
     * Add one row
     */
    this.addRow = function(balls) {

        //We need keep balls in same position when move it up  and down
        this.toggleSwitchLayout();

        this.unshift(balls);
        this.pop();
    };

    /**
     * Remove one row
     */
    this.removeRow = function() {

        // We need keep balls in same position when move it up  and down
        this.toggleSwitchLayout();

        this.shift();
        this.push();
    };

    /**
     * Add one row to the first row of the array
     */
    this.unshift = function(balls) {

        var row = [];

        for (var i = 0; i < this.hexes.length; i++) {
            this.hexes[i].row += 1;
        }

        for (var x = 0; x < this.ceils.length; x++) {

            var hex = new HexCeil(x, 0, this.radius, this.angle, this.isEven);

            this.ceils[x].unshift(hex);
            this.hexes.push(hex);

            if (balls[x]) {
                hex.ball = balls[x];
                hex.ball.placeTo(hex.center);
            }
        }
    };

    /**
     * Remove firs row of grid
     */
    this.shift = function(balls) {

        var row = [];

        for (var x = 0; x < this.ceils.length; x++) {

            var hex = this.ceils[x].shift();

            if (hex.ball) {
                hex.ball.release();
            }

            this.hexes.splice(this.hexes.indexOf(hex), 1);
        }

        for (var i = 0; i < this.hexes.length; i++) {
            this.hexes[i].row -= 1;
        }

    };

    /**
     * Remove last row
     */
    this.pop = function() {

        for (var i = 0; i < this.ceils.length; i++) {

            var hex = this.ceils[i].splice(this.ceils[i].length - 1, 1);

            if (hex[0].ball) {
                hex[0].ball.release();
            }

            this.hexes.splice(this.hexes.indexOf(hex[0]), 1);
        }
    };

    /**
     * Add one empty row to the and of array
     */
    this.push = function() {

        for (var i = 0; i < this.ceils.length; i++) {

            var hex = new HexCeil(i, this.ceils[i].length, this.radius, this.angle, this.isEven);

            this.ceils[i].push(hex);
            this.hexes.push(hex);
        }
    };

    /**
     * Toggle switch layout from odd, event
     */
    this.toggleSwitchLayout = function() {
        this.isEven = !this.isEven;
    };

    /**
     * Rebuild hex grid
     */
    this.rebuild = function() {

        for (var i = 0; i < this.hexes.length; i++) {

            var hex = this.hexes[i];

            hex.rebuild(this.isEven);

            if (hex.ball) {
                hex.ball.animateTo(hex.center);
            }
        }
    };

    /**
     * Find one hex at specified position
     */
    this.find = function(q, r) {

        if (this.ceils[q] && this.ceils[q][r]) {
            return this.ceils[q][r];
        }

        return null;
    };

    /**
     * Return all ball from firs row
     */
    this.getAllWithBallFromFirstRow = function() {

        var hexesWithBalls = [];

        for (var i = 0; i < this.ceils.length; i++) {
            if (this.ceils[i][0].ball) hexesWithBalls.push(this.ceils[i][0]);
        }

        return hexesWithBalls;
    };

    /**
     * Check hex neighbors and return neighbors with balls
     * Probably not the best name of the function :-)
     */
    this.getNeighborsWithBalls = function(hex) {

        var neighbors = this.findNeighbors(hex);
        var withBalls = [];

        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            neighbor.neighborCheck = true; // For debug draw

            if (neighbor.ball) {
                withBalls.push(neighbor);
            }
        }

        return withBalls;
    };

    /**
     * Get 2 front neighbors
     */
    this.getFrontNeighbors = function(hex) {

        var neighbors = null;

        var order = this.isEven ? (hex.row + 1) % 2 : hex.row % 2;

        if (order) {
            neighbors = [
				this.find(hex.col + 1, hex.row - 1),
				this.find(hex.col, hex.row - 1),
			];
        } else {
            neighbors = [
				this.find(hex.col, hex.row - 1),
				this.find(hex.col - 1, hex.row - 1),
			];
        }

        return neighbors.filter(function(e) {
            return e;
        });
    };

    /**
     * Find neighbors around given hex
     */
    this.findNeighbors = function(hex) {

        var neighbors = null;

        var order = this.isEven ? (hex.row + 1) % 2 : hex.row % 2;

        if (order) {
            neighbors = [
				this.find(hex.col + 1, hex.row - 1),
				this.find(hex.col, hex.row - 1),
				this.find(hex.col - 1, hex.row),
				this.find(hex.col + 1, hex.row),
				this.find(hex.col, hex.row + 1),
				this.find(hex.col + 1, hex.row + 1),
			];
        } else {
            neighbors = [
				this.find(hex.col, hex.row - 1),
				this.find(hex.col - 1, hex.row - 1),
				this.find(hex.col - 1, hex.row),
				this.find(hex.col + 1, hex.row),
				this.find(hex.col - 1, hex.row + 1),
				this.find(hex.col, hex.row + 1),
			];
        }

        return neighbors.filter(function(e) {
            return e;
        });
    };

    /**
     * Convert world point coordinates to offset coordinates ande return hex
     */
    this.pixelToHex = function(pixel) {

        var x;

        // Cube and axial coordinates system is center based, so we need substruct our position shift
        if (this.isEven) {
            x = pixel.x - this.width;
        } else {
            x = pixel.x - this.width / 2;
        }

        var offset = this.cubeToOffset(this.cubeRound(this.pixelToCube({
            x: x,
            y: pixel.y - this.radius,
        })));

        return this.find(offset.q, offset.r);
    };

    /**
     * Convert hex offset coordinates to worlds screen coordinates
     */
    this.hexToPixel = function(hex) {

        var x;

        if (this.isEven) {
            x = this.radius * Math.sqrt(3) * (hex.col - 0.5 * (Math.abs(hex.row) % 2)) + hex.width;
        } else {
            x = this.radius * Math.sqrt(3) * (hex.col + 0.5 * (Math.abs(hex.row) % 2)) + hex.width / 2;
        }

        return {
            x: x,
            y: this.radius * 3 / 2 * hex.row
        };
    };

    /**
     * Convert worlds screen coordinates to cube hex coordinates
     */
    this.pixelToCube = function(pixel) {

        var x = pixel.x;
        var y = pixel.y;

        var q = (x * Math.sqrt(3) / 3 - y / 3) / this.radius;
        var r = y * 2 / 3 / this.radius;

        return {
            x: q,
            y: -q - r,
            z: r
        };
    };

    /**
     * Convert cube hex coordinates to offset hex coordinates
     */
    this.cubeToOffset = function(cube) {

        var x = cube.x;
        var y = cube.y;
        var z = cube.z;

        if (this.isEven) {
            col = x + (z + (Math.abs(z) % 2)) / 2;
        } else {
            col = x + (z - (Math.abs(z) % 2)) / 2;
        }

        row = z;

        return {
            q: col,
            r: row
        };
    };

    /**
     * Round for cube hex coordinates
     */
    this.cubeRound = function(cube) {

        var rx = Math.round(cube.x);
        var ry = Math.round(cube.y);
        var rz = Math.round(cube.z);

        var x_diff = Math.abs(rx - cube.x);
        var y_diff = Math.abs(ry - cube.y);
        var z_diff = Math.abs(rz - cube.z);

        if (x_diff > y_diff && x_diff > z_diff) {
            rx = -ry - rz;
        } else if (y_diff > z_diff) {
            ry = -rx - rz;
        } else {
            rz = -rx - ry;
        }

        return {
            x: rx,
            y: ry,
            z: rz
        };
    };
});
