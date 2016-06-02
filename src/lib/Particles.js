import ui.ParticleEngine as ParticleEngine;
import src.utils.Random as Random;

exports = Class(ParticleEngine, function(supr) {

    /**
     * Init
     */
    this.init = function(config, superview) {

        supr(this, 'init', []);

        opts = merge(config, {
            superview: superview,
            width: 43,
            height: 43,
            initCount: 2000,
            zIndex: 7,
            centerAnchor: true
        });

        this.config = config;

        supr(this, 'init', [opts]);

        GC.app.on('particles:cannon:shoot', this.cannonShoot.bind(this));
        GC.app.on('particles:ball:movement', this.ballMovement.bind(this));
        GC.app.on('particles:ball:reflect', this.ballReflact.bind(this));
        GC.app.on('particles:ball:colided', this.ballCollided.bind(this));
        GC.app.on('particles:ball:destroy', this.ballDestroy.bind(this));
        GC.app.on('particles:ball:drop_down_destroy', this.ballDropDownDestroy.bind(this));
        GC.app.on('particles:ball:dropdown', this.ballDropDown.bind(this));
    };

    /**
     * Cannon shoot animation
     */
    this.cannonShoot = function(position, direction) {

        var mid = this.make('gold_mid', 3);
        for (var i = 0; i < mid.length; i++) {

            var pObj = mid[i];

            var velocity = 80;
            var dVelocity = 200;

            pObj.dx = direction.x / velocity;
            pObj.dy = direction.y / velocity;
            pObj.dr = Random.float(3, 3)

            pObj.ddx = Random.float(direction.x - dVelocity, direction.x + dVelocity);
            pObj.ddy = Random.float(direction.y - dVelocity, direction.y + dVelocity);
            pObj.ddr = Random.float(3, 3)

            pObj.ttl = 1000;
            pObj.x = position.x;
            pObj.y = position.y;

            pObj.dopacity = Random.float(-0.3, -0.5);
            pObj.transition = "easeOut";
        }

        this.emitParticles(mid);
    };

    /**
     * Particles track after ball
     */
    this.ballMovement = function(type, ball, direction) {

        if (!ball || !direction) return;

        var particles = this.make(type + '_small', 1);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            var velocity = 80;

            pObj.dx = direction.x / velocity;
            pObj.dy = -direction.y / velocity;

            pObj.ttl = 900;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x = Random.float(pObj.x - 5, pObj.x + 5);
            pObj.y = Random.float(pObj.y - 5, pObj.y + 5);

            pObj.dopacity = Random.float(-0.4, -0.7);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);
    };

    /**
     * Particles track after ball
     */
    this.ballDropDown = function(type, ball, direction) {

        if (!ball || !direction) return;

        var particles = this.make(type + '_small', 2);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.dx = direction.x;
            pObj.dy = -direction.y;

            pObj.ttl = 1200;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x = Random.float(pObj.x - 5, pObj.x + 5);
            pObj.y = Random.float(pObj.y - 5, pObj.y + 5);

            pObj.dopacity = Random.float(-0.2, -0.7);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);
    };


    /**
     * Emit particles whan ball tach walls
     */
    this.ballReflact = function(type, ball) {

        if (!ball) return;

        var particles = this.make(type + '_mid', 10);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-30, 30);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-30, 30);
            pObj.dscale = Random.float(0.2, 0.8);

            pObj.dy = Random.integer(-40, 40);
            pObj.dx = Random.integer(-40, 40);

            pObj.ttl = 1000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.5, -0.9);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);
    };

    /**
     * Emit particles on bol colizion
     */
    this.ballCollided = function(type, ball) {

        if (!ball) return;

        var particles = this.make(type + '_small', 20);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);
            pObj.dscale = Random.float(0.2, 0.8);

            pObj.dy = Random.integer(-20, 20);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.4, -0.8);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);
    };

    /**
     * Emit particles on bol colizion
     */
    this.ballDestroy = function(type, ball) {

        if (!ball) return;

        var particles = this.make(type + '_small', 30);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);

            pObj.dy = Random.integer(0, 50);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.2, -0.4);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);

        var particles = this.make(type + '_mid', 15);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);

            pObj.dy = Random.integer(-20, 20);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.4, -0.8);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);

        var particles = this.make(type + '_big', 3);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);
            //pObj.dscale = Random.float(0.2, 0.8);

            pObj.dy = Random.integer(-20, 20);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.4, -0.8);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);
    };

    /**
     * Drop down particle emit
     */
    this.ballDropDownDestroy = function(type, ball) {

        if (!ball) return;

        var particles = this.make(type + '_small', 30);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);

            pObj.dy = Random.integer(0, -50);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.2, -0.4);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);

        var particles = this.make(type + '_mid', 15);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);

            pObj.dy = Random.integer(0, -50);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.2, -0.4);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);

        var particles = this.make(type + '_big', 3);
        for (var i = 0; i < particles.length; i++) {

            var pObj = particles[i];

            pObj.polar = true;

            pObj.ox = ball.x + ball.width / 2 + Random.integer(-15, 15);
            pObj.oy = ball.y + ball.height / 2 + Random.integer(-15, 15);
            //pObj.dscale = Random.float(0.2, 0.8);

            pObj.dy = Random.integer(0, -50);
            pObj.dx = Random.integer(-20, 20);

            pObj.ttl = 4000;
            pObj.x = ball.x + ball.width / 2;
            pObj.y = ball.y + ball.height / 2;

            pObj.x += Random.integer(-20, 20);
            pObj.y += Random.integer(-20, 20);

            pObj.dopacity = Random.float(-0.2, -0.4);
            pObj.transition = "easeOut";
        }

        this.emitParticles(particles);
    };

    /**
     * Get particles by type, see config
     */
    this.make = function(type, count) {

        var image = Random.choose(this.config.items[type]);

        var color = type.split('_')[0];
        var size = type.split('_')[1];
        size = this.config.sizes[size];

        var particleObjects = this.obtainParticleArray(count);

        for (var i = 0; i < count; i++) {

            var pObj = particleObjects[i];

            pObj.image = this.config.path + color + '/' + image;
            pObj.width = size[0];
            pObj.height = size[1];

            pObj.ttl = 4000;
        }

        return particleObjects;
    };

    /**
     * Particle engine tick
     */
    this.update = function(dt) {
        this.runTick(dt * 3);
    }

});
