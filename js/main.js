var w = window,
    d = document;

w.onload = function () {
    var target = d.querySelector('#target'),
        MAX_PARTICLES = 200, //максимально количество частиц
        COLORS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']; //цвета частиц

    /*
    * Создание частицы
    * @param {int} x - координата по x
    * @param {int} y - координата по y
    * @return {Object}
    */
    var Particle = function (x, y) {
        this.init( x, y, random( 5, 40 ) );
    };

    Particle.prototype = {
        draw: function( ctx ) {

                ctx.beginPath();
                ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
                ctx.fillStyle = this.color;
                ctx.fill();
            },
        init: function( x, y, radius ) {

                this.alive = true;

                this.radius = radius || 10;
                this.wander = 0.15;
                this.theta = random( TWO_PI );
                this.drag = 0.92;
                this.color = random(COLORS);

                this.x = x || 0.0;
                this.y = y || 0.0;

                this.vx = 0.0;
                this.vy = 0.0;
         },
         move: function () {
             this.x += random(0.2,1);
             this.y += random(0.2,1);
         }
    }

    var region = Sketch.create({
        container: target//создаем конву
    });

    region.particles = [];

    region.setup = function () {
        var x = null,
            y = null,
            particle = null;

        //создание частиц
        for (var i = 0; i < MAX_PARTICLES; i++) {
            x = random(this.width);
            y = random(this.height * 2); //появление на пределами области
            particle = new Particle(x, y);
            this.particles.push(particle);
        }
    };

    region.draw = function () {
        var len = this.particles.length;

        while (len--) {
            this.particles[len].draw(region);
        }
        
    };
};