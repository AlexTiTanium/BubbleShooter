exports = {

    // Base game dimension
    width: 576,
    height: 1024,

    // Set maximum delta time value
    max_delta: 100,

    board: {
        columns: 10,
        rows: 16,
        radius: 15,
        baseWidth: 576
    },

    cannon: {

        ballWindowYoffset: 27,
        shootDelay: 380,
        barrel: {
            autoStart: true,
            width: 70, //130,
            height: 118, //220,
            frameRate: 10,
            defaultAnimation: "idle",
            url: "resources/images/cannon/barrel",
        },
        base: {
            image: "resources/images/cannon/base.png",
            width: 70,
            height: 29
        }
    },

    ballPool: {
        initCount: 120,
        initOpts: {
            width: 25,
            height: 25
        },
        types: ['blue', 'green', 'red', 'purpure', 'yellow']
    },

    balls: {
        "blue": {
            image: 'resources/images/balls/ball_blue2.png',
            score: 10
        },
        "green": {
            image: 'resources/images/balls/ball_green.png',
            score: 15
        },
        "red": {
            image: 'resources/images/balls/ball_red.png',
            score: 20
        },
        "purpure": {
            image: 'resources/images/balls/ball_purpure.png',
            score: 25
        },
        "yellow": {
            image: 'resources/images/balls/ball_yellow.png',
            score: 30
        },
    },

    // Background image
    background: {
        image: 'resources/images/ui/bg1_center.png',
        width: 768,
        height: 1024
    },

    head: {
        image: 'resources/images/ui/bg1_header.png',
        layout: 'box',
        horizontalAlign: 'center',
        verticalAlign: 'top',
        height: 128,
    },

    bg_left: {
        image: 'resources/images/ui/bg1_left_corner.png',
        width: 260,
        height: 208
    },

    bg_right: {
        image: 'resources/images/ui/bg1_right_corner.png',
        width: 260,
        height: 212
    },

    levels: [
		'resources/levels/1.json'
	]

};
