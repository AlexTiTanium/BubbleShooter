exports = {

    // Base game dimension
    width: 576,
    height: 1024,

    // Set maximum delta time value
    max_delta: 100,

    board: {
        columns: 10,
        rows: 15,

        radius: 15,
        angle: 20,
        isEven: false, // start layout
        baseWidth: 576,
        keepPosition: 9 // Keep min and max height of grid on this row
    },

    ball: {
        ballSpeed: 0.5,
        dropSpeed: 0.2,
    },

    cannon: {
        balls: 30,
        ballWindowYoffset: 27,
        shootDelay: 420,
        barrel: {
            autoStart: true,
            width: 70, //130,
            height: 118, //220,
            frameRate: 30,
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
        initCount: 200,
        initOpts: {
            width: 25,
            height: 25
        },
        types: ['blue', 'green', 'red', 'purple', 'yellow']
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
        "purple": {
            image: 'resources/images/balls/ball_purpure.png',
            score: 25
        },
        "yellow": {
            image: 'resources/images/balls/ball_yellow.png',
            score: 30
        },
    },

    // Avalible levels
    levels: [
		'resources/levels/1.json',
		'resources/levels/2.json',
		'resources/levels/3.json',
		'resources/levels/4.json',
		'resources/levels/5.json',
		'resources/levels/6.json',
		'resources/levels/7.json'
	],

    sound: {
        music: {
            path: 'music',
            volume: 0.1,
            loop: true,
            background: true
        },
        shot: {
            path: 'effect',
            volume: 0.1
        },
        pop: {
            path: 'effect',
            volume: 0.3
        },
        reflect: {
            path: 'effect',
            volume: 0.3
        },
        dropdown: {
            path: 'effect',
            volume: 0.1
        },
        rebound: {
            path: 'effect',
            volume: 0.1
        },
        stick: {
            path: 'effect',
            volume: 0.1
        },
        start: {
            path: 'effect',
            volume: 0.1
        },
        win: {
            path: 'effect',
            volume: 0.1
        },
        fail: {
            path: 'effect',
            volume: 0.1
        }
    },

    particles: {

        sizes: {
            big: [40, 40],
            mid: [15, 15],
            small: [7, 7]
        },

        path: 'resources/images/particles/',

        items: {
            blue_big: ["big.png"],
            blue_mid: ["mid.png", "mid_2.png", "mid_3.png", "mid_4.png", "mid_5.png"],
            blue_small: ["small.png", "small_2.png", "small_3.png", "small_4.png", "small_5.png", "small_6.png"],

            gold_big: ["big.png"],
            gold_mid: ["mid.png", "mid_2.png", "mid_3.png", "mid_4.png", "mid_5.png"],
            gold_small: ["small.png", "small_2.png", "small_3.png", "small_4.png"],

            green_big: ["big.png"],
            green_mid: ["mid.png", "mid_2.png", "mid_3.png", "mid_4.png", "mid_5.png"],
            green_small: ["small.png", "small_2.png", "small_3.png", "small_4.png", "small_5.png"],

            purple_big: ["big.png"],
            purple_mid: ["mid.png", "mid_2.png"],
            purple_small: ["small_1.png", "small_2.png", "small.png"],

            red_big: ["big.png"],
            red_mid: ["mid.png", "mid_2.png", "mid_3.png"],
            red_small: ["small.png", "small_2.png", "small_3.png"],

            yellow_big: ["big.png"],
            yellow_mid: ["mid_1.png", "mid_2.png", "mid_3.png", "mid_4.png", "mid_5.png"],
            yellow_small: ["small_1.png", "small_2.png", "small_3.png", "small_4.png", "small_5.png"],
        }
    },

    ui: {
        // Background image
        background: {
            image: 'resources/images/ui/bg1_center.png',
            width: 768,
            height: 1024
        },

        level: {
            image: "resources/images/ui/score.png",
            width: 200,
            height: 64,
            x: 100,
            y: 10
        },

        score: {
            image: "resources/images/ui/score.png",
            width: 200,
            height: 64,

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

        next_ball: {
            image: 'resources/images/ui/next_ball.png',
            width: 50,
            height: 49,
        },

        balls_counter: {
            image: 'resources/images/ui/balls_counter_bg.png',
            width: 44,
            height: 42
        },

        popup: {
            image: 'resources/images/ui/popup.png',
            width: 500,
            height: 532
        },

        play_btn: {
            image: 'resources/images/ui/play.png',
            width: 144,
            height: 142
        },

        return_btn: {
            image: 'resources/images/ui/return.png',
            width: 144,
            height: 142
        }
    }

};
