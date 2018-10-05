(function (exports) {

    var Ranking = function (_game) {
        this.game = _game;
    }

    Ranking.prototype = {

        create: function () {
            this.background = BubbleShoot.game.add.image(0, 0, 'backGame2');
            BubbleShoot.UI.changeBack2()
            if (BubbleShoot.deploy == "produccion") {
                this.getUser();
            }
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
            };
            style.tabs = [120, 230, 100, 80]
            style.font = "30px din_condensedbold";
            this.headers = ['POSICIÓN', 'NOMBRES', 'PUNTOS', 'TIEMPO'];
            this.rankHeaders = this.game.add.text(0, 0, "", style);
            this.rankHeaders.parseList(this.headers);
            this.rankHeaders.x = (BubbleShoot.game.world.width / 2) - (this.rankHeaders.width / 2);
            this.rankHeaders.y = (BubbleShoot.game.world.height / 2) - (this.rankHeaders.height / 2) - 270;
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
                boundsAlignH: "right",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 300
            };
            this.loading = this.game.add.sprite(0, 0, 'loading');
            this.loading.scale.setTo(0.3);

            this.loading.y = (this.game.world.height / 2) - (this.loading.height / 2);
            this.loading.x = (this.game.world.width / 2) - (this.loading.width / 2);
            //  Here we add a new animation called 'walk'
            //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
            var start = this.loading.animations.add('start');

            //  And this starts the animation playing by using its key ("walk")
            //  30 is the frame rate (30fps)
            //  true means it will loop when it finishes
            this.loading.animations.play('start', 30, true);
            style.font = "60px din_condensedbold";
            var titulo = BubbleShoot.game.add.text(0, 0, 'RANKING', style);
            titulo.y = 80;
            titulo.x = (BubbleShoot.game.world.width / 2) - (titulo.width / 2);
            //Call Users
            var xmlhttp = new XMLHttpRequest();
            if (BubbleShoot.UI.reg == 1) {

                var url = "https://ddbdev.co/chesterbubbleAPI/public/positions";
            } else {
                var url = "https://ddbdev.co/chesterbubbleAPI2/public/positions";

            }
            var this_ = this;
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    var usuarios = JSON.parse(this.responseText);
                    this_.updateUsuarios(usuarios);
                }
            };
            xmlhttp.open("GET", url, true);
            try {
                xmlhttp.send();

            } catch (error) {
                console.log(error);
            }


        },
        updateCurrent: function (usuario) {
            console.log(usuario);
            var usuariosList = [];
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
            };
            style.tabs = [120, 230, 100, 80]
            style.font = "30px din_condensedbold";
            var barra = this.game.add.image(0, 0, 'barra');
            barra.scale.setTo(0.75);
            barra.x = (BubbleShoot.game.world.width / 2) - (barra.width / 2);
            barra.y = this.rankHeaders.y + 50;
            barra.alpha = 0.3;
            if (BubbleShoot.deploy != "produccion") {
                usuario = {};
                usuario.pointsOld = 85000000;
                usuario.name = "Cristian Andres Arrieta";
                usuario.time = "00:00:20";
                usuario.position = "1";
            }
            var currentUser = [usuario.position, usuario.name, usuario.pointsOld, usuario.time]
            //  Or you can modify the tabs property directly:
            // text.tabs = 132;
            var currentPosition = this.game.add.text(0, 0, "", style);
            currentPosition.parseList(currentUser);
            currentPosition.x = (BubbleShoot.game.world.width / 2) - (this.rankHeaders.width / 2);
            currentPosition.y = this.rankHeaders.y + 50;
        },
        updateUsuarios: function (usuarios) {

            this.loading.animations.stop('start');
            this.loading.visible = false;

            //Call Users
            var usuariosList = [];
            var style = {
                font: "90px din_condensedbold", fill: "#fff",
                align: "center", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
            };
            usuarios[0].map(function (usuario) {
                //★
                if (usuario.name.length > 25) {
                    usuario.name = usuario.name.substring(0, 20) + "...";
                }
                usuario.name = usuario.name.toLowerCase();
                usuario.name = usuario.name.replace(/\b[a-z]/g, function (f) { return f.toUpperCase(); });
                var newUsuario = [usuario.position + "", usuario.name, usuario.points + "", usuario.time]
                usuariosList.push(newUsuario)
            })






            //  Or you can modify the tabs property directly:
            // text.tabs = 132;
            style.tabs = [120, 230, 100, 80]
            style.font = "30px din_condensedbold";
            
            var text2 = this.game.add.text(0, 0, "", style);
            text2.parseList(usuariosList);
            text2.x = (BubbleShoot.game.world.width / 2) - (this.rankHeaders.width / 2);
            text2.y = (BubbleShoot.game.world.height / 2) - (text2.height / 2) + 10;

            var btnHome = this.game.add.button(0, 0, "icoinicio");
            btnHome.scale.setTo(1.2);
            btnHome.alpha = 0.6;
            btnHome.y = (this.world.height * 0.8) - (btnHome.height * 0.8);
            btnHome.x = (this.world.width / 2) - (btnHome.width / 2) - 200;

            // var btnRanking = this.game.add.button(0, 0, "icoranking");
            // btnRanking.scale.setTo(1.2);
            // btnRanking.alpha = 0.6;
            // btnRanking.y = (this.world.height * 0.8) - (btnRanking.height * 0.8);
            // btnRanking.x = (this.world.width / 2) - (btnRanking.width / 2) - 70;

            var btnMecanica = this.game.add.button(0, 0, "icomecanica");
            btnMecanica.scale.setTo(1.2);
            btnMecanica.alpha = 0.6;
            btnMecanica.y = (this.world.height * 0.805) - (btnMecanica.height * 0.805);
            btnMecanica.x = (this.world.width / 2) - (btnMecanica.width / 2) + 70;

            var btnSonido = this.game.add.button(0, 0, "icosonido");
            btnSonido.scale.setTo(1.2);
            btnSonido.alpha = 0.6;
            btnSonido.y = (this.world.height * 0.8) - (btnSonido.height * 0.8);
            btnSonido.x = (this.world.width / 2) - (btnSonido.width / 2) + 200;

            var button = this.add.button(0, 0, "botonModal");
            button.scale.setTo(0.75);
            button.alpha = 0.6;
            button.y = (BubbleShoot.game.world.height * 0.92) - (button.height * 0.92);
            button.x = (BubbleShoot.game.world.width / 2) - (button.width / 2);

            style.font = "40px din_condensedbold";
            this.text5 = BubbleShoot.game.add.text(0, 0, "JUGAR", style);
            this.text5.y = (BubbleShoot.game.world.height * 0.91) - (this.text5.height * 0.91);
            this.text5.x = (BubbleShoot.game.world.width / 2) - (this.text5.width / 2);


            button.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                this.state.start('game');
            }, this)

            btnHome.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                this.game.state.start('menu');
            }, this)
            btnMecanica.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.UI.createMecanica()

            }, this)
            btnSonido.events.onInputDown.add(function () {
                BubbleShoot.UI.clickSound();
                BubbleShoot.game.sound.mute = !BubbleShoot.game.sound.mute;
            }, this)

        },
        getUser: function () {
            BubbleShoot.UI.gameApi.getUserInformation()
                .then((data) => {
                    console.log(data);
                    BubbleShoot.UI.infoUsuarioAPI = data;
                    var xmlhttp = new XMLHttpRequest();
                    if (BubbleShoot.UI.reg == 1) {
                        var url = "https://ddbdev.co/chesterbubbleAPI/public/userIdPropios/" + BubbleShoot.UI.infoUsuarioAPI.respondentGUID;
                    } else {
                        var url = "https://ddbdev.co/chesterbubbleAPI2/public/userIdPropios/" + BubbleShoot.UI.infoUsuarioAPI.respondentGUID;
                    }
                    var this_ = this;
                    xmlhttp.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            var response = JSON.parse(this.responseText);
                            this_.createRank(response);
                        }
                    };
                    xmlhttp.open("GET", url, true);
                    try {
                        xmlhttp.send();
                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        createRank: function (response) {
            if (response.length === 0) {
                var params = "name=" + BubbleShoot.UI.infoUsuarioAPI.firstName + " " + BubbleShoot.UI.infoUsuarioAPI.lastName + "&id_los_propios=" + BubbleShoot.UI.infoUsuarioAPI.respondentGUID + "";

                var http = new XMLHttpRequest();
                if (BubbleShoot.UI.reg == 1) {

                    var url = "https://ddbdev.co/chesterbubbleAPI/public/ranking";
                } else {
                    var url = "https://ddbdev.co/chesterbubbleAPI2/public/ranking";

                }
                http.open("POST", url, true);

                //Send the proper header information along with the request
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                http.onreadystatechange = function () {//Call a function when the state changes.
                    if (http.readyState == 4 && http.status == 200) {
                        console.log(http.responseText);
                        var lala = JSON.parse(http.responseText);
                        BubbleShoot.UI.infoUsuarioAPI.pointsOld = 0;
                        BubbleShoot.UI.infoUsuarioAPI.idAPI = lala.data[0].id === '' ? 0 : lala.data[0].id;
                        this.updateCurrent(BubbleShoot.UI.infoUsuarioAPI);
                    }
                }
                http.send(params);

                BubbleShoot.UI.gameApi.createGameSession()
                    .then((data) => {
                        BubbleShoot.UI.gameSession = data.gameSessionID;
                        var sendPointsArgs = {
                            "gameSessionID": BubbleShoot.UI.gameSession,
                            "points": 60
                        }
                        BubbleShoot.UI.gameApi.sendPoints(sendPointsArgs)
                            .then((data) => {
                                console.log(data);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            } else {
                BubbleShoot.UI.infoUsuarioAPI.pointsOld = response[0].points === '' ? 0 : response[0].points;
                BubbleShoot.UI.infoUsuarioAPI.idAPI = response[0].id === '' ? 0 : response[0].id;
                BubbleShoot.UI.infoUsuarioAPI.time = response[0].time === '' ? 0 : response[0].time;
                BubbleShoot.UI.infoUsuarioAPI.name = response[0].name === '' ? 0 : response[0].name;
                BubbleShoot.UI.infoUsuarioAPI.position = response[0].position === '' ? 0 : response[0].position;
                this.updateCurrent(BubbleShoot.UI.infoUsuarioAPI);

            }
        }

    }

    exports.Ranking = Ranking;

})(this);
