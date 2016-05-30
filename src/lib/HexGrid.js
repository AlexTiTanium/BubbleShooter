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
     * Generate hexagon grid
     */
    this.createGrid = function(columns, rows, radius) {

        var grid = [];

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {

                var hex = new HexCeil(x, y, radius, this);

                grid[x] = grid[x] || [];
                grid[x][y] = hex;

                this.hexes.push(hex);
            }
        }

        return grid;
    };

    this.find = function(q, r) {

        if (this.ceils[q] && this.ceils[q][r]) {
            return this.ceils[q][r];
        }

        return null;
    };

    this.getAnyWithBallFromFirstRow = function() {

        for (var i = 0; i < this.ceils[0].length; i++) {
            if (this.ceils[0][i].ball) return this.ceils[0][i];
        }

        return null;
    };

    this.colorCheck = function(hex) {

        var found = this.waveColorCheck(hex);
        var drop = [];

        if (found.length < 3) return;

        for (var i = 0; i < found.length; i++) {
            found[i].ball.release();
            found[i].ball = null;
        }

        var initial = this.getAnyWithBallFromFirstRow();

        if (!initial) {
            drop = this.hexes;
        } else {
            var connected = this.waveDetachedBallsCheck(initial);
            for (var i = 0; i < this.hexes.length; i++) {
                if (this.hexes[i].ball && connected.indexOf(this.hexes[i]) == -1) drop.push(this.hexes[i]);
            }
        }

        for (var i = 0; i < drop.length; i++) {
            if (!drop[i].ball) return;
            drop[i].ball.drop();
            drop[i].ball = null;
        }
    };

    this.waveColorCheck = function(hex, found, checked) {

        found = found || [hex];
        checked = checked || [hex];

        var color = hex.ball.type;

        var neighbors = this.getNeighborsWithBalls(hex);

        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (checked.indexOf(neighbor) != -1) continue;

            checked.push(neighbor);

            neighbor.checkColor = true;

            if (neighbor.ball.type == color) {
                found.push(neighbor);
                this.waveColorCheck(neighbor, found, checked);
            }
        }

        return found;
    };

    this.waveDetachedBallsCheck = function(hex, checked) {

        checked = checked || [hex];

        var neighbors = this.getNeighborsWithBalls(hex);

        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (checked.indexOf(neighbor) != -1) continue;
            checked.push(neighbor);

            neighbor.checkDetach = true;

            this.waveDetachedBallsCheck(neighbor, checked);
        }

        return checked;
    };

    /**
     *
     */
    this.getHexByPoint = function(point) {

        var hex = this.pixelToHex(point);
        if (!hex) return;
        hex.underBall = true; // For debug
        return hex;
    };

    /**
     * Check hex neighbors and return neighbors with balls
     * Probably not the best name of the function ))
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
     *
     */
    this.getFrontNeighbors = function(hex) {

        var neighbors = null;

        if (hex.isOdd) {
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
     *
     */
    this.findNeighbors = function(hex) {

        var neighbors = null;

        if (hex.isOdd) {
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
     *
     */
    this.pixelToHex = function(pixel) {
        var offset = this.cubeToOffset(this.cubeRound(this.pixelToCube(pixel)));

        offset.q -= 1;
        offset.r -= 1;

        if (this.ceils[offset.q] && this.ceils[offset.q][offset.r]) {
            return this.ceils[offset.q][offset.r];
        }

        return null;
    };

    /**
     *
     */
    this.hexToPixel = function(hex) {
        return {
            x: this.radius * Math.sqrt(3) * (hex.col + 0.5 * (Math.abs(hex.row) % 2)),
            y: this.radius * 3 / 2 * hex.row
        };
    };

    /**
     *
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
     *
     */
    this.cubeToOffset = function(cube) {

        var x = cube.x;
        var y = cube.y;
        var z = cube.z;

        col = x + (z + (Math.abs(z) % 2)) / 2;
        row = z;

        return {
            q: col,
            r: row
        };
    };

    /**
     *
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
