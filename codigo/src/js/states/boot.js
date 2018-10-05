(function (exports) {

    var Boot = function (game) {
        this.game = game;
    }

    Boot.prototype = {

        preload: function () {

            this.load.crossOrigin = 'anonymous';

            this.load.spritesheet('loading', assetsPath + '/img/loading.png', 512, 256, 13);
            this.load.audio('main', [assetsPath + '/sounds/main.mp3', assetsPath + '/sounds/main.ogg']);

        },

        create: function () {
            BubbleShoot.sound = {};
            BubbleShoot.sound.main = this.game.add.sound('main');
            BubbleShoot.sound.main.volume = 0.050;
            BubbleShoot.sound.main.loop = true;
            BubbleShoot.sound.main.play();

            // set scale options
            this.input.maxPointers = 1;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            // this.scale.setScreenSize(true);
            if (BubbleShoot.deploy == "produccion") {
                this.getUser();
            }
            // this.scale.maxWidth = Math.round(BubbleShoot.UI.width * 0.7);
            // this.scale.maxHeight = Math.round(BubbleShoot.UI.height * 0.7);

            // this.scale.forceOrientation(true, false);

            // start the Preloader state
            this.state.start('preloader');
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



            }
        }

    }

    exports.Boot = Boot;

})(this);
