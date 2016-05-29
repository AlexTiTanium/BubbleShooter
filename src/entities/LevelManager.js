import src.Config as Config;

exports = Class(function(supr) {

    /**
     * init
     */
    this.init = function(levels) {
        this.levels = levels;
        this.current = 0;
    };

    /**
     * Get current level information
     */
    this.getCurrent = function() {
        return JSON.parse(CACHE[this.levels[this.current]]);
    };

});
