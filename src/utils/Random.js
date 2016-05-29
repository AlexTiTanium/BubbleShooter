exports = {

    integer: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    float: function(min, max) {
        return min + Math.random() * (max - min);
    },

    choose: function(array) {
        return array[this.integer(0, array.length - 1)];
    }
};
