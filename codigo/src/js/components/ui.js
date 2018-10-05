(function (exports) {

    var maxRows = 4;
    var maxCols = 9;

    var colWidth = BubbleShoot.Bubble.SIZE;
    var rowHeight = BubbleShoot.Bubble.SIZE;

    var screenWidth = Math.min(window.innerWidth, window.innerHeight);
    var screenHeight = Math.min(window.innerWidth, screenWidth * 2);

    var screenWidth = 586;
    var screenHeight = 1024;

    // 16:9 640x360
    // screenWidth = 360; screenHeight = 640;

    var width = screenWidth;
    var height = screenHeight;

    var boardWidht = screenWidth;
    var boardHeight = 0;

    // var scale = Math.min((boardWidht/colWidth/maxCols), (boardHeight/rowHeight/maxRows));
    // var bubbleScale = Utils.mean([boardWidht/colWidth/maxCols, boardHeight/rowHeight/maxRows]);
    var bubbleScale = boardWidht / colWidth / maxCols;
    var bubbleSize = BubbleShoot.Bubble.SIZE * bubbleScale;
    var points = 0;
    var UI = {
        gameApiInst: {},
        contadorSlides: 0,
        background: '#fff',
        width: width,
        height: height,

        maxRows: maxRows,
        maxCols: maxCols,

        bubble: {
            scale: bubbleScale,
            size: bubbleSize,
            radius: bubbleSize / 2,
        },

        board: {
            width: boardWidht,
            height: boardHeight,
            rowHeight: bubbleSize - 9,
            separatorHeight: 2,
        }
        ,
        createComojugar: function () {
            this.modal = BubbleShoot.game.add.sprite(0, 0, 'modal');
            this.modal.alpha = 0;
            var style = {
                font: "90px din_condensedbold",
                fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.mecGroup = BubbleShoot.game.add.group();

            this.modal.scale.setTo(0.7);
            this.modal.y = (BubbleShoot.game.world.height / 2) - (this.modal.height / 2);
            this.modal.x = (BubbleShoot.game.world.width / 2) - (this.modal.width / 2);

            var mec2 = BubbleShoot.game.add.sprite(0, 0, 'mec2');
            var mec6 = BubbleShoot.game.add.sprite(0, 0, 'mec6');
            var mec8 = BubbleShoot.game.add.sprite(0, 0, 'mec8');
            var mec10 = BubbleShoot.game.add.sprite(0, 0, 'mec10');


            var animMec2 = BubbleShoot.game.add.sprite(0, 0, 'animMec2');
            var animMec2P = BubbleShoot.game.make.sprite(0, 0, 'animMec2P');
            animMec2P.visible = false;

            var animMec3 = BubbleShoot.game.add.sprite(0, 0, 'animMec3');
            var animMec3P = BubbleShoot.game.make.sprite(0, 0, 'animMec3P');
            animMec3P.visible = false;

            var animMec4 = BubbleShoot.game.add.sprite(0, 0, 'animMec4');
            var animMec4P = BubbleShoot.game.make.sprite(0, 0, 'animMec4P');
            animMec4P.visible = false;

            var animMec5 = BubbleShoot.game.add.sprite(0, 0, 'animMec4');
            var animMec5P = BubbleShoot.game.make.sprite(0, 0, 'animMec4P');
            animMec5P.visible = false;
            this.cerrar = BubbleShoot.game.add.button(0, 0, 'icocerrar');





            var generalPositionMecY = (BubbleShoot.game.world.height / 2) - (mec2.height / 2);
            var generalPositionMecX = (BubbleShoot.game.world.width / 2) - (mec2.width / 2);



            mec2.position.set(generalPositionMecX, generalPositionMecY);
            mec6.position.set(generalPositionMecX, generalPositionMecY);
            mec8.position.set(generalPositionMecX, generalPositionMecY);
            mec10.position.set(generalPositionMecX, generalPositionMecY);



            animMec2.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec2P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec2.addChild(animMec2);
            mec2.addChild(animMec2P);

            animMec3.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec3P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec6.addChild(animMec3);
            mec6.addChild(animMec3P);


            animMec4.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec4P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec8.addChild(animMec4);
            mec8.addChild(animMec4P);

            animMec5.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);
            animMec5P.position.set(generalPositionMecX + 60, generalPositionMecY + 180.5);

            mec10.addChild(animMec5);
            mec10.addChild(animMec5P);

            this.cerrar.position.set((BubbleShoot.game.world.width / 2) - (this.cerrar.width / 2) + 210, 120);

            this.mecGroup.add(mec2);
            this.mecGroup.add(mec6);
            this.mecGroup.add(mec8);
            this.mecGroup.add(mec10);

            this.mecGroup.forEach(function (item) {
                item.visible = false;
            })
            this.contadorSlides = 0;
            this.mecGroup.children[this.contadorSlides].visible = true;

            this.modal.inputEnabled = true;

            this.buttonRight = BubbleShoot.game.add.button(0, 0, "icoright");
            this.buttonRight.y = (BubbleShoot.game.world.height * 0.7) - (this.buttonRight.height * 0.7);
            this.buttonRight.x = (BubbleShoot.game.world.width / 2) - (this.buttonRight.width / 2) + 200;
            this.buttonRight.tag = "right";



            this.buttonLeft = BubbleShoot.game.add.button(0, 0, "icoleft");
            this.buttonLeft.y = (BubbleShoot.game.world.height * 0.7) - (this.buttonLeft.height * 0.7);
            this.buttonLeft.x = (BubbleShoot.game.world.width / 2) - (this.buttonLeft.width / 2) - 200;
            this.buttonLeft.tag = "left";
            this.buttonLeft.visible = false;

            this.modal.events.onInputDown.add(this.lockInput, this);


            this.buttonLeft.events.onInputDown.add(this.showSlide, this);
            this.buttonRight.events.onInputDown.add(this.showSlide, this);


            this.cerrar.events.onInputDown.add(this.destroyComojugar, this);

            this.buttonJ = BubbleShoot.game.add.button(0, 0, "botonModal");
            this.buttonJ.scale.setTo(0.68);
            this.buttonJ.alpha = 0.6;
            this.buttonJ.y = (BubbleShoot.game.world.height * 0.84) - (this.buttonJ.height * 0.84);
            this.buttonJ.x = (BubbleShoot.game.world.width / 2) - (this.buttonJ.width / 2);

            style.font = "40px din_condensedbold";
            this.textd = BubbleShoot.game.add.text(0, 0, "JUGAR", style);
            this.textd.y = (BubbleShoot.game.world.height * 0.835) - (this.textd.height * 0.835);
            this.textd.x = (BubbleShoot.game.world.width / 2) - (this.textd.width / 2);

            this.buttonJ.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.game.state.start('game');
            }, this);


        },
        lockInput: function () {
            console.log("Lock");
        },
        showSlide: function (button) {
            console.log();
            console.log(button.tag);
            if (button.tag == "left") {
                console.log("lefttttttt");
                this.contadorSlides--;
            } else {
                this.contadorSlides++;
            }
            if (this.contadorSlides == 0) {
                this.buttonLeft.visible = false;
                this.contadorSlides = 0;                
                this.buttonRight.visible = true;
            } else {
                this.buttonLeft.visible = true;
            }
            if (this.contadorSlides ==  this.mecGroup.children.length - 1) {
                this.buttonRight.visible = false;
            }else{
                this.buttonRight.visible = true;                
            }
            this.mecGroup.forEach(function (item) {
                item.visible = false;
            })
            this.mecGroup.children[this.contadorSlides].visible = true;

            if (this.mecGroup.children[this.contadorSlides].children.length) {
                var childrens = this.mecGroup.children[this.contadorSlides].children;
                this.animateMecanica(childrens);
            }


        },
        animateMecanica(childrens) {
            childrens[1].visible = false;
            childrens[0].visible = true;
            var anim = childrens[0].animations.add('animar');
            childrens[0].animations.play('animar', 30, false);
            var this_ = this;
            anim.onComplete.add(function () {
                childrens[0].visible = false;
                childrens[1].visible = true;
                var anim = childrens[1].animations.add('animarp');
                childrens[1].animations.play('animarp', 30, false);
                anim.onComplete.add(function () {
                    this_.animateMecanica(childrens);
                })
            })
        },
        destroyComojugar: function () {
            this.mecGroup.forEach(function (item) {
                item.kill();
            })
            this.textd.kill();
            this.buttonJ.kill();

            this.modal.kill();
            this.cerrar.kill();

            this.buttonRight.kill();
            this.buttonLeft.kill();
            this.contadorSlides = 0;
            this.clickSound();
        },
        destroyMecanica: function () {
            this.modal.kill();
            this.cerrar.kill();
            this.mecanicaGroup.forEach(function (item) {
                item.kill();
            })
            this.clickSound();
        },
        createMecanica: function () {

            this.mecanicaGroup = BubbleShoot.game.add.group();
            this.modal = BubbleShoot.game.add.image(0, 0, 'backGame2');
            this.modal.inputEnabled = true;
            this.modal.events.onInputDown.add(function () {
                return false;
            }, this);
            this.modal.y = (BubbleShoot.game.world.height / 2) - (this.modal.height / 2);
            this.modal.x = (BubbleShoot.game.world.width / 2) - (this.modal.width / 2);
            this.cerrar = BubbleShoot.game.add.button(0, 0, 'icocerrar');
            this.cerrar.position.set((BubbleShoot.game.world.width / 2) - (this.cerrar.width / 2) + 232, 86);
            this.cerrar.events.onInputDown.add(this.destroyMecanica, this);
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };

            style.font = "60px din_condensedbold";
            var text = BubbleShoot.game.add.text(0, 0, 'TÉRMINOS & CONDICIONES', style);
            text.y = 80;
            text.x = (BubbleShoot.game.world.width / 2) - (text.width / 2);
            style.font = "23px din_condensedbold";

            style.wordWrapWidth = 520;
            if (BubbleShoot.UI.reg == 1) {
                var templateText = `El juego estará disponible exclusivamente para Los Propios, desde el 12 de febrero hasta el 30 de marzo de 2018
Recibirás 60 puntos la primera vez que juegues. 
Puedes jugar todas las veces que quieras para mejorar tu posición, pero solo se tendrá en cuenta para el ranking el mejor alcanzado en el menor tiempo.  
El juego tiene solamente un nivel y las cápsulas aparecerán de forma aleatoria.    
El objetivo del juego es unir 3 o más cápsulas del mismo color o crear combinaciones para obtener puntos (las cápsulas se pueden unir de forma horizontal, vertical o diagonal)
Ve al botón “¿Cómo Jugar?” en el inicio para saber cómo sumar puntos en el juego.
Si en 3 lanzamientos no logras unir cápsulas del mismo color, las cápsulas del tablero bajarán progresivamente.
Si las cápsulas del tablero llegan a la línea horizontal que está en la parte inferior de la pantalla, perderás la partida.
Si estás entre los mejores 10 puntajes de tu regional, el 30 de marzo a las 14:00, recibirás 1.000 puntos en tu cuenta www.lospropios.net.
Por ningún motivo el reconocimiento será entregado en dinero en efectivo.`;
            } else {
                var templateText = `El juego estará disponible exclusivamente para Los Propios desde el 12 de febrero hasta el 30 de marzo de 2018
Recibirás 60 puntos la primera vez que juegues.
Puedes jugar todas las veces que quieras para mejorar tu posición, pero solo se tendrá en cuenta para el ranking el mejor puntaje alcanzado en el menor tiempo.
El juego tiene solamente un nivel y las cápsulas aparecerán de forma aleatoria.
El objetivo del juego es unir 3 o más cápsulas del mismo color para obtener puntos (las cápsulas se pueden unir de forma horizontal, vertical o diagonal)
Ve al botón “¿Cómo Jugar?” en el inicio para saber cómo sumar puntos en el juego.
Si en 3 lanzamientos no logras unir cápsulas del mismo color, las cápsulas del tablero bajarán progresivamente.
Si las cápsulas del tablero llegan a la linea horizontal que está en la parte inferior de la pantalla, perderás la partida.
Si estás entre los mejores 10 puntajes de tu regional el 30 de marzo a las 14:00, recibirás 1.500 puntos en tu cuenta www.lospropios.net.
Por ningún motivo el reconocimiento será entregado en dinero en efectivo.`;
            }

            var text2 = BubbleShoot.game.add.text(0, 0, templateText, style);
            text2.y = (BubbleShoot.game.world.height * 0.8) - (text2.height * 0.8);
            text2.x = (BubbleShoot.game.world.width / 2) - (text2.width / 2);




            this.mecanicaGroup.add(this.modal);
            this.mecanicaGroup.add(text);
            this.mecanicaGroup.add(text2);
        },
        clickSound: function () {
            BubbleShoot.sound.clic.play();
        },
        changeBack: function () {
            document.getElementById("backDeskNorm").style.cssText = "z-index:0";
            document.getElementById("backDeskGame").style.cssText = "z-index:1";


        },
        changeBack2: function () {
            document.getElementById("backDeskNorm").style.cssText = "z-index:1";
            document.getElementById("backDeskGame").style.cssText = "z-index:0";

        },
        reg: 3,
        gameApi: {
            getUserInformation: () => {
                UI.gameApiInst.getUserInformation();
                var promise = new Promise(
                    (resolve, reject) => {
                        UI.gameApiInst.onSuccess = (data) => {
                            resolve(data);
                        }
                        UI.gameApiInst.onError = (error) => {
                            reject(error);
                        }
                    }
                )
                return promise;
            },
            createGameSession: () => {
                UI.gameApiInst.createGameSession();
                var promise = new Promise(
                    (resolve, reject) => {
                        UI.gameApiInst.onSuccess = (data) => {
                            resolve(data);
                        }
                        UI.gameApiInst.onError = (error) => {
                            reject(error);
                        }
                    }
                )
                return promise;
            },
            getGameSession: (getGameSessionArgs) => {
                UI.gameApiInst.getGameSession(getGameSessionArgs);
                var promise = new Promise(
                    (resolve, reject) => {
                        UI.gameApiInst.onSuccess = (data) => {
                            resolve(data);
                        }
                        UI.gameApiInst.onError = (error) => {
                            reject(error);
                        }
                    }
                )
                return promise;
            },
            sendPoints: (sendPointsArgs) => {
                UI.gameApiInst.sendPoints(sendPointsArgs);
                var promise = new Promise(
                    (resolve, reject) => {
                        UI.gameApiInst.onSuccess = (data) => {
                            resolve(data);
                        }
                        UI.gameApiInst.onError = (error) => {
                            reject(error);
                        }
                    }
                )
                return promise;
            }
        },

    }
    BubbleShoot.UI = UI;
    if (BubbleShoot.deploy == "produccion") {
        BubbleShoot.UI.gameApiInst = new GameAPI()
        var old_console_log = console.log;
         console.log = function () {
         }
        console.log(BubbleShoot.UI.gameApiInst);
    }


    exports.UI = UI;

})(BubbleShoot);
