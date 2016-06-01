exports = Class(function(supr) {

    /**
     * init. One hex ceil, has a vertices center col and row
     */
    this.init = function(col, row, radius, angle, isEven) {

        this.radius = radius;

        this.height = this.radius * 2;
        this.width = Math.sqrt(3) / 2 * this.height;
        this.side = this.radius * 3 / 2;
        this.angle = angle * Math.PI / 180;
        this.isEven = isEven; // Layout type even or odd

        // Offset cordinates system
        this.col = col; //  X
        this.row = row; //  Y

        this.ball = null; // Hex is empty

        this.center = this.calculateCenter();
        this.vertices = this.calculateVertices();
    };

    /**
     * Calculate center of hex
     */
    this.calculateCenter = function() {

        var x = 0;

        if (this.isEven) {
            x = this.radius * Math.sqrt(3) * (this.col - 0.5 * (Math.abs(this.row) % 2)) + this.width;
        } else {
            x = this.radius * Math.sqrt(3) * (this.col + 0.5 * (Math.abs(this.row) % 2)) + this.width / 2;
        }

        return {
            x: x,
            y: (this.radius + this.radius / 2) * this.row + this.radius
        };
    };

    /**
     * Calculate corner offset
     */
    this.calculateCornerOffset = function(cornerIndex) {

        var angle = 2 * Math.PI * (cornerIndex + this.angle) / 6;

        return {
            x: this.radius * Math.cos(angle),
            y: this.radius * Math.sin(angle)
        };
    };

    /**
     * Calcelate vertices coordinates
     */
    this.calculateVertices = function() {

        this.corners = [];

        for (var i = 0; i < 6; i++) {
            var offset = this.calculateCornerOffset(i);

            this.corners.push({
                x: this.center.x + offset.x,
                y: this.center.y + offset.y
            });
        }

        return this.corners;
    };

    /**
     * Rebuild hex grid
     */
    this.rebuild = function(isEven) {
        this.isEven = isEven;
        this.center = this.calculateCenter();
        this.vertices = this.calculateVertices();
    };

});
