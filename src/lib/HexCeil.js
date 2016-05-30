exports = Class(function(supr) {

    /**
     * init. This is  pointy topped odd-r hex!!
     */
    this.init = function(col, row, radius, grid) {

        this.radius = radius;

        this.height = this.radius * 2;
        this.width = Math.sqrt(3) / 2 * this.height;
        this.side = this.radius * 3 / 2;

        // Offset cordinates system
        this.col = col; //  X
        this.row = row; //  Y

        this.isOdd = this.row % 2

        this.grid = grid;
        this.ball = null; // Hex is empty

        this.center = {
            x: this.width / 2 + (this.width * this.col) + (this.isOdd * this.width / 2),
            y: this.height / 2 + ((this.radius + this.radius / 2) * this.row)
        };

        this.vertices = this.calculateVertices();
    };


    this.calculateVertices = function() {

        var hWidth = this.width / 2;
        var hRadius = this.radius / 2;

        return [
            // Top middle
            {
                x: this.center.x,
                y: this.center.y - this.radius
            },

            // Right top
            {
                x: this.center.x + hWidth,
                y: this.center.y - hRadius
            },

            // Right bottom
            {
                x: this.center.x + hWidth,
                y: this.center.y + hRadius
            },

            // bottom midle
            {
                x: this.center.x,
                y: this.center.y + this.radius
            },

            // left bottom
            {
                x: this.center.x - hWidth,
                y: this.center.y + hRadius
            },

            // left top
            {
                x: this.center.x - hWidth,
                y: this.center.y - hRadius
            }
        ];
    };
});
