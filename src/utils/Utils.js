exports = {

    circleCircleCollision: function(point1, point2, radius) {

        var dx = point1.x - point2.x;
        var dy = point1.y - point2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius * 1.9) {
            return true;
        }

        return false;
    }

};
