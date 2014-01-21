var w = window,
    d = document;

w.onload = function () {
    var target = d.querySelector('#target'),
        MAX_PARTICLES = 150, //максимально количество частиц
        RADIUS = {
            MAX: 80,
            MIN: 10
        },
        OPACITY = {
            MAX: 1,
            MIN: 0.4
        },
        COLORS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']; //цвета частиц


    /*
    * Создание частицы
    * @param {int} x - координата по x
    * @param {int} y - координата по y
    * @return {Object}
    */
    var Particle = function (x, y) {
        this.init( x, y);
    };

    Particle.prototype = {
        //Параметры создаваемой частицы
        init: function( x, y ) {
            this.radius = random(RADIUS.MIN, RADIUS.MAX);//радиус частиц
            this.color = random(COLORS);//цвет частицы
            this.opacity = random(OPACITY.MIN, OPACITY.MAX);
            this.x = x;
            this.y = y;

            this.vx = 0.0;
        },
        draw: function( ctx ) {
            ctx.save();
            ctx.beginPath();//Начинает отрисовку фигуры
            ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
            ctx.fillStyle = this.color;//цвет
            ctx.globalAlpha = this.opacity;//прозрачность
            ctx.fill();
            ctx.stroke();//завершаем отрисовку
            ctx.restore();
        },
        move: function () {
            this.y -= random(0.2, 0.5);
            //Возврашам в начало частицы которые ушли за пределы хослста
            if (this.y < -100) {
                this.y = region.height;
            }  
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
            this.particles[len].draw(region);//создание частиц
            this.particles[len].move();//движение
        }
        
    };
};