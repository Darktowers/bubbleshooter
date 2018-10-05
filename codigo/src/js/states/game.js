;
(function (global) {

    'use strict';

    var fpsText = "Hola";

    var Game = function (_game) {
        this.game = _game;
    }

    Game.prototype = {

        create: function () {






            this.game.stage.disableVisibilityChange = true;
            BubbleShoot.UI.changeBack()
            BubbleShoot.CurrenteState = this;
            BubbleShoot.state = 'stated';
            this.background = BubbleShoot.game.add.image(0, 0, 'backGame');
            this.background.inputEnabled = true;

            this.boardShoot = BubbleShoot.game.add.image(0, BubbleShoot.game.height - 260, 'shooterx');
            BubbleShoot.spinBtn = BubbleShoot.game.add.button(0, 0, 'spin');
            BubbleShoot.spinBtn.position.set(BubbleShoot.game.world.centerX + 20, BubbleShoot.game.height - 190);
            BubbleShoot.spinBtn.scale.setTo(0.5);
            BubbleShoot.spinBtn.events.onInputDown.add(this.changeBubble, this);
            if (!this.game.device.touch) {
                BubbleShoot.spinBtn.events.onInputOver.add(function () {
                    this.boardShoot.loadTexture("shooterxHov");
                }, this);
                BubbleShoot.spinBtn.events.onInputOut.add(function () {
                    this.boardShoot.loadTexture("shooterx");
                }, this);
            }


            // var background = this.game.add.tileSprite(0, 0, BubbleShoot.UI.width, BubbleShoot.UI.height, "background");
            // background.alpha = 0.8;

            this.game.time.advancedTiming = true;

            BubbleShoot.fire = true;
            BubbleShoot.entities = BubbleShoot.game.add.group();

            var bubblesGroup = BubbleShoot.game.add.group();
            bubblesGroup.enableBody = true;

            BubbleShoot.entities.add(bubblesGroup);
            BubbleShoot.entities.bubbles = bubblesGroup;

            BubbleShoot.isTouch = this.game.device.touch;
            console.log(BubbleShoot.isTouch);
            this.createPlayers(function () {
                this.configureCollision();
                this.createTablero();
                this.attachEvents();

            });

            BubbleShoot.entities.bringToTop(BubbleShoot.entities.bubbles);

            this.timerGame = this.game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
            this.timerGame.loop(1, this.cronometro, this);
            this.timerGame.loop(1000, this.updateTextTime, this);



            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            this.timerGame.start();

            BubbleShoot.sessionTime = "00:00";
            this.horas = 0
            this.centesimas = 0
            this.segundos = 0
            this.minutos = 0
            this.totalSegundos = 0


            var style = {
                font: "38px din_condensedbold",
                fill: "#fff",
                align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };

            BubbleShoot.timeText = this.game.add.text(0, 0, '00:00', style);

            BubbleShoot.timeText.setTextBounds(70, 20, 135, 53);

            BubbleShoot.sound.shoot = this.game.add.sound('launch');
            BubbleShoot.sound.explosion = this.game.add.sound('explosion');
            BubbleShoot.sound.fail = this.game.add.sound('fail');
            BubbleShoot.sound.win = this.game.add.sound('win');
            BubbleShoot.sound.goodjob = this.game.add.sound('goodjob');





            BubbleShoot.animations = {};
            BubbleShoot.animations.mentol = BubbleShoot.game.add.sprite(-250, -250, 'mentol');
            BubbleShoot.animations.mentol.visible = false;
            BubbleShoot.animations.mentol.y = (this.world.height / 2) - (BubbleShoot.animations.mentol.height / 2);
            BubbleShoot.animations.mentol.x = (this.world.width / 2) - (BubbleShoot.animations.mentol.width / 2);



            BubbleShoot.animations.purpleX2 = BubbleShoot.game.add.sprite(-250, -250, 'purplex2');
            BubbleShoot.animations.purpleX2.visible = false;
            BubbleShoot.animations.purpleX2.y = (this.world.height / 2) - (BubbleShoot.animations.purpleX2.height / 2);
            BubbleShoot.animations.purpleX2.x = (this.world.width / 2) - (BubbleShoot.animations.purpleX2.width / 2);

            BubbleShoot.animations.sabor = BubbleShoot.game.add.sprite(-250, -250, 'sabor');
            BubbleShoot.animations.sabor.visible = false;
            BubbleShoot.animations.sabor.y = (this.world.height / 2) - (BubbleShoot.animations.sabor.height / 2);
            BubbleShoot.animations.sabor.x = (this.world.width / 2) - (BubbleShoot.animations.sabor.width / 2);


        },
        updateTextTime() {
            setTimeout(function () {
                BubbleShoot.timeText.text = BubbleShoot.sessionTime;
                BubbleShoot.timeText.updateText();
                BubbleShoot.timeText.dirty = false;
            }, null);

        },
        cronometro: function () {


            if (this.centesimas < 59) {
                this.centesimas++;
                //if (this.centesimas < 10) { this.centesimas = "0"+this.centesimas }
                //this.Centesimas.innerHTML = ":"+this.centesimas;
            }
            if (this.centesimas == 59) {
                this.centesimas = -1;
            }
            if (this.centesimas == 0) {
                this.segundos++;
                this.totalSegundos++;
                if (this.segundos < 10 && this.minutos < 10) {
                    BubbleShoot.sessionTime = "0" + this.minutos + ":0" + this.segundos;
                } else if (this.segundos < 10) {
                    BubbleShoot.sessionTime = this.minutos + ":0" + this.segundos;
                } else if (this.minutos < 10) {
                    BubbleShoot.sessionTime = "0" + this.minutos + ":" + this.segundos;
                } else {
                    BubbleShoot.sessionTime = this.minutos + ":" + this.segundos;
                }
            }
            if (this.segundos == 59) {
                this.segundos = -1;
            }
            if ((this.centesimas == 0) && (this.segundos == 0)) {
                this.minutos++;
                //if (this.minutos < 10) { this.minutos = "0"+this.minutos }
                //this.Minutos.innerHTML = ":"+this.minutos;
            }
            if (this.minutos == 59) {
                this.minutos = -1;
            }
            if ((this.centesimas == 0) && (this.segundos == 0) && (this.minutos == 0)) {
                this.horas++;
                //if (this.horas < 10) { this.horas = "0"+this.horas }
                //this.Horas.innerHTML = this.horas;
            }
            BubbleShoot.totalSegundos = parseFloat(this.totalSegundos+"."+this.centesimas) * 1000;

        },
        createPlayers: function (done) {
            if (BubbleShoot.mode == BubbleShoot.MODES.SINGLEPLAYER) {

                BubbleShoot.player = new BubbleShoot.Player('You', BubbleShoot.PLAYER_SIDE_BOTTOM);

                var maxRows = Math.round(BubbleShoot.UI.maxRows);
                var maxCols = BubbleShoot.UI.maxCols;

                BubbleShoot.player.board.createGrid(maxRows, maxCols);
                BubbleShoot.player.board.createBubbles();
                BubbleShoot.player.shooter.showTrajectory(false);
                BubbleShoot.player.shooter.reload(true);


                BubbleShoot.player.enemy = BubbleShoot.enemy;

                BubbleShoot.player.shooter.createAlterBubble();

                return done.call(this);
            }
        },
        changeBubble: function () {
            BubbleShoot.player.shooter.changeBubble()
        },
        createTablero: function () {
            BubbleShoot.tablero = this.game.add.button(0, 0, 'tablero');
            var copy = "0";
            var fill = "#fff";

            var style = {
                font: "38px din_condensedbold",
                fill: "#fff",
                align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };

            BubbleShoot.textPuntos = this.game.add.text(0, 0, copy, style);

            BubbleShoot.textPuntos.setTextBounds(345, 20, 135, 53);

            BubbleShoot.tablero.onInputDown.add(function () {
                this.createPause();
                BubbleShoot.tablero.loadTexture("tablero-press");
                
            }, this)


            BubbleShoot.player.board.createLifes();
            

        },

        createPause: function () {
            BubbleShoot.UI.clickSound();
            BubbleShoot.state = 'pause';
            this.timerGame.paused = true;
            this.detachEvents();
            this.createModalLayer();
        },
        configureCollision: function () {
            var config = BubbleShoot.Collision.config;
            config.bubbleRadius = BubbleShoot.UI.bubble.radius;
            config.trajectory.distance = BubbleShoot.UI.bubble.radius / 5;
            config.trajectory.duration = 600;
            config.gameWidth = BubbleShoot.game.width;
        },

        attachEvents: function () {
            BubbleShoot.tablero.inputEnabled = true;
            this.game.input.addMoveCallback(this.inputMove, this);
            this.background.events.onInputDown.add(this.inputDown, this);

            this.background.events.onInputUp.add(this.inputUp, this);
            this.game.canvas.style.cursor = 'crosshair';
        },

        detachEvents: function () {
            BubbleShoot.tablero.inputEnabled = false;
            this.game.input.deleteMoveCallback(this.inputMove, this);
            this.background.events.onInputUp.remove(this.inputUp, this);
            this.game.canvas.style.cursor = 'default';
        },

        update: function () {
            if (BubbleShoot.player.board.grid.length > 12) {

            }
            var this_ = this;
            if (BubbleShoot.player.board.grid.length > 12) {
                BubbleShoot.player.board.grid[12].map(function (item) {
                    if (item != undefined) {
                        this_.finish();
                    }
                })
            }
            if(BubbleShoot.fire){
                BubbleShoot.player.shooter.showTrajectory(false);
            }else{
                BubbleShoot.player.shooter.showTrajectory(true);
            }
        },

        render: function () {
            // var _this = this;
            // BubbleShoot.player.bubbles.forEachAlive(function(bubble) {
            //     this.game.debug.body(bubble);
            // }.bind(this));
            //this.game.debug.geom(BubbleShoot.textPuntos.textBounds, 'rgba(255,0,0,0.5)');
            BubbleShoot.game.debug.geom(BubbleShoot.pause, '#0fffff');
        },
        inputDown: function (input, event) {

            BubbleShoot.fire = false;

        },
        inputUp: function (input, event) {
            BubbleShoot.fire = true;

            if (BubbleShoot.state != 'finished' && BubbleShoot.state != 'pause') {
                BubbleShoot.player.fire();
            }
        },

        inputMove: function (input, x, y, fromClick) {
            var rotation = this.game.physics.arcade.angleToPointer(BubbleShoot.player.shooter);
            // fix rotation: imagem deveria estar apontada para direita, esta para cima
            rotation += 1.57079633;

            BubbleShoot.player.shooter.setRotation(rotation);

        },

        finish: function (winner) {


            if (BubbleShoot.state == 'finished') {
                return false;
            }
            BubbleShoot.sound.fail.play();
            BubbleShoot.state = 'finished';
            this.timerGame.stop();
            this.detachEvents();
            this.createModalLayer();
            BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos)


        },

        createModalLayer: function () {
            this.detachEvents();
            BubbleShoot.spinBtn.inputEnabled = false;

            var modalGroup = this.game.add.group();
            var modal = this.add.sprite(0, 0, 'modal');
            modal.scale.setTo(0.7);
            this.background.inputEnabled = false;
            modal.y = (this.world.height / 2) - (modal.height / 2);
            modal.x = (this.world.width / 2) - (modal.width / 2);
            var style = {
                font: "90px din_condensedbold",
                fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };
            var btnHome = this.game.add.button(0, 0, "icoinicio");
            btnHome.scale.setTo(1.2);
            btnHome.alpha = 0.6;
            btnHome.y = (this.world.height * 0.7) - (btnHome.height * 0.7);
            btnHome.x = (this.world.width / 2) - (btnHome.width / 2) - 200;

            var btnRanking = this.game.add.button(0, 0, "icoranking");
            btnRanking.scale.setTo(1.2);
            btnRanking.alpha = 0.6;
            btnRanking.y = (this.world.height * 0.7) - (btnRanking.height * 0.7);
            btnRanking.x = (this.world.width / 2) - (btnRanking.width / 2) - 70;

            var btnMecanica = this.game.add.button(0, 0, "icomecanica");
            btnMecanica.scale.setTo(1.2);
            btnMecanica.alpha = 0.6;
            btnMecanica.y = (this.world.height * 0.704) - (btnMecanica.height * 0.704);
            btnMecanica.x = (this.world.width / 2) - (btnMecanica.width / 2) + 70;

            var btnSonido = this.game.add.button(0, 0, "icosonido");
            btnSonido.scale.setTo(1.2);
            btnSonido.alpha = 0.6;
            btnSonido.y = (this.world.height * 0.7) - (btnSonido.height * 0.7);
            btnSonido.x = (this.world.width / 2) - (btnSonido.width / 2) + 200;


            if (BubbleShoot.state == 'pause') {
                var text = this.game.add.text(0, 0, 'PAUSA', style);
                text.y = 250;
                text.x = (this.world.width / 2) - (text.width / 2);
                style.font = "35px din_condensedbold";
                // var text2 = this.game.add.text(0, 0, 'Tienes', style);
                // text2.y = (this.world.height / 3) - (text2.height / 3);
                // text2.x = (this.world.width / 2) - (text2.width / 2);
                // style.font = "90px din_condensedbold";
                // var text3 = this.game.add.text(0, 0, BubbleShoot.player.board.returnPoints(), style);
                // text3.y = (this.world.height * 0.42) - (text3.height * 0.42);
                // text3.x = (this.world.width / 2) - (text3.width / 2);
                // style.font = "50px din_condensedbold";
                // var text4 = this.game.add.text(0, 0, "PUNTOS", style);
                // text4.y = (this.world.height * 0.5) - (text4.height * 0.5);
                // text4.x = (this.world.width / 2) - (text4.width / 2);

                var pause = this.game.add.image(0, 0, 'icopause');
                pause.y = 420;
                pause.x = (this.world.width / 2) - (pause.width / 2);
                
                var button = this.game.add.button(0, 0, "botonModal");
                button.scale.setTo(0.7);
                button.alpha = 0.2;
                button.y = (this.world.height * 0.84) - (button.height * 0.84);
                button.x = (this.world.width / 2) - (button.width / 2);
                style.font = "40px din_condensedbold";
                this.text5 = this.game.add.text(0, 0, "CONTINUAR JUGANDO", style);
                this.text5.y = (this.world.height * 0.835) - (this.text5.height * 0.835);
                this.text5.x = (this.world.width / 2) - (this.text5.width / 2);


                modalGroup.add(modal);
                modalGroup.add(text);
                // modalGroup.add(text2);
                // modalGroup.add(text3);
                // modalGroup.add(text4);
                
                modalGroup.add(pause);
                
                modalGroup.add(button);
                modalGroup.add(this.text5);



                button.events.onInputDown.add(function () {
                    BubbleShoot.UI.clickSound();
                    BubbleShoot.tablero.loadTexture("tablero");

                    modalGroup.forEach(function (item) {
                        var anim = BubbleShoot.game.add.tween(item).to({
                            alpha: 0
                        }, 300, 'Linear', true, 0);
                    });

                    BubbleShoot.state = 'running';
                    this.timerGame.paused = false;

                    BubbleShoot.spinBtn.inputEnabled = true;
                    button.destroy();
                    btnRanking.destroy();
                    btnHome.destroy();
                    btnMecanica.destroy();
                    btnSonido.destroy();

                    this.attachEvents();
                    this.background.inputEnabled = true;

                }, this)
            } else {
                
                style.font = "45px din_condensedbold";
                var text = this.game.add.text(0, 0, 'OUCH', style);
                text.y = 160;
                text.x = (this.world.width / 2) - (text.width / 2);
                style.font = "35px din_condensedbold";
                style.wordWrapWidth = 500;
                var text2 = this.game.add.text(0, 0, 'Vuelve a empezar y mejora tu puntaje', style);
                text2.y = (this.world.height / 4) - (text2.height / 4);
                text2.x = (this.world.width / 2) - (text2.width / 2);
                style.font = "60px din_condensedbold";
                var text3 = this.game.add.text(0, 0, BubbleShoot.player.board.returnPoints(), style);
                text3.y = (this.world.height * 0.4) - (text3.height * 0.4);
                text3.x = (this.world.width / 2) - (text3.width / 2);
                style.font = "26px din_condensedbold";
                var text4 = this.game.add.text(0, 0, "PUNTOS", style);
                text4.y = (this.world.height * 0.45) - (text4.height * 0.45);
                text4.x = (this.world.width / 2) - (text4.width / 2);
                var button = this.game.add.button(0, 0, "botonModal");
                button.scale.setTo(0.68);
                button.alpha = 0.6;
                button.y = (this.world.height * 0.84) - (button.height * 0.84);
                button.x = (this.world.width / 2) - (button.width / 2);
                style.font = "45px din_condensedbold";
                this.text5 = this.game.add.text(0, 0, "VOLVER A JUGAR", style);
                this.text5.y = (this.world.height * 0.84) - (this.text5.height * 0.84);
                this.text5.x = (this.world.width / 2) - (this.text5.width / 2);


                modalGroup.add(modal);
                modalGroup.add(text);
                modalGroup.add(text2);
                modalGroup.add(text3);
                modalGroup.add(text4);
                modalGroup.add(button);
                modalGroup.add(this.text5);



                button.events.onInputDown.add(function () {
                    BubbleShoot.UI.clickSound();

                    BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos)
                BubbleShoot.tablero.loadTexture("tablero-press");
                    
                    this.game.state.start('game');
                }, this)
            }

            this.text5.alpha = 0.6;

            button.events.onInputOver.add(this.hoverBtnx, this)
            button.events.onInputOut.add(this.unHoverBtnx, this)

            btnHome.events.onInputOver.add(this.hoverBtn, this)
            btnHome.events.onInputOut.add(this.unHoverBtn, this)

            btnRanking.events.onInputOver.add(this.hoverBtn, this)
            btnRanking.events.onInputOut.add(this.unHoverBtn, this)

            btnMecanica.events.onInputOver.add(this.hoverBtn, this)
            btnMecanica.events.onInputOut.add(this.unHoverBtn, this)

            btnSonido.events.onInputOver.add(this.hoverBtn, this)
            btnSonido.events.onInputOut.add(this.unHoverBtn, this)

            btnRanking.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos)

                this.state.start('ranking');
            }, this)
            btnHome.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.player.board.savePoints(BubbleShoot.totalSegundos)
                this.game.state.start('menu');
            }, this)

            btnMecanica.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.UI.createMecanica()

            }, this)

            btnSonido.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.game.sound.mute = !BubbleShoot.game.sound.mute;
                if(BubbleShoot.game.sound.mute){
                    btnSonido.loadTexture("icosonidoPause");
                }else{
                    btnSonido.loadTexture("icosonido");
                }
            }, this)

        },
        hoverBtn: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.8
            }, 300, 'Linear', true, 0);

        },
        unHoverBtn: function (btn) {
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.6
            }, 300, 'Linear', true, 0);
        },
        hoverBtnx: function (btn) {
            var text = BubbleShoot.game.add.tween(this.text5).to({
                alpha: 0.8
            }, 300, 'Linear', true, 0);
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.8
            }, 300, 'Linear', true, 0);

        },
        unHoverBtnx: function (btn) {
            var text = BubbleShoot.game.add.tween(this.text5).to({
                alpha: 0.6
            }, 300, 'Linear', true, 0);
            var anim = BubbleShoot.game.add.tween(btn).to({
                alpha: 0.6
            }, 300, 'Linear', true, 0);
        }

    }

    global.Game = Game;

})(this, BubbleShoot);