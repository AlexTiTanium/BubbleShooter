import src.utils.Utils as Utils;
import src.Config as Config;

exports = Class(function(supr) {

    /**
     * Represents main game logic
     */
    this.init = function(grid, ballsPool, cannon) {

        this.grid = grid;
        this.balls = ballsPool;
        this.ceils = grid.ceils;
        this.hexes = grid.hexes;
        this.collison = 8;

        this.gridCursor = 0;
        this.levelGrid = [];

        GC.app.on('collision:check', this.beginBallsCollisionCheck.bind(this));
    };

    /**
     * Reload game logic
     */
    this.reload = function() {
        this.ceils = this.grid.ceils;
        this.hexes = this.grid.hexes;
        this.gridCursor = 0;
        this.levelGrid = [];
    };

    /**
     * Init collison check for ball over balls in the grid
     */
    this.beginBallsCollisionCheck = function(ball, collision) {
        for (var i = 1; i <= this.collison; i++) {

            var position = {
                x: collision.position.x + (collision.targetPosition.x - collision.position.x) / this.collison * i,
                y: collision.position.y + (collision.targetPosition.y - collision.position.y) / this.collison * i
            };

            // Center of current ball
            var center = {
                x: position.x + ball.style.width / 2,
                y: position.y + ball.style.height / 2
            };

            // Radius of checked ball
            var radius = ball.style.width / 2;

            // Get hex below ball
            var targetHex = this.grid.pixelToHex(center);

            if (!targetHex) continue;
            targetHex.underBall = true;

            if (!targetHex.ball) {
                ball.previousHex = targetHex;
            }

            // If both front hexes is empty allow pass throw
            var frontHex = this.grid.getFrontNeighbors(targetHex);
            if (frontHex[0] && frontHex[1] && !frontHex[0].ball && !frontHex[1].ball) {
                continue;
            }

            // Get hex neighbors for colsion check
            var checkCollisions = this.grid.getNeighborsWithBalls(targetHex);

            // Add to collsions check traget hex if it has a ball
            if (targetHex.ball) {
                checkCollisions.push(targetHex);
            }

            if (!ball.previousHex) continue;
            for (var j = 0; j < checkCollisions.length; j++) {
                var hex = checkCollisions[j];

                if (!hex.ball) continue;

                // Check collision with neighbors
                if (Utils.circleCircleCollision(hex.center, center, radius)) {
                    this.placeBallToHex(ball, ball.previousHex);
                    return;
                }
            }

            // If ball at the zero row position and hax are empty
            if (targetHex && targetHex.row == 0 && !targetHex.ball) {
                this.placeBallToHex(ball, targetHex);
            }
        }
    };

    /*
     * We call this func whan found a good position for hex and want place ball to this hex
     */
    this.placeBallToHex = function(ball, hex) {

        var haveNeighbors = this.grid.getNeighborsWithBalls(hex);
        if (hex && hex.row != 0 && haveNeighbors.length == 0) return;

        hex.ball = ball;

        ball.onCollison(hex); // It will place ball to hex center
        this.colorCheck(hex); // Check if there are matched colors
        this.shiftCheck(); // Check if we need move up or down grid

        ball.previousHex = null; // avoid memory leeak
    };

    /**
     * Init new layout
     */
    this.fillGrid = function(levelGrid) {

        this.levelGrid = levelGrid;
        this.gridcursor = 0;

        for (var i = 0; i < this.hexes.length; i++) {

            var hex = this.grid.hexes[i];

            if (!levelGrid[hex.row]) continue;
            if (!levelGrid[hex.row][hex.col]) continue;

            var ballType = levelGrid[hex.row][hex.col];

            this.gridCursor++;

            this.balls.create(ballType, hex);
        }

        this.shiftCheck();
    };

    /**
     * Generate balls from level grid
     */
    this.makeBalls = function(count) {

        var balls = [];

        this.gridCursor++;
        if (this.gridCursor >= this.levelGrid.length) this.gridCursor = 0;

        for (var x = 0; x < count; x++) {
            var type = this.levelGrid[this.gridCursor][x];
            balls.push(this.balls.create(type));
        }

        return balls;
    };

    /**
     * Detect if we need shift down or up
     */
    this.shiftCheck = function() {

        var firstHex = this.hexes.filter(function(o) {
                return o.ball;
            })
            .sort(function(a, b) {
                return b.row - a.row;
            }).shift();

        var diff = Config.board.keepPosition - firstHex.row;

        if (diff == 0) return; // oll ok firs ball on keepPosition row

        if (diff > 0) {
            for (var i = 0; i < diff; i++) {
                this.grid.addRow(this.makeBalls(Config.board.columns));
            }
        } else {
            for (var i = diff; i < 0; i++) {
                this.grid.removeRow();
            }
        }

        this.grid.rebuild();
    };

    /**
     * Check if neighbors have tha same color as given hex,
     */
    this.colorCheck = function(hex) {

        var found = this.waveColorCheck(hex);

        if (found.length < 3) return;

        for (var i = 0; i < found.length; i++) {
            found[i].ball.burst();
            found[i].ball.release();
            found[i].ball = null;
        }

        // Run this check only if we destroyed any balls
        this.detachCheck();
    };

    /**
     * Recursive wave color check
     */
    this.waveColorCheck = function(hex, found, checked) {

        found = found || [hex];
        checked = checked || [hex];

        var color = hex.ball.type;

        var neighbors = this.grid.getNeighborsWithBalls(hex);

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

    /**
     * Check if there present some detached balls
     */
    this.detachCheck = function() {

        var initial = this.grid.getAllWithBallFromFirstRow();
        var drop = [];

        if (!initial.length) {
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

    /**
     * Recursive wave detach check
     */
    this.waveDetachedBallsCheck = function(hexes, checked) {

        checked = checked || [];
        var neighbors = [];

        for (var i = 0; i < hexes.length; i++) {
            neighbors = neighbors.concat(this.grid.getNeighborsWithBalls(hexes[i]));
        }

        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (checked.indexOf(neighbor) != -1) continue;
            checked.push(neighbor);

            neighbor.checkDetach = true;

            this.waveDetachedBallsCheck([neighbor], checked);
        }

        return checked;
    };

});
