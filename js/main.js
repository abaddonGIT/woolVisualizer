/******************************************************
 * Copyright 2014 by Abaddon <abaddongit@gmail.com>
 * @author Abaddon <abaddongit@gmail.com> 
 * @version 0.0.1
 * ***************************************************/
var w = window,
    d = document,
    MP3_PATH = 'files/test.mp3',
    MAX_PARTICLES = 50,
    TWO_PI = Math.PI * 2,
    SMOOTHING = 0.3,
    FURIE = 512,
    RADIUS = {
        MAX: 80.0,
        MIN: 10.0
    },
    SIZE = {
        MIN: 0.5,
        MAX: 1.25
    },
    OPACITY = {
        MIN: 0.4,
        MAX: 0.8
    },
    SPEED = {
        MIN: 0.2,
        MAX: 1
    },
    BIRD_SPEED = {
        MIN: 2.5,
        MAX: 3.2
    },
    BIRD_JUMP = {
        MIN: 20,
        MAX: 30
    },
    IMAGES = ['img/red.png','img/ell.png','img/blue.png','img/black.png'],
    COLORS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']; //цвета частиц


    var WoolAnalaser = function () {
        "use strict";
        var ctx = null,
        canva = null,
        config = null,
        particles = [],
        rope = null,
        birds = [],
        audio = null,
        input = d.querySelector('#song'),
        that = this;


        config = this.config = {
            fullscreen: true,
            interval: 10,
            type: "canvas"
        };
        /*
        * Конструктор анализатора
        */
        var Analyse = function () {
            var _that = this,
            AudioContext = w.AudioContext || w.webkitAudioContext;

            this.audio = new Audio();
            this.audio.src = MP3_PATH;
            this.audio.controls = true;

            this.context = new AudioContext();
            this.node = this.context.createJavaScriptNode(2048, 1, 1);
            //Анализатор
            this.analyser = this.context.createAnalyser();
            this.analyser.smoothingTimeConstant = SMOOTHING;
            this.analyser.fftSize = FURIE;

            this.bands = new Uint8Array(this.analyser.frequencyBinCount);

            this.audio.addEventListener('canplay', function () {
                if (!_that.source) {
                    _that.source = _that.context.createMediaElementSource(_that.audio);
                    _that.source.connect(_that.analyser);
                    _that.analyser.connect(_that.node);
                    _that.node.connect(_that.context.destination);
                    _that.source.connect(_that.context.destination);

                    _that.node.onaudioprocess = function () {
                        _that.analyser.getByteFrequencyData(_that.bands);
                        if (!_that.audio.paused) {
                            return typeof _that.update === "function" ? _that.update(_that.bands) : 0;
                        }
                    };
                }
            });
            d.body.appendChild(_that.audio);

            return this;
        };

        /*
        * Кконструктор частиц
        */
        var Particle = function () {
            this.init();
        };

        Particle.prototype = {
            /*
            * Создает частицу
            */
            init: function () {
                this.x = that.random(canva.width);
                this.y = that.random(canva.height);
                this.level = 1 * that.random(4);
                this.speed = that.random(SPEED.MIN, SPEED.MAX);
                this.radius = that.random(RADIUS.MIN, RADIUS.MAX); //радиус частиц
                this.color = that.random(COLORS); //цвет частицы
                this.opacity = that.random(OPACITY.MIN, OPACITY.MAX);
                this.band = Math.floor(that.random(128));
            },
            /*
            * Рисует частицу в конве
            */
            draw: function () {
                var pulsar, scale;
                pulsar = Math.exp(this.pulse);
                scale = pulsar * this.radius || this.radius;
                ctx.save();
                ctx.beginPath(); //Начинает отрисовку фигуры
                ctx.arc(this.x, this.y, scale, 0, TWO_PI);
                ctx.fillStyle = this.color; //цвет
                ctx.globalAlpha = this.opacity / this.level; //прозрачность
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = this.color; //цвет рамки
                ctx.stroke();
                ctx.restore();

                this.move();
            },
            /*
            * Движение частицы
            */
            move: function () {
                this.y -= this.speed * this.level;
                //this.x += this.speed * this.level;
                //Возврашам в начало частицы которые ушли за пределы хослста
                if (this.y < -100) {
                    this.y = canva.height;
                }
            }
        };


        /*
        * Веревка
        */

        var Rope = function () {
            this.init();
        };

        Rope.prototype = {
            init: function () {
                this.x = 0;
                this.y = canva.height/2;
                this.deflection = 0.0;
                this.color = "#000";
            },
            draw: function () {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.quadraticCurveTo(canva.width/2, this.y + this.deflection, canva.width, this.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();

                this.move();
            },
            move: function () {
                /*var ln = birds.length;
                while (ln--) {
                    var loc = birds[ln];
                    if (loc.stop && !loc.finish) {
                        this.deflection += 10;
                        loc.finish = true;
                    }
                }*/
            }
        };

        /*
        * Птички
        */
        var Bird = function () {
            this.init();
        };

        Bird.prototype = {
            init: function () {
                var img = new Image();
                img.src = that.random(IMAGES);
                img.width = 100;
                img.height = 100;
                this.up = true;
                this.down = false;
                this.stop = false;
                this.finish = false;
                this.x = canva.width - img.width;
                this.y = canva.height/2 - img.height;
                this.speed = that.random(BIRD_SPEED.MIN, BIRD_SPEED.MAX);
                this.jump = that.random(BIRD_JUMP.MIN, BIRD_JUMP.MAX);
                this.bord = that.random(300, canva.width - 100); 

                this.img = img;
            },
            draw: function () {
                ctx.save();
                ctx.beginPath();    
                ctx.drawImage(this.img, this.x, this.y);
                ctx.closePath();
                ctx.restore();

                this.move();
            },
            move: function () {
                if (this.x > this.bord && !this.stop) {
                    this.x -= this.speed;
                
                    if (this.y > canva.height/2 - this.img.height - this.jump && !this.down) {
                        this.y--;
                    } else {
                        this.up = false;
                        this.down = true;
                    }

                    if (this.y < canva.height/2 - this.img.height && !this.up) {
                        this.y += this.speed;
                    } else {
                        this.up = true;
                        this.down = false;
                    }

                } else {
                    this.y = canva.height/2 - this.img.height;
                    this.stop = true;

                }

                //разрешаем стоскновения
                var ln = birds.length;

                while (ln--) {
                    var loc = birds[ln];

                    if (this.x > loc.x && (this.x < loc.x + loc.img.width + 10) && this.stop) {//столкновение
                        this.x++;
                    }

                }
            }
        };

        /*
        * Создает конву
        */
        this.init = function (contener) {
            ctx = this.createCanvas(contener);
            canva = ctx.canvas;
            this.createParticles();
        };
        /*
        * Создает частицы
        */
        this.createParticles = function () {
            var particle = null, audio = null;

            for (var i = 0; i < MAX_PARTICLES; i++) {
                particle = new Particle();
                particles.push(particle);
            }

            rope = new Rope();

            for (var i = 0; i < 7; i++) {
                birds.push(new Bird());
            }

            try {
                audio = new Analyse();

                input.addEventListener('change', function () {
                    var song = this.value,
                        fReader = new FileReader();

                    fReader.readAsDataURL(this.files[0]);
                    fReader.onloadend = function (event) {
                        var e = event || w.event;
                        audio.audio.src = e.target.result;
                        audio.audio.load();
                    };
                }, false);

                audio.update = function (bands) {
                    var ln = MAX_PARTICLES;

                    while (ln--) {
                        var loc = particles[ln];
                        loc.pulse = bands[loc.band] / 256;
                    }
                };
            } catch (e) {
                throw ('Ваш барузер не поддержывает audio Api');
            }
            setInterval(that.action, this.config.interval);
        }
        /*
        * Добавляет частицы в конву и анимирует их
        */
        this.action = function () {
            var ln = MAX_PARTICLES;
            that.clear();
            for (var i = 0; i < ln; i++) {
                var loc = particles[i];
                loc.draw();
            }
            //Рисуем веревку
            rope.draw();
            for (var i = 0; i < 7; i++) {
                var loc = birds[i];
                loc.draw();
            }
            
        }
        /*
        * Чистит конву перед следующей анимацией
        */
        this.clear = function () {
            ctx.clearRect(0, 0, canva.width, canva.height);
        };
    };

WoolAnalaser.prototype = {
    /*
    * Создает конву на странице
    * @param {Object} contener - dom объект элемента для вставки конвы
    * @return {Object} context - контекст созданной конвы
    */
    createCanvas: function (contener) {
        var config = this.config,
            canvas = null,
            context = null;

        canvas = d.createElement('canvas'),
        context = canvas.getContext('2d');

        if (config.fullscreen) {
            canvas.width = w.innerWidth;
            canvas.height = w.innerHeight;
        }
        (contener || d.body).appendChild(canvas);
        return context;
    },
    /*
    * Выбор рандомного значения
    */
    random: function( min, max ) {
        if (this.isArray( min )) {
            return min[ ~~( Math.random() * min.length ) ];
        }
        if (!this.isNumber(max)) {
            max = min || 1, min = 0;
        }
        return min + Math.random() * ( max - min ); 
    },
    /*
    * Проверка на массив
    */
    isArray: function(object) {
        return Object.prototype.toString.call( object ) == '[object Array]';
    },
    /*
    * Проверка на число
    */
    isNumber: function(object) {
        return typeof object == 'number';
    }
};

w.onload = function () {
    var analyser = new WoolAnalaser ();
    analyser.init(d.querySelector('#target'));
};